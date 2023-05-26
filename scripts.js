const debug = document.getElementById('debug');
const debugClick = document.getElementById('debug-click');
const debugDisplay = document.getElementById('debug-display');
const buttonContainer = document.getElementById('button-container');
const resultDisplay = document.getElementById('result');
const calcSpanOne = document.getElementById('calc-one');
const calcSpanTwo = document.getElementById('calc-two');
const calcSpanThree = document.getElementById('calc-three');


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

let debugList = {
    click: 0,
    display: 0,
}

const debugListProxy = new Proxy(debugList, {
    set: function (target, key, value) {
        if(key == 'click') {
            debugClick.textContent = (`${key}: ${value}` );
        } else {
            debugDisplay.textContent = (` ${key}: ${value}`);
        }
        target[key] = value;
        return true;
    }
  });

function debugToggle(e) {
    if(debug.style.display === 'flex') {
        debug.style.display = 'none';
        e.target.textContent = 'debug: off';
    
    } else {
        debug.style.display = 'flex';
        e.target.textContent = 'debug: on';
    }
}

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
    firstOnlyZeroDot: false,
    secondOnlyZeroDot: false,
    firstOnlyOneChar: false,
    secondOnlyOneChar: false,
    firstOnlyMinus: false,
    secondOnlyMinus: false, 
    firstDotIsLast: false,
    secondDotIsLast: false,
    firstHasDot: false,
    secondHasDot: false,
    firstHasMinus: false,
    secondHasMinus: false,
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
    hasMinus() {
        this.firstHasMinus = (firstNum.includes('-')) ? true : false;
        this.secondHasMinus = (secondNum.includes('-')) ? true : false;
    },
    onlyMinus() {
        this.firstOnlyMinus = (firstNum[0] == '-' && firstNum[1] == undefined) ? true : false;
        this.secondOnlyMinus = (secondNum[0] == '-' && secondNum[1] == undefined) ? true : false;
    }, 
    reset() {
        for(key in this) {
            if (typeof this[key] !== 'function') this[key] = false;
        }
    },
}

function display(arr, opr, arr2) {
    
    let str = '';
    let str2 = '';

    if(arr) str = arr.join('');
    if(arr2) str2 = arr2.join('');

    if(arr && !opr && !arr2) {
        //display arr
        debugListProxy.display = 1;
        calcSpanOne.textContent = (str.length >= 19) ? str.slice(-19) : str;
        calcSpanTwo.textContent = '';
        calcSpanThree.textContent = '';
        return 0;

    } else if(arr && opr && !arr2) {
        //display arr and opr
        debugListProxy.display = 2;
        calcSpanOne.textContent = (str.length >= 18) ? str.slice(-19) : str;
        calcSpanTwo.textContent = opr;
        calcSpanThree.textContent = '';
        return 0;

    } else if(arr && opr && arr2) {
        //display arr and opr and arr2
        debugListProxy.display = 3;
        if(str2.length >= 19) {
            //before 123+7890[12345678901234567890], after [12345678901234567890]
            debugListProxy.display = 3.1;
            calcSpanOne.textContent = '';
            calcSpanTwo.textContent = '';
            calcSpanThree.textContent = str2.slice(-19);
            return 0;
        } else if(str2.length >= 18) {
            //before 123[+1234567890123456789], after [+1234567890123456789]
            debugListProxy.display = 3.2;
            calcSpanOne.textContent = ''
            calcSpanTwo.textContent = opr;
            calcSpanThree.textContent = str2.slice(-18);
            return 0;
        }else {
            //before 123[456+7890123456789012]
            debugListProxy.display = 3.3;
            calcSpanOne.textContent = str.slice(-(18-str2.length));
            calcSpanTwo.textContent = opr;
            calcSpanThree.textContent = str2;
            return 0;
        }

    } else if(!arr && !opr && !arr2) {
        //display empty
        debugListProxy.display = 4;
        calcSpanOne.textContent = '';
        calcSpanTwo.textContent = '';
        calcSpanThree.textContent = '';
        return;
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
        debugListProxy.click = 1.1;
        //before[], after[]    
        return 1.1;

    } else if(exist.firstOnlyZeroDot && !exist.operator) {
        //before[0.], after[] 
        debugListProxy.click = 1.2;
        firstNum.pop();
        firstNum.pop();
        display();
        return 1.2;

    } else if(exist.firstOnlyOneChar && !exist.operator && !exist.secondNum) {
        //before[1], after[]
        debugListProxy.click = 1.3;
        firstNum.pop();
        display();
        return 1.3;

    } else if(exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[123], after[12]
        debugListProxy.click = 1.4;
        firstNum.pop();
        display(firstNum);
        return 1.4;

    } else if(exist.firstNum && exist.operator && !exist.secondNum) {
        //before[123+], after[123]
        debugListProxy.click = 1.5;
        operator = '';
        display(firstNum);
        return 1.5;

    } else if(exist.secondOnlyZeroDot) {
        //before[123+0.], after[123+]
        debugListProxy.click = 1.6; 
        secondNum.pop();
        secondNum.pop();
        display(firstNum, operator);
        return 1.6;

    } else if(exist.secondOnlyOneChar) {
        //before[123+4], after[123+]
        debugListProxy.click = 1.7;
        secondNum.pop();
        display(firstNum, operator);
        return 1.7;

    } else if(exist.firstNum && exist.operator && exist.secondNum) {
        //before[123+456], after[123+45]
        debugListProxy.click = 1.8;
        secondNum.pop();
        display(firstNum, operator, secondNum);
        return 1.8;

    }
}

function numClick(buttonChar) {
    exist.check(); 

    if(!exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[], after[1]
        debugListProxy.click = 2.1;
        firstNum.push(buttonChar);
        display(firstNum);
        return 2.1;

    } else if(exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[123], after[1234]
        debugListProxy.click = 2.2;
        firstNum.push(buttonChar);
        display(firstNum);
        return 2.2;

    } else if(exist.firstNum && exist.operator && !exist.secondNum) {
        //before[123+], after[123+4]
        debugListProxy.click = 2.3;
        secondNum.push(buttonChar);
        display(firstNum, operator, secondNum);
        return 2.3;

    } else if(exist.firstNum && exist.operator && exist.secondNum) {
        //before[123+456], after[123+4567]
        debugListProxy.click = 2.4;
        secondNum.push(buttonChar);
        display(firstNum, operator, secondNum);
        return 2.4;
    
    } 
}

function plusMinusClick() {
    exist.check(); 
    exist.hasMinus();

    if(!exist.firstHasMinus && !exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[], after[-]
        debugListProxy.click = 3.1;
        firstNum.unshift('-');
        display(firstNum);
        return 3.1;

    } else if(exist.firstHasMinus && !exist.firstNum && !exist.operator && !exist.secondNum ) {
        //before[-], after[]
        debugListProxy.click = 3.2;
        firstNum.shift('');
        display(firstNum);
        return 3.2;

    } else if(!exist.firstHasMinus && exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[123], after[-123]
        debugListProxy.click = 3.3;
        firstNum.unshift('-');
        display(firstNum);
        return 3.3;

    } else if(exist.firstHasMinus && exist.firstNum && !exist.operator && !exist.secondNum ) {
        //before[-123], after[123]
        debugListProxy.click = 3.4;
        firstNum.shift('');
        display(firstNum);
        return 3.4;

    } else if(!exist.secondHasMinus && exist.firstNum && exist.operator && !exist.secondNum) {
        //before[123+], after[123+-] 
        debugListProxy.click = 3.5;
        secondNum.unshift('-');
        display(firstNum, operator, secondNum);
        return 3.5;

    } else if(exist.secondHasMinus && exist.firstNum && exist.operator && !exist.secondNum) {
        //before[123+-], after[123+]
        debugListProxy.click = 3.6;
        secondNum.shift('');
        display(firstNum, operator);
        return 3.6;

    } else if(!exist.secondHasMinus && exist.firstNum && exist.operator && exist.secondNum) {
        //before[123+456], after[123+-456]
        debugListProxy.click = 3.7;
        secondNum.unshift('-');
        display(firstNum, operator, secondNum);
        return 3.7;
    
    } else if(exist.secondHasMinus && exist.firstNum && exist.operator && exist.secondNum) {
        //before[123+-456], after[123+456]
        debugListProxy.click = 3.8;
        secondNum.shift('');
        display(firstNum, operator, secondNum);
        return 3.8;

    }
}

function dotClick(buttonChar) {
    exist.check();
    exist.hasDot();
    exist.onlyMinus();

    if(!exist.firstNum && !exist.operator && !exist.secondNum) {
        //before[], after[0.]
        debugListProxy.click = 4.1;
        firstNum.push('0');
        firstNum.push('.');
        display(firstNum);
        return 4.1;

    } else if(exist.firstOnlyMinus && !exist.operator && !exist.secondNum) { 
        //before[-], after[-0.] 
        debugListProxy.click = 4.7;
        firstNum.push('0');
        firstNum.push('.');
        display(firstNum);
        return 4.7;

    } else if(exist.firstNum && exist.operator && exist.secondOnlyMinus) { 
        //before[123+-], after[123+-0.] 
        debugListProxy.click = 4.8;
        secondNum.push('0');
        secondNum.push('.');
        display(firstNum, operator, secondNum);
        return 4.8;

    } else if(exist.firstNum && exist.firstHasDot && !exist.operator) {
        //before[0.], after[0.] //before[1.23], after[1.23]
        debugListProxy.click = 4.2;
        return 4.2;

    } else if(exist.firstNum && !exist.firstHasDot && !exist.operator) { 
        //before[123], after[123.] 
        debugListProxy.click = 4.3;
        firstNum.push(buttonChar);
        display(firstNum);
        return 4.3;

    } else if(exist.firstNum && exist.operator && !exist.secondNum ) {
        //before[0.123+], after[0.123+0.] //before[123+], after[123+0.]
        debugListProxy.click = 4.4;
        secondNum.push('0');
        secondNum.push('.');
        display(firstNum, operator, secondNum);
        return 4.4;

    } else if(exist.firstNum && exist.operator && exist.secondNum && exist.secondHasDot ) {
        //before[0.123+0.], after[0.123+0.] //before[0.123+12.3], after[0.123+12.3] 
        debugListProxy.click = 4.5;
        return 4.5;

    } else if(exist.firstNum && exist.operator && exist.secondNum && !exist.secondHasDot ) { 
        //before[0.123+456], after[0.123+456.] 
        debugListProxy.click = 4.6;
        secondNum.push(buttonChar);
        display(firstNum, operator, secondNum);
        return 4.6;

    } 
}

function operatorClick(buttonChar) {
    exist.check();
    exist.checkOnlyZeroDot();
    exist.checkOnlyOneChar();
    exist.checkDotIsLast();
    exist.onlyMinus();

    if(!exist.firstNum) {
        //before[], after[]
        debugListProxy.click = 5.1;
        return 5.1;

    } else if(exist.firstDotIsLast && !exist.operator) {
        //before[0.], after[0.] //before[123.], after[123.]
        debugListProxy.click = 5.2;
        return 5.2;

    } else if(exist.firstNum && !exist.operator && !exist.firstOnlyMinus) { 
        //before[123], after[123+]
        debugListProxy.click = 5.3;
        operator = buttonChar;
        display(firstNum, operator);
        return 5.3;

    } else if(exist.firstNum && exist.operator && !exist.secondNum ) {
        //before[123+], after[123+]
        debugListProxy.click = 5.4;
        return 5.4;
        
    } else if(exist.firstNum && exist.operator && exist.secondDotIsLast) {
        //before[123+0.], after[123+0.]
        debugListProxy.click = 5.5;
        return 5.5;

    } else if(exist.firstNum && exist.operator && exist.secondOnlyMinus) {
        //before[123+-], after[123+-]
        debugListProxy.click = 5.8;
        return 5.8;

    } else if(exist.firstNum && exist.operator && exist.secondNum) { 
        //before[123+456], after[result+][result] 
        debugListProxy.click = 5.6;
        resultDisplay.textContent = calculate();
        firstNum.splice(0, firstNum.length);
        for(const obj of Array.from(resultDisplay.textContent)) {
            firstNum.push(obj);
        }
        operator = buttonChar;
        secondNum.splice(0, secondNum.length);
        display(firstNum, operator);
        return 5.6;
    
    } else if(exist.firstNum && exist.operator && exist.result && !exist.secondNum) { 
        //before[result+][result], after[result+][result] 
        debugListProxy.click = 5.7;
        return 5.7;

    } 
}

function equalClick() {
    exist.check();
    exist.checkOnlyZeroDot();
    exist.checkOnlyOneChar();
    exist.checkDotIsLast();
    exist.onlyMinus();

    if(!exist.firstNum) {
        //before[], after[]
        debugListProxy.click = 6.1;
        return 6.1;

    } else if(exist.firstDotIsLast && !exist.operator) {
        //before[0.], after[0.] //before[123.], after[123.]
        debugListProxy.click = 6.2;
        return 6.2;

    } else if(exist.firstOnlyMinus && !exist.operator) {
        //before[-], after[-]
        debugListProxy.click = 6.8;
        return 6.8;

    } else if(exist.firstNum && !exist.operator) { 
        //before[123], after[123]
        debugListProxy.click = 6.3;
        return 6.3;

    } else if(exist.firstNum && exist.operator && !exist.secondNum ) {
        //before[123+], after[123+]
        debugListProxy.click = 6.4;
        return 6.4;

    } else if(exist.firstNum && exist.operator && exist.secondDotIsLast) {
        //before[123+0.], after[123+0.]
        debugListProxy.click = 6.5;
        return 6.5;

    } else if(exist.firstNum && exist.operator && exist.secondOnlyMinus) {
        //before[123+-], after[123+-]
        debugListProxy.click = 6.9;
        return 6.9;

    } else if(exist.firstNum && exist.operator && exist.secondNum) { 
        //before[123+456], after[123+456][result]
        debugListProxy.click = 6.6; 
        resultDisplay.textContent = calculate();
        firstNum.splice(0, firstNum.length);
        for(const obj of Array.from(resultDisplay.textContent)) {
            firstNum.push(obj);
        }
        operator = '';
        secondNum.splice(0, secondNum.length);
        return 6.6;
    
    } else if(exist.firstNum && exist.operator && exist.result && !exist.secondNum) { 
        //before[result+][result], after[result+][result]
        debugListProxy.click = 6.7;
        return 6.7;

    } 
}

function clearClick() {
    debugListProxy.click = 7.1;
    firstNum.splice(0, firstNum.length);
    operator = '';
    secondNum.splice(0, secondNum.length);
    calcSpanOne.textContent = '';
    calcSpanTwo.textContent = '';
    calcSpanThree.textContent = '';
    resultDisplay.textContent = '';
    exist.reset();
    return 7.1;
}

function clickButton(e) {   
    const buttonChar = e.target.textContent;

    if(operators.includes(buttonChar)) return operatorClick(buttonChar);
    if(numbers.includes(buttonChar)) return numClick(buttonChar);
    if(buttonChar == 'DEL') return delClick();
    if(buttonChar == 'C') return clearClick();
    if(buttonChar == '+/-') return plusMinusClick();
    if(buttonChar == '=') return equalClick();
    if(buttonChar == '.') return dotClick(buttonChar);
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
buttonContainer.addEventListener('mouseup', up);
document.getElementById('debug-button').addEventListener('click', debugToggle);