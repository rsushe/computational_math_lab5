function showError(input, message) {
    const formField = input.parentElement;

    formField.classList.remove('success');
    formField.classList.add('error');

    const error = formField.querySelector('small');
    error.textContent = message;
}

function showSuccess(input) {
    const formField = input.parentElement;

    formField.classList.remove('error');
    formField.classList.add('success');

    const error = formField.querySelector('small');
    error.textContent = '';
}

function validate_form_table() {
    let valid = true;

    let table = document.getElementById("input_table");
    let cells = table.querySelectorAll("td");

    cells.forEach((cell) => {
        let button = cell.firstChild
        if (button.value == null || button.value === "") {
            button.classList.remove('success');
            button.classList.add('error');
            valid = false;
        } else {
            button.classList.remove('error');
            button.classList.add('success');
        }
    });

    let uniqueX = new Set();

    for (let i = 0; i < cells.length; i += 2) {
        let button = cells[i].firstChild;
        if (button.value != null && button.value !== "") {
            let val = button.value;

            if (uniqueX.has(val)) {
                button.classList.remove('success');
                button.classList.add('error');
                valid = false;
            } else {
                uniqueX.add(val);
            }
        }
    }

    if (valid) {
        showSuccess(table);
    } else {
        showError(table, "Пожалуйста, заполните все пустые поля ввода и удалите повторения в столбце X")
    }

    return validate_target_x() && valid;
}

function intOrNaN(x) {
    return /^-?\d+$/.test(x) ? +x : NaN
}

function validate_form_func() {
    let valid;

    const startEl = document.getElementById("start");
    const endEl = document.getElementById("end");
    const pointsEl = document.getElementById("points");

    const start = startEl.value, end = endEl.value, points = pointsEl.value;

    if (isNaN(start) || isNaN(end) || isNaN(intOrNaN(start)) || isNaN(intOrNaN(end))) {
        valid = false;
        if (isNaN(start) || isNaN(intOrNaN(start))) {
            showError(startEl, "Введите целое число");
        } else {
            showSuccess(startEl);
        }
        if (isNaN(end) || isNaN(intOrNaN(end))) {
            showError(endEl, "Введите целое число");
        } else {
            showSuccess(endEl)
        }
    } else if (intOrNaN(end) <= intOrNaN(start)) {
        valid = false;
        showSuccess(startEl);
        showError(endEl, "Конец интервала должен быть строго больше чем начало интервала");
    } else {
        valid = true;
        showSuccess(startEl);
        showSuccess(endEl);
    }

    if (isNaN(points) || isNaN(intOrNaN(points))) {
        valid = false;
        showError(pointsEl, "Введите целое число");
    } else if (parseInt(points) < 2 || parseInt(points) > 10) {
        valid = false;
        showError(pointsEl, "Введите целое число в диапазоне [2, 10]");
    } else {
        valid = valid && true;
        showSuccess(pointsEl);
    }

    return validate_target_x() && valid;
}

function validate_input_number() {
    let valid;

    const input = document.getElementById("quantity")
    const number = input.value;

    if (isNaN(number) || isNaN(parseInt(number))) {
        showError(input, "Введите целое число");
        valid = false;
    } else if (parseInt(number) < 2 || parseInt(number) > 10) {
        showError(input, "Введите целое число в диапазоне [2, 10]");
        valid = false;
    } else {
        showSuccess(input);
        valid = true;
    }

    return valid;
}

function validate_target_x() {
    let valid;

    const input = document.getElementById("target")

    console.log("target_x " + input.value + "\n")

    if (input.value === null || input.value === "") {
        showError(input, "Введите число");
        valid = false;
    } else {
        showSuccess(input);
        valid = true;
    }

    return valid;
}

function validate_form_file(file_data) {
    let valid;

    const file_input = document.getElementById("file")

    let lines = file_data.split("\n");

    console.log("lines: " + lines)

    if (lines.length < 2 || lines.length > 10) {
        showError(file_input, "Количество строк в файле должно быть в диапазоне [2, 10]");
        valid = false;
    } else if (lines_is_invalid(lines)) {
        showError(file_input, "Строки в файле должны выглядеть как два числа разделенные пробелом");
        valid = false;
    } else if (!all_x_is_unique(lines)) {
        showError(file_input, "Все значения координаты X в файле должны быть уникальны");
        valid = false;
    } else {
        showSuccess(file_input);
        valid = true;
    }

    return validate_target_x() && valid;
}

function all_x_is_unique(lines) {
    let uniqueX = new Set();

    for (let i = 0; i < lines.length; i++) {
        let x = lines[i].split(" ")[0];
        if (uniqueX.has(x)) {
            return false;
        }
        uniqueX.add(x);
    }

    return true;
}

function lines_is_invalid(lines) {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let split_line = line.split(" ");
        split_line[0] = split_line[0].replace(',', '.');
        split_line[1] = split_line[1].replace(',', '.');

        if (split_line.length !== 2 || isNaN(split_line[0]) || isNaN(parseFloat(split_line[0]))
            || isNaN(split_line[1]) || isNaN(parseFloat(split_line[1]))) {
            console.log(split_line)
            return true;
        }
    }
    return false;
}