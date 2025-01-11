import React, { useState, useCallback } from 'react';
import { useSelector , useDispatch } from 'react-redux'
import { updateCell } from '../../store/slices/spreadSheetSlice';

const Cell = ({rowIndex , colIndex , isActive}) => {
  const dispatch  = useDispatch();
  const [isEditing , setIsEditing] = useState(false);
  const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
  const cellData = useSelector((state) => state.spreadSheet.cells[cellId]) ||{
    value : '',
    formulae : '',
    format : {
        bold : false,
        italic : false,
        fontSize : 12,
        color : '#000000'
    }
  };
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  } , []);
  
  const handleBlur = useCallback((e)=>{
    setIsEditing(false);
    const value = e.target.value;
    dispatch(updateCell({ id: cellId, value, formulae: value.startsWith('=') ? value : '' }));
  }, [dispatch , cellId]);
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  }, []);
    return (
    <div
    className={`w-full h-full relative ${
        isActive ? 'bg-blue-50' : 'bg-white'
      }`}
      onDoubleClick={handleDoubleClick}
      >
    {isEditing ? (
        <input
        type = "text"
        className = "absolute inset-0 w-full h-full px-2 outline-none border-2 border-blue-500 "
        defaultValue = {cellData.formulae || cellData.value}
        autoFocus
        onBlur = {handleBlur}
        onKeyDown={handleKeyDown}
        />
    ) : (
        <div
        className='w-full h-full px-2 overflow-hidden whitespace-nowrap flex items-center'
        style = {{
            fontWeight : cellData.format.bold ? 'bold' : 'normal',
            fontStyle : cellData.format.italic ? 'italic' : 'normal',
            fontSize : `${cellData.format.fontSize}px`,
            color : cellData.format.color
        }}
        >
            {cellData.value}
        </div>
    )}
      </div>
  );
};

export default Cell