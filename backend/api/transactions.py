from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from utils.models import Transaction, TransactionCreate
from database.supabase_client import supabase

router = APIRouter()

@router.get("/transactions")
async def get_transactions(user_id: str, authorization: Optional[str] = Header(None)):
    """
    Get all transactions for a user
    """
    try:
        response = supabase.table("transactions") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("date", desc=True) \
            .execute()

        return response.data

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch transactions: {str(e)}"
        )

@router.post("/transactions")
async def create_transaction(
    transaction: TransactionCreate,
    user_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    Create a new transaction
    """
    try:
        data = transaction.dict()
        data["user_id"] = user_id

        response = supabase.table("transactions") \
            .insert(data) \
            .execute()

        return response.data[0] if response.data else None

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create transaction: {str(e)}"
        )

@router.delete("/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    Delete a transaction
    """
    try:
        response = supabase.table("transactions") \
            .delete() \
            .eq("id", transaction_id) \
            .execute()

        return {"message": "Transaction deleted successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete transaction: {str(e)}"
        )

@router.put("/transactions/{transaction_id}")
async def update_transaction(
    transaction_id: str,
    transaction: TransactionCreate,
    authorization: Optional[str] = Header(None)
):
    """
    Update a transaction
    """
    try:
        data = transaction.dict()

        response = supabase.table("transactions") \
            .update(data) \
            .eq("id", transaction_id) \
            .execute()

        return response.data[0] if response.data else None

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update transaction: {str(e)}"
        )
