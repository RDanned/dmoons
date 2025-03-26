from pydantic import BaseModel
from typing import Optional


class CryptoBase(BaseModel):
    symbol: str
    name: Optional[str] = None
    image_url: Optional[str] = None


class CryptoCreate(CryptoBase):
    current_price: Optional[float] = None
    pass


class CryptoUpdate(BaseModel):
    current_price: float | None = None


class CryptoOut(CryptoBase):
    id: int
    current_price: float | None

    class Config:
        from_attributes = True
