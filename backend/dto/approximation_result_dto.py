from typing import List

from pydantic import BaseModel


class ApproximationResultDTO(BaseModel):
    best_approximation: str
    linear: List[float]
    square: List[float]
    cubic: List[float]
    exponential: List[float] | None
    logarithmic: List[float] | None
    power: List[float] | None
