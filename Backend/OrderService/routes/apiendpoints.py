from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import AddressInfo
from dal import databaseinteraction

# Router sets up the prefixes and allows the main application to see the included routes. 
router = APIRouter(
    prefix="/order",
    tags=["orders","CRUD","Unprotected"],
    responses={404 : {"description":"Not Found"}}
)


# Create Orders
@router.post("/create-order/flowers/{BID}/{Email}")
async def CreateOrder( body: AddressInfo, BID: str = Path(alias='BID'), Email: str = Path(alias='Email')):
    return databaseinteraction.ProcessBasketToOrder_Flower(body, BID, Email)

@router.post("/create-order/food/{BID}/{Email}")
async def CreateOrder(BID: str = Path(alias='BID'), Email: str = Path(alias='Email')):
    return databaseinteraction.ProcessBasketToOrder_Food(BID, Email)


# Get Order by ID
@router.get("/fetch/flower/{OID}")
async def FetchOrder(OID: str = Path(alias='OID')):
    return databaseinteraction.FetchFlowerOrderbyID(OID)

@router.get("/fetch/food/{OID}")
async def FetchOrder(OID: str = Path(alias='OID')):
    return databaseinteraction.FetchFoodOrderbyID(OID)


# Get Orders by User
@router.get("/fetch-all/flowers/{UID}")
async def FetchUserOrders(UID: str = Path(alias='UID')):
    return databaseinteraction.FetchFlowerOrdersOfUser(UID)\

@router.get("/fetch-all/food/{UID}")
async def FetchUserOrders(UID: str = Path(alias='UID')):
    return databaseinteraction.FetchFoodOrdersOfUser(UID)


# Delete Orders by ID
@router.delete("/cancel/{OID}")
async def CancelOrder(OID: str = Path(alias='OID')):
    return databaseinteraction.CancelFlowerOrder(OID)

@router.delete("/complete/food/{OID}")
async def CompleteFoodOrder(OID: str = Path(alias='OID')):
    return databaseinteraction.CompleteFoodOrder(OID)