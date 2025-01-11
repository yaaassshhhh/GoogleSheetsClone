import { createSlice } from "@reduxjs/toolkit";


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
rowCount : 100
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
                        bold : false,
                        italic : false,
                        fontSize : 12,
                        color : '#000000'
                    }
                }
            }
            state.cells[id] = {...state.cells[id] , value , formulae};
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
    }
});

export const {updateCell , setActiveCell , updateSelection , updateCellFormat} = spreadSheetSlice.actions;
export default spreadSheetSlice.reducer;