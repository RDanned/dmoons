from sqlalchemy.orm import Session
from app.models.cryptocurrency import Cryptocurrency
from app.schemas.cryptocurrency import CryptoCreate, CryptoUpdate

def create(db: Session, obj_in: CryptoCreate):
    db_obj = Cryptocurrency(
        symbol=obj_in.symbol,
        name=obj_in.name
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def get_by_symbol(db: Session, symbol: str):
    return db.query(Cryptocurrency).filter(Cryptocurrency.symbol == symbol).first()

def update(db: Session, db_obj: Cryptocurrency, obj_in: CryptoUpdate):
    if obj_in.current_price is not None:
        db_obj.current_price = obj_in.current_price
    db.commit()
    db.refresh(db_obj)
    return db_obj

def remove(db: Session, db_obj: Cryptocurrency):
    db.delete(db_obj)
    db.commit()

def remove_all(db: Session):
    db.query(Cryptocurrency).delete()
    db.commit()

def get_all(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Cryptocurrency).offset(skip).limit(limit).all()
