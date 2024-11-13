from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import AddressInfo
from dal import databaseinteraction

# Router sets up the prefixes and allows the main application to see the included routes. 
router = APIRouter(
    prefix="/order",
    tags=["orders","CRUD","Unprotected"],
    responses={404 : {"description":"Not Found"}}
)


@router.post("/create-order/{BID}/{Email}")
async def CreateOrder( body: AddressInfo, BID: str = Path(alias='BID'), Email: str = Path(alias='Email')):
    return databaseinteraction.ProcessBasketToOrder(body, BID, Email)


@router.get("/fetch/{OID}")
async def FetchOrder(OID: str = Path(alias='OID')):
    return databaseinteraction.FetchOrderbyID(OID)

@router.get("/fetch-all/{UID}")
async def FetchUserOrders(UID: str = Path(alias='UID')):
    return databaseinteraction.FetchOrdersOfUser(UID)

@router.delete("/cancel/{OID}")
async def CancelOrder(OID: str = Path(alias='OID')):
    return databaseinteraction.CancelOrder(OID, UID)