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
columnWidths : {},
rowHeights : {},
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
        },
        addRow : (state , action) => {
            //adding new row and subsequently updating and moving the cell ids and data respectively.
            const { index } = action.payload;
            state.rowCount++;

            const newCells  = {};
            Object.keys(state.cells).forEach(cellId => {
                const colLabel = cellId.match(/[A-Z]+/)[0];
                const rowNum = parseInt(cellId.match(/\d+/)[0]);

                if(rowNum > index){
                    const newCellId = `${colLabel}${rowNum + 1}`;
                    newCells[newCellId] = state.cells[cellId];
                }else{
                    newCells[cellId] = state.cells[cellId];
                }
            });
            state.cells = newCells;
        },
        deleteRow: (state, action) => {
            //deleting the selected row and subsequently updating and moving the cell ids and data respectively.
            const { index } = action.payload;
            if (state.rowCount <= 1) return;
            state.rowCount--;

            const newCells = {};
            Object.keys(state.cells).forEach(cellId => {
              const colLabel = cellId.match(/[A-Z]+/)[0];
              const rowNum = parseInt(cellId.match(/\d+/)[0]);
              
              if (rowNum === index) return; 
              if (rowNum > index) {
                const newCellId = `${colLabel}${rowNum - 1}`;
                newCells[newCellId] = state.cells[cellId];
              } else {
                newCells[cellId] = state.cells[cellId];
              }
            });
            state.cells = newCells;
          },
      
          addColumn: (state, action) => {
            const { index } = action.payload;
            state.columnCount++;

            const newCells = {};
            Object.keys(state.cells).forEach(cellId => {
              const colLabel = cellId.match(/[A-Z]+/)[0];
              const colIndex = getColumnIndex(colLabel);
              
              if (colIndex >= index) {
                const newColLabel = getColumnLabel(colIndex + 1);
                const rowNum = cellId.match(/\d+/)[0];
                const newCellId = `${newColLabel}${rowNum}`;
                newCells[newCellId] = state.cells[cellId];
              } else {
                newCells[cellId] = state.cells[cellId];
              }
            });
            state.cells = newCells;
          },
      
          deleteColumn: (state, action) => {
            const { index } = action.payload;
            if (state.columnCount <= 1) return;
            
            state.columnCount--;
            const newCells = {};
            Object.keys(state.cells).forEach(cellId => {
              const colLabel = cellId.match(/[A-Z]+/)[0];
              const colIndex = getColumnIndex(colLabel);
              
              if (colIndex === index) return; 
              if (colIndex > index) {
                const newColLabel = getColumnLabel(colIndex - 1);
                const rowNum = cellId.match(/\d+/)[0];
                const newCellId = `${newColLabel}${rowNum}`;
                newCells[newCellId] = state.cells[cellId];
              } else {
                newCells[cellId] = state.cells[cellId];
              }
            });
            state.cells = newCells;
          },
          updateColumnWidth: (state, action) => {
            const { index, width } = action.payload;
            state.columnWidths[index] = Math.max(width, 50); // Minimum width of 50px
          },
      
          updateRowHeight: (state, action) => {
            const { index, height } = action.payload;
            state.rowHeights[index] = Math.max(height, 20); // Minimum height of 20px
          },
          clearError : (state) => {
            state.error = null;
          }
    }
});

function getColumnIndex(label) {
    let index = 0;
    for (let i = 0; i < label.length; i++) {
      index = index * 26 + (label.charCodeAt(i) - 64);
    }
    return index - 1;
  }
  
  function getColumnLabel(index) {
    let label = '';
    index += 1;
    while (index > 0) {
      index--;
      label = String.fromCharCode(65 + (index % 26)) + label;
      index = Math.floor(index / 26);
    }
    return label;
}

const extractCellRefs = (formulae) =>{
    if(!formulae?.startsWith('=')) return [];

    const matches = formulae.match(/[A-Z]+\d+/g) || [];

    return [...new Set(matches)]; // to remove duplicates
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
export const {updateCell , setActiveCell , updateSelection , updateCellFormat, sertError ,addRow, deleteRow, addColumn, deleteColumn, updateColumnWidth, updateRowHeight, clearError} = spreadSheetSlice.actions;
export default spreadSheetSlice.reducer;