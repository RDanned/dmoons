from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud import crud_crypto
from app.schemas.cryptocurrency import CryptoCreate, CryptoOut, CryptoUpdate
from app.db.session import get_db
from app.services.coingecko import fetch_from_coingecko
from app.models.cryptocurrency import Cryptocurrency
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

router = APIRouter()


@router.post("/", response_model=CryptoOut)
def create_crypto(crypto_in: CryptoCreate, db: Session = Depends(get_db)):
    logging.debug('test')
    existing_obj = crud_crypto.get_by_symbol(db, crypto_in.symbol)
    if existing_obj:
        raise HTTPException(status_code=400, detail="Symbol already exists")

    data = fetch_from_coingecko(crypto_in.symbol)
    print('data', data)

    if not data:
        raise HTTPException(status_code=404, detail="Symbol not found on Coingecko")

    crypto_in.name = data["name"]
    crypto_in.current_price = data["current_price"]
    crypto_in.image_url = data["image_url"] if data.get("image_url", None) else None

    print('crypto_in', crypto_in)

    db_obj = Cryptocurrency(
        symbol=crypto_in.symbol,
        name=crypto_in.name,
        image_url=crypto_in.image_url,
        current_price=crypto_in.current_price
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@router.get("/", response_model=list[CryptoOut])
def list_cryptos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_crypto.get_all(db, skip=skip, limit=limit)


@router.get("/{symbol}", response_model=CryptoOut)
def get_crypto(symbol: str, db: Session = Depends(get_db)):
    data = fetch_from_coingecko(symbol)
    print('GECKO')
    print('data', data)
    db_obj = crud_crypto.get_by_symbol(db, symbol)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Not found")
    return db_obj


@router.put("/{symbol}", response_model=CryptoOut)
def update_crypto(symbol: str, crypto_update: CryptoUpdate, db: Session = Depends(get_db)):
    db_obj = crud_crypto.get_by_symbol(db, symbol)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Not found")
    updated_obj = crud_crypto.update(db, db_obj, crypto_update)
    return updated_obj


@router.get("/{symbol}/get-update", response_model=CryptoOut)
def get_update_crypto(symbol: str, db: Session = Depends(get_db)):
    data = fetch_from_coingecko(symbol)
    if not data:
        raise HTTPException(status_code=404, detail="Symbol not found on Coingecko")

    db_obj = crud_crypto.get_by_symbol(db, symbol)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Not found")

    crypto_update = CryptoUpdate(current_price=data["current_price"])
    updated_obj = crud_crypto.update(db, db_obj, crypto_update)
    return updated_obj


@router.delete("/{symbol}")
def delete_crypto(symbol: str, db: Session = Depends(get_db)):
    db_obj = crud_crypto.get_by_symbol(db, symbol)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Not found")
    crud_crypto.remove(db, db_obj)
    return {"msg": "Deleted"}


@router.delete("/")
def delete_cryptos(db: Session = Depends(get_db)):
    crud_crypto.remove_all(db)
    return {"msg": "Deleted all"}
