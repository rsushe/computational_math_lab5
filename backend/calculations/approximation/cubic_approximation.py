from typing import List

from calculations.accuracy import calculate_standard_deviation
from calculations.matrix import solve_by_gauss_seidel_method, solve_by_gauss_method


def approximate_to_cubic(n: int, xs: List[float], ys: List[float]):
    x_sum, y_sum = sum(xs), sum(ys)

    square_x_sum = sum([x ** 2 for x in xs])
    cube_x_sum = sum([x ** 3 for x in xs])
    fourth_x_sum = sum([x ** 4 for x in xs])
    fifth_x_sum = sum([x ** 5 for x in xs])
    sixth_x_sum = sum([x ** 6 for x in xs])

    xy_sum = sum([x * y for x, y in zip(xs, ys)])
    square_x_y_sum = sum([(x ** 2) * y for x, y in zip(xs, ys)])
    cube_x_y_sum = sum([(x ** 3) * y for x, y in zip(xs, ys)])

    matrix = [
        [n, x_sum, square_x_sum, cube_x_sum, y_sum],
        [x_sum, square_x_sum, cube_x_sum, fourth_x_sum, xy_sum],
        [square_x_sum, cube_x_sum, fourth_x_sum, fifth_x_sum, square_x_y_sum],
        [cube_x_y_sum, fourth_x_sum, fifth_x_sum, sixth_x_sum, cube_x_y_sum]
    ]

    try:
        solution = solve_by_gauss_method(matrix)
    except ValueError:
        return None, None

    phi = lambda x: solution[0] + solution[1] * x + solution[2] * (x ** 2) + solution[3] * (x ** 3)

    standard_deviation = calculate_standard_deviation(xs, ys, phi)

    return solution, standard_deviation
