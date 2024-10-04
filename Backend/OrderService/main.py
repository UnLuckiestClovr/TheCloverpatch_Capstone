from fastapi import FastAPI, Path, Depends
from starlette.responses import Response
from py_eureka_client import eureka_client

from miscscripts import EurekaConnection

app = FastAPI(
    title="CloverpatchOrderService",
    version="0.1"
)

# CORS Setup ----------------------------------
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:8080",
    "https://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------------------------------------------

app.include_router()

app.get("/")
async def root():
    return { "message" : "Order Root Called"}

#Eureka Service Config
EurekaHost = "localhost"
EurekaPort = 10000

EurekaConnection.Eureka_Register(EurekaHost, EurekaPort)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app=app, host="0.0.0.0", port=8080)