import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCellFormat } from '../../store/slices/spreadSheetSlice';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, Palette
} from 'lucide-react';

const Toolbar = () => {
  const dispatch = useDispatch();
  const activeCell = useSelector(state => state.spreadSheet.activeCell);
  const cellFormat = useSelector(state => 
    activeCell ? state.spreadSheet.cells[activeCell]?.format : null
  );

  const updateFormat = (formatUpdate) => {
    if (!activeCell) return;
    dispatch(updateCellFormat({
      id: activeCell,
      format: {
        ...(cellFormat || {}),
        ...formatUpdate
      }
    }));
  };

  return (
    <div className="flex items-center space-x-2 px-2 py-1 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
        <select className="h-8 px-2 border border-gray-300 rounded text-sm bg-white">
          <option>Arial</option>
          <option>Times New Roman</option>
          <option>Calibri</option>
          <option>Roboto</option>
        </select>
        <select 
          className="h-8 w-16 border border-gray-300 rounded text-sm bg-white"
          value={cellFormat?.fontSize || 12}
          onChange={(e) => updateFormat({ fontSize: Number(e.target.value) })}
        >
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32].map(size => (
            <option key={size}>{size}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
        <button 
          onClick={() => updateFormat({ bold: !cellFormat?.bold })}
          className={`p-1 rounded hover:bg-gray-200 ${cellFormat?.bold ? 'bg-gray-200' : ''}`}
        >
          <Bold size={16} />
        </button>
        <button 
          onClick={() => updateFormat({ italic: !cellFormat?.italic })}
          className={`p-1 rounded hover:bg-gray-200 ${cellFormat?.italic ? 'bg-gray-200' : ''}`}
        >
          <Italic size={16} />
        </button>
        <button 
          onClick={() => updateFormat({ underline: !cellFormat?.underline })}
          className={`p-1 rounded hover:bg-gray-200 ${cellFormat?.underline ? 'bg-gray-200' : ''}`}
        >
          <Underline size={16} />
        </button>
      </div>

      <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
        <button className="p-1 rounded hover:bg-gray-200">
          <Palette size={16} />
        </button>
        <input 
          type="color" 
          className="w-6 h-6 p-0 border-0"
          value={cellFormat?.color || '#000000'}
          onChange={(e) => updateFormat({ color: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-1">
        <button 
          onClick={() => updateFormat({ align: 'left' })}
          className={`p-1 rounded hover:bg-gray-200 ${cellFormat?.align === 'left' ? 'bg-gray-200' : ''}`}
        >
          <AlignLeft size={16} />
        </button>
        <button 
          onClick={() => updateFormat({ align: 'center' })}
          className={`p-1 rounded hover:bg-gray-200 ${cellFormat?.align === 'center' ? 'bg-gray-200' : ''}`}
        >
          <AlignCenter size={16} />
        </button>
        <button 
          onClick={() => updateFormat({ align: 'right' })}
          className={`p-1 rounded hover:bg-gray-200 ${cellFormat?.align === 'right' ? 'bg-gray-200' : ''}`}
        >
          <AlignRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;