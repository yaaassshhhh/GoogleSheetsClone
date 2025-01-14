import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector , useDispatch } from 'react-redux'
import { updateCell } from '../../store/slices/spreadSheetSlice';
import ChartComponent from '../DataVisualization/ChartComponents';
const Cell = ({rowIndex , colIndex , isActive}) => {
  const dispatch  = useDispatch();
  const [isEditing , setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef(null);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
        if (isActive && e.key === 'F2') {
            setIsEditing(true);
            setEditValue(cellData?.formulae || cellData?.value || '');
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, [isActive, cellData]);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(cellData?.formulae || cellData?.value || '');
  } , [cellData]);
  
  const handleBlur = useCallback(()=>{
    if(!isEditing) return;
    setIsEditing(false);
    if (editValue !== (cellData?.formulae || cellData?.value || '')) {
      dispatch(updateCell({
        id: cellId,
        value: editValue,
        formulae: editValue.startsWith('=') ? editValue : ''
      }));
    }
    
    dispatch(updateCell({ id: cellId, value : editValue, formulae: editValue.startsWith('=') ? editValue : '' }));
  }, [dispatch , cellId , editValue , cellData, isEditing]);


  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }else if(e.key === 'Escape'){
      e.preventDefault();
      setIsEditing(false);
      setEditValue(cellData?.formulae || cellData?.value || '');
    }
  }, [handleBlur, cellData]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
        inputRef.current.focus();
    }
}, [isEditing]);

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
        outline: 'none',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    };
};
// console.log('Cell Data:', cellId, cellData); //Debug log
const format = cellData?.format || {};
// console.log('Cell Format:', format); //Debug log

const renderContent = () => {
  if (isEditing) {
      return (
          <input
              ref={inputRef}
              type="text"
              className="absolute inset-0 w-full h-full px-2 focus:outline-none border-2 border-green-500"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
          />
      );
  }

  // Check if the cell value is a chart
  if (cellData.value && typeof cellData.value === 'object' && cellData.value.type === 'CHART') {
      return (
          <div className="absolute inset-0 flex items-center justify-center">
              <ChartComponent 
                  type={cellData.value.chartType}
                  data={cellData.value.data}
                  width={200}  // You might want to make these dynamic based on cell size
                  height={150}
              />
          </div>
      );
  }

  return (
      <div
          className="w-full h-full px-2 overflow-hidden whitespace-nowrap flex items-center"
          style={getCellStyle()}
      >
          {cellData.value}
      </div>
  );
};
    return(
      <div
          className={`w-full h-full cursor-text relative ${
              isActive ? 'bg-green-50' : 'bg-white'
          }`}
          onDoubleClick={handleDoubleClick}
      >
          {renderContent()}
      </div>
  );
};

export default Cell