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
  const cellData = useSelector(state => activeCell ? state.spreadSheet.cells[activeCell] : null);
 
  console.log('1-Active Cell:', activeCell);
  console.log('2-Cell Data:', cellData);
  


  const updateFormat = (formatUpdate) => {
    if (!activeCell) return;

    const cellCurrentFormat = cellData?.format || {};
    console.log('3-Cell Format:', cellCurrentFormat);
    
    const newFormat = {
      ...cellCurrentFormat,
      ...formatUpdate
    };

    console.log('4-New Format:', newFormat);

    dispatch(updateCellFormat({
      id : activeCell,
      format : newFormat
    }));
  };

  return (
    <div className="flex items-center space-x-2 px-2 py-1 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
        <select
         value={cellData?.format?.fontFamily || 'Arial'}
         onChange={(e) => updateFormat({fontFamily : e.target.value})}         
         className="h-8 px-2 border border-gray-300 rounded text-sm bg-white">
          <option>Arial</option>
          <option>Times New Roman</option>
          <option>Calibri</option>
          <option>Roboto</option>
        </select>
        <select 
          className="h-8 w-16 border border-gray-300 rounded text-sm bg-white"
          value={cellData?.format?.fontSize || 12}
          onChange={(e) => updateFormat({ fontSize: Number(e.target.value) })}
        >
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-1 border-r border-gray-300 pr-2">
        <button 
          onClick={() => updateFormat({ bold: !cellData?.format?.bold })}
          className={`p-1 rounded hover:bg-gray-200 ${cellData?.format?.bold ? 'bg-gray-200' : ''}`}
        >
          <Bold size={16} />
        </button>
        <button 
          onClick={() => updateFormat({ italic: !cellData?.format?.italic })}
          className={`p-1 rounded hover:bg-gray-200 ${cellData?.format?.italic ? 'bg-gray-200' : ''}`}
        >
          <Italic size={16} />
        </button>
        <button 
          onClick={() => updateFormat({ underline: !cellData?.format?.underline })}
          className={`p-1 rounded hover:bg-gray-200 ${cellData?.format?.underline ? 'bg-gray-200' : ''}`}
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
          value={cellData?.format?.color || '#000000'}
          onChange={(e) => updateFormat({ color: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-1">
        <button 
          onClick={() => updateFormat({ align: 'left' })}
          className={`p-1 rounded hover:bg-gray-200 ${cellData?.format?.align === 'left' ? 'bg-gray-200' : ''}`}
        >
          <AlignLeft size={16} />
        </button>
        <button 
          onClick={() => updateFormat({ align: 'center' })}
          className={`p-1 rounded hover:bg-gray-200 ${cellData?.format?.align === 'center' ? 'bg-gray-200' : ''}`}
        >
          <AlignCenter size={16} />
        </button>
        <button 
          onClick={() => updateFormat({ align: 'right' })}
          className={`p-1 rounded hover:bg-gray-200 ${cellData?.format?.align === 'right' ? 'bg-gray-200' : ''}`}
        >
          <AlignRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;