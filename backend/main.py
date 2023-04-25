from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dto.interpolation_response import InterpolationResponse
from dto.point import Point
from service.interpolation_service import interpolate

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
async def root():
    return "pong"


@app.post("/interpolate", response_model=InterpolationResponse)
async def root(points: List[Point]):
    print(points)

    interpolation_result: InterpolationResponse = interpolate(points)

    return interpolation_result
