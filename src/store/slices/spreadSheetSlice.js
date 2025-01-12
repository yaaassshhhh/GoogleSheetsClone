import { createSlice } from "@reduxjs/toolkit";
import { evaluateFormulae } from "../../utils/formulaeEvaluator";

const initialCellFormat = {
    bold: false,
    italic: false,
    underline: false,
    fontSize: 12,
    color: '#000000',
    backgroundColor: '#ffffff',
    align: 'left',
    fontFamily: 'Arial'
  };

const initialState = {
cells : {},
columns : {},
rows : {},
activeCell : null,
selection : {
    start : null,
    end : null
},
columnCount : 26,
rowCount : 100,
error : null
};

export const spreadSheetSlice = createSlice({
    name : "spreadSheet",
    initialState,
    reducers : {
        updateCell : (state , action) => {
            const {id , value , formulae} = action.payload;
            if (!state.cells[id]){
                state.cells[id] = {
                    value : '',
                    formulae :'',
                    format : {
                        ...initialCellFormat
                    },
                    dependencies : [],
                    dependents : [] 
                };
            }
            //clearing old dependencies
            state.cells[id].dependencies.forEach(depId =>{
                if(state.cells[depId]){
                    state.cells[depId].dependents = state.cells[depId].dependents.filter(d => d!=id);
                }
            })
            // Updating dependencies if it's a formulae
            if(formulae){
                const newDependencies = extractCellRefs(formulae);
                state.cells[id].dependencies = newDependencies;
                //updating dependents for each dependency
                newDependencies.forEach(depId =>{
                    if(!state.cells[depId]){
                        state.cells[depId]={
                            value: '',
                            formulae: '',
                            format: { ...initialCellFormat },
                            dependencies: [],
                            dependents: []
                        };
                    }
                    if(!state.cells[depId].dependents.includes(id)){
                        state.cells[depId].dependents.push(id);
                    }
                });
            } else {
                state.cells[id].dependencies = [];
            }

            const getCellValue = (ref) => state.cells[ref]?.value || 0;

            const evaluatedValue = formulae ? 
                evaluateFormulae(formulae, getCellValue) : 
                value;

            state.cells[id] = {
                ...state.cells[id],
                value: evaluatedValue,
                formulae: formulae
            };

            updateDependentCells(state, id);
        },
        setActiveCell : (state , action) => {
            state.activeCell = action.payload;
        },
        updateSelection : (state , action) => {
            const {start , end} = action.payload;
            state.selection = {start , end};
        },
        updateCellFormat : (state , action) => {
            const {id , format} = action.payload;
            // console.log('Redux: Updating cell format:', id, format); // Debug log
            if (!state.cells[id]) {
                state.cells[id] = {
                    value: '',
                    formulae: '',
                    format: {},
                    dependencies: [],
                    dependents: []
                };
            }            
            state.cells[id].format = {
                ...state.cells[id].format,
                ...format
            };
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

const extractCellRefs = (formulae) =>{
    if(!formulae?.startsWith('=')) return [];

    const matches = formulae.match(/[A-Z]+\d+/g) || [];

    return [...new Set(matches)]; //Remove Duplicates
}
const updateDependentCells = (state , changedCellId) => {
    const cell = state.cells[changedCellId];
    if(!cell?.dependents?.length) return;

    cell.dependents.forEach(dependentId => {
        const dependentCell = state.cells[dependentId];
        if(dependentCell?.formulae){
            const getCellValue = (ref) => {
                return state.cells[ref]?.value || 0; 
            }
            dependentCell.value = evaluateFormulae(
                dependentCell.formulae,
                getCellValue
            );
            updateDependentCells(state, dependentId);
        }
    });
}
export const {updateCell , setActiveCell , updateSelection , updateCellFormat, sertError} = spreadSheetSlice.actions;
export default spreadSheetSlice.reducer;