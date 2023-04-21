from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from dto.approximation_result_dto import ApproximationResultDTO
from dto.point_dto import PointDTO
from service.approximation_service import approximate

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/approximate", response_model=ApproximationResultDTO)
async def root(points: List[PointDTO]):
    print(points)

    approximation_result: ApproximationResultDTO = approximate(points)

    return approximation_result
