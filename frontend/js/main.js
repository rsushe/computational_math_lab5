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
    points = []
    let cells = document.getElementById("input_table").querySelectorAll("input");

    for (let i = 0; i < cells.length; i += 2) {
        point = {}
        point.x = parseFloat(cells[i].value.replace(',', '.'))
        point.y = parseFloat(cells[i + 1].value.replace(',', '.'))

        points.push(point)
    }

    return points
}

function parseFile(file_data) {
    points = []

    lines = file_data.split("\r\n");

    lines.forEach((line) => {
        split_line = line.split(" ");

        point = {}
        point.x = parseFloat(split_line[0].replace(',', '.'))
        point.y = parseFloat(split_line[1].replace(',', '.'))

        points.push(point)
    });

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

function getFunction(data) {
    switch (data.best_approximation) {
        case "linear":
            return x => data.linear[0] + data.linear[1] * x;
        case "square":
            return x => data.square[0] + data.square[1] * x + data.square[2] * Math.pow(x, 2);
        case "cubic":
            return x => data.cubic[0] + data.cubic[1] * x + data.cubic[2] * Math.pow(x, 2) + data.cubic[3] * Math.pow(x, 3);
        case "exponential":
            return x => data.exponential[0] * Math.exp(data.exponential[1] * x);
        case "logarithmic":
            return x => data.logarithmic[0] * Math.log(x) + data.logarithmic[1];
        case "power":
            return x => data.power[0] * Math.pow(x, data.power[1])
    }
}

function getFunctionTextRepresentation(data) {
    switch (data.best_approximation) {
        case "linear":
            return data.linear[0] + " + " + data.linear[1] + " * x";
        case "square":
            return data.square[0] + " + " + data.square[1] + " * x + " + data.square[2] + " * x ^ 2";
        case "cubic":
            return data.cubic[0] + " + " + data.cubic[1] + " * x + " + data.cubic[2] + " * x ^ 2 + " + data.cubic[3] + " * x ^ 3";
        case "exponential":
            return data.exponential[0] + " * e ^ (x * " + data.exponential[1] + ")";
        case "logarithmic":
            return data.logarithmic[0] + " * ln(x) + " + data.logarithmic[1];
        case "power":
            return data.power[0] + " * x ^ " + data.power[1];
    }
}

function getTypeTextRepresentation(data) {
    switch (data.best_approximation) {
        case "linear":
            return "линейная";
        case "square":
            return "квадратичная";
        case "cubic":
            return "кубическая";
        case "exponential":
            return "экспоненциальная";
        case "logarithmic":
            return "логарифмическая";
        case "power":
            return "степенная"
    }
}

function draw_points(board, points) {
    points.forEach((point) => {
        board.create("point", [point.x, point.y], {fixed:true});
    });
}

function submitForm(board, points) {
    $.ajax({
        type: 'POST',
        url: config.backendURL,
        contentType: "application/json",
        data: JSON.stringify(points),
        dataType: 'json',
        success: (data) => {
            console.log(data);

            min_x = points[0].x;
            max_x = points[0].x;

            min_y = points[0].y;
            max_y = points[0].y;

            points.forEach((point) => {
                min_x = Math.min(min_x, point.x);
                max_x = Math.max(max_x, point.x);

                min_y = Math.min(min_y, point.y);
                max_y = Math.max(max_y, point.y);
            });

            board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [min_x - 1, max_y + 1, max_x + 1, min_y - 1], axis: true, showCopyright: false});
        
            functionRule = getFunction(data);

            board.create('functiongraph',[functionRule, min_x, max_x]);

            draw_points(board, points);

            $(".right_data #result").html(getTypeTextRepresentation(data));
            $(".right_data #function").html(getFunctionTextRepresentation(data));
        }
    });
}

$(document).ready(() => {
    let board = JXG.JSXGraph.initBoard('jxgbox', {boundingbox: [-6, 6, 6, -6], axis: true, showCopyright: false});

    let isReadingFile = false;

    createTableWithNRows($(".left_data #quantity").val())

    $(".left_data #quantity").change(() => {
        if (validate_input_number()) {
            createTableWithNRows($(".left_data #quantity").val())
        }
    });

    $(".left_data #toggle").click(() => {
        isReadingFile = !isReadingFile;

        table = document.getElementById("form_table")
        button = document.getElementById("form_button")

        if (isReadingFile) {
            setElementVisibilityTo(table, false);
            setElementVisibilityTo(button, true);
        } else {
            setElementVisibilityTo(table, true);
            setElementVisibilityTo(button, false);
        }
        console.log($(".left_data #toggle").is(":checked"));
    });

    $(".left_data #file").change((event) => {
        const reader = new FileReader();

        reader.addEventListener(
            "load",
            () => {
                let file_data = reader.result;
                console.log(file_data)
                if (validate_file_data(file_data)) {
                    console.log("file here");
                    submitForm(board, parseFile(file_data));
                }
            },
            false
        );

        const fileList = event.target.files;
      
        if (fileList.length > 0) {
            reader.readAsText(fileList[0]);
        }

        $(".left_data #file")[0].value = '';
      });

    $('#form #submit').click((event) => {
        if (validate_form()) {
            submitForm(board, parseTable());
        }
        event.preventDefault();
    });

});