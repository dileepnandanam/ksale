import React, { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Admin from "./Admin";
import Home from "./Home";
import Join, { Login } from "./Join";

export const UserContext = React.createContext()

function App() {
  const [count, setCount] = useState(0)
  const [located, setLocated] = useState(false);

  const user = {
    Current: () => {
      const saved = localStorage.getItem("currentUser")
      try {
        return JSON.parse(saved)
      } catch(e) {
        return(null)
      }
    },
    Set: (user) => {
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
  }

  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home located={located} setLocated={setLocated} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
