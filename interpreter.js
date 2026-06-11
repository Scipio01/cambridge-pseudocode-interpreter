let variables = {};
let lines = [];
let currentLine = 0;
let loops = {};


function validateProgram() {
    let stack = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (line.startsWith("DECLARE")) {
            let declaration = line.replace("DECLARE", "").trim();

            if (declaration === "") {
                currentLine = i;
                showError("DECLARE statement needs a variable name");
                return false;
            }

            if (!declaration.includes(":")) {
                currentLine = i;
                showError("DECLARE statement must include :");
                return false;
            }

            let colonPos = declaration.indexOf(":");

            let variableName = declaration.substring(0, colonPos).trim();
            let dataType = declaration.substring(colonPos + 1).trim();

            if (variableName === "") {
                currentLine = i;
                showError("DECLARE statement needs a variable name");
                return false;
            }

            if (dataType === "") {
                currentLine = i;
                showError("DECLARE statement needs a data type");
                return false;
            }

            if (dataType.includes("ARRAY")) {
                if (!dataType.includes("[")) {
                    currentLine = i;
                    showError("ARRAY declaration must include [");
                    return false;
                }

                if (!dataType.includes("]")) {
                    currentLine = i;
                    showError("ARRAY declaration must include ]");
                    return false;
                }

                if (!dataType.includes("OF")) {
                    currentLine = i;
                    showError("ARRAY declaration must include OF");
                    return false;
                }
            }
        }

        if (line.startsWith("IF")) {
            if (!line.endsWith("THEN")) {
                currentLine = i;
                showError("IF statement must end with THEN");
                return false;
            }

            stack.push({
                type: "IF",
                lineNumber: i
            });
        }

        if (line === "ENDIF") {
            if (stack.length === 0) {
                currentLine = i;
                showError("ENDIF without matching IF");
                return false;
            }

            let lastBlock = stack.pop();

            if (lastBlock.type !== "IF") {
                currentLine = i;
                showError("ENDIF does not match IF");
                return false;
            }
        }

        if (line.startsWith("FOR")) {
            let forLine = line.replace("FOR", "").trim();

            if (!forLine.includes("←")) {
                currentLine = i;
                showError("FOR statement must use ←");
                return false;
            }

            if (!forLine.includes("TO")) {
                currentLine = i;
                showError("FOR statement must include TO");
                return false;
            }

            let parts = forLine.split("←");
            let variableName = parts[0].trim();

            if (variableName === "") {
                currentLine = i;
                showError("FOR statement needs a variable name");
                return false;
            }

            let range = parts[1].split("TO");
            let startValue = range[0].trim();
            let endValue = range[1].trim();

            if (startValue === "" || endValue === "") {
                currentLine = i;
                showError("FOR statement needs start and end values");
                return false;
            }

            stack.push({
                type: "FOR",
                variableName: variableName,
                lineNumber: i
            });
        }

        if (line.startsWith("NEXT")) {
            let nextVariable = line.replace("NEXT", "").trim();

            if (nextVariable === "") {
                currentLine = i;
                showError("NEXT statement needs a variable name");
                return false;
            }

            if (stack.length === 0) {
                currentLine = i;
                showError("NEXT without matching FOR");
                return false;
            }

            let lastBlock = stack.pop();

            if (lastBlock.type !== "FOR") {
                currentLine = i;
                showError("NEXT does not match FOR");
                return false;
            }

            if (lastBlock.variableName !== nextVariable) {
                currentLine = i;
                showError("NEXT variable does not match FOR variable");
                return false;
            }
        }

        if (line.startsWith("WHILE")) {
            let condition = line.replace("WHILE", "").trim();

            if (condition === "") {
                currentLine = i;
                showError("WHILE statement needs a condition");
                return false;
            }

            stack.push({
                type: "WHILE",
                lineNumber: i
            });
        }

        if (line === "ENDWHILE") {
            if (stack.length === 0) {
                currentLine = i;
                showError("ENDWHILE without matching WHILE");
                return false;
            }

            let lastBlock = stack.pop();

            if (lastBlock.type !== "WHILE") {
                currentLine = i;
                showError("ENDWHILE does not match WHILE");
                return false;
            }
        }

        if (line === "REPEAT") {
            stack.push({
                type: "REPEAT",
                lineNumber: i
            });
        }

        if (line.startsWith("UNTIL")) {
            let condition = line.replace("UNTIL", "").trim();

            if (condition === "") {
                currentLine = i;
                showError("UNTIL statement needs a condition");
                return false;
            }

            if (stack.length === 0) {
                currentLine = i;
                showError("UNTIL without matching REPEAT");
                return false;
            }

            let lastBlock = stack.pop();

            if (lastBlock.type !== "REPEAT") {
                currentLine = i;
                showError("UNTIL does not match REPEAT");
                return false;
            }
        }
    }

    if (stack.length > 0) {
        let unclosedBlock = stack.pop();
        currentLine = unclosedBlock.lineNumber;

        if (unclosedBlock.type === "IF") {
            showError("ENDIF expected");
        }

        if (unclosedBlock.type === "FOR") {
            showError("NEXT expected");
        }

        if (unclosedBlock.type === "WHILE") {
            showError("ENDWHILE expected");
        }

        if (unclosedBlock.type === "REPEAT") {
            showError("UNTIL expected");
        }

        return false;
    }

    return true;
}


function runCode() {
    variables = {};
    loops = {};
    document.getElementById("output").textContent = "";

    let code = document.getElementById("code").value;

    lines = code.split("\n").map(function(line) {
        return line.split("//")[0];
    });

    if (!validateProgram()) {
        return;
    }

    currentLine = 0;

    while (currentLine < lines.length) {
        runLine(lines[currentLine].trim());
        currentLine++;
    }
}


function runLine(line) {
    if (line === "") return;

    if (line.startsWith("DECLARE")) {
        return;
    }

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

    if (line.startsWith("WHILE")) {
        let condition = line.replace("WHILE", "").trim();

        if (getValue(condition) === false) {
            skipToEndwhile();
        }

        return;
    }

    if (line === "ENDWHILE") {
        let depth = 0;

        while (currentLine >= 0) {
            currentLine--;

            let previousLine = lines[currentLine].trim();

            if (previousLine === "ENDWHILE") {
                depth++;
            }

            if (previousLine.startsWith("WHILE")) {
                if (depth === 0) {
                    currentLine--;
                    return;
                }

                depth--;
            }
        }

        return;
    }

    if (line === "REPEAT") {
        return;
    }

    if (line.startsWith("UNTIL")) {
        let condition = line.replace("UNTIL", "").trim();

        if (getValue(condition) === false) {
            jumpBackToRepeat();
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

        if (name.includes("[") && name.endsWith("]")) {
            let arrayName = name.split("[")[0].trim();
            let indexText = name.split("[")[1].replace("]", "").trim();
            let index = getValue(indexText);

            if (variables[arrayName] === undefined) {
                variables[arrayName] = {};
            }

            variables[arrayName][index] = getValue(value);
            return;
        }

        variables[name] = getValue(value);
        return;
    }

    if (line.startsWith("OUTPUT")) {
        let outputText = line.replace("OUTPUT", "").trim();
        let parts = outputText.split(",");
        let result = "";

        for (let i = 0; i < parts.length; i++) {
            result += getValue(parts[i].trim());
        }

        print(result);
        return;
    }
}

function getValue(value) {

    if (value.startsWith("LENGTH(") && value.endsWith(")")) {
        let inside = value.replace("LENGTH(", "").slice(0, -1).trim();
        let text = getValue(inside);

        return text.length;
    }

    if (value.startsWith("UCASE(") && value.endsWith(")")) {
        let inside = value.replace("UCASE(", "").slice(0, -1).trim();
        let text = getValue(inside);

        return String(text).toUpperCase();
    }

    if (value.startsWith("LCASE(") && value.endsWith(")")) {
        let inside = value.replace("LCASE(", "").slice(0, -1).trim();
        let text = getValue(inside);

        return String(text).toLowerCase();
    }

    if (value.startsWith("SUBSTRING(") && value.endsWith(")")) {
        let inside = value.replace("SUBSTRING(", "").slice(0, -1).trim();
        let parts = inside.split(",");

        let text = String(getValue(parts[0].trim()));
        let start = getValue(parts[1].trim());
        let length = getValue(parts[2].trim());

        return text.substring(start - 1, start - 1 + length);
    }

    if (value.startsWith("RANDOM(") && value.endsWith(")")) {
        let inside = value.replace("RANDOM(", "").slice(0, -1).trim();
        let parts = inside.split(",");

        let min = getValue(parts[0].trim());
        let max = getValue(parts[1].trim());

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (value.startsWith("ROUND(") && value.endsWith(")")) {
        let inside = value.replace("ROUND(", "").slice(0, -1).trim();
        let number = getValue(inside);

        return Math.round(number);
    }

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

    if (value.includes(" MOD ")) {
        let parts = value.split(" MOD ");
        let left = getValue(parts[0].trim());
        let right = getValue(parts[1].trim());
        return left % right;
    }

    if (value.includes(" DIV ")) {
        let parts = value.split(" DIV ");
        let left = getValue(parts[0].trim());
        let right = getValue(parts[1].trim());
        return Math.floor(left / right);
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

    if (value.includes("[") && value.endsWith("]")) {
        let arrayName = value.split("[")[0].trim();
        let indexText = value.split("[")[1].replace("]", "").trim();
        let index = getValue(indexText);

        if (variables[arrayName] === undefined) {
            return undefined;
        }

        return variables[arrayName][index];
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

function skipToEndwhile() {
    let depth = 0;

    while (currentLine < lines.length) {
        currentLine++;

        let line = lines[currentLine].trim();

        if (line.startsWith("WHILE")) {
            depth++;
        }

        if (line === "ENDWHILE") {
            if (depth === 0) {
                return;
            }

            depth--;
        }
    }
}


function jumpBackToRepeat() {
    let depth = 0;

    while (currentLine >= 0) {
        currentLine--;

        let previousLine = lines[currentLine].trim();

        if (previousLine.startsWith("UNTIL")) {
            depth++;
        }

        if (previousLine === "REPEAT") {
            if (depth === 0) {
                currentLine--;
                return;
            }

            depth--;
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


function insertArrow() {
    let codeBox = document.getElementById("code");

    let start = codeBox.selectionStart;
    let end = codeBox.selectionEnd;

    codeBox.value =
        codeBox.value.substring(0, start) +
        " ← " +
        codeBox.value.substring(end);

    codeBox.focus();

    codeBox.selectionStart = start + 3;
    codeBox.selectionEnd = start + 3;
}