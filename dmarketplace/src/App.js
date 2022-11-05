import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import './App.css'

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userAccount'))
    console.log(userData)
    if (!userData) {
      console.log('here')
      navigate('/login')
    }
  }, [navigate])

  return <div className='App'></div>
}

export default App
