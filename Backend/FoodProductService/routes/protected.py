from fastapi import APIRouter, Depends, HTTPException, Path

from models.apimodels import *
from dal import mongo_interaction

router = APIRouter()

@router.post("/create/product/{ptype}")
def CreateProduct(body: EdibleItem, ptype: int = Path(alias='ptype')):
    return mongo_interaction.ProductCreationEnact(body, ptype)


@router.put("/update/product/{ptype}")
def UpdateProduct(body: EdibleItem, ptype: int = Path(alias='ptype')):
    return mongo_interaction.EnactProductUpdate(body, ptype)


@router.delete("/delete/product/{ptype}/{id}")
def DeleteProduct(ptype: int = Path(alias='ptype'), id: int = Path(alias='id')):
    return mongo_interaction.EnactProductDeletion(id, ptype)