from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime

class ExtractRequest(BaseModel):
    text: str = Field(..., description="Receipt text to extract data from")

class ExtractedData(BaseModel):
    vendor: str
    amount: float
    date: str
    category: str
    description: str
    confidence: float = Field(..., ge=0.0, le=1.0)

class Transaction(BaseModel):
    id: Optional[str] = None
    user_id: str
    vendor: str
    category: str
    amount: float
    date: str
    description: Optional[str] = None
    created_at: Optional[str] = None

class TransactionCreate(BaseModel):
    vendor: str
    category: str
    amount: float
    date: str
    description: Optional[str] = None

class MonthlySummary(BaseModel):
    total_spent: float
    transaction_count: int
    top_category: str
    spending_by_category: dict[str, float]
    monthly_totals: list[dict[str, Any]]
    insights: list[str]

class HealthCheck(BaseModel):
    status: str
    timestamp: datetime = Field(default_factory=datetime.now)
