from app.database.connection import Base, engine

from app.models.organization import Organization
from app.models.user import User
from app.models.product import Product


def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    init_db()