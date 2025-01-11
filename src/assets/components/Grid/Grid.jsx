import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveCell, updateSelection } from '../../../store/slices/spreadSheetSlice';

const Grid = () => {
    const dispatch = useDispatch();
    const { columnCount, rowCount, activeCell, selection } = useSelector(
        (state) => state.spreadSheet
    );
    const getColumnLabel = useCallback((index) => {
        let label = '';
        while (index > 0) {
            label = String.fromCharCode(65 + (index % 26)) + label;
            index = Math.floor(index / 26) - 1;
        }
        return label;
    }, []);

    const handleClick = useCallback((rowIndex, colIndex) => {
        const cellId = `${getColumnLabel(colIndex)}${rowIndex + 1}`;
        dispatch(setActiveCell(cellId));
        dispatch(updateSelection({ start: { row: rowIndex, col: colIndex }, end: { row: rowIndex, col: colIndex } }));

    }, [dispatch, getColumnLabel]);

    return (
        <div className='overflow-auto h-full'>
            <div className='relative'>
                {/* Header Row */}
                <div className='sticky top-0 z-10 flex'>
                    <div className='w-10 h-6 bg-gray-100 border-b border-r border-gray-300'>
                        {Array.from({ length: columnCount }).map((_, index) => (
                            <div
                                key={`header-${index}`}
                                className='w-10 h-6 bg-gray-100 border-b border-r border-gray-300 flex items-center justify-center text-sm text-gray-600'>
                                {getColumnLabel(index)}
                            </div>
                        ))}
                    </div>
                    {/* Grid Cells */}
                    {Array.from({ length: rowCount }).map((_, rowIndex) => {
                        <div key={`row-${rowIndex}`}
                            className='flex'>
                            {/* Row Header */}
                            <div className='sticky left-0 w-10 bg-gray-100 border-b border-r border-gray-300 flex items-center justify-center text-sm text-gray-600'>
                                {rowIndex + 1}
                            </div>
                            {/* Row Cells */}
                            {Array.from({ length: columnCount }).map((_, colIndex) => (
                                <Cell
                                    key={`${rowIndex}-${colIndex}`}
                                    rowIndex={rowIndex}
                                    colIndex={colIndex}
                                    isActive={activeCell === `${getColumnLabel(colIndex)}${rowIndex + 1}`}
                                    onClick={() => handleClick(rowIndex, colIndex)}
                                />
                    ))}
                        </div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Grid;