from fastapi import FastAPI
from app.api.auth import router as auth_router


app = FastAPI(
    title="StockFlow API",
    description="SaaS Inventory Management System",
    version="1.0.0"
)

# Include routers
app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "Welcome to StockFlow API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}