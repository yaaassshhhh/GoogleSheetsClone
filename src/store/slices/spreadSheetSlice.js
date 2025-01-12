import { createSlice } from "@reduxjs/toolkit";
import { evaluateFormulae } from "../../utils/formulaeEvaluator";

const initialCellFormat = {
    bold: false,
    italic: false,
    underline: false,
    fontSize: 12,
    color: '#000000',
    backgroundColor: '#ffffff',
    align: 'left'
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
            const getCellValue = (ref) => {
                console.log('Getting value for cell:', ref);
    console.log('Cell value:', state.cells[ref]?.value);
                return state.cells[ref]?.value || 0;
            };

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
            if(state.cells[id]){
               state.cells[id]  = {...state.cells[id] , ...format};  
            };
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

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