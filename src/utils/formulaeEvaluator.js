export const evaluateFormulae = (formulae , getCellValue) => {
    // console.log('1-Formulae received:', formulae);
    if(!formulae?.startsWith('=')) return formulae;

    try{
        // console.log('2 - Formulae received in try:', formulae);
        //removing the '=' prefix
        const expression = formulae.substring(1);
        //ex:- sum(A1:A5,B3,C1)
        if(expression.includes('(')){
            // console.log('3 - Expression received and is aggregate:', expression);
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
    // console.log('4 - Expression received: in evaluateFn', expression); Debug log
    const functionMap = {
        'SUM': calculateSum,
        'AVERAGE': calculateAverage,
        'MAX': calculateMax,
        'MIN': calculateMin,
        'COUNT': calculateCount,
        'MEDIAN': calculateMedian,
        'STDDEV': calculateStandardDeviation,
        'VARIANCE': calculateVariance,
        'PRODUCT': calculateProduct,
        'MODE': calculateMode,
        'RANGE': calculateRange,
        // New data quality functions
        'TRIM': calculateTrim,
        'UPPER': calculateUpper,
        'LOWER': calculateLower,
        'REMOVE_DUPLICATES': calculateRemoveDuplicates,
        'FIND_AND_REPLACE': calculateFindAndReplace
    };

    //will extract function name and parameters using regex
    //ex - For SUM(A1:A3):
    // match[0]: Entire match → "SUM(A1:A3)"
    // match[1]: Function name → "SUM"
    // match[2]: Arguments → "A1:A3" match = ["SUM(A1:A3)", "SUM", "A1:A3"]

    const match = expression.match(/^([A-Z]+)\((.*)\)$/i);
    // console.log('5 - Regex match result:', match); 
    // console.log('5 - Regex match result:');  //Debug log

    if(!match) return '#ERROR!';
    // const [_ , functionName , args] = match;
    const functionName = match[1].toUpperCase();
    const args = match[2].split(',').map(arg => arg.trim());
    // console.log('6-Function name:', functionName); //Debug log
    // console.log('7-Arguments:', args); //Debug log

    if(!functionMap[functionName]) return '#INVALID!';

    //now ill split the arguments and evaluate them
    //ex - for SUM(A1:A5,B3,C1) --> args = A1:A5,B3,C1 --> ['A1:A5' , 'B3','C1'] --> [[1,2,3,4,5],3,1] --> [1,2,3,4,5,3,1] --> (.filter is used to remove empty strings or null values) --> .map to number in case some are still strings

    //special handling for data quality functions that work with ttext
    if (['TRIM', 'UPPER', 'LOWER'].includes(functionName)) {
        const cellValue = getCellValue(args[0]);
        return functionMap[functionName]([cellValue]);
    }

    //special handling for Find and Replace
    if (functionName === 'FIND_AND_REPLACE') {
        const [cellRef, findText, replaceText] = args;
        return calculateFindAndReplace([getCellValue(cellRef), findText.replace(/['"]/g, ''), replaceText.replace(/['"]/g, '')]);
    }

    //special handling for Remove Duplicate in a RANGE
    if (functionName === 'REMOVE_DUPLICATES') {
        return calculateRemoveDuplicates([getRangeValues(args[0], getCellValue)]);
    }

    const evaluatedArgs = args.map(arg =>{
        // console.log('8 - Processing argument:', arg);
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
    })
    .flat()
    .filter(value => value !== null && value !== '' && !isNaN(Number(value)))
    .map(Number);

    // console.log('9 - Final evaluated args:', evaluatedArgs);
    const result = functionMap[functionName](evaluatedArgs);
    // console.log('10 - Final result:', result);
    return result;
    //calculateSum([1,2,3,4,5]) --> 15 , these function are implemented below
};

// Data Quality Function Implementations
const calculateTrim = (args) => {
    const value = args[0];
    if (value === null || value === undefined) return '';
    return String(value).trim();
};

const calculateUpper = (args) => {
    const value = args[0];
    if (value === null || value === undefined) return '';
    return String(value).toUpperCase();
};
const calculateLower = (args) => {
    const value = args[0];
    if (value === null || value === undefined) return '';
    return String(value).toLowerCase();
};

const calculateRemoveDuplicates = (args) => {
    const values = args[0];
    if (!Array.isArray(values)) return values;
    return [...new Set(values)].join(', ');
};

const calculateFindAndReplace = (args) => {
    const [text, find, replace] = args;
    if (text === null || text === undefined) return '';
    return String(text).replaceAll(find, replace || '');
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
const calculateMedian = (numbers) => {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const calculateStandardDeviation = (numbers) => {
    if (numbers.length === 0) return 0;
    const avg = calculateAverage(numbers);
    const squareDiffs = numbers.map(num => Math.pow(num - avg, 2));
    const avgSquareDiff = calculateAverage(squareDiffs);
    return Math.sqrt(avgSquareDiff);
};

const calculateVariance = (numbers) => {
    if (numbers.length === 0) return 0;
    const avg = calculateAverage(numbers);
    return numbers.reduce((variance, num) => variance + Math.pow(num - avg, 2), 0) / numbers.length;
};
const calculateProduct = (numbers) => {
    return numbers.reduce((product, num) => product * num, 1);
};

const calculateMode = (numbers) => {
    if (numbers.length === 0) return 0;
    const frequency = {};
    numbers.forEach(num => frequency[num] = (frequency[num] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(num => frequency[num] === maxFreq);
    return modes.length === 1 ? parseFloat(modes[0]) : modes.map(Number);
};

const calculateRange = (numbers) => {
    if (numbers.length === 0) return 0;
    return calculateMax(numbers) - calculateMin(numbers);
};
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
