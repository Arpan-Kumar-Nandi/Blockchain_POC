import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Wallet = () => {
  const dispatch = useDispatch()

  const mintPOC20Tokens = (e) => {
    e.preventDefault()
    dispatch()
  }

  return (
    <div>
      <button onClick={mintPOC20Tokens}>Mint</button>
    </div>
  )
}

export default Wallet
