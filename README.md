
# StockFlow – SaaS Inventory Management System

StockFlow is a full-stack, multi-tenant SaaS inventory management application that enables organizations to manage products, track stock quantities, and monitor low-stock inventory through a centralized dashboard.

Each organization has its own isolated inventory workspace, ensuring that users cannot access products belonging to other organizations.

![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Status](https://img.shields.io/badge/Status-Deployed-success)

## Live Application

- **Frontend:** https://stock-flow-gamma.vercel.app/
- **Backend:** https://stockflow-backend-xvyn.onrender.com
- **API Documentation:** https://stockflow-backend-xvyn.onrender.com/docs

> The backend is hosted on Render's free instance. Initial requests may take longer when the service has been inactive.

## Key Features

### Authentication and Security

- Organization registration and user login
- JWT-based authentication
- Password hashing using Argon2
- Protected API endpoints
- Organization-level data isolation
- Automatic handling of expired or invalid access tokens

### Product Management

- Add, view, update and delete products
- Unique SKU within each organization
- Product descriptions
- Cost and selling price management
- Search products by name or SKU
- Filter products by stock status

### Stock Management

- Update stock quantities
- Configure product-level low-stock thresholds
- Identify in-stock, low-stock and out-of-stock products
- Validate quantities and prices to prevent negative values

### Inventory Dashboard

- Total number of products
- Total available stock quantity
- Low-stock product count
- Detailed low-stock product list

### User Interface

- Responsive design
- Sidebar navigation
- Product management forms
- Loading indicators
- Error and success messages
- Delete confirmation

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | React, JavaScript, Vite |
| Styling | CSS |
| HTTP Client | Axios |
| Routing | React Router |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| ORM | SQLAlchemy |
| Database | PostgreSQL |
| Authentication | JWT |
| Password Hashing | Argon2 |
| Data Validation | Pydantic |
| Package Management | uv, npm |
| Backend Hosting | Render |
| Frontend Hosting | Vercel |
| Version Control | Git, GitHub |

## System Architecture

```mermaid
flowchart TD
    A[User Browser] --> B[React Frontend - Vercel]
    B -->|HTTP Requests and JWT| C[FastAPI Backend - Render]
    C --> D[Authentication and Validation]
    D --> E[Business Logic and Services]
    E --> F[SQLAlchemy ORM]
    F --> G[(PostgreSQL Database - Render)]
```

The frontend communicates with the backend using REST APIs. The backend validates access tokens, processes business logic, and communicates with the PostgreSQL database using SQLAlchemy.

Database credentials and JWT signing secrets are stored in backend environment variables rather than exposed to the frontend.

## Multi-Tenant Architecture

StockFlow uses a shared database with organization-level data isolation.

- Each registered user belongs to an organization.
- Each product is associated with an organization ID.
- The backend identifies the organization through the authenticated user.
- Product operations and dashboard queries are restricted to that organization.
- Different organizations can use the same SKU without conflicts.

The MVP supports one user per organization.

## Database Design

```mermaid
erDiagram
    ORGANIZATIONS ||--|| USERS : has
    ORGANIZATIONS ||--o{ PRODUCTS : owns

    ORGANIZATIONS {
        int id PK
        string name
        datetime created_at
    }

    USERS {
        int id PK
        int organization_id FK
        string email
        string password_hash
        datetime created_at
    }

    PRODUCTS {
        int id PK
        int organization_id FK
        string name
        string sku
        string description
        int quantity
        decimal cost_price
        decimal selling_price
        int low_stock_threshold
        datetime created_at
        datetime updated_at
    }
```

### Database Constraints

- Unique user email addresses
- Unique SKU within each organization
- Foreign key relationships
- Non-negative stock quantities
- Non-negative product prices
- Non-negative low-stock thresholds

## Project Structure

```text
StockFlow/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── product.py
│   │   │   └── dashboard.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── dependencies.py
│   │   ├── database/
│   │   │   ├── connection.py
│   │   │   └── init_db.py
│   │   ├── models/
│   │   │   ├── organization.py
│   │   │   ├── user.py
│   │   │   └── product.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── product.py
│   │   │   └── dashboard.py
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── product_service.py
│   │   │   └── dashboard_service.py
│   │   └── main.py
│   ├── .env.example
│   ├── pyproject.toml
│   └── uv.lock
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Register organization and user | No |
| POST | `/auth/login` | Login and generate JWT | No |
| GET | `/auth/me` | Get current user details | Yes |

### Product Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create a product |
| GET | `/products` | List organization products |
| GET | `/products/{product_id}` | Retrieve a product |
| PUT | `/products/{product_id}` | Update product and stock |
| DELETE | `/products/{product_id}` | Delete a product |

All product endpoints require authentication.

### Dashboard and Health Check

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/dashboard` | Retrieve inventory statistics | Yes |
| GET | `/health` | Application health check | No |
| GET | `/` | API welcome response | No |

## Getting Started

### Prerequisites

- Git
- Python 3.14 or compatible version
- uv package manager
- Node.js and npm compatible with the project's Vite version
- PostgreSQL database with SSL support

### 1. Clone the Repository

```bash
git clone https://github.com/anjali6215/StockFlow.git
cd StockFlow
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
uv sync
```

Create a `.env` file using `.env.example` as a reference.

```env
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
JWT_SECRET_KEY=your_generated_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Generate a secure JWT signing key:

```bash
uv run python -c "import secrets; print(secrets.token_hex(32))"
```

Replace the placeholder JWT secret with the generated value.

Initialize the database tables:

```bash
uv run python -m app.database.init_db
```

Start the backend:

```bash
uv run uvicorn app.main:app --reload
```

Backend URL: http://127.0.0.1:8000

Swagger Documentation: http://127.0.0.1:8000/docs

### 3. Frontend Setup

Open another terminal from the project root:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend development server:

```bash
npm run dev
```

Frontend URL: http://localhost:5173/

### 4. Production Build

```bash
npm run build
```

The production-ready frontend files are generated in the `dist` directory.

## Application Workflow

1. Register a new organization with an email and password.
2. Log in to the application.
3. Receive a JWT access token from the backend.
4. Access the organization-specific inventory dashboard.
5. Add products with SKU, quantity, prices and stock threshold.
6. Update or delete existing products.
7. Monitor inventory statistics and low-stock products.
8. Log out to end the session on the frontend.

## Low-Stock Logic

A product is considered low stock when its quantity is less than or equal to its low-stock threshold.

```text
Quantity <= Low-stock threshold
```

Example:

| Product | Quantity | Threshold | Status |
|---------|----------|-----------|--------|
| Laptop | 25 | 5 | In stock |
| Keyboard | 3 | 5 | Low stock |
| USB Charger | 0 | 5 | Out of stock |

Out-of-stock products are also included in the dashboard's low-stock count.

## Testing

The following scenarios were manually tested during development:

- User registration and login
- Invalid login credentials
- Protected endpoint access
- Product creation, retrieval, update and deletion
- Duplicate SKU validation
- Invalid quantity validation
- Stock quantity updates
- Dashboard calculations
- Low-stock identification
- Cross-organization access restrictions
- Frontend and backend integration
- Production frontend build
- Deployed application functionality

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render Web Service |
| Database | Render PostgreSQL |
| Source Code | GitHub |

Production environment variables are configured separately on the hosting platforms.

## MVP Scope and Limitations

StockFlow currently focuses on core inventory management functionality.

- One user per organization
- Product-level stock thresholds
- Direct stock quantity updates
- Browser localStorage for JWT access tokens
- No automatic token refresh

## Future Enhancements

- Multiple users per organization
- Role-based access control
- Refresh token authentication
- Improved browser token storage
- Organization-wide default stock threshold
- Stock movement history and audit logs
- Supplier and warehouse management
- CSV import and export
- Automated low-stock notifications
- Automated testing
- Advanced inventory analytics

## Project Status

- [x] Project initialization
- [x] PostgreSQL database configuration
- [x] Database models and relationships
- [x] User registration and authentication
- [x] Multi-tenant data isolation
- [x] Product management APIs
- [x] Stock management
- [x] Dashboard APIs
- [x] React frontend development
- [x] Frontend and backend integration
- [x] Production build
- [x] Backend deployment
- [x] Frontend deployment
- [x] Manual application testing

**Status: MVP Completed and Deployed**

## Author

**Anjali Chintanaboina**

GitHub: https://github.com/anjali6215

---

StockFlow – Simplifying inventory management through a centralized SaaS platform.
