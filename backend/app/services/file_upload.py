import asyncio
import logging
import tempfile
import uuid
from typing import Optional
from fastapi import UploadFile
from qdrant_client.models import PointStruct

from app.core.qdrant import qdrant_client, COLLECTION_NAME
from app.core.supabase import upload_document
from app.core.jina import embed_text
from app.models.file_uploads import Document, FileStatus

from app.repositories.file_upload import FileUploadRepository
from app.utils.files_read import load_documents, create_chunks


class FileUploadService:
    def __init__(self, repository: FileUploadRepository):
        self.repository = repository

    async def upload_and_process_document(
        self,
        file: UploadFile,
        user_id: uuid.UUID,
        chat_id: Optional[uuid.UUID] = None,
    ) -> Document:
        file_bytes = await file.read()
        filename = file.filename or "uploaded_document"
        content_type = file.content_type or "application/octet-stream"
        doc_id = uuid.uuid4()

        # 1. Upload to Supabase Storage
        storage_path = upload_document(
            file_bytes=file_bytes,
            user_id=str(user_id),
            chat_id=str(chat_id or "global"),
            document_id=str(doc_id),
            filename=filename,
            content_type=content_type,
        )

        # 2. Create Initial Document Record in Postgres
        document = Document(
            id=doc_id,
            user_id=user_id,
            chat_id=chat_id,
            filename=filename,
            file_type=content_type,
            storage_path=storage_path,
            file_size_bytes=len(file_bytes),
            status=FileStatus.PROCESSING,
        )
        await self.repository.save_document(document)

        # 3. Save temporary file to disk for text extraction & chunking
        try:
            suffix = "." + filename.split(".")[-1] if "." in filename else ".txt"
            with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
                tmp.write(file_bytes)
                tmp_path = tmp.name

            # Load document content & create chunks
            docs = load_documents(tmp_path)
            chunks = create_chunks(docs, chunk_size=500, overlap=100)

            # 4. Generate Embeddings & Index into Qdrant Vector Store
            points = []
            for idx, chunk in enumerate(chunks):
                chunk_text = chunk.page_content if hasattr(chunk, "page_content") else str(chunk)
                embedding = await asyncio.to_thread(embed_text, chunk_text)

                point_id = str(uuid.uuid4())
                points.append(
                    PointStruct(
                        id=point_id,
                        vector=embedding,
                        payload={
                            "document_id": str(doc_id),
                            "user_id": str(user_id),
                            "chat_id": str(chat_id) if chat_id else None,
                            "filename": filename,
                            "chunk_index": idx,
                            "text": chunk_text,
                        },
                    )
                )

            if points:
                # Ensure Qdrant collection exists
                try:
                    collections_res = await qdrant_client.get_collections()
                    collection_names = [c.name for c in collections_res.collections]
                    if COLLECTION_NAME not in collection_names:
                        from qdrant_client.models import VectorParams, Distance
                        vector_dim = len(points[0].vector)
                        await qdrant_client.create_collection(
                            collection_name=COLLECTION_NAME,
                            vectors_config=VectorParams(size=vector_dim, distance=Distance.COSINE),
                        )
                except Exception as c_err:
                    logging.warning(f"Qdrant collection check/create notice: {c_err}")

                await qdrant_client.upsert(
                    collection_name=COLLECTION_NAME,
                    points=points,
                )


            # 5. Update Status to INDEXED
            updated_doc = await self.repository.update_status(doc_id, FileStatus.INDEXED)
            return updated_doc or document

        except Exception as e:
            logging.error(f"Error processing file {filename}: {e}")
            updated_doc = await self.repository.update_status(doc_id, FileStatus.FAILED)
            return updated_doc or document
