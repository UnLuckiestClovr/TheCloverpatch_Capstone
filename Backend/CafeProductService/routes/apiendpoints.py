from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import *
from dal import mongo_interaction

router = APIRouter(
    prefix="/products",
    tags=['food','drinks'],
    responses={404 : {"description": "Not Found"}}
)

@router.get("/fetch/dessert")
def getDessert():
    return mongo_interaction.FetchAll_Dessert()

@router.get("/fetch/food")
def getFood():
    return mongo_interaction.FetchAll_Food_NonAdult()


@router.get("/fetch/drinks")
def getDrinks():
    return mongo_interaction.FetchAll_Drinks_NonAdult()


@router.get("/fetch/adult/food")
def getFood_Adult():
    return mongo_interaction.Fetch_Food_Adult()


@router.get("/fetch/adult/drinks")
def getDrinks_Adult():
    return mongo_interaction.Fetch_Drinks_Adult()


@router.get("/fetch/food/id/{id}")
def getFood_byID(id: str = Path(alias='id')):
    return mongo_interaction.Fetch_Food_ByID(id)


@router.get("/fetch/drinks/{id}")
def getDrink_byID(id: str = Path(alias='id')):
    return mongo_interaction.Fetch_Drink_ByID(id)