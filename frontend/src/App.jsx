import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {import.meta.env.VITE_API_URL}
    </>
  )
}

export default App
