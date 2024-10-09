from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import *
from dal import mongo_interaction

router = APIRouter()