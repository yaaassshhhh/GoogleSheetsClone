import React , { useState,useEffect,useCallback } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { updateCell } from '../../store/slices/spreadSheetSlice';

const FormulaeBar = () => {
    const dispatch = useDispatch();
    const activeCell = useSelector(state => state.spreadSheet.activeCell);
    const cellData = useSelector(state => activeCell ? state.spreadSheet.cells[activeCell] : null);
    const [formulae, setFormulae] = useState("");

    useEffect(() => {
        if(cellData){
            setFormulae(cellData.formulae || cellData.value || '');
        }else{
            setFormulae('');
        }
    },[activeCell , cellData]);

    const handleFormulaeChange = useCallback((e) => {
        setFormulae(e.target.value);
    })

    const handleFormulaeSubmit = useCallback(() => {
        if(!activeCell) return;

        const value = formulae.startsWith('=') ? evaluateFormulae(formulae) : formulae;

        dispatch(updateCell({
            id : activeCell,
            value : value,
            formulae : formulae.startsWith('=') ? formulae : ''
        }));
    }, [dispatch , activeCell , formulae]);

    const handleKeyDown = useCallback((e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
            handleFormulaeSubmit();

        }
    },[handleFormulaeSubmit]);

  return (
    <div
      className="flex items-center border-b border-gray-300 px-2 py-1 bg-white">
        <div
          className="flex items-center mr-2">
          <span 
            className='"text-gray-600 text-sm font-medium mr-2"'>fx</span>
          <div 
            className="bg-gray-100 px-2 py-1 rounded min-w-[60px]">
                    {activeCell || ''}
          </div>
        </div>
        <input
                type="text"
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                value={formula}
                onChange={handleFormulaChange}
                onBlur={handleFormulaSubmit}
                onKeyDown={handleKeyDown}
                placeholder="Enter a value or formula"
            />
    </div>
  )
}

export default FormulaeBar