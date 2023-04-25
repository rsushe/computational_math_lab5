from typing import List

from pydantic import BaseModel


class InterpolationResponse(BaseModel):
    lagrange_coefficients: List[float]
    newton_coefficients: List[float]
