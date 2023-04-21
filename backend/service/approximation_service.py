from collections import namedtuple
from functools import cmp_to_key
from typing import List

from calculations.approximation.cubic_approximation import approximate_to_cubic
from calculations.approximation.exponential_approximation import approximate_to_exponential
from calculations.approximation.linear_approximation import approximate_to_linear
from calculations.approximation.logarithmic_approximation import approximate_to_logarithmic
from calculations.approximation.square_approximation import approximate_to_square
from dto.approximation_result_dto import ApproximationResultDTO
from dto.point_dto import PointDTO


def approximate(points: List[PointDTO]):
    n = len(points)
    xs = [point.x for point in points]
    ys = [point.y for point in points]

    linear_coefficients, linear_deviation = approximate_to_linear(n, xs, ys)

    square_coefficients, square_deviation = approximate_to_square(n, xs, ys)

    cubic_coefficients, cubic_deviation = approximate_to_cubic(n, xs, ys)

    exponential_coefficients, exponential_deviation = approximate_to_exponential(n, xs, ys)

    logarithmic_coefficients, logarithmic_deviation = approximate_to_logarithmic(n, xs, ys)

    power_coefficients, power_deviation = approximate_to_logarithmic(n, xs, ys)

    best_approximation = calculate_best_approximation(linear_deviation, square_deviation, cubic_deviation,
                                                      exponential_deviation, logarithmic_deviation, power_deviation)

    approximation_result = ApproximationResultDTO(best_approximation=best_approximation,
                                                  linear=linear_coefficients,
                                                  square=square_coefficients,
                                                  cubic=cubic_coefficients,
                                                  exponential=exponential_coefficients,
                                                  logarithmic=logarithmic_coefficients,
                                                  power=power_coefficients)

    return approximation_result


def calculate_best_approximation(linear_deviation, square_deviation, cubic_deviation,
                                 exponential_deviation, logarithmic_deviation, power_deviation):
    Pair = namedtuple("Pair", ["deviation", "function_type"])

    pairs = [Pair(linear_deviation, "linear"), Pair(square_deviation, "square"), Pair(cubic_deviation, "cubic")]

    if exponential_deviation is not None:
        pairs.append(Pair(exponential_deviation, "exponential"))

    if logarithmic_deviation is not None:
        pairs.append(Pair(logarithmic_deviation, "logarithmic"))

    if power_deviation is not None:
        pairs.append(Pair(power_deviation, "power"))

    pairs.sort(key=cmp_to_key(lambda p1, p2: p1.deviation - p2.deviation))

    print(pairs)

    return pairs[0].function_type
