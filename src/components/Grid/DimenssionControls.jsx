import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addRow, deleteColumn, deleteRow, addColumn } from '../../store/slices/spreadSheetSlice';

const DimenssionControls = () => {
  const dispatch = useDispatch();
  const { columnCount, rowCount } = useSelector((state) => state.spreadSheet);

  const handleAddRow = () => {
    dispatch(addRow({ index: rowCount }));
  };

  const handleDeleteRow = () => {
    dispatch(deleteRow({ index: rowCount - 1 }));
  };

  const handleAddColumn = () => {
    dispatch(addColumn({ index: columnCount }));
  };

  const handleDeleteColumn = () => {
    dispatch(deleteColumn({ index: columnCount - 1 }));
  };

  return (
    <div className='flex space-x-4 p-2 bg-gray-50 border-b border-gray-50'>
      <button onClick={handleAddRow} className="px-2 py-1 bg-green-700 text-white rounded hover:bg-green-900">
        Row++
      </button>
      <button onClick={handleDeleteRow} className="px-2 py-1 bg-green-700 text-white rounded hover:bg-green-900">
        Row--
      </button>
      <button onClick={handleAddColumn} className="px-2 py-1 bg-green-700 text-white rounded hover:bg-green-900">
        Column++
      </button>
      <button onClick={handleDeleteColumn} className="px-2 py-1 bg-green-700 text-white rounded hover:bg-green-900">
        Column--
      </button>
    </div>
  );
};

export default DimenssionControls;