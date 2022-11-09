import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyNFTS } from '../../../store/user/userSlice'
import Cards from './common/Cards'

const MyItems = () => {
  const dispatch = useDispatch()
  const { myNFTList } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchMyNFTS())
  }, [dispatch])
  return <Cards productsList={myNFTList} context='myItems' />
}

export default MyItems
