import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { addRow, deleteColumn, deleteRow, addColumn } from '../../store/slices/spreadSheetSlice';

const DimenssionControls = () => {
    const dispatch = useDispatch();
    const {columnCount , rowCount} = useSelector((state) => state.spreadSheet);
  return (
    <div className='flex space-x-4 p-2 bg-gray-100 border-b'>
        <button onClick={dispatch(addRow({index : rowCount}))}>
            Add Row
        </button>
        <button 
        onClick={() => dispatch(deleteRow({ index: rowCount - 1 }))}
        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete Row
      </button>
      <button 
        onClick={() => dispatch(addColumn({ index: columnCount }))}
        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Column
      </button>
      <button 
        onClick={() => dispatch(deleteColumn({ index: columnCount - 1 }))}
        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete Column
      </button>
    </div>
  )
};

export default DimenssionControls;