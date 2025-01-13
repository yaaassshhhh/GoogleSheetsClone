import React from 'react'
import { useEffect, useState } from 'react';

const ResizeHandle = ({ type, index, initialSize, onResize }) => {
    const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [startSize, setStartSize] = useState(null);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    setStartPos(type === 'column' ? e.clientX : e.clientY);
    setStartSize(initialSize);
    e.preventDefault();
  }

  useEffect(() =>{
    if(!isResizing) return;

    const handleMouseMove = (e) => {
        if(!startPos || !startSize) return;
        const currentPos = type === 'column' ? e.clientX : e.clientY;
        const diff = currentPos - startPos;
        onResize(startSize + diff);
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        setStartPos(null);
        setStartSize(null);
    };

    document.addEventListener('mousemove',handleMouseMove);
    document.addEventListener('mouseup',handleMouseUp);

    return () => {
        document.removeEventListener('mousemove',handleMouseMove);
        document.removeEventListener('mouseup',handleMouseUp);
    }
  }, [isResizing, startPos, startSize, type,onResize]);
  return (
    <div
    className={`absolute ${
      type === 'column' 
        ? 'cursor-col-resize right-0 top-0 w-1 h-full hover:bg-blue-400'
        : 'cursor-row-resize bottom-0 left-0 w-full h-1 hover:bg-blue-400'
    } bg-transparent hover:bg-opacity-50 z-20`}
    onMouseDown={handleMouseDown}
  />
  )
}

export default ResizeHandle