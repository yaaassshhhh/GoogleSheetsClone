import React, { useState, useCallback } from 'react';
import { useSelector , useDispatch } from 'react-redux'
import { updateCell } from '../../store/slices/spreadSheetSlice';

const Cell = ({rowIndex , colIndex , isActive}) => {
  const dispatch  = useDispatch();
  const [isEditing , setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

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
    setEditValue(cellData?.formulae || cellData?.value || '');
  } , [cellData]);
  
  const handleBlur = useCallback(()=>{
    setIsEditing(false);
    if (editValue !== (cellData?.formulae || cellData?.value || '')) {
      dispatch(updateCell({
        id: cellId,
        value: editValue,
        formulae: editValue.startsWith('=') ? editValue : ''
      }));
    }
    
    dispatch(updateCell({ id: cellId, value : editValue, formulae: editValue.startsWith('=') ? editValue : '' }));
  }, [dispatch , cellId , editValue , cellData]);


  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  }, []);

  const getCellStyle = () => {
    const format = cellData?.format || {};
    return {
        fontWeight: format.bold ? 'bold' : 'normal',
        fontStyle: format.italic ? 'italic' : 'normal',
        textDecoration: format.underline ? 'underline' : 'none',
        color: format.color || '#000000',
        fontSize: `${format.fontSize || 12}px`,
        textAlign: format.align || 'left',
        width: '100%',
        height: '100%',
        padding: '0 4px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none'
    };
};
// console.log('Cell Data:', cellId, cellData); //Debug log
const format = cellData?.format || {};
// console.log('Cell Format:', format); //Debug log

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
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        onBlur = {handleBlur}
        onKeyDown={handleKeyDown}
        />
    ) : (
        <div
        className='w-full h-full px-2 overflow-hidden whitespace-nowrap flex items-center'
        style = {
          {
                fontFamily: format.fontFamily || 'Arial',
                fontSize: `${format.fontSize || 12}px`,
                fontWeight: format.bold ? 'bold' : 'normal',
                fontStyle: format.italic ? 'italic' : 'normal',
                textDecoration: format.underline ? 'underline' : 'none',
                color: format.color || '#000000',
                textAlign: format.align || 'left',
                padding: '0 4px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                minHeight: '100%'
            }
        }
        >
            {cellData.value}
        </div>
    )}
      </div>
  );
};

export default Cell