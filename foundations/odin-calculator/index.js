
// append a new element to the DOM
// inputs: 
//  parent: name of parent node
//  childName: name of child node
const appendNewElement = (parent, childName) => {return parent.appendChild(document.createElement(childName));}
// this is cursed


// select the body
bodyelem = document.querySelector("body");
// add an article (semantic HTML)
calculatorBox  = appendNewElement(bodyelem, "article");

// set up sections (each row of calculator)
const calculatorState = {
    // decimal can only be clicked once per number 
    decimalClicked : false,
    iobuffer       : "",
    stack          : [],
    divisionByZeroError : false,
    // inputError : false, // is the input bad? (unsure if this needs to be used)
    valueInStack : false // is the calculated value already in the stack?
}
const CALC_ROWS = 5;
const sectionArr = [];
const sectionNames = [];
// 5 sections, for now
for(let i = 0; i < CALC_ROWS; i++){
    sectionArr.push(appendNewElement(calculatorBox, "section"));
    temp_section = `section${i}` // the section is named section i
    // store the section name and add it to a new class
    sectionNames[i] = temp_section
    sectionArr[i].classList.add(temp_section); // and added to class
}
// section 1: the calculator window
const display     = sectionArr[0];
const displayElem = appendNewElement(display, "section");
displayElem.classList.add("calcDisplay");
const displayDiv = appendNewElement(displayElem, "div");
displayDiv.classList.add("displayBox");

// based on my casio FX-9860GII
const calcButtons = {
    section1 : [
        ["7",   1], // value and width
        ["8",   1],
        ["9",   1],
        ["Del", 1],
        ["AC",  1]
    ],
    section2 : [
        ["4",   1], 
        ["5",   1],
        ["6",   1],
        ["*",   1],
        ["/",   1]
    ],
    section3 : [
        ["1",   1], 
        ["2",   1],
        ["3",   1],
        ["+",   1],
        ["-",   1]
    ],
    section4 : [
        ["0",   2], 
        [".",   1],
        // ["EXP", 1],
        ["EXE", 2],
    ]
}


const parseOp = () => {
    if (calculatorState.stack.length < 3) {
        return;
    }
    const num1   = parseFloat(calculatorState.stack.pop());
    const op     = calculatorState.stack.pop();
    const num2   = parseFloat(calculatorState.stack.pop());
    if (op === "+"){
        calculatorState.stack.push(num2 + num1);
        return;
    }
    if (op === "-"){
        calculatorState.stack.push(num2 - num1);
        return;
    }
    if (op === "*"){
        calculatorState.stack.push(num2 * num1);
        return;
    }
    if (op === "/"){
        if(num1 !== 0){
            calculatorState.stack.push(num2 / num1);
            return;
        }
        else{
            // division by 0
            calculatorState.divisionByZeroError = true;
            return;
        }
    }
} 


// process a button,
// handle div by zero and reset input when some other text is written to screen 
const resetDivByZero = () => {
    if (calculatorState.divisionByZeroError) {
        calculatorState.iobuffer = ""
        calculatorState.stack    = [] // you want to reset your stack
        calculatorState.divisionByZeroError = false;    
        calculatorState.decimalClicked = false;
    }
}
const processNumber = (calcButton) => {
    if (calculatorState.valueInStack){
        calculatorState.valueInStack = false;
    }
    calculatorState.iobuffer += calcButton;     
}

const processDecimal = (calcButton) => {
    if (calculatorState.valueInStack){
        calculatorState.valueInStack = false;
    }   
    if (!calculatorState.decimalClicked){
        // if decimal is clicked don't click it again
        calculatorState.iobuffer += calcButton
        calculatorState.decimalClicked = true;
    }
}
const processOp     = (calcButton) => {
    if (isNaN(parseFloat(calculatorState.iobuffer))){
        return;
    }
    if (!calculatorState.valueInStack){
        calculatorState.stack.push(calculatorState.iobuffer);
        calculatorState.valueInStack = false;
    }
    // you've processed a number and cleared the buffer
    calculatorState.iobuffer = ""; // clear buffer
    calculatorState.decimalClicked = false;
    // push the calculator button onto the stack
    calculatorState.stack.push(calcButton);

}   

const processDel    = () => {
    calculatorState.stack = []; // if there is a dirty value in the stack from a previous computation
        // don't keep it around if you delete a value
    const strlen = calculatorState.iobuffer.length;
    const value = calculatorState.iobuffer[strlen - 1];
    calculatorState.iobuffer = calculatorState.iobuffer.slice(0, strlen - 1);
    if (value === "."){
        calculatorState.decimalClicked = false;
    }
    calculatorState.valueInStack = false;
}

const processAC     = () => {
    calculatorState.stack = [];
    calculatorState.iobuffer = ""; // reset io buffer
    calculatorState.valueInStack = false; // no more values in stack
    calculatorState.decimalClicked = false; // reset decimal click
}

const processEXE = () => {
    calculatorState.stack.push(calculatorState.iobuffer);
    parseOp(); // call parseop, ensure that all elements are on the stack
    if (calculatorState.divisionByZeroError){
        calculatorState.iobuffer = "DIV BY ZERO!";
        return;
    }
    calculatorState.valueInStack = true;
    calculatorState.iobuffer = `${calculatorState.stack[0]}`;
    calculatorState.decimalClicked = false; // completed computation so decimal no longer clicked
}

const processItem = (calcButton) => {
    // processItem is only called when you have some button to click or state to track.
    // so handle divbyzeros beforehand
    resetDivByZero();
    if (calcButton.match(/[0-9]/)) {
        processNumber(calcButton);
        return;
    }
    else if (calcButton.match(/\./)) {
        processDecimal(calcButton);
        return;
    }
    else if (calcButton.match(/(\*|\+|\-|\/)/)) {
        // clear screen
        processOp(calcButton);
        return;
    }
    // delete one char
    else if (calcButton === "Del"){
        processDel(calcButton);
        return;
    }
    // clear calculator
    else if (calcButton === "AC"){
        processAC();
        return;
    }
    else if (calcButton === "EXE"){
        // push the next number onto the stack and process it
        processEXE();
        return;
    }
    
}

const processItemWithTextChange = (calcButton) => {
    displayDiv.textContent = calculatorState.iobuffer;
    // process the button value
    processItem(calcButton);
    // new iobuffer state
    displayDiv.textContent = calculatorState.iobuffer;
}

for (const section in calcButtons){
    // get the current section we're in
    const sectionNumber = sectionNames.indexOf(section);
    const currentSection = sectionArr[sectionNumber];
    for (const sectionElem of calcButtons[section]){
        // <div class="calcButton"> 
        console.log(currentSection);
        const currentCalcButton = appendNewElement(currentSection,"button");
        currentCalcButton.classList.add("calcButton");
        // sectionElem[0] is the string
        // sectionElem[1] is the flex 
        currentCalcButton.textContent   = sectionElem[0];
        currentCalcButton.style["flex"] = sectionElem[1];
        currentCalcButton.addEventListener("click", () => {
            processItemWithTextChange(sectionElem[0]);
        });   
    }
}




// map keys for non numbers
const keyMap = {
    "Enter" : "EXE",
    "C"     : "AC",
    "c"     : "AC",
    "Backspace" : "Del",
}
// can't use keypress to detect backspace
document.addEventListener("keyup", (event) => {
    if (event.key.match(/^[0-9]|\.|\*|\+|\-|\//)){
        processItemWithTextChange(event.key);
    }
    else if (keyMap[event.key] === undefined){
        return;
    }
    else {
        processItemWithTextChange(keyMap[event.key]);
    }
})


// for(let i = 0; i < CALC_ROWS; i++)


