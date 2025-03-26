from sqlalchemy import Column, Integer, String, Float, URL
from app.db.base_class import Base


class Cryptocurrency(Base):
    __tablename__ = "cryptocurrencies"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=True)
    symbol = Column(String, unique=True, index=True)
    name = Column(String)
    current_price = Column(Float)
