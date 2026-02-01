import re
from datetime import datetime
from typing import Dict, Any
from transformers import pipeline
import torch

# Initialize NER pipeline with a pre-trained model
# Using a smaller, efficient model for Named Entity Recognition
try:
    device = 0 if torch.cuda.is_available() else -1
    ner_pipeline = pipeline(
        "ner",
        model="dslim/bert-base-NER",
        aggregation_strategy="simple",
        device=device
    )
except Exception as e:
    print(f"Warning: Could not load NER model: {e}")
    ner_pipeline = None

# Category keywords for classification
CATEGORY_KEYWORDS = {
    "Food & Dining": ["restaurant", "cafe", "coffee", "starbucks", "mcdonalds", "pizza", "burger",
                      "food", "dining", "kitchen", "bar", "pub", "diner", "grill"],
    "Transportation": ["uber", "lyft", "taxi", "gas", "fuel", "parking", "metro", "transit",
                       "train", "bus", "airline", "flight"],
    "Shopping": ["amazon", "walmart", "target", "store", "shop", "retail", "mall", "market"],
    "Entertainment": ["movie", "cinema", "theater", "netflix", "spotify", "game", "concert",
                      "ticket", "event"],
    "Utilities": ["electric", "water", "gas", "internet", "phone", "utility", "bill"],
    "Healthcare": ["hospital", "doctor", "pharmacy", "medical", "health", "clinic", "dental"],
    "Travel": ["hotel", "airbnb", "booking", "travel", "vacation", "resort", "motel"],
    "Other": []
}

def extract_amount(text: str) -> float:
    """
    Extract monetary amount from text using regex patterns
    """
    # Common patterns for amounts
    patterns = [
        r'\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',  # $123.45 or $1,234.56
        r'(\d+(?:,\d{3})*(?:\.\d{2}))\s*(?:USD|dollars?)',  # 123.45 USD
        r'(?:total|amount|subtotal|balance)[\s:]*\$?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)',  # Total: $123.45
    ]

    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            # Get the last match (usually the total)
            amount_str = matches[-1].replace(',', '')
            try:
                return float(amount_str)
            except ValueError:
                continue

    return 0.0

def extract_date(text: str) -> str:
    """
    Extract date from text using various patterns
    """
    # Try to find date patterns
    patterns = [
        r'(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})',  # 12/31/2024 or 12-31-24
        r'(\d{4}[-/]\d{1,2}[-/]\d{1,2})',  # 2024-12-31
        r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})',  # January 31, 2024
    ]

    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            date_str = matches[0]
            # Try to parse the date
            try:
                # Handle different formats
                for fmt in ['%m/%d/%Y', '%m-%d-%Y', '%Y-%m-%d', '%m/%d/%y', '%B %d, %Y', '%b %d, %Y']:
                    try:
                        dt = datetime.strptime(date_str, fmt)
                        return dt.strftime('%Y-%m-%d')
                    except ValueError:
                        continue
            except Exception:
                continue

    # Default to today if no date found
    return datetime.now().strftime('%Y-%m-%d')

def extract_vendor(text: str) -> str:
    """
    Extract vendor name using NER and pattern matching
    """
    if ner_pipeline:
        try:
            # Use NER to find organization names
            entities = ner_pipeline(text[:512])  # Limit text length for efficiency
            for entity in entities:
                if entity['entity_group'] in ['ORG', 'ORGANIZATION'] and entity['score'] > 0.7:
                    return entity['word'].strip()
        except Exception as e:
            print(f"NER extraction failed: {e}")

    # Fallback: Look for common vendor patterns
    lines = text.split('\n')
    for line in lines[:5]:  # Check first few lines
        line = line.strip()
        if len(line) > 3 and len(line) < 50 and not any(char.isdigit() for char in line[:10]):
            return line

    return "Unknown Vendor"

def classify_category(text: str, vendor: str) -> str:
    """
    Classify transaction category based on keywords
    """
    combined_text = (text + " " + vendor).lower()

    # Score each category
    category_scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        if category == "Other":
            continue
        score = sum(1 for keyword in keywords if keyword in combined_text)
        if score > 0:
            category_scores[category] = score

    if category_scores:
        return max(category_scores, key=category_scores.get)

    return "Other"

def extract_description(text: str, vendor: str, amount: float) -> str:
    """
    Generate a brief description from the receipt text
    """
    # Remove common receipt headers/footers
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    # Filter out lines with the vendor name, amount, and common receipt terms
    description_lines = []
    skip_terms = ['receipt', 'thank you', 'total', 'subtotal', 'tax', 'change', vendor.lower()]

    for line in lines:
        line_lower = line.lower()
        if len(line) < 50 and not any(term in line_lower for term in skip_terms):
            if not re.match(r'^\$?\d+\.?\d*$', line):  # Skip lines that are just numbers
                description_lines.append(line)

    if description_lines:
        return ' | '.join(description_lines[:3])  # First 3 relevant lines

    return f"Purchase from {vendor}"

def calculate_confidence(text: str, vendor: str, amount: float, date: str, category: str) -> float:
    """
    Calculate confidence score based on extraction quality
    """
    confidence = 0.0

    # Vendor confidence
    if vendor and vendor != "Unknown Vendor":
        confidence += 0.25

    # Amount confidence
    if amount > 0:
        confidence += 0.25

    # Date confidence (check if it's recent)
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d')
        days_diff = abs((datetime.now() - date_obj).days)
        if days_diff < 365:  # Within a year
            confidence += 0.25
    except:
        confidence += 0.1

    # Category confidence
    if category != "Other":
        confidence += 0.25

    return min(confidence, 1.0)

def extract_expense_data(text: str) -> Dict[str, Any]:
    """
    Main function to extract all expense data from receipt text
    """
    # Extract individual fields
    amount = extract_amount(text)
    date = extract_date(text)
    vendor = extract_vendor(text)
    category = classify_category(text, vendor)
    description = extract_description(text, vendor, amount)
    confidence = calculate_confidence(text, vendor, amount, date, category)

    return {
        "vendor": vendor,
        "amount": amount,
        "date": date,
        "category": category,
        "description": description,
        "confidence": confidence
    }
