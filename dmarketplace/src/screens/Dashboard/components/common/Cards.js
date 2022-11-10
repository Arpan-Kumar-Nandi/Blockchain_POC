import React from 'react'
import {
  buyNFTToken,
  fetchNFTItemDetails,
} from '../../../../store/user/userSlice'
import './Cards.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const Cards = ({ productsList = [], context = '' }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userAccount } = useSelector((state) => state.user)
  const handleBuyNFT = async (e, item) => {
    e.preventDefault()
    e.stopPropagation()

    dispatch(
      buyNFTToken({
        contractAddress: item.contractAddress,
        tokenId: item.tokenId,
        price: item.price,
      })
    )
  }

  const handleRedirect = async (item, context) => {
    await dispatch(
      fetchNFTItemDetails({
        contractAddress: item.contractAddress,
        tokenId: item.tokenId,
      })
    )
    if (context === 'home') {
      navigate(`/dashboard/product/${item.tokenId}`)
    }

    if (context === 'account') {
      navigate(`/dashboard/account/product/${item.tokenId}`)
    }
  }

  const handleResell = (e) => {
    e.preventDefault()
  }

  const displayMyItems = () => {
    return productsList.map((item) => (
      <div
        className='card'
        key={item.tokenId}
        onClick={() => handleRedirect(item, 'account')}
      >
        <div className='card-tag'>
          <span
            className={
              item.status === '0' ? 'tag card-available' : 'tag card-sold'
            }
          >
            {item.status === '0' ? 'Available' : 'Sold'}
          </span>
        </div>
        <div className='card-title-date-container'>
          <p className='card-title'>{item.title}</p>
          <p className='card-date highlight'>{item.date}</p>
        </div>
        <p className='card-description'>{item.description}</p>
        <p className='card-price highlight'>
          {item.price}
          <span className='price-unit'>POC20 TOKENS</span>
        </p>
        {item.status === '1' && (
          <button
            className='card-buy-button'
            onClick={(e) => handleResell(e, item)}
          >
            Resell
          </button>
        )}
      </div>
    ))
  }
  const displayMyItemsHome = () => {
    return productsList.map((item) => (
      <div
        className='card'
        key={item.tokenId}
        onClick={() => handleRedirect(item, 'home')}
      >
        <div className='card-tag'>
          <span
            className={
              item.status === '0' ? 'tag card-available' : 'tag card-sold'
            }
          >
            {item.status === '0' ? 'Available' : 'Sold'}
          </span>
        </div>
        <div className='card-title-date-container'>
          <p className='card-title'>{item.title}</p>
          <p className='card-date highlight'>{item.date}</p>
        </div>
        <p className='card-description'>{item.description}</p>
        <p className='card-price highlight'>
          {item.price}
          <span className='price-unit'>POC20 TOKENS</span>
        </p>
        <p className='card-owner'>
          {item.owner === userAccount?.publicAddress
            ? 'You are the owner'
            : `Owner ${item.owner}`}
        </p>
        {item.status === '0' && item.owner !== userAccount?.publicAddress && (
          <button
            className='card-buy-button'
            onClick={(e) => handleBuyNFT(e, item)}
          >
            Buy
          </button>
        )}
      </div>
    ))
  }

  return (
    <div className='cards-container'>
      {context === 'myItems' ? displayMyItems() : displayMyItemsHome()}
    </div>
  )
}

export default Cards
