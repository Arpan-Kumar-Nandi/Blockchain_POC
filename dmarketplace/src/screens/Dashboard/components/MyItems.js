import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyNFTS } from '../../../store/user/userSlice'
import Cards from './common/Cards'
import './MyItems.css'

const MyItems = () => {
  const dispatch = useDispatch()
  const { myNFTList } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchMyNFTS())
  }, [dispatch])
  return (
    <div className='items-container'>
      <Cards productsList={myNFTList} context='myItems' />
    </div>
  )
}

export default MyItems
