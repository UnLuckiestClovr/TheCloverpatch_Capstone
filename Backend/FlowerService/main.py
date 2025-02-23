from fastapi import FastAPI, Path, Depends
from starlette.responses import Response

from security.dependencies import get_token_header
from routes import apiendpoints, protected

app = FastAPI(
    title="CloverpatchFlowerService",
    version="0.1"
)

# CORS Setup ----------------------------------
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:8080",
    "https://localhost:8080",
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
app.include_router(
    protected.router,
    prefix='/protected-flowers',
    tags=['flowers'],
    dependencies=[Depends(get_token_header)],
    responses={404 : {"description": "Not Found"}}
)

app.get("/")
async def root():
    return { "message" : "Order Root Called"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app=app, host="0.0.0.0", port=12002)