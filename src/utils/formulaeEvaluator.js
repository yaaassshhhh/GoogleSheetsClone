export const evaluateFormulae = (formulae , getCellValue) => {
    if(!formulae.startsWith('=')) return formulae;

    try{
        //removing the '=' prefix
        const expression = formulae.substring(1);
        if(expression.includes('(')){
            return evaluateFunction(expression, getCellValue);
        }
        //now ill handle the basic arithmetic operations and cell references
        const evaluatedExpression = replaceReferences(expression , getCellValue);
        return eval(evaluatedExpression);
    } catch(error){
        return '#ERROR!';
    }
};

//function to evaluate functions
const evaluateFunction = (expression , getCellValue) => {
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

    const match = expression.match(/(\w+)\((.*)\)/);
    if(!match) return '#ERROR!';

    const [_ , functionName , args] = match;
    if(!functionMap[functionName]) return '#INVALID!';

    //now ill split the arguments and evaluate them
    //ex - for SUM(A1:A5,B3,C1) --> args = A1:A5,B3,C1 --> ['A1:A5' , 'B3','C1'] --> [[1,2,3,4,5],3,1] --> [1,2,3,4,5,3,1] --> (.filter is used to remove empty strings or null values) --> .map to number in case some are still strings

    const evaluatedArgs = args.split(',').map(arg =>{
        if(arg.includes(':')){
            const [start , end] = arg.split(':');
            return expandRange(start.trim() , end.trim()).map(ref => getCellValue(ref));
        }
        return [getCellValue(arg.trim())];
    })
    .flat()
    .filter(value => !isNaN(Number(value)))
    .map(Number);

    return functionMap[functionName](evaluatedArgs);
    //calculateSum([1,2,3,4,5]) --> 15 , these function are implemented below
};
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

const expandRange = (start , end) =>{
    const startCol = start.match(/[A-Z]+/)[0];
    const startRow = parseInt(start.match(/\d+/)[0]);
    const endCol = end.match(/[A-Z]+/)[0];
    const endRow = parseInt(end.match(/\d+/)[0]);

    const refs = [];
    for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
        for (let row = startRow; row <= endRow; row++) {
            refs.push(`${String.fromCharCode(col)}${row}`);
        }
    }
    return refs;
}
