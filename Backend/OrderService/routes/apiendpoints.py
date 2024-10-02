from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import Order, OrderItem
from dal import databaseinteraction

# Router sets up the prefixes and allows the main application to see the included routes. 
router = APIRouter(
    prefix="/basket",
    tags=["Basket","CRUD","Unprotected"],
    responses={404 : {"description":"Not Found"}}
)


@router.post("/create-order/{BID}")
async def CreateOrder(BID: str = Path(alias='BID')):
    return databaseinteraction.ProcessBasketToOrder(BID)


@router.get("/fetch/{OID}")
async def FetchOrder(OID: str = Path(alias='OID')):
    return databaseinteraction.FetchOrderbyID(OID)

@router.get("/fetch-all/{UID}")
async def FetchUserOrders(UID: str = Path(alias='UID')):
    return databaseinteraction.FetchOrdersOfUser(UID)

@router.delete("/cancel/{UID}/{OID}")
async def CancelOrder(UID: str = Path(alias='UID'), OID: str = Path(alias='OID')):
    return databaseinteraction.CancelOrder(OID, UID)