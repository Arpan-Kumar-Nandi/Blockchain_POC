import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllItems } from '../../../store/user/userSlice'
import Cards from './common/Cards'
import './Home.css'

const Home = () => {
  const dispatch = useDispatch()
  const { allItemsList } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchAllItems())
  }, [dispatch])
  return (
    <div className='home-container'>
      <Cards productsList={allItemsList} context='home' />
    </div>
  )
}

export default Home
