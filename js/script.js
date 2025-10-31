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
    if (op === "+") return add(a, b).toFixed(3);
    else if (op === "-") return sub(a, b).toFixed(3);
    else if (op === "x") return mul(a, b).toFixed(3);
    else if (op === "/") return div(a, b).toFixed(3);
}

function display(button, currentInput) {
    if (operation.textContent === "ERROR") operation.textContent = "0";
    if (!(isNaN(button))) {
        if (currentInput === "0") {
            currentInput = button;
            operation.textContent = currentInput;
        } else if (equalsExists && !operators.includes(currentInput.slice(-1))) {
            currentInput = button;
            equalsExists = false;
            operation.textContent = currentInput;
        } else {
            if (isNaN(currentInput.slice(-1)) && currentInput.slice(-1) !== ".") operation.textContent = button;
            else operation.textContent += button;
            currentInput += button;
            equalsExists = false;
        }
    } else if(button === "." && !operators.some(op => currentInput.slice(-1) === op)) {
        let lastOperatorIndex = -1;
        for (let symbol of operators) {
            const idx = currentInput.lastIndexOf(symbol);
            if (idx > lastOperatorIndex) lastOperatorIndex = idx;
        }
        const currentNumber = currentInput.slice(lastOperatorIndex + 1);
        if (!currentNumber.includes(".")) {
            currentInput += button;
            operation.textContent = currentInput;
        }
    } else if (button === "C") {
        currentInput = "0";
        operation.textContent = "0";
    } else if (button === "DEL" && currentInput !== "0") {
        currentInput = currentInput.split("").slice(0, -1).join("");
        if (currentInput === "") currentInput = "0";
        operation.textContent = currentInput;
    } else if (["+", "-", "x", "/"].includes(button) && !operators.some(op => currentInput.slice(-1) === op)) {
        if (operators.some(op => currentInput.includes(op))) {
            op = operators.find(op => currentInput.includes(op));
            opIdx = operators.map(op => currentInput.indexOf(op)).find(op => op !== -1);
            num1 = Number(currentInput.slice(0, opIdx));
            num2 = Number(currentInput.slice(opIdx + 1));
            const result = Number(operate(num1, num2, op));
            op = button;
            currentInput = result.toString() + op;
            operation.textContent = result;
        } else {
            op = button;
            currentInput += `${button}`;
        }
    } else if (button === "=") {
        opIndex = operators.map(op => currentInput.indexOf(op)).find(idx => idx !== -1);
        num1 = currentInput.slice(0, opIndex);
        num2 = currentInput.slice(opIndex + 1);
        if (num2 !== "") {
            const result = Number(operate(+num1, +num2, op)).toString();
            currentInput = result;
            operation.textContent = result;
            equalsExists = true;
        } else {
            currentInput = "0";
            operation.textContent = "ERROR"
        }
    }
    return currentInput;
}

const screen = document.querySelector(".screen");
const operation = document.createElement("p");
screen.appendChild(operation);
const operators = ["+", "-", "x", "/"];
let num1, num2, op;
let equalsExists = false;

let input = "0";
operation.textContent = input;
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        const value = e.target.textContent;
        input = display(value, input);
    })
})