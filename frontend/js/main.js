function getInputRow() {
    return "<tr>" +
        "<td><input type='number'>" +
        "<td><input type='number'>" +
        "</tr>"
}

function createTableWithNRows(n) {
    $(".left_data #input_table tbody").html(getInputRow().repeat(n))
}

function parseTable() {
    let points = []
    let cells = document.getElementById("input_table").querySelectorAll("input");

    let point;
    for (let i = 0; i < cells.length; i += 2) {
        point = {};
        point.x = parseFloat(cells[i].value.replace(',', '.'));
        point.y = parseFloat(cells[i + 1].value.replace(',', '.'));

        points.push(point);
    }

    return points;
}

function parseFile(file_data) {
    let points = []

    let lines = file_data.split("\n");

    lines.forEach((line) => {
        let split_line = line.split(" ");

        let point = {};
        point.x = parseFloat(split_line[0].replace(',', '.'));
        point.y = parseFloat(split_line[1].replace(',', '.'));

        points.push(point);
    });

    return points;
}

function parseFunc() {
    let funcStr = $("option:selected").text();
    let func;

    console.log(funcStr);

    switch (funcStr) {
        case "sin(x)":
            func = x => Math.sin(x);
            break;
        case "x^2 + x":
            func = x => x * x + x;
            break;
        default:
            func = x => x;
            break;
    }

    let points = []

    const start = parseInt($("#start").val()), end = parseInt($("#end").val()),
        number_of_points = parseInt($("#points").val());

    let step = (end - start) / (number_of_points - 1), currentX = start;

    for (let i = 0; i < number_of_points; i++) {
        let point = {};
        point.x = currentX;
        point.y = func(currentX);

        currentX += step;

        points.push(point);
    }

    console.log(points);

    return points;
}

function setElementVisibilityTo(element, isVisible) {
    if (isVisible) {
        element.classList.remove("invisible");
        element.classList.add("visible");
    } else {
        element.classList.remove("visible");
        element.classList.add("invisible");
    }
}

function draw_points(board, points) {
    points.forEach((point) => {
        board.create("point", [point.x, point.y], {fixed: true});
    });
}

function getLagrangeFunc(lagrange_coef, points) {
    return x => {
        const n = lagrange_coef.length;
        let result = 0;
        for (let i = 0; i < n; i++) {
            let product = 1;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    product *= (x - points[j].x);
                }
            }
            result += lagrange_coef[i] * product;
        }
        return result;
    }
}

function fact(x) {
    if (x === 0) {
        return 1;
    }
    return x * fact(x - 1);
}

function getNewtonFunc(newton_coef, points) {
    return x => {
        const n = newton_coef.length, h = points[1].x - points[0].x;
        let result = points[0].y;

        for (let i = 0; i < n; i++) {
            let product = 1;
            for (let j = 0; j <= i; j++) {
                product *= (x - points[j].x);
            }
            result += newton_coef[i] * product / (fact(i + 1) * Math.pow(h, i + 1));
        }

        return result;
    }
}

function submitForm(board, points, target_x) {

    console.log(JSON.stringify(points))

    $.ajax({
        type: 'POST',
        url: config.host + config.interpolation_endpoint,
        contentType: "application/json",
        data: JSON.stringify(points),
        dataType: 'json',
        success: (data) => {
            console.log(data);


            let min_x = points[0].x;
            let max_x = points[0].x;

            let min_y = points[0].y;
            let max_y = points[0].y;

            points.forEach((point) => {
                min_x = Math.min(min_x, point.x);
                max_x = Math.max(max_x, point.x);

                min_y = Math.min(min_y, point.y);
                max_y = Math.max(max_y, point.y);
            });

            board = JXG.JSXGraph.initBoard('jxgbox', {
                boundingbox: [min_x - 5, max_y + 5, max_x + 5, min_y - 5],
                axis: true,
                showCopyright: false
            });

            let lagrangeFunc = getLagrangeFunc(data.lagrange_coefficients, points);
            let newtonFunc = getNewtonFunc(data.newton_coefficients, points);

            board.create('functiongraph', [lagrangeFunc, min_x, max_x]);
            board.create('functiongraph', [newtonFunc, min_x, max_x], {strokecolor:'red'});

            draw_points(board, points);

            $("#lagrange").text(lagrangeFunc(target_x));
            $("#newton").text(newtonFunc(target_x));
        }
    });
}

$(document).ready(() => {
    let board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-6, 6, 6, -6], axis: true, showCopyright: false});

    let file_data = "";

    let table = document.getElementById("form_table");
    let file = document.getElementById("form_file");
    let func = document.getElementById("form_func");

    let table_btn = document.getElementById("btn_table");
    let file_btn = document.getElementById("btn_file");
    let func_btn = document.getElementById("btn_func");

    let selected_type = "table";

    createTableWithNRows($(".left_data #quantity").val())

    $(".left_data #quantity").change(() => {
        if (validate_input_number()) {
            createTableWithNRows($(".left_data #quantity").val())
        }
    });

    $(".left_data #btn_table").click(() => {
        selected_type = "table";

        setElementVisibilityTo(table, true);
        setElementVisibilityTo(file, false);
        setElementVisibilityTo(func, false);

        table_btn.classList.add("selected");
        file_btn.classList.remove("selected");
        func_btn.classList.remove("selected");
    });

    $(".left_data #btn_file").click(() => {
        selected_type = "file";

        setElementVisibilityTo(table, false);
        setElementVisibilityTo(file, true);
        setElementVisibilityTo(func, false);

        table_btn.classList.remove("selected");
        file_btn.classList.add("selected");
        func_btn.classList.remove("selected");
    });

    $(".left_data #btn_func").click(() => {
        selected_type = "func";

        setElementVisibilityTo(table, false);
        setElementVisibilityTo(file, false);
        setElementVisibilityTo(func, true);

        table_btn.classList.remove("selected");
        file_btn.classList.remove("selected");
        func_btn.classList.add("selected");
    });

    $(".left_data #file").change((event) => {
        const reader = new FileReader();

        reader.addEventListener(
            "load",
            () => {
                file_data = reader.result;
                console.log(file_data);
            },
            false
        );

        const fileList = event.target.files;

        if (fileList.length > 0) {
            reader.readAsText(fileList[0]);
        }
    });

    $('#form #submit').click((event) => {
        console.log(selected_type)

        let points;

        switch (selected_type) {
            case "table":
                if (validate_form_table()) {
                    points = parseTable();
                    break;
                }
                event.preventDefault();
                return;
            case "file":
                if (validate_form_file(file_data)) {
                    points = parseFile(file_data);
                    break;
                }
                event.preventDefault();
                return;
            case "func":
                if (validate_form_func()) {
                    points = parseFunc();
                    break;
                }
                event.preventDefault();
                return;
        }

        console.log("success validation " + selected_type)

        let target_x = parseFloat($("#target").val());

        console.log(points, target_x);

        submitForm(board, points, target_x);

        if (selected_type === "file") {
            $(".left_data #file")[0].value = '';
        }

        event.preventDefault();
    });
});