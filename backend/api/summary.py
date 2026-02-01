from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from datetime import datetime, timedelta
from collections import defaultdict
from utils.models import MonthlySummary
from database.supabase_client import supabase

router = APIRouter()

def generate_insights(transactions: list, spending_by_category: dict, monthly_totals: list) -> list[str]:
    """
    Generate smart insights from transaction data
    """
    insights = []

    if not transactions:
        return ["No transactions yet. Start tracking your expenses!"]

    # Total spending insight
    total_spent = sum(t['amount'] for t in transactions)
    insights.append(f"You've spent ${total_spent:.2f} in total this period.")

    # Top category insight
    if spending_by_category:
        top_category = max(spending_by_category, key=spending_by_category.get)
        top_amount = spending_by_category[top_category]
        percentage = (top_amount / total_spent) * 100
        insights.append(
            f"{top_category} is your biggest expense category at ${top_amount:.2f} ({percentage:.1f}%)."
        )

    # Monthly comparison
    if len(monthly_totals) >= 2:
        current_month = monthly_totals[-1]['total']
        previous_month = monthly_totals[-2]['total']
        change = ((current_month - previous_month) / previous_month) * 100

        if change > 20:
            insights.append(f"Warning: Your spending increased by {change:.1f}% compared to last month.")
        elif change < -20:
            insights.append(f"Great job! You reduced spending by {abs(change):.1f}% compared to last month.")

    # Average transaction
    avg_transaction = total_spent / len(transactions)
    insights.append(f"Your average transaction is ${avg_transaction:.2f}.")

    # Frequency insight
    if len(transactions) >= 10:
        insights.append(f"You've made {len(transactions)} transactions. Consider reviewing recurring expenses.")

    return insights[:5]  # Return top 5 insights

@router.get("/summary", response_model=MonthlySummary)
async def get_summary(user_id: str, authorization: Optional[str] = Header(None)):
    """
    Get spending summary and insights for a user
    """
    try:
        # Fetch all transactions for the user
        response = supabase.table("transactions") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("date", desc=False) \
            .execute()

        transactions = response.data

        if not transactions:
            return MonthlySummary(
                total_spent=0,
                transaction_count=0,
                top_category="N/A",
                spending_by_category={},
                monthly_totals=[],
                insights=["No transactions yet. Start tracking your expenses!"]
            )

        # Calculate total spent
        total_spent = sum(t['amount'] for t in transactions)
        transaction_count = len(transactions)

        # Calculate spending by category
        spending_by_category = defaultdict(float)
        for t in transactions:
            spending_by_category[t['category']] += t['amount']

        spending_by_category = dict(spending_by_category)

        # Find top category
        top_category = max(spending_by_category, key=spending_by_category.get) if spending_by_category else "N/A"

        # Calculate monthly totals
        monthly_totals_dict = defaultdict(float)
        for t in transactions:
            date = datetime.fromisoformat(t['date'].replace('Z', '+00:00'))
            month_key = date.strftime('%b %Y')
            monthly_totals_dict[month_key] += t['amount']

        monthly_totals = [
            {"month": month, "total": total}
            for month, total in sorted(monthly_totals_dict.items(),
                                      key=lambda x: datetime.strptime(x[0], '%b %Y'))
        ]

        # Generate insights
        insights = generate_insights(transactions, spending_by_category, monthly_totals)

        return MonthlySummary(
            total_spent=total_spent,
            transaction_count=transaction_count,
            top_category=top_category,
            spending_by_category=spending_by_category,
            monthly_totals=monthly_totals,
            insights=insights
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate summary: {str(e)}"
        )
