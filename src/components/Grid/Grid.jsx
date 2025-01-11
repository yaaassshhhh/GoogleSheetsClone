import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveCell, updateSelection } from '../../store/slices/spreadSheetSlice';
import Cell from './Cell';
const Grid = () => {
    const dispatch = useDispatch();
    const { columnCount, rowCount, activeCell, selection } = useSelector(
        (state) => state.spreadSheet
    );
    const getColumnLabel = useCallback((index) => {
        let label = '';
        index += 1;
        while (index > 0) {
            index--;
            label = String.fromCharCode(65 + (index % 26)) + label;
            index = Math.floor(index / 26) ;
        }
        return label;
    }, []);

    const handleClick = useCallback((rowIndex, colIndex) => {
        const cellId = `${getColumnLabel(colIndex)}${rowIndex + 1}`;
        dispatch(setActiveCell(cellId));
        dispatch(updateSelection({ start: { row: rowIndex, col: colIndex }, end: { row: rowIndex, col: colIndex } }));

    }, [dispatch, getColumnLabel]);

    return (
        <div className="overflow-auto h-full">
            <div className="relative inline-block min-w-full">
                {/* Header Row with corner cell */}
                <div className="flex sticky top-0 z-10">
                    {/* Corner cell */}
                    <div className="w-16 h-8 bg-gray-100 border-r border-b border-gray-300 sticky left-0 z-20" />
                    
                    {/* Column headers */}
                    <div className="flex">
                        {Array.from({ length: columnCount }).map((_, index) => (
                            <div
                                key={`header-${index}`}
                                className="w-24 h-8 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center text-sm text-gray-600"
                            >
                                {getColumnLabel(index)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid Rows */}
                {Array.from({ length: rowCount }).map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="flex">
                        {/* Row header */}
                        <div className="sticky left-0 w-16 h-8 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center text-sm text-gray-600 z-10">
                            {rowIndex + 1}
                        </div>

                        {/* Row cells */}
                        {Array.from({ length: columnCount }).map((_, colIndex) => (
                            <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                className={`w-24 h-8 border-r border-b border-gray-300 ${
                                    activeCell === `${getColumnLabel(colIndex)}${rowIndex + 1}` 
                                        ? 'bg-blue-50' 
                                        : 'bg-white'
                                }`}
                                onClick={() => handleClick(rowIndex, colIndex)}
                            >
                                <Cell
                                    rowIndex={rowIndex}
                                    colIndex={colIndex}
                                    isActive={activeCell === `${getColumnLabel(colIndex)}${rowIndex + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Grid;