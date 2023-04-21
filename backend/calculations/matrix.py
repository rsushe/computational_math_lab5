from typing import List


def solve_by_gauss_seidel_method(matrix: List[List[float]], matrix_size: int, accuracy: float = 1e-4) -> List[float]:
    c: List[List[float]] = []
    d: List[float] = []

    for i, matrix_row in enumerate(matrix):
        next_c_vector: List[float] = []
        for j, row_value in enumerate(matrix_row[:-1]):
            if i == j:
                next_c_vector.append(0)
            elif matrix_row[i] != 0:
                next_c_vector.append(-1 * row_value / matrix_row[i])
            else:
                raise ValueError("values at diagonal position in matrix can't be 0")

        c.append(next_c_vector)
        d.append(matrix_row[-1] / matrix_row[i])

    max_accuracy: float = 100

    max_iterations: int = 10000
    current_iteration: int = 0

    x_k: List[float] = d[::]

    while max_accuracy > accuracy and current_iteration < max_iterations:
        current_iteration += 1
        next_x_k = []
        for i in range(matrix_size):
            next_x_k_value = d[i]
            for j in range(i):
                next_x_k_value += c[i][j] * next_x_k[j]
            for j in range(i, matrix_size):
                next_x_k_value += c[i][j] * x_k[j]
            next_x_k.append(next_x_k_value)

        x_k[::] = next_x_k[::]

        accuracy_vector = [abs(next_x_k[i] - x_k[i]) for i in range(matrix_size)]
        max_accuracy = max(accuracy_vector)

    return x_k


def swap_lines(matrix, i):
    for j in range(i + 1, len(matrix)):
        if matrix[j][i] != 0:
            matrix[j], matrix[i] = matrix[i], matrix[j]
            return matrix


def triangulize_matrix(matrix):
    n = len(matrix)
    for i in range(0, n):

        if matrix[i][i] == 0:
            matrix = swap_lines(matrix, i)

        i_i = matrix[i][i]
        for j_in_i_line in range(i, n + 1):
            matrix[i][j_in_i_line] = matrix[i][j_in_i_line] / i_i

        for j_after_i in range(i + 1, n):
            j_line_head = matrix[j_after_i][i]
            for k in range(i, n + 1):
                matrix[j_after_i][k] = matrix[j_after_i][k] - j_line_head * matrix[i][k]
    return matrix


def solve_by_gauss_method(matrix) -> list[float]:
    n = len(matrix)
    matrix = triangulize_matrix(matrix)

    for i in range(1, n):
        for j_before_i in range(0, i):
            i_head = matrix[j_before_i][i]
            for k in range(i, n + 1):
                matrix[j_before_i][k] = matrix[j_before_i][k] - matrix[i][k] * i_head

    return [round(matrix[i][n], 3) for i in range(0, len(matrix))]
