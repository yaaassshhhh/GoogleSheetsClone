import React, { useState , useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveCell, updateSelection } from '../../store/slices/spreadSheetSlice';
import Cell from './Cell';
import { useEffect } from 'react';
const Grid = () => {
    const dispatch = useDispatch();
    const { columnCount, rowCount, activeCell, selection } = useSelector(
        (state) => state.spreadSheet
    );
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(null);

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

    const handleMouseDown = useCallback((rowIndex, colIndex, e) =>{
        if(e.button !== 0) return; // to only handle left click

        const cellId = `${getColumnLabel(colIndex)}${rowIndex + 1}`;
        dispatch(setActiveCell(cellId));
        setIsDragging(true);
        setDragStart({ row: rowIndex, col: colIndex });
        dispatch(updateSelection({
            start : { row: rowIndex, col: colIndex },
            end : { row: rowIndex, col: colIndex }
        }));
    }, [dispatch , getColumnLabel]);

    const handleMouseMove = useCallback((rowIndex, colIndex) =>{
        if(!isDragging || !dragStart) return;

        dispatch(updateSelection({
            start : dragStart,
            end : { row: rowIndex, col: colIndex }
        }));
    }, [isDragging , dragStart, dispatch]);

    const handleMouseUp = useCallback(() =>{
        setIsDragging(false);
        setDragStart(null);
    },[]);

    useEffect(() =>{
        document.addEventListener('mouseup',handleMouseUp);
        return () => document.removeEventListener('mouseup',handleMouseUp);
    },[handleMouseUp]);
    
    const isCellSelected = useCallback((rowIndex, colIndex) =>{
        if(!selection.start || !selection.end) return false;

        const minRow = Math.min(selection.start.row,selection.end.row);
        const maxRow = Math.max(selection.start.row,selection.end.row);
        const maxCol = Math.max(selection.start.col,selection.end.col);
        const minCol = Math.min(selection.start.col,selection.end.col);
        
        return rowIndex >= minRow && rowIndex <= maxRow && colIndex >= minCol && colIndex <= maxCol;

    },[selection]);

    // const handleClick = useCallback((rowIndex, colIndex) => {
    //     const cellId = `${getColumnLabel(colIndex)}${rowIndex + 1}`;
    //     dispatch(setActiveCell(cellId));
    //     dispatch(updateSelection({ start: { row: rowIndex, col: colIndex }, end: { row: rowIndex, col: colIndex } }));

    // }, [dispatch, getColumnLabel]);

    return (
        
        <div className="overflow-auto w-full h-full " 
            onMouseUp={handleMouseUp}>
            <div className="inline-block min-w-full relative">
                {/* Header Row with corner cell */}
                <div className="flex sticky top-0 z-10 bg-gray-50">
                    {/* Corner cell */}
                    <div className="w-16 h-8 bg-gray-100 border-r border-b border-gray-300 sticky left-0 z-20 shrink-0" />
                    
                    {/* Column headers */}
                    <div className="flex">
                        {Array.from({ length: columnCount }).map((_, index) => (
                            <div
                                key={`header-${index}`}
                                className="w-24 h-8 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center text-sm text-gray-600
                                shrink-0"
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
                        <div className="sticky left-0 w-16 h-8 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center text-sm text-gray-600 z-10 shrink-0">
                            {rowIndex + 1}
                        </div>

                        {/* Row cells */}
                        {Array.from({ length: columnCount }).map((_, colIndex) => (
                            <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                className={`w-24 h-8 border-r border-b border-gray-300 relative shrink-0 ${
                                    isCellSelected(rowIndex , colIndex) ? 'bg-blue-50 ring-2 ring-blue-400 z-10' : 'bg-white'
                                }`}
                                onMouseDown = {(e) => handleMouseDown(rowIndex, colIndex, e)}
                                onMouseMove = {() => handleMouseMove(rowIndex, colIndex)}
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