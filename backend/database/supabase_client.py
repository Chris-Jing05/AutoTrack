import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def get_supabase_client() -> Client:
    """
    Create and return a Supabase client instance
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")

    return create_client(url, key)

# Create a global client instance
supabase: Client = get_supabase_client()
