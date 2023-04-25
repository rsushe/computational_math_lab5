from typing import List


def newton_interpolation(n: int, xs: List[float], ys: List[float]):
    finite_differences = [[0 for _ in range(n)] for _ in range(n)]

    for i in range(n):
        finite_differences[i][0] = ys[i]

    k = 1
    while k <= n:
        for i in range(n - k):
            finite_differences[i][k] = (finite_differences[i + 1][k - 1] - finite_differences[i][k - 1]) / (
                    xs[i + k] - xs[i])
        k += 1

    return [finite_differences[i][i] for i in range(n)]
    # return finite_differences[0][::]
