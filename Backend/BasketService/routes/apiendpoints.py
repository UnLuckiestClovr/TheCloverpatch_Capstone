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

@router.get("/get/{type}/{BID}")
async def getBasket(BID : str = Path(alias='BID'), type : str = Path(alias='type')):
    return databaseinteraction.getBasket(BID, type)

@router.delete("/delete/{type}/{BID}")
async def deleteBasket(BID : str = Path(alias='BID'), type : str = Path(alias='type')):
    return databaseinteraction.ClearBasket(BID, type)

@router.delete("/delete/{type}/{BID}/{IID}")
async def deleteItemFromBasket(BID : str = Path(alias='BID'), IID : int = Path(alias='IID'), type : str = Path(alias='type')):
    return databaseinteraction.deleteItemFromBasket(BID, IID, type)