import logging
from pathlib import Path
from app.core.config import settings


def upload_document(
    file_bytes: bytes,
    user_id: str,
    chat_id: str,
    document_id: str,
    filename: str,
    content_type: str,
) -> str:
    safe_filename = filename.replace("/", "_").replace("\\", "_")
    storage_path = f"{user_id}/{chat_id}/{document_id}/{safe_filename}"

    if settings.SUPABASE_REST_URL and settings.SUPABASE_SERVICE_ROLE_KEY and settings.SUPABASE_BUCKET:
        try:
            from supabase import create_client
            supabase_client = create_client(
                settings.SUPABASE_REST_URL.strip(),
                settings.SUPABASE_SERVICE_ROLE_KEY.strip(),
            )
            supabase_client.storage.from_(settings.SUPABASE_BUCKET.strip()).upload(
                path=storage_path,
                file=file_bytes,
                file_options={
                    "content-type": content_type,
                    "upsert": "true",
                },
            )
            return storage_path
        except Exception as e:
            logging.warning(f"Supabase upload failed ({e}) — falling back to local file storage")

    # Local fallback
    local_dir = Path("uploads") / user_id / chat_id / document_id
    local_dir.mkdir(parents=True, exist_ok=True)
    local_file = local_dir / safe_filename
    local_file.write_bytes(file_bytes)
    return str(local_file)