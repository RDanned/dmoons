from fastapi import APIRouter
from app.api.routers import crypto

api_router = APIRouter()
api_router.include_router(crypto.router, prefix="/cryptos", tags=["cryptos"])
