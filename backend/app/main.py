from fastapi import FastAPI

app = FastAPI(
    title="StockFlow API",
    description="SaaS Inventory Management System",
    version="1.0.0"
)


@app.get("/")
def root():
    return {"message": "Welcome to StockFlow API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}