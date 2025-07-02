import React, { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Admin from "./Admin";
import Home from "./Home";
import Join, { Login } from "./Join";
import Api from "./Api";

export const UserContext = React.createContext()

function App() {
  const [count, setCount] = useState(0)
  const [located, setLocated] = useState(false);

  const user = {
    Current: () => (currentUser),
    Fetch: () => {
      const saved = localStorage.getItem("currentUser")
      try {
        return JSON.parse(saved)
      } catch(e) {
        return(null)
      }
    },
    Set: (user) => {
      localStorage.setItem("currentUser", JSON.stringify(user))
      setCurrentUser(user)
    },
    Unset: () => {
      localStorage.setItem("currentUser", null)
      setCurrentUser(null)
    }
  }

  const [currentUser, setCurrentUser] = useState(user.Fetch())

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const res = await Api.getUser()
      user.set(res)
    } catch (e) {
      user.Unset()
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
