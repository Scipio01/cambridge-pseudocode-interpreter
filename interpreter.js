let variables = {};
let lines = [];
let currentLine = 0;
let loops = {};

function runCode() {
    variables = {};
    loops = {};
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

    if (line === "ELSE") {
        skipToEndif();
        return;
    }

    if (line === "ENDIF") {
        return;
    }

    if (line.startsWith("IF")) {
        if (!line.endsWith("THEN")) {
            showError("IF statement must end with THEN");
            return;
        }

        let condition = line.replace("IF", "").replace("THEN", "").trim();

        if (getValue(condition) === false) {
            skipToElseOrEndif();
        }

        return;
    }

    if (line.startsWith("FOR")) {
        let forLine = line.replace("FOR", "").trim();
        let parts = forLine.split("←");

        let variableName = parts[0].trim();
        let range = parts[1].split("TO");

        let startValue = getValue(range[0].trim());
        let endValue = getValue(range[1].trim());

        variables[variableName] = startValue;

        loops[variableName] = {
            startLine: currentLine,
            endValue: endValue
        };

        return;
    }

    if (line.startsWith("NEXT")) {
        let variableName = line.replace("NEXT", "").trim();

        variables[variableName]++;

        if (variables[variableName] <= loops[variableName].endValue) {
            currentLine = loops[variableName].startLine;
        }

        return;
    }

    if (line.startsWith("INPUT")) {
        let variableName = line.replace("INPUT", "").trim();
        let userInput = prompt("Enter value for " + variableName);

        variables[variableName] = userInput;

        return;
    }

    if (line.includes("←")) {
        let parts = line.split("←");
        let name = parts[0].trim();
        let value = parts[1].trim();

        variables[name] = getValue(value);
        return;
    }

    if (line.startsWith("OUTPUT")) {
        let value = line.replace("OUTPUT", "").trim();
        print(getValue(value));
        return;
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

function skipToElseOrEndif() {
    while (currentLine < lines.length) {
        currentLine++;

        if (currentLine >= lines.length) {
            showError("ENDIF expected");
            return;
        }

        let line = lines[currentLine].trim();

        if (line === "ELSE") {
            return;
        }

        if (line === "ENDIF") {
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