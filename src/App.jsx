import React from 'react'
import { Provider } from 'react-redux'
import {store} from './store'
import Grid from './components/Grid/Grid'
import FormulaeBar from './components/FormulaeBar/FormulaeBar'
import Toolbar from './components/Toolbar/Toolbar'
import { PiMicrosoftExcelLogoThin } from "react-icons/pi";
const App = () => {
  return (
    <Provider store={store}>
      <div className="h-screen flex flex-col">
        <header className="flex items-center border-b border-gray-200 h-12 shrink-0">
        <div className='flex items-center px-4'>
        <PiMicrosoftExcelLogoThin size={50} />
          <h1 className="text-lg font-medium text-green-700">Google-Sheets Clone</h1>
        </div>
        </header>

        {/* Menu Bar - Optional, commenting out for now */}
        <div className="flex items-center border-b border-gray-200 h-8 px-2 bg-gray-50">
          <div className="flex space-x-4">
            <span className="text-sm text-gray-600">File</span>
            <span className="text-sm text-gray-600">Edit</span>
            <span className="text-sm text-gray-600">View</span>
            <span className="text-sm text-gray-600">Insert</span>
            <span className="text-sm text-gray-600">Format</span>
          </div>
        </div>

        <Toolbar />
        <FormulaeBar/>

        <main className="flex-1 overflow-hidden bg-gray-50">
          <Grid />
        </main>
        <footer className="border-t border-gray-200 h-6 shrink-0 bg-gray-50">
          <div className="flex items-center h-full px-4">
            <span className="text-xs text-gray-500">Developed By Yash Agrawal</span>            
          </div>
        </footer>
      </div>
    </Provider>
  )
}

export default App
