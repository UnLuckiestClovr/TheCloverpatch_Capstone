from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import *
from dal import databaseinteraction

# Router sets up the prefixes and allows the main application to see the included routes. 
router = APIRouter(
    prefix="/basket",
    tags=["Basket","CRUD","Unprotected"],
    responses={404 : {"description":"Not Found"}}
)

@router.post("/add/Flowers/{BID}")
async def addSingleItemToBasket(BID: str = Path(alias='BID'), body: Item = None):
    try:
        return databaseinteraction.addItemToBasket(BID, body, "Flowers")
    except Exception as e:
        print(e)

@router.post("/add/Food/{BID}")
async def addSingleItemToBasket(BID: str = Path(alias='BID'), body: FoodItem = None):
    try:
        return databaseinteraction.addItemToBasket(BID, body, "Food")
    except Exception as e:
            print(e)

@router.get("/get-all/{BID}")
async def getAllBaskets(BID: str = Path(alias='BID')):
    return databaseinteraction.getAllBaskets(BID)

@router.delete("/delete/{type}/{BID}")
async def deleteBasket(BID : str = Path(alias='BID'), type : str = Path(alias='type')):
    return databaseinteraction.ClearBasket(BID, type)

@router.delete("/delete-item/{type}/{BID}/{IID}")
async def deleteItemFromBasket(type : str = Path(alias='type'), BID : str = Path(alias='BID'), IID : str = Path(alias='IID')):
    return databaseinteraction.deleteItemFromBasket(BID, IID, type)