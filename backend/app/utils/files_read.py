from pathlib import Path
from typing import List, Union

from langchain_community.document_loaders import Docx2txtLoader, PyPDFLoader, TextLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


def load_documents(file_path: Union[str, Path]) -> List[Document]:
    """
    Loads documents using LangChain document loaders.
    Supports PDF, DOCX, TXT, and Markdown files.
    """
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    ext = path.suffix.lower()

    if ext == ".pdf":
        loader = PyPDFLoader(str(path))
    elif ext in [".docx", ".doc"]:
        loader = Docx2txtLoader(str(path))
    elif ext in [".txt", ".md"]:
        loader = TextLoader(str(path), encoding="utf-8")
    else:
        raise ValueError(f"Unsupported file format: {ext}")

    return loader.load()


def create_chunks(
    documents: Union[List[Document], str],
    chunk_size: int = 500,
    overlap: int = 100,
) -> List[Document]:
    """
    Splits documents or raw text into chunks using LangChain's RecursiveCharacterTextSplitter.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap,
    )

    if isinstance(documents, str):
        return text_splitter.create_documents([documents])

    return text_splitter.split_documents(documents)


if __name__ == "__main__":
    import sys

    file_to_read = sys.argv[1] if len(sys.argv) > 1 else "one.docx"

    print(f"LangChain Document Reader ready! Attempting to read: {file_to_read}")

    try:
        docs = load_documents(file_to_read)
        print(f"\n--- Loaded {len(docs)} Document Page(s) ---")

        chunks = create_chunks(docs, chunk_size=500, overlap=100)
        print(f"--- Created {len(chunks)} Chunks via RecursiveCharacterTextSplitter ---")
        if chunks:
            print("\nSample Chunk 0:", chunks[0])
    except FileNotFoundError as err:
        print(f"\n⚠️  {err}")
        print("Tip: Ensure the file exists at that path, or provide a valid file path.")





