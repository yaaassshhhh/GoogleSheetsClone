import React, { useState, useCallback } from 'react';
import { useSelector , useDispatch } from 'react-redux'

const Cell = ({rowIndex , colIndex , isActive , onClick}) => {
  const dispatch  = useDispatch();
  const [isEditing , setIsEditing] = useState(false);
  const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
  const cellData = useSelector((state) => state.spreadSheet.cells[cellId] ||{
    value : '',
    formulae : '',
    format : {
        bold : false,
        italic : false,
        fontSize : 12,
        color : '#000000'
    }
  })
  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  } , []);
  
  const handleBlur = useCallback((e)=>{
    if(e.key === 'Enter'){
        e.preventDefault();
        e.target.blur();
    }
  }, []);
  
    return (
    <></>
  )
}

export default Cell