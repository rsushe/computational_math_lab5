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

function validate_form() {
    let valid = true;

    let errorText;

    let table = document.getElementById("input_table");
    let cells = table.querySelectorAll("td");
    cells.forEach((cell) => {
        let button = cell.firstChild
        if (button.value == null || button.value == "") {
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
        if (button.value != null && button.value != "") {
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

    return valid
}

function validate_input_number() {
    let valid;

    const input = document.getElementById("quantity")
    const number = input.value;

    if (isNaN(number) || isNaN(parseInt(number))) {
        showError(input, "Введите целое число");    
        valid = false;
    } else if (parseInt(number) < 8 || parseInt(number) > 12) {
        showError(input, "Введите целое число в диапазоне [8, 12]");
        valid = false;
    } else {
        showSuccess(input);
        valid = true;
    }

    return valid;
}

function validate_file_data(file_data) {
    let valid;

    const file_input = document.getElementById("file")

    lines = file_data.split("\r\n");

    if (lines.length < 8 || lines.length > 12) {
        showError(file_input, "Количество строк в файле должно быть в диапазоне [8, 12]");
        valid = false;
    } else if (lines_is_invalid(lines)) {
        console.log("lines is invalid here")
        showError(file_input, "Строки в файле должны выглядеть как два числа разделенные пробелом");
        valid = false;
    } else if (!all_x_is_unique(lines)) {
        showError(file_input, "Все значения координаты X в файле должны быть уникальны");
        valid = false;
    } else {
        showSuccess(file_input);
        valid = true;
    }

    return valid;
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

        if (split_line.length != 2 || isNaN(split_line[0]) || isNaN(parseFloat(split_line[0])) 
        || isNaN(split_line[1]) || isNaN(parseFloat(split_line[1]))) {
            console.log(split_line)
            return true;
        };
    }
    return false
}