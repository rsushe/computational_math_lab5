from typing import List

from calculations.approximation.linear_approximation import approximate_to_linear
from math import log


def approximate_to_exponential(n: int, xs: List[float], ys: List[float]):
    if not all(y > 0 for y in ys):
        return None, None

    lin_ys = [log(y) for y in ys]

    try:
        solution, standard_deviation = approximate_to_linear(n, xs, lin_ys)
    except ValueError:
        return None, None

    return solution[::-1], standard_deviation
