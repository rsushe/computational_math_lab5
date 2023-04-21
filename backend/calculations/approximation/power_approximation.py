from typing import List

from linear_approximation import approximate_to_linear
from math import log


def approximate_to_power(n: int, xs: List[float], ys: List[float]):
    if not all(x > 0 and y > 0 for x, y in zip(xs, ys)):
        return None, None

    lin_xs = [log(x) for x in xs]
    lin_ys = [log(y) for y in ys]

    try:
        solution, standard_deviation = approximate_to_linear(n, lin_xs, lin_ys)
    except ValueError:
        return None, None

    return solution[::-1], standard_deviation
