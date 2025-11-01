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
    else if (op === "/") {
        const result = div(a, b);
        if (result === "ERROR") return result;
        else return result.toFixed(3);
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

function display(button, currentInput) {
    const value = button.textContent;
    if (operation.textContent === "ERROR") operation.textContent = "0";
    if (!(isNaN(value))) {
        if (currentInput === "0") {
            currentInput = value;
            operation.textContent = value;
        } else if (currentInput.includes("=")) {
            currentInput = value;
            operation.textContent = value;
        } else {
            if (isNaN(currentInput.slice(-1)) && currentInput.slice(-1) !== ".") operation.textContent = value;
            else operation.textContent += value;
            currentInput += value;
        }
    } else if(value === "." && !operators.some(op => currentInput.slice(-1) === op)) {
        let lastOperatorIndex = -1;
        for (let symbol of operators) {
            const idx = currentInput.lastIndexOf(symbol);
            if (idx > lastOperatorIndex) lastOperatorIndex = idx;
        }
        const currentNumber = currentInput.slice(lastOperatorIndex + 1);
        if (!currentNumber.includes(".")) {
            currentInput += value;
            operation.textContent = currentNumber + value;
        }
    } else if (value === "C") {
        currentInput = "0";
        operation.textContent = "0";
        resetActiveOperator();
    } else if (value === "DEL") {
        if (currentInput.includes("=")) {
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
            const lastChar = currentInput.slice(-1);
            if (operators.includes(lastChar)) {
                currentInput = currentInput.slice(0, -1);
                resetActiveOperator();
                operation.textContent = currentInput === "" ? "0" : currentInput;
            } else {
                currentInput = currentInput.slice(0, -1);
                const newLastChar = currentInput.slice(-1);
                if (operators.includes(newLastChar) || currentInput === "") {
                    operation.textContent = "0";
                } else {
                    operation.textContent = currentInput;
                }
            }
            if (currentInput === "" || currentInput === "-") {
                currentInput = "0";
                operation.textContent = currentInput;
            }
        }
    } else if (["+", "-", "x", "/"].includes(value) && !operators.some(op => currentInput.slice(-1) === op)) {
        highlightOperator(button);
        if (operators.some(op => currentInput.includes(op)) && !currentInput.includes("=")) {
            previousOp = operators.find(op => currentInput.includes(op));
            const opIdx = [...currentInput].findIndex((char, idx) => operators.includes(char) && idx !== 0);
            num1 = Number(currentInput.slice(0, opIdx));
            if (currentInput.includes("=")) {
                equalsIdx = currentInput.indexOf("=");
                num2 = Number(currentInput.slice(opIdx + 1, equalsIdx));
            } else num2 = Number(currentInput.slice(opIdx + 1));
            const result = Number(operate(num1, num2, previousOp));
            currentOp = value;
            currentInput = result.toString() + currentOp;
            operation.textContent = result;
        } else if (currentInput.includes("=")) {
            currentOp = value;
            currentInput = currentInput.split("=")[1] + currentOp;
        } else {
            currentOp = value;
            currentInput += `${value}`;
        }
    } else if (value === "=") {
        resetActiveOperator();
        const opIndex = [...currentInput].findIndex((char, idx) => operators.includes(char) && idx !== 0);
        num1 = currentInput.slice(0, opIndex);
        num2 = currentInput.slice(opIndex + 1);
        if (num2 !== "" && opIndex !== undefined) {
            const result = Number(operate(+num1, +num2, currentOp)).toString();
            if (isNaN(result)) {
                currentInput = "0";
                operation.textContent = "ERROR"
            } else {
                currentInput += value + result;
                operation.textContent = result;
            }
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
operatorButton = document.querySelector("#sum");
const rgb = window.getComputedStyle(operatorButton).backgroundColor;
let activeOperatorButton = null;

let input = "0";
operation.textContent = input;
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        const target = e.target;
        input = display(target, input);
    })
})