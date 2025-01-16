import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Admin from "./Admin";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

const Home = () => {
  return("coming_soon")
}

export default App
