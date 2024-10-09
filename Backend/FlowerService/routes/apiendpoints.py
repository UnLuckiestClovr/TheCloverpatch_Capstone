from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import *
from dal import mongo_interaction

router = APIRouter(
    prefix='/flowers',
    tags=['flowers'],
    responses={404 : {"description": "Not Found"}}
)


@router.get("/get-all")
async def get_all():
    return mongo_interaction.FetchAllFlowers()


@router.get("/get-current-month")
async def get_current_month():
    return mongo_interaction.FetchFlowers_byCurrentMonth()