from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, File, Form, UploadFile, status

from app.api.dependencies import CurrentUserDep, FileUploadServiceDep
from app.schemas.file_upload import DocumentResponse

router = APIRouter(prefix="/file", tags=["File Uploads"])


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    chat_id: Optional[UUID] = Form(None),
    current_user: CurrentUserDep = None,
    service: FileUploadServiceDep = None,
):
    """
    Upload a document (PDF, DOCX, TXT, MD), store in Supabase storage,
    and index vector embeddings into Qdrant for RAG.
    """
    document = await service.upload_and_process_document(
        file=file,
        user_id=current_user.id,
        chat_id=chat_id,
    )
    return document


@router.get("/my-documents", response_model=List[DocumentResponse])
async def get_my_documents(
    current_user: CurrentUserDep = None,
    service: FileUploadServiceDep = None,
):
    """
    List all documents uploaded by the authenticated user.
    """
    documents = await service.repository.get_user_documents(current_user.id)
    return documents


@router.get("/chat/{chat_id}", response_model=List[DocumentResponse])
async def get_chat_documents(
    chat_id: UUID,
    current_user: CurrentUserDep = None,
    service: FileUploadServiceDep = None,
):
    """
    List documents attached to a specific chat session.
    """
    documents = await service.repository.get_chat_documents(chat_id)
    return documents

