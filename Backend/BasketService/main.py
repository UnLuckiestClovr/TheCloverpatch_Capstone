from fastapi import FastAPI, Path, Depends
from starlette.responses import Response
from py_eureka_client import eureka_client

from miscscripts import EurekaConnection
from routes import apiendpoints

app = FastAPI(
    title='CloverpatchBasketService',
    version='0.1'
)

app.include_router(apiendpoints.router)

@app.get("/")
async def root():
    return {"message" : "Basket Root Called"}

#Eureka Service Config
EurekaHost = "localhost"
EurekaPort = 10000

EurekaConnection.Eureka_Register(EurekaHost, EurekaPort)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app=app, host="0.0.0.0", port=8080)