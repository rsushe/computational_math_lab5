from typing import List
from calculations.matrix import solve_by_gauss_seidel_method, solve_by_gauss_method
from calculations.accuracy import calculate_standard_deviation


def approximate_to_linear(n: int, xs: List[float], ys: List[float]):
    x_sum, y_sum = sum(xs), sum(ys)
    square_x_sum = sum([x ** 2 for x in xs])
    xy_sum = sum([x * y for x, y in zip(xs, ys)])

    matrix = [
        [n, x_sum, y_sum],
        [x_sum, square_x_sum, xy_sum]
    ]

    try:
        solution = solve_by_gauss_method(matrix)
    except ValueError:
        return None, None

    phi = lambda x: solution[0] + solution[1] * x

    standard_deviation = calculate_standard_deviation(xs, ys, phi)

    return solution, standard_deviation
