let variables = {};
let lines = [];
let currentLine = 0;

function runCode() {
    variables = {};
    document.getElementById("output").textContent = "";

    let code = document.getElementById("code").value;
    lines = code.split("\n");

    currentLine = 0;

    while (currentLine < lines.length) {
        runLine(lines[currentLine].trim());
        currentLine++;
    }
}


function runLine(line) {
    if (line === "") return;

    if (line.startsWith("IF")) {
    if (!line.endsWith("THEN")) {
        showError("IF statement must end with THEN");
        return;
    }

    let condition = line.replace("IF", "").replace("THEN", "").trim();

    if (getValue(condition) === false) {
        skipToEndif();
    }

    return;
}

    if (line.includes("←")) {
        let parts = line.split("←");
        let name = parts[0].trim();
        let value = parts[1].trim();

        variables[name] = getValue(value);
    }

    else if (line.startsWith("OUTPUT")) {
        let value = line.replace("OUTPUT", "").trim();
        print(getValue(value));
    }
}

function getValue(value) {


    if (value.includes(">=")) {
    let parts = value.split(">=");
    let left = getValue(parts[0].trim());
    let right = getValue(parts[1].trim());
    return left >= right;
    }

    if (value.includes("<=")) {
    let parts = value.split("<=");
    let left = getValue(parts[0].trim());
    let right = getValue(parts[1].trim());
    return left <= right;
    }

    if (value.includes("<>")) {
    let parts = value.split("<>");
    let left = getValue(parts[0].trim());
    let right = getValue(parts[1].trim());
    return left !== right;
    }

    if (value.includes("=")) {
    let parts = value.split("=");
    let left = getValue(parts[0].trim());
    let right = getValue(parts[1].trim());
    return left === right;
    }

    if (value.includes(">")) {
        let parts = value.split(">");
        let left = getValue(parts[0].trim());
        let right = getValue(parts[1].trim());
        return left > right;
    }

    if (value.includes("<")) {
    let parts = value.split("<");
    let left = getValue(parts[0].trim());
    let right = getValue(parts[1].trim());
    return left < right;
    }


    if (value.includes("+")) {
        let parts = value.split("+");
        let left = getValue(parts[0].trim());
        let right = getValue(parts[1].trim());
        return left + right;
    }

    if (value.includes("-")) {
    let parts = value.split("-");
    let left = getValue(parts[0].trim());
    let right = getValue(parts[1].trim());
    return left - right;
}

if (value.includes("*")) {
    let parts = value.split("*");
    let left = getValue(parts[0].trim());
    let right = getValue(parts[1].trim());
    return left * right;
}

if (value.includes("/")) {
    let parts = value.split("/");
    let left = getValue(parts[0].trim());
    let right = getValue(parts[1].trim());
    return left / right;
}

if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
}

if (!isNaN(value)) {
    return Number(value);
}

return variables[value];
}

function skipToEndif() {
    while (currentLine < lines.length) {
        currentLine++;

        if (currentLine >= lines.length) {
            showError("ENDIF expected");
            return;
        }

        if (lines[currentLine].trim() === "ENDIF") {
            return;
        }
    }
}

function showError(message) {
    document.getElementById("output").textContent +=
        "Error on line " + (currentLine + 1) + ": " + message + "\n";
}

function print(text) {
    document.getElementById("output").textContent += text + "\n";
}