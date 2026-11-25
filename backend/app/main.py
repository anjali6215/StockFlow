from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import CORS_ORIGINS
from app.api.auth import router as auth_router
from app.api.product import router as product_router
from app.api.dashboard import router as dashboard_router


app = FastAPI(
    title="StockFlow API",
    description="SaaS Inventory Management System",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(auth_router)
app.include_router(product_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {"message": "Welcome to StockFlow API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}