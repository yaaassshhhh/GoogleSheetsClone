export const evaluateFormulae = (formulae , getCellValue) => {
    console.log('1-Formulae received:', formulae);
    if(!formulae.startsWith('=')) return formulae;

    try{
        console.log('2 - Formulae received in try:', formulae);
        //removing the '=' prefix
        const expression = formulae.substring(1);
        //ex:- sum(A1:A5,B3,C1)
        if(expression.includes('(')){
            console.log('3 - Expression received and is aggregate:', expression);
            return evaluateFunction(expression, getCellValue);
        }
        //now ill handle the basic arithmetic operations and cell references
        //ex:- =A1 + B2 - C3
        const evaluatedExpression = replaceReferences(expression , getCellValue);
        return eval(evaluatedExpression);
    } catch(error){
        console.log('Error:', error);
        return '#ERROR!';
    }
};

//function to evaluate functions
const evaluateFunction = (expression , getCellValue) => {
    console.log('4 - Expression received: in evaluateFn', expression);
    const functionMap = {
        'SUM': calculateSum,
        'AVERAGE': calculateAverage,
        'MAX': calculateMax,
        'MIN': calculateMin,
        'COUNT': calculateCount
    };

    //will extract function name and parameters using regex
    //ex - For SUM(A1:A3):
    // match[0]: Entire match → "SUM(A1:A3)"
    // match[1]: Function name → "SUM"
    // match[2]: Arguments → "A1:A3" match = ["SUM(A1:A3)", "SUM", "A1:A3"]

    const match = expression.match(/^([A-Z]+)\((.*)\)$/i);
    console.log('5 - Regex match result:', match);
    console.log('5 - Regex match result:');

    if(!match) return '#ERROR!';
    // const [_ , functionName , args] = match;
    const functionName = match[1].toUpperCase();
    const args = match[2].split(',').map(arg => arg.trim());
    console.log('6-Function name:', functionName);
    console.log('7-Arguments:', args);

    if(!functionMap[functionName]) return '#INVALID!';

    //now ill split the arguments and evaluate them
    //ex - for SUM(A1:A5,B3,C1) --> args = A1:A5,B3,C1 --> ['A1:A5' , 'B3','C1'] --> [[1,2,3,4,5],3,1] --> [1,2,3,4,5,3,1] --> (.filter is used to remove empty strings or null values) --> .map to number in case some are still strings

    const evaluatedArgs = args.map(arg =>{
        console.log('8 - Processing argument:', arg);
        const isCellReference = /[A-Z]/i.test(arg);

        if(arg.includes(':')){
            // const [start , end] = arg.split(':');
            // return expandRange(start.trim() , end.trim()).map(ref => getCellValue(ref));
            return getRangeValues(arg ,getCellValue);
        }else if(isCellReference) {
            // Handle cell reference
            const value = getCellValue(arg);
            return [value];
        }
            else {
                // Handle direct number
                const value = parseFloat(arg);
                return [isNaN(value) ? 0 : value];
            }
        // return [getCellValue(arg.trim())];
        // const val = getCellValue(arg)
        // console.log('Single cell value:', val);
        // return [val];
    })
    .flat()
    .filter(value => value !== null && value !== '' && !isNaN(Number(value)))
    .map(Number);

    console.log('9 - Final evaluated args:', evaluatedArgs);
    const result = functionMap[functionName](evaluatedArgs);
    console.log('10 - Final result:', result);
    return result;
    //calculateSum([1,2,3,4,5]) --> 15 , these function are implemented below
};

const getRangeValues = (range , getCellValue) => {
    const [start, end] = range.split(':');
    const startRow = parseInt(start.match(/\d+/)[0], 10);
    const endRow = parseInt(end.match(/\d+/)[0], 10);
    const startCol = start.match(/[A-Z]+/)[0];
    const endCol = end.match(/[A-Z]+/)[0];

    const values = [];
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
            const cell = String.fromCharCode(col) + row;
            values.push(getCellValue(cell));
        }
    }
    return values;
}
//reduce: A higher-order function that iterates over the array, applying a reducer function to accumulate a result.0 is the initial value of the accumulator.
const calculateSum = (numbers) => {
    return numbers.reduce((sum , num) => sum + num, 0);
};

const calculateMax = (numbers) => {
    if (numbers.length === 0) return 0;
    return Math.max(...numbers);
};

const calculateMin = (numbers) => {
    if (numbers.length === 0) return 0;
    return Math.min(...numbers);
};

const calculateCount = (numbers) => {
    return numbers.length;
};

const calculateAverage = (numbers) => {
    if(numbers.length === 0) return 0;
    return calculateSum(numbers) / numbers.length;
}
// const expandRange = (start , end) =>{
//     const startCol = start.match(/[A-Z]+/)[0];
//     const startRow = parseInt(start.match(/\d+/)[0]);
//     const endCol = end.match(/[A-Z]+/)[0];
//     const endRow = parseInt(end.match(/\d+/)[0]);

//     const refs = [];
//     for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
//         for (let row = startRow; row <= endRow; row++) {
//             refs.push(`${String.fromCharCode(col)}${row}`);
//         }
//     }
//     return refs;
// }

// Helper function to replace cell references with values
const replaceReferences = (expression, getCellValue) => {
    return expression.replace(/[A-Z]+\d+/g, match => {
        const value = getCellValue(match);
        return isNaN(value) ? 0 : value;
    });
};
