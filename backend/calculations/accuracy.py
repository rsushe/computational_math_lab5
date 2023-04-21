from typing import List, Callable
from math import sqrt


def calculate_standard_deviation(xs: List[float], ys: List[float], phi: Callable[[float], float]):
    return sqrt(sum([(phi(x) - y) ** 2 for x, y in zip(xs, ys)]) / len(xs))
