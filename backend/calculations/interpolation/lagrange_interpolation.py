from typing import List


def lagrange_interpolation(n: int, xs: List[float], ys: List[float]):
    coefficients = []

    for i in range(n):
        c = 1
        for j in range(n):
            if i != j:
                c *= (xs[i] - xs[j])
        coefficients.append(ys[i] / c)

    return coefficients
