import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import './App.css'

function App() {
  const navigate = useNavigate()
  const { userAccount } = useSelector((state) => state.user)

  useEffect(() => {
    !userAccount ? navigate('/login') : navigate('/dashboard')
  }, [navigate, userAccount])

  return <div className='App'></div>
}

export default App
