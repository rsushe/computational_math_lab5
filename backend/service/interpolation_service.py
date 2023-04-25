from typing import List

from calculations.interpolation.lagrange_interpolation import lagrange_interpolation
from calculations.interpolation.newton_interpolation import newton_interpolation
from dto.interpolation_response import InterpolationResponse
from dto.point import Point


def interpolate(points: List[Point]):

    n = len(points)
    xs = [point.x for point in points]
    ys = [point.y for point in points]

    lagrange_coefficients = lagrange_interpolation(n, xs, ys)

    newton_coefficients = newton_interpolation(n, xs, ys)

    interpolation_result = InterpolationResponse(lagrange_coefficients=lagrange_coefficients,
                                                 newton_coefficients=newton_coefficients)

    return interpolation_result
