const buttonContainer = document.getElementById('button-container');
const calculation = document.getElementById('calculation');
const resultDisplay = document.getElementById('result');
calculation.textContent = '';
let minusExist = false;
let operator = '';
let dotExist = false;
let result = 0;

let buttons = [];
const id = ['devide', 'plusMinus', 'DEL', 'clear', 'multiply', 
            'nine', 'eight', 'seven', 'deduct', 'six', 'five', 'four', 'add', 
            'three', 'two', 'one', 'equal', 'dot', 'zero'];
const content = ['/', '+/-', 'DEL', 'C', '*', '9', '8',
                 '7', '-', '6', '5', '4', '+', '3', 
                 '2', '1', '=', '.', '0'];
const firstMust = ['plusMinus', 'clear', 'nine', 'eight', 'seven', 'six', 'five',
                'four', 'three', 'two', 'one', 'zero', 'dot'];
const operators = ['devide', 'multiply', 'deduct', 'add', '/', '*', '-', '+'];
const firstNum = [];
const secondNum = [];

function makeButtons() {
    for(let i=0; i<19; i++) {
        buttons[i] = document.createElement('button');
        buttons[i].classList.add('button');
        buttons[i].id = id[i];
        buttons[i].textContent = content[i];
        buttonContainer.appendChild(buttons[i]);
    }
}
makeButtons();

function printCalculation(buttonChar) {
    if(operator == '' && secondNum[0] == undefined) { 
        if(buttonChar == 'DEL') firstNum.pop();
        if(buttonChar != '+/-' && buttonChar != 'DEL') firstNum.push(buttonChar);
        calculation.textContent = (firstNum.join('').length >= 19) ? firstNum.join('').slice(-19) : firstNum.join('');

    } else if(operators.includes(buttonChar)) {
        calculation.textContent = (firstNum.join('').length >= 18) ? firstNum.join('').slice(-18) + buttonChar : firstNum.join('') + buttonChar;

    } else if(operator != '' && buttonChar == 'DEL' && secondNum[0] == undefined) {
        operator = '';
        calculation.textContent = (firstNum.join('').length >= 19) ? firstNum.join('').slice(-19) : firstNum.join('');

    } else if (buttonChar == 'DEL' && secondNum[0] != undefined) {
        secondNum.pop();
        
        if(firstNum.join('').length + 1 + secondNum.join('').length >= 19) {
            const newArr = firstNum.concat(operator, secondNum);
            calculation.textContent = newArr.join('').slice(-19);
        } else {
            calculation.textContent = firstNum.join('') + operator + secondNum.join('');
        }
    } else {
        if(buttonChar != '+/-') secondNum.push(buttonChar);

        if(firstNum.join('').length + 1 + secondNum.join('').length >= 19) {
            const newArr = firstNum.concat(operator, secondNum);
            calculation.textContent = newArr.join('').slice(-19);
        } else {
            calculation.textContent = firstNum.join('') + operator + secondNum.join('');
        }
    }
}  


function calculate() {

    let first = parseFloat(firstNum.join(''));
    let second = parseFloat(secondNum.join(''));
    let result = 0; 
     
    if(operator == '+') result = first + second;
    else if(operator == '-') result = first - second;
    else if(operator == '/') result = first / second;
    else if(operator == '*') result = first * second;
    

    resultDisplay.textContent = (result.toString().length >= 14) ? result.toPrecision(10) : result;
    
    firstNum.splice(0, firstNum.length);
    for(const obj of Array.from(resultDisplay.textContent)) {
        firstNum.push(obj);
    }
    operator = '';
    secondNum.splice(0, secondNum.length);
    return 0;

}

function clickButton(e) {
    
    const buttonId = e.target.id;
    const buttonChar = e.target.textContent;

    if(firstNum[0] == undefined) {
        if (!(firstMust.includes(buttonId))) return 0;
        if(buttonId == 'dot') {
            dotExist = true;
            firstNum.push('0');
            printCalculation(buttonChar);
            return 0;
        }
    }
 
    if(buttonId == 'dot') {
        if(operator != '' && secondNum[0] ==undefined) {
            dotExist = true;
            secondNum.push('0');
            printCalculation(buttonChar);
            return 0;
        }
        if (dotExist == true) return 0;
        dotExist = true;
        printCalculation(buttonChar);
        return 0;
    }

    if(buttonId == 'plusMinus') {
        if (operator != '') {
            if(minusExist == false) {
                minusExist = true;
                secondNum.unshift('-');
                printCalculation(buttonChar);
                return 0; 
            } else {
                minusExist = false;
                secondNum.shift();
                printCalculation(buttonChar);
                return 0;
            }
        }
        if (minusExist == false) { //if minus don't exist, add it
            minusExist = true;
            firstNum.unshift('-');
            printCalculation(buttonChar);
            return 0;
        }
        minusExist = false; //if minus exist, remove it
        firstNum.shift();
        printCalculation(buttonChar);
        return 0;
    }

    if(operators.includes(buttonId)) {
        if(operator != '') calculate();
        operator = buttonChar;
        dotExist = false;
        printCalculation(buttonChar);
        return 0;
    }

    if(buttonId == 'equal') {
        calculate();
        return 0;
    }

    if(buttonId == 'clear') {
        firstNum.splice(0, firstNum.length);
        operator = '';
        secondNum.splice(0, secondNum.length);
        dotExist = false;
        minusExist = false;
        calculation.textContent = '';
        resultDisplay.textContent = '';
        return 0;
    }

    printCalculation(buttonChar);
    return 0; 
}

// interface effects :

let oldLightId = 0;
function hoverOn(e) {
    if(e.target.id == 'button-container') return;
    if (oldLightId != 0) document.getElementById(oldLightId).style.filter = 'brightness(1)';
    e.target.style.filter = 'brightness(0.8)';
    oldLightId = e.target.id;
}
function hoverOff() {
    if (oldLightId != 0) document.getElementById(oldLightId).style.filter = 'brightness(1)';
}
function down(e) {
    if(e.target.id == 'button-container') return 0;
    e.target.style.filter = 'brightness(0.4)';
}
function up(e) {
    if(e.target.id == 'button-container') return 0;
    e.target.style.filter = 'brightness(0.8)';
    clickButton(e);
}

buttonContainer.addEventListener('mouseover', hoverOn);
buttonContainer.addEventListener('mouseleave', hoverOff);
buttonContainer.addEventListener('mousedown', down);
buttonContainer.addEventListener('mouseup', up)