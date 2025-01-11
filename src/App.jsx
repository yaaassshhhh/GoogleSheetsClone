import React from 'react'
import { Provider } from 'react-redux'
import {store} from './store'
import Grid from './components/Grid/Grid'
const App = () => {
  return (
    <Provider store={store}>
      <div className="h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 p-2">
          <h1 className="text-xl font-semibold text-gray-800">GoogleSheet Clone</h1>
        </header>
        <main className="flex-1 overflow-hidden">
          <Grid />
        </main>
      </div>
    </Provider>
  )
}

export default App
