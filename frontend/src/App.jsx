import React, { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Admin from "./Admin";
import Home from "./Home";
import Profile from "./Profile";
import Join, { Login } from "./Join";
import Api from "./Api";

export const UserContext = React.createContext()

function App() {
  const [count, setCount] = useState(0)
  const [located, setLocated] = useState(false);

  const user = {
    setOnetimeMessage: (msg) => {
      setMessage(msg)
    },
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

  const [message, setMessage] = useState();
  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(null), message.timeout)
    }
  }, [message])
  const checkUser = async () => {
    try {
      const res = await Api.getUser()
      user.Set(res.data)
    } catch (e) {
      user.Unset()
    }
  }

  return (
    <UserContext.Provider value={user}>
      { message &&
        <div style={{ textAlign: "center", fontSize: "20px", width: "100%", padding: "12px" }} className={message.type}>
          {message.text}
        </div>
      }
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home located={located} setLocated={setLocated} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
