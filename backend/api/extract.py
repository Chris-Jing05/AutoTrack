from fastapi import APIRouter, HTTPException
from utils.models import ExtractRequest, ExtractedData
from ml.extractor import extract_expense_data

router = APIRouter()

@router.post("/extract", response_model=ExtractedData)
async def extract_from_text(request: ExtractRequest):
    """
    Extract expense data from receipt text using NLP
    """
    try:
        # Extract data using ML pipeline
        extracted = extract_expense_data(request.text)

        return ExtractedData(**extracted)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract data: {str(e)}"
        )
