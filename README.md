# StockFlow – SaaS Inventory Management System

## Overview

StockFlow is a multi-tenant SaaS inventory management application designed to help organizations manage products, monitor stock levels, and identify low-stock products through a centralized dashboard.

Each organization can securely manage its own inventory without accessing other organizations' data.

## Key Features

- User registration and login
- JWT-based authentication
- Organization-based data isolation
- Product creation, viewing, updating, and deletion
- Stock quantity management
- Low-stock identification
- Inventory dashboard

## Technology Stack

| Component | Technology |
|---|---|
| Backend | Python, FastAPI |
| Frontend | React |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Authentication | JWT |
| Package Management | uv |
| Backend Deployment | Render |
| Frontend Deployment | Vercel |
| Version Control | Git and GitHub |

## Project Structure

```
StockFlow/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── .env.example
│   ├── pyproject.toml
│   └── uv.lock
├── .gitignore
└── README.md
```

## Backend Setup

1. Navigate to the backend directory.

   `cd backend`

2. Install dependencies.

   `uv sync`

3. Create a `.env` file using `.env.example` as a reference.

4. Initialize the database.

   `uv run python -m app.database.init_db`

5. Start the FastAPI server.

   `uv run uvicorn app.main:app --reload`

## API Documentation

Swagger UI: http://localhost:8000/docs

## Development Status

- [x] Project initialization
- [x] PostgreSQL database configuration
- [x] Database connection
- [x] Database models and table creation
- [ ] User authentication
- [ ] Product management APIs
- [ ] Stock management
- [ ] Dashboard APIs
- [ ] Frontend development
- [ ] Deployment and testing

## Project Status

Currently under development.