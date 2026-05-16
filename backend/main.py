from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Scraper API",
    description="Backend API for the Scraper educational search engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "scraper-backend"}

# Mount your routers here
# from app.api.v1 import router as api_v1_router
# app.include_router(api_v1_router, prefix="/api/v1")
