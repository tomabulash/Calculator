const buttonContainer = document.getElementById('button-container');
const calculation = document.getElementById('calculation');
const resultDisplay = document.getElementById('result');

const id = ['devide', 'plusMinus', 'DEL', 'clear', 'multiply', 
            'nine', 'eight', 'seven', 'deduct', 'six', 'five', 'four', 'add', 
            'three', 'two', 'one', 'equal', 'dot', 'zero'];
const content = ['/', '+/-', 'DEL', 'C', '*', '9', '8',
                 '7', '-', '6', '5', '4', '+', '3', 
                 '2', '1', '=', '.', '0'];
const operators = ['/', '*', '-', '+'];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const firstNum = [];
let operator = '';
const secondNum = [];

function makeButtons() {
    for(let i=0; i<19; i++) {
        let makeButton = document.createElement('button');
        makeButton.classList.add('button');
        makeButton.id = id[i];
        makeButton.textContent = content[i];
        buttonContainer.appendChild(makeButton);
    }
}

let exist = {
    firstNum: false,
    operator: false,
    secondNum: false,
    result: false,
    minus: false,
    firstOnlyZeroDot: false,
    secondOnlyZeroDot: false,
    firstOnlyOneChar: false,
    secondOnlyOneChar: false,
    firstDotIsLast: false,
    secondDotIsLast: false,
    firstHasDot: false,
    secondHasDot: false,
    check() {
        this.firstNum = (firstNum[0] == undefined) ? false : true;
        this.operator = (operator == '') ? false : true;
        this.secondNum = (secondNum[0] == undefined) ? false : true;
        this.result = (resultDisplay.textContent == '') ? false : true;
    },
    checkOnlyZeroDot() {
        this.firstOnlyZeroDot = (firstNum[0] == '0' && firstNum[1] == '.' && firstNum[2] == undefined) ? true : false;
        this.secondOnlyZeroDot = (secondNum[0] == '0' && secondNum[1] == '.' && secondNum[2] == undefined) ? true : false;
    },
    checkOnlyOneChar() {
        this.firstOnlyOneChar = (firstNum[0] != undefined && firstNum[1] == undefined) ? true : false;
        this.secondOnlyOneChar = (secondNum[0] != undefined && secondNum[1] == undefined) ? true : false;
    },
    checkDotIsLast() {
        this.firstDotIsLast = (firstNum.slice(-1) == '.') ? true : false;
        this.secondDotIsLast = (secondNum.slice(-1) == '.') ? true : false;
    },
    hasDot() {
        this.firstHasDot = (firstNum.includes('.')) ? true : false;
        this.secondHasDot = (secondNum.includes('.')) ? true : false;
    },
    reset() {
        for(key in this) {
            if (typeof this[key] !== 'function') this[key] = false;
        }
    },
}

function display(arr, opr, arr2) {
    let str = arr.join('');
    let str2 = '';

    if(arr2) str2 = arr2.join('');

    if(arr && !opr && !arr2) {
        //display arr
        return (str.length >= 19) ? str.slice(-19) : str;

    } else if(arr && opr && !arr2) {
        //display arr and opr
        return (str.length >= 18) ? str.slice(-19) + opr : str + opr;

    } else if(arr && opr && arr2) {
        //display arr and opr and arr2
        if(str.length + 1 + str2.length >= 19) {
            return str.concat(opr, str2).slice(-19);
        } else {
            return str + opr + str2;
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
    
    return (result.toString().length >= 14) ? result.toPrecision(10) : result;
}

function delClick() {
    exist.check();
    exist.checkOnlyZeroDot();
    exist.checkOnlyOneChar();

    if(!exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[], after[]    
        return 0;

    } else if(exist.firstOnlyZeroDot && !exist.operator) {
        //before[0.], after[] 
        firstNum.pop();
        firstNum.pop();
        calculation.textContent = '';
        return 0;

    } else if(exist.firstOnlyOneChar && !exist.operator && !exist.secondNum) {
        //before[1], after[]
        firstNum.pop();
        calculation.textContent = '';
        return 0;

    } else if(exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[123], after[12]
        firstNum.pop();
        calculation.textContent = display(firstNum);
        return 0;

    } else if(exist.firstNum && exist.operator && !exist.secondNum) {
        //before[123+], after[123]
        operator = '';
        calculation.textContent = display(firstNum);
        return 0;

    } else if(exist.secondOnlyZeroDot) {
        //before[123+0.], after[123+] 
        secondNum.pop();
        secondNum.pop();
        calculation.textContent = display(firstNum, operator);
        return 0;

    } else if(exist.secondOnlyOneChar) {
        //before[123+4], after[123+]
        secondNum.pop();
        calculation.textContent = display(firstNum, operator);
        return 0;

    } else if(exist.firstNum && exist.operator && exist.secondNum) {
        //before[123+456], after[123+45]
        secondNum.pop();
        calculation.textContent = display(firstNum, operator, secondNum);
        return 0;

    }
}

function numClick(buttonChar) {
    exist.check(); 

    if(!exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[], after[1]
        firstNum.push(buttonChar);
        calculation.textContent = display(firstNum);
        return 0;

    } else if(exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[123], after[1234]
        firstNum.push(buttonChar);
        calculation.textContent = display(firstNum);
        return 0;

    } else if(exist.firstNum && exist.operator && !exist.secondNum) {
        //before[123+], after[123+4]
        secondNum.push(buttonChar);
        calculation.textContent = display(firstNum, operator, secondNum);
        return 0;

    } else if(exist.firstNum && exist.operator && exist.secondNum) {
        //before[123+456], after[123+4567]
        secondNum.push(buttonChar);
        calculation.textContent = display(firstNum, operator, secondNum);
        return 0;
    
    } 
}

function plusMinusClick() {
    exist.check(); 

    if(!exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[], after[-]
        firstNum.unshift('-');
        exist.minus = true;
        calculation.textContent = display(firstNum);
        return 0;

    } else if(!exist.firstNum && exist.minus && !exist.operator && !exist.secondNum ) {
        //before[-], after[]
        firstNum.shift('');
        exist.minus = false;
        calculation.textContent = display(firstNum);
        return 0;

    } else if(exist.firstNum && !exist.minus && !exist.operator && !exist.secondNum) {
        //before[123], after[-123]
        firstNum.unshift('-');
        exist.minus = true;
        calculation.textContent = display(firstNum);
        return 0;

    } else if(exist.firstNum && exist.minus && !exist.operator && !exist.secondNum ) {
        //before[-123], after[123]
        firstNum.shift('');
        exist.minus = false;
        calculation.textContent = display(firstNum);
        return 0;

    } else if(exist.firstNum && exist.operator && !exist.secondNum) {
        //before[123+], after[123+-] adds '-' to secondNum
        secondNum.unshift('-');
        exist.minus = true;
        calculation.textContent = display(firstNum, operator, secondNum);
        return 0;

    } else if(exist.firstNum && exist.minus && exist.operator && !exist.secondNum) {
        //before[123+-], after[123+] 
        secondNum.shift('');
        exist.minus = false;
        calculation.textContent = display(firstNum, operator);
        return 0;

    } else if(exist.firstNum && exist.operator && !exist.minus && exist.secondNum) {
        //before[123+456], after[123+-456]
        secondNum.unshift('-');
        exist.minus = true;
        calculation.textContent = display(firstNum, operator, secondNum);
        return 0;
    
    } else if(exist.firstNum && exist.operator && exist.minus && exist.secondNum) {
        //before[123+-456], after[123+456]
        secondNum.shift('');
        exist.minus = false;
        calculation.textContent = display(firstNum, operator, secondNum);
        return 0;

    }
}

function dotClick(buttonChar) {
    exist.check();
    exist.hasDot();

    if(!exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[], after[0.]
        firstNum.push('0');
        firstNum.push('.');
        calculation.textContent = display(firstNum);
        return 0;

    } else if(exist.firstNum && exist.firstHasDot && !exist.operator) {
        //before[0.], after[0.] //before[1.23], after[1.23]
        return 0;

    } else if(exist.firstNum && !exist.firstHasDot && !exist.operator) { 
        //before[123], after[123.] 
        firstNum.push(buttonChar);
        calculation.textContent = display(firstNum);
        return 0;

    } else if(exist.firstNum && exist.operator && !exist.secondNum ) {
        //before[0.123+], after[0.123+0.] //before[123+], after[123+0.]
        secondNum.push('0');
        secondNum.push('.');
        calculation.textContent = display(firstNum, operator, secondNum);
        return 0;

    } else if(exist.firstNum && exist.operator && exist.secondNum && exist.secondHasDot ) {
        //before[0.123+0.], after[0.123+0.] //before[0.123+12.3], after[0.123+12.3] 
        return 0;

    } else if(exist.firstNum && exist.operator && exist.secondNum && !exist.secondHasDot ) { //here
        //before[0.123+456], after[0.123+456.] 
        secondNum.push(buttonChar);
        calculation.textContent = display(firstNum, operator, secondNum);
        return 0;

    } 
}

function operatorClick(buttonChar) {
    exist.check();
    exist.checkOnlyZeroDot();
    exist.checkOnlyOneChar();
    exist.checkDotIsLast();

    if(!exist.firstNum) {
        //before[], after[]
        return 0;

    } else if(exist.firstDotIsLast && !exist.operator) {
        //before[0.], after[0.] //before[123.], after[123.]
        return 0;

    } else if(exist.firstNum && !exist.operator) { 
        //before[123], after[123+] 
        operator = buttonChar;
        calculation.textContent = display(firstNum, operator);
        return 0;

    } else if(exist.firstNum && exist.operator && !exist.secondNum ) {
        //before[123+], after[123+]
        return 0;

    } else if(exist.firstNum && exist.operator && exist.secondDotIsLast) {
        //before[123+0.], after[123+0.]
        return 0;

    } else if(exist.firstNum && exist.operator && exist.secondNum) { 
        //before[123+456], after[result+][result] 
        resultDisplay.textContent = calculate();
        firstNum.splice(0, firstNum.length);
        for(const obj of Array.from(resultDisplay.textContent)) {
            firstNum.push(obj);
        }
        operator = buttonChar;
        secondNum.splice(0, secondNum.length);
        calculation.textContent = display(firstNum, operator);
        return 0;
    
    } else if(exist.firstNum && exist.operator && exist.result && !exist.secondNum) { 
        //before[result+][result], after[result+][result] 
        return 0;

    } 
}

function equalClick() {
    exist.check();
    exist.checkOnlyZeroDot();
    exist.checkOnlyOneChar();
    exist.checkDotIsLast();

    if(!exist.firstNum) {
        //before[], after[]
        return 0;

    } else if(exist.firstDotIsLast && !exist.operator) {
        //before[0.], after[0.] //before[123.], after[123.]
        return 0;

    } else if(exist.firstNum && !exist.operator) { 
        //before[123], after[123]
        return 0;

    } else if(exist.firstNum && exist.operator && !exist.secondNum ) {
        //before[123+], after[123+]
        return 0;

    } else if(exist.firstNum && exist.operator && exist.secondDotIsLast) {
        //before[123+0.], after[123+0.]
        return 0;

    } else if(exist.firstNum && exist.operator && exist.secondNum) { 
        //before[123+456], after[123+456][result] 
        resultDisplay.textContent = calculate();
        firstNum.splice(0, firstNum.length);
        for(const obj of Array.from(resultDisplay.textContent)) {
            firstNum.push(obj);
        }
        operator = '';
        secondNum.splice(0, secondNum.length);
        return 0;
    
    } else if(exist.firstNum && exist.operator && exist.result && !exist.secondNum) { 
        //before[result+][result], after[result+][result] 
        return 0;

    } 
}

function clearClick() {
    firstNum.splice(0, firstNum.length);
    operator = '';
    secondNum.splice(0, secondNum.length);
    calculation.textContent = '';
    resultDisplay.textContent = '';
    exist.reset();
    return 0;
}

function clickButton(e) {   
    const buttonChar = e.target.textContent;

    if(operators.includes(buttonChar)) operatorClick(buttonChar);
    if(numbers.includes(buttonChar)) numClick(buttonChar);
    if(buttonChar == 'DEL') delClick();
    if(buttonChar == 'C') clearClick();
    if(buttonChar == '+/-') plusMinusClick();
    if(buttonChar == '=') equalClick();
    if(buttonChar == '.') dotClick(buttonChar);    
}

//interface effects :

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

makeButtons();

buttonContainer.addEventListener('mouseover', hoverOn);
buttonContainer.addEventListener('mouseleave', hoverOff);
buttonContainer.addEventListener('mousedown', down);
buttonContainer.addEventListener('mouseup', up)