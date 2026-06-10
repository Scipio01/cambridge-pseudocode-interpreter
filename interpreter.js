let variables = {};

function runCode() {
    variables = {};
    document.getElementById("output").textContent = "";

    let code = document.getElementById("code").value;
    let lines = code.split("\n");

    for (let line of lines) {
        runLine(line.trim());
    }
}

function runLine(line) {
    if (line === "") return;

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
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
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

    if (!isNaN(value)) {
        return Number(value);
    }

    return variables[value];
}

function print(text) {
    document.getElementById("output").textContent += text + "\n";
}