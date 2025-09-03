import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ProductList from './ProductList'
import DynamicForm from './DynamicForm'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ProductList />
      <DynamicForm />
    </>
  )
}

export default App
