import React , { useState,useEffect,useCallback } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { updateCell } from '../../store/slices/spreadSheetSlice';
import DimenssionControls from '../Grid/DimenssionControls';
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
      className="flex items-center border-b border-gray-300 px-2 py-1 bg-gray-50">
        <div
          className="flex items-center mr-2">
          <div 
            className="bg-green-100 px-2 py-1 rounded min-w-[45px] items-center justify-center font-medium">
                    {activeCell || ''}
          </div>
        </div>
          <span 
            className="text-green-900 text-md font-medium ">fx</span>
        <input
                type="text"
                className="ml-2 flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                value={formulae}
                onChange={handleFormulaeChange}
                onBlur={handleFormulaeSubmit}
                onKeyDown={handleKeyDown}
                placeholder="Enter a value or formula"
            />
                    <DimenssionControls/>
    </div>
  )
}

export default FormulaeBar