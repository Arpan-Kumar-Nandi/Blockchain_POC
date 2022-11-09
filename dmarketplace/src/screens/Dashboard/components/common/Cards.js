import React from 'react'
import { buyNFTToken } from '../../../../store/user/userSlice'
import './Cards.css'
import { useDispatch } from 'react-redux'

const Cards = ({ productsList = [], context = '' }) => {
  const dispatch = useDispatch()

  const handleBuyNFT = async (e, item) => {
    e.preventDefault()
    dispatch(
      buyNFTToken({
        contractAddress: item.contractAddress,
        tokenId: item.tokenId,
        price: item.price,
      })
    )
  }

  const displayMyItems = () => {
    return productsList.map((item) => (
      <div className='card' key={item.tokenId}>
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
      </div>
    ))
  }
  const displayMyItemsHome = () => {
    return productsList.map((item) => (
      <div className='card' key={item.tokenId}>
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
        <p className='card-owner'>Owner {item.owner}</p>
        {item.status === '0' && (
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
