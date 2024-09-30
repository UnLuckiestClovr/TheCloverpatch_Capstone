import time

from fastapi import FastAPI, Path, Depends
from starlette.responses import Response
from py_eureka_client import eureka_client

from MiscScripts import EurekaConnection

app = FastAPI(
    title='CloverpatchBasketService',
    version='0.1'
)

app.include_router()

@app.get("/")
async def root():
    return {"message": "Basket Root Called"}

#Eureka Service Config
EurekaHost = "localhost"
EurekaPort = 10000

EurekaConnection.Eureka_Register(EurekaHost, EurekaPort)

