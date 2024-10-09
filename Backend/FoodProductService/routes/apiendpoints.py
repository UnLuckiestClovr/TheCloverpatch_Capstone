from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import *
from dal import mongo_interaction

router = APIRouter(
    prefix="/products",
    tags=['food','drinks'],
    responses={404 : {"description": "Not Found"}}
)

