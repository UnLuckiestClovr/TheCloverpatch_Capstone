from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import Item, Basket
from dal import databaseinteraction

# Router sets up the prefixes and allows the main application to see the included routes. 
router = APIRouter(
    prefix="/basket",
    tags=["Basket","CRUD","Unprotected"],
    responses={404 : {"description":"Not Found"}}
)

@router.post("/add/{type}/{BID}")
async def addSingleItemToBasket(BID: str = Path(alias='BID'), type: str = Path(alias='type'), body: Item = None):
    return databaseinteraction.addItemToBasket(BID, body, type)

@router.get("/get-all/{BID}")
async def getAllBaskets(BID: str = Path(alias='BID')):
    return databaseinteraction.getAllBaskets(BID)

@router.delete("/delete/{type}/{BID}")
async def deleteBasket(BID : str = Path(alias='BID'), type : str = Path(alias='type')):
    return databaseinteraction.ClearBasket(BID, type)

@router.delete("/delete-item/{type}/{BID}/{IID}")
async def deleteItemFromBasket(type : str = Path(alias='type'), BID : str = Path(alias='BID'), IID : str = Path(alias='IID')):
    return databaseinteraction.deleteItemFromBasket(BID, IID, type)