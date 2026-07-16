from supabase import Client, create_client
from app.core.config import settings

supabase_client : Client = create_client(settings.SUPABASE_REST_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

def upload_document(
    file_bytes: bytes,
    user_id: str,
    chat_id: str,
    document_id: str,
    filename: str,
    content_type: str,
) -> str:
    safe_filename = filename.replace("/", "_").replace("\\", "_")

    storage_path = (
        f"{user_id}/"
        f"{chat_id}/"
        f"{document_id}/"
        f"{safe_filename}"
    )

    supabase_client.storage.from_(settings.SUPABASE_BUCKET).upload(
        path=storage_path,
        file=file_bytes,
        file_options={
            "content-type": content_type,
            "upsert": "false",
        },
    )

    return storage_path