import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { logout } from '../../store/user/userSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onDisconnect = async () => {
    dispatch(logout())
    navigate('/login')
  }
  return (
    <section>
      <button onClick={onDisconnect}>Logout</button>
    </section>
  )
}

export default Dashboard
