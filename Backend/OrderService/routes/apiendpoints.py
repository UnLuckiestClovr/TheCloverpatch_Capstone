from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import Order, OrderItem
from dal import databaseinteraction

# Router sets up the prefixes and allows the main application to see the included routes. 
router = APIRouter(
    prefix="/basket",
    tags=["Basket","CRUD","Unprotected"],
    responses={404 : {"description":"Not Found"}}
)

@router.post("/create-order")
async def CreateOrder():
    pass

@router.get("/fetch/{OID}")
async def FetchOrder(OID: str = Path(alias='OID')):
    pass