// parseInt() for string to number conversion
const buttonContainer = document.getElementById('button-container');
const calculation = document.getElementById('calculation');
const resultDisplay = document.getElementById('result');
calculation.textContent = '';

let buttons = [];
const id = ['devide', 'module', 'plusMinus', 'clear', 'multiply', 
            'nine', 'eight', 'seven', 'deduct', 'six', 'five', 'four', 'add', 
            'three', 'two', 'one', 'equal', 'dot', 'zero'];
const content = ['/', '%', '+/-', 'C', '*', '9', '8',
                 '7', '-', '6', '5', '4', '+', '3', 
                 '2', '1', '=', '.', '0'];
const firstMust = ['plusMinus', 'clear', 'nine', 'eight', 'seven', 'six', 'five',
                'four', 'three', 'two', 'one', 'zero', 'dot'];
const operators = ['devide', 'multiply', 'deduct', 'add'];

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

// calculation :
let minus = false;
let firstNum = 0;
let operator = '';
let secondNum = 0;
let dot = false;
let secondNumStart = 0;
let result = 0;

function calculate() {
    if(firstNum<0) secondNumStart--;
    secondNum += 2;
    secondNum = parseFloat(calculation.textContent.substring(secondNumStart));
 
    
    if(operator == 'add') return firstNum + secondNum;
    if(operator == 'deduct') return firstNum - secondNum;
    if(operator == 'devide') return firstNum / secondNum;
    if(operator == 'multiply') return firstNum * secondNum;
}

function clickButton(e) {
    
    const buttonId = e.target.id;

    if(calculation.textContent == '') {
        if (!(firstMust.includes(buttonId))) return 0;
        if(buttonId == 'dot') {
            dot = true;
            calculation.textContent = '0.';
        }
    }

    if(buttonId == 'dot' && dot == true) return 0;
    if(buttonId == 'dot') dot = true;

    if(buttonId == 'plusMinus') {
        if (operator != '') return 0;
        if (minus == false) {
            minus = true;
            return calculation.textContent = '-' + calculation.textContent;
        }
        minus = false;
        return calculation.textContent = calculation.textContent.slice(1);
    }

    //length way is not good
    if(operators.includes(buttonId)) {
        if(operator == '' && resultDisplay.textContent == '') {
            firstNum = parseFloat(calculation.textContent);
            operator = buttonId;
            dot = false;
            secondNumStart = calculation.textContent.length;
            console.log(secondNum);
        } else if(operator != '') {
            
            resultDisplay.textContent = calculate();
            console.log('go to location ' + secondNumStart + 'in string ' + calculation.textContent);
            console.log(firstNum + operator + secondNum);
            operator = buttonId;
            firstNum = parseFloat(resultDisplay.textContent);
            calculation.textContent = firstNum + e.target.textContent;
            secondNumStart = calculation.textContent.length;
            return 0;
        } 
    }

    if(buttonId == 'equal') {
        secondNum = parseFloat(calculation.textContent.substring(secondNumStart));
        resultDisplay.textContent = calculate();
        firstNum = resultDisplay.textContent;
        operator = '';
        secondNum = 0;
        return 0;
    }
    

    if(buttonId == 'clear') {
        firstNum = 0;
        operator = '';
        secondNum = 0;
        dot = false;
        minus = false;
        calculation.textContent = '';
        resultDisplay.textContent = '';
        return 0;
    }
    calculation.textContent += e.target.textContent;
    
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
buttonContainer.addEventListener('mouseup', up);