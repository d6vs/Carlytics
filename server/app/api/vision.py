from fastapi import APIRouter, File, UploadFile, status, Request, HTTPException
import os
import uuid

from app.core.logging import get_logger
from app.schemas.response import CarVisualReport
from app.services.caption_service import CaptionService

logger = get_logger(__name__)

router = APIRouter(prefix="/vision", tags=["Vision"])

_caption_service = CaptionService()
UPLOAD_DIR = "static/uploads"


@router.post(
    "/upload",
    summary="Upload a vehicle image locally",
    description="Upload an image to the local server storage and get its URL.",
    status_code=status.HTTP_201_CREATED,
)
async def upload_image(
    request: Request,
    image: UploadFile = File(..., description="Vehicle image file (JPEG, PNG, WEBP)"),
) -> dict[str, str]:
    """Accept an image upload, save it locally, and return its local static URL."""
    ext = os.path.splitext(image.filename or "")[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, JPEG, PNG, and WEBP formats are supported."
        )

    # Generate unique filename
    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        content = await image.read()
        # Ensure upload dir exists
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(content)

        base_url = str(request.base_url).rstrip("/")
        local_url = f"{base_url}/static/uploads/{filename}"
        logger.info("Successfully uploaded image locally to: %s", local_url)
        return {"url": local_url}
    except Exception as exc:
        logger.exception("Local image upload failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Local upload failed: {exc}",
        )


@router.post(
    "/inspect",
    response_model=CarVisualReport,
    summary="Multi-aspect visual car inspection via BLIP",
    description="Upload a vehicle image (JPEG, PNG, WEBP) to generate a multi-aspect BLIP condition report.",
    status_code=status.HTTP_200_OK,
)
async def inspect_vehicle_image(
    image: UploadFile = File(
        ...,
        description="Vehicle image file (JPEG, PNG, WEBP)",
    ),
) -> CarVisualReport:
    """Accept an image file and return its multi-aspect BLIP condition report."""
    logger.info("Received image upload for multi-aspect inspection: %s", image.filename)

    raw_bytes = await image.read()
    report_dict = _caption_service.inspect_from_bytes(raw_bytes)

    return CarVisualReport(**report_dict)
