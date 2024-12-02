from fastapi import FastAPI, Path, Depends
from starlette.responses import Response
from py_eureka_client import eureka_client

from routes import apiendpoints

app = FastAPI(
    title='CloverpatchBasketService',
    version='0.1'
)

# CORS Setup ----------------------------------
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "https://localhost:3000/*",
    "http://localhost:3000/*",
    "https://allowing-hideously-ostrich.ngrok-free.app/",
    "https://allowing-hideously-ostrich.ngrok-free.app:3000/",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ---------------------------------------------

app.include_router(apiendpoints.router)

@app.get("/")
async def root():
    return {"message" : "Basket Root Called"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app=app, host="0.0.0.0", port=8080)