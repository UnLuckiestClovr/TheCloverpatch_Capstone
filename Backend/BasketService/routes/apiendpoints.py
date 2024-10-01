from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import Item, Basket
from dal import databaseinteraction

# Router sets up the prefixes and allows the main application to see the included routes. 
router = APIRouter(
    prefix="/basket",
    tags=["Basket","CRUD","Unprotected"],
    responses={404 : {"description":"Not Found"}}
)

@router.post("/add-item/{BID}")
async def addSingleItemToBasket(BID: str = Path(alias='BID'), body: Item = None):
    return databaseinteraction.addItemToBasket(BID, body)

@router.get("/get/{BID}")
async def getBasket(BID : str = Path(alias='BID')):
    return databaseinteraction.getBasket(BID)

@router.delete("/delete/{BID}")
async def deleteBasket(BID : str = Path(alias='BID')):
    return databaseinteraction.ClearBasket(BID)

@router.delete("/delete-item/{BID}/{IID}")
async def deleteItemFromBasket(BID : str = Path(alias='BID'), IID : int = Path(alias='IID')):
    return databaseinteraction.deleteItemFromBasket(BID, IID)