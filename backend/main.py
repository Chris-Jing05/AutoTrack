from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from api import extract, transactions, summary

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AutoTrack API",
    description="AI-Powered Expense Tracker API",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(extract.router, prefix="/api", tags=["extract"])
app.include_router(transactions.router, prefix="/api", tags=["transactions"])
app.include_router(summary.router, prefix="/api", tags=["summary"])

@app.get("/")
async def root():
    return {
        "message": "AutoTrack API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
