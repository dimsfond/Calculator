function add(a,b) {
    return a + b;
}

function sub(a, b) {
    return a-b;
}

function mul(a, b) {
    return a * b;
}

function div (a, b) {
    if (b === 0) return "ERROR"
    return a / b;
}

function operate(a, b, op) {
    if (op === "+") return add(a, b);
    else if (op === "-") return sub(a, b);
    else if (op === "x") return mul(a, b);
    else if (op === "/") {
        const result = div(a, b);
        if (result === "ERROR") return result;
        else return result;
    }
}

function highlightOperator(button) {
    if (activeOperatorButton) {
        activeOperatorButton.style.backgroundColor = rgb;
    }
    button.style.backgroundColor = "lightgreen"
    activeOperatorButton = button;

}

function resetActiveOperator() {
    if (activeOperatorButton) {
        activeOperatorButton.style.backgroundColor = rgb;
        activeOperatorButton = null;
    }
}

function formatResult(result) {
    let absResult = Math.abs(result);
    if ((absResult !== 0 && (absResult < 0.001 || absResult > Math.pow(10, MAX_LENGTH)))) {
        return Number(result).toExponential(MAX_LENGTH - 5); // NEW: keep it compact
        }
    let rounded = Math.round(result * 1000) / 1000;
    let str = rounded.toString();
    if (str.replace('.', '').length > MAX_LENGTH) {
        str = Number(rounded).toExponential(MAX_LENGTH - 5);
    }
    return str;
}

function handleNumber(value, currentInput) {
    const lastOpIdx = Math.max(
        currentInput.lastIndexOf('+'),
        currentInput.lastIndexOf('-'),
        currentInput.lastIndexOf('x'),
        currentInput.lastIndexOf('/')
    );
    let currentNumber = currentInput.slice(lastOpIdx + 1);
    if (currentNumber.replace('.', '').length >= MAX_LENGTH) return currentInput;
    if (currentInput === "0" || currentInput.includes("=")) {
        currentInput = value;
        operation.textContent = value;
    } else {
        if (isNaN(currentInput.slice(-1)) && currentInput.slice(-1) !== ".") operation.textContent = value;
        else operation.textContent += value;
        currentInput += value;
    }
    return currentInput;
}

function handleDecimal(currentInput) {
    let lastOperatorIndex = -1;
    for (let op of operators) {
        const idx = currentInput.lastIndexOf(op);
        if (idx > lastOperatorIndex) lastOperatorIndex = idx;
    }
    const currentNumber = currentInput.slice(lastOperatorIndex + 1);
    if (!currentNumber.includes(".")) {
        currentInput += ".";
        operation.textContent = currentNumber + ".";
    }
    return currentInput;
}

function handleClear(currentInput) {
    currentInput = "0";
    operation.textContent = "0";
    resetActiveOperator();
    return currentInput;
}

function handleDelete(currentInput) {
    if (currentInput.includes ("=")) {
        let [beforeEq, result] = currentInput.split("=");
        result = result.slice(0, -1);
        if (result === "") {
            currentInput = "0";
            operation.textContent = "0";
        } else {
            currentInput = result;
            operation.textContent = result;
        }
    } else {
        let lastChar = currentInput.slice(-1);
        currentInput = currentInput.slice(0, -1);
        if (operators.includes(lastChar)) {
            resetActiveOperator();
        }
        let newLastChar = currentInput.slice(-1);
        if (currentInput === "" || currentInput === "-") {
            currentInput = "0";
            operation.textContent = "0";
        } else if (operators.includes(newLastChar)) {
            operation.textContent = "0";
        } else {
            let lastOpIndex = -1;
            for (let op of operators) {
                const idx = currentInput.lastIndexOf(op);
                if (idx > lastOpIndex) {
                    lastOpIndex = idx;
                }
            }
            operation.textContent = currentInput.slice(lastOpIndex + 1) || "0";
        }
    }
    return currentInput;
}

function handleOperator(value, button, currentInput) {
    // highlightOperator(button);
    if (operators.includes(currentInput.slice(-1))) {
        const lastOp = currentInput.slice(-1);
        if (["x", "/"].includes(lastOp) && ["+", "-"].includes(value)) {
            currentInput += value;
            currentOp = lastOp;
            return currentInput;
        }
        currentOp = value;
        currentInput = currentInput.slice(0, -1) + value;
        highlightOperator(button);
        return currentInput;
    }
    if (currentInput.includes("=")) {
        currentInput = currentInput.split("=")[1];
    }
    if (operators.some(op => {
        const idx = currentInput.lastIndexOf(op);
        return idx !== 0 && currentInput[idx - 1] && currentInput[idx - 1].toLowerCase() !== "e";
    })) {
        const previousOpIdx = [...currentInput].findIndex((op, idx) => operators.includes(op) && idx !== 0 && currentInput[idx - 1].toLowerCase() !== "e");
        const previousOp = currentInput.charAt(previousOpIdx);
        let num1 = currentInput.slice(0, previousOpIdx);
        let num2 = currentInput.slice(previousOpIdx + 1);
        let result = operate(+num1, +num2, previousOp);
        if (result === "ERROR") {
            currentInput = "0";
            operation.textContent = "ERROR"
            return currentInput;
        }
        let resultStr = formatResult(result);
        currentOp = value;
        currentInput = resultStr + currentOp;
        operation.textContent = resultStr;
        highlightOperator(button);
    } else {
        currentOp = value;
        currentInput += value;
        highlightOperator(button);
    }
    return currentInput;
}

function handleEquals(currentInput) {
    resetActiveOperator();
    if (currentInput.includes("=")) {
        return currentInput;
    }
    const opIndex = [...currentInput].findIndex((char, idx) => operators.includes(char) && idx !== 0 && currentInput[idx - 1].toLowerCase() !== "e");
    let num1 = currentInput.slice(0, opIndex);
    let num2 = currentInput.slice(opIndex + 1);
    if ((num1 === "" && ["-", "+"].includes(currentInput[0])) || num2 === "") {
        return currentInput;
    }
    if (num2 !== "" && opIndex !== -1) {
        let result = operate(+num1, +num2, currentOp);
        if (result === "ERROR") {
            currentInput = "0";
            operation.textContent = "ERROR"
        } else {
            let resultStr = formatResult(result);
            currentInput += "=" + resultStr;
            operation.textContent = resultStr;
        }
    } else {
        currentInput = "0";
        operation.textContent = "ERROR"
    }
    return currentInput;
}

function display(button, currentInput) {
    const value = button.textContent;
    if (operation.textContent === "ERROR") operation.textContent = "0";
    if (!(isNaN(value))) {
        currentInput = handleNumber(value, currentInput);
    } else if(value === "." && !operators.some(op => currentInput.slice(-1) === op)) {
        currentInput = handleDecimal(currentInput);
    } else if (value === "C") {
        currentInput = handleClear(currentInput);
    } else if (value === "DEL") {
        currentInput = handleDelete(currentInput);
    } else if (["+", "-", "x", "/"].includes(value)) {
        currentInput = handleOperator(value, button, currentInput);
    } else if (value === "=") {
        currentInput = handleEquals(currentInput);
    }
    return currentInput;
}

const screen = document.querySelector(".screen");
const operation = document.createElement("p");
screen.appendChild(operation);
const operators = ["+", "-", "x", "/"];
const operatorButton = document.querySelector("#sum");
const rgb = window.getComputedStyle(operatorButton).backgroundColor;
let activeOperatorButton = null;
let currentOp = null;
const MAX_LENGTH = 13;

let input = "0";
operation.textContent = input;
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        const target = e.target;
        input = display(target, input);
        console.log(input);
    })
})