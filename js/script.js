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
    if (op === "*") return mul(a, b);
    if (op === "/") return div(a, b);
}

function display(button, currentInput) {
    if (!(isNaN(button)) || (["-", "."].includes(button) && currentInput.length === 0)) {
        currentInput += button;
        operation.textContent = currentInput;
    }
    if (currentInput.length >= 1) {
        if (button === "C") {
            currentInput = "";
            operation.textContent = "";
        } else if (button === "DEL") {
            currentInput = currentInput.split("").slice(0, -1).join("");
            operation.textContent = currentInput;
        }
    }
    return currentInput;
}

const screen = document.querySelector(".screen");
const operation = document.createElement("p");
screen.appendChild(operation);
let num1, num2, op;

let input = "";
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener("click", (e) => {
        value = e.target.textContent;
        input = display(value, input);
    })
})