from pydantic import BaseModel


class PointDTO(BaseModel):
    x: float
    y: float
