from typing import List

from calculations.approximation.linear_approximation import approximate_to_linear
from math import log


def approximate_to_logarithmic(n: int, xs: List[float], ys: List[float]):
    if not all(x > 0 for x in xs):
        return None, None

    lin_xs = [log(x) for x in xs]

    try:
        solution, standard_deviation = approximate_to_linear(n, lin_xs, ys)
    except ValueError:
        return None, None

    return solution[::-1], standard_deviation
