import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { buyNFTToken, fetchNFTItemDetails } from '../../../store/user/userSlice'
import './ProductDetails.css'

const ProductDetails = () => {
  const { nftItem, userAccount } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleBuyNFT = async (e, item) => {
    e.preventDefault()
    e.stopPropagation()

    await dispatch(
      buyNFTToken({
        contractAddress: item.contractAddress,
        tokenId: item.tokenId,
        price: item.price,
      })
    )

    dispatch(
      fetchNFTItemDetails({
        contractAddress: item.contractAddress,
        tokenId: item.tokenId,
      })
    )
  }

  const displayHistory = () => {
    const { itemOwnerHistory, itemPriceHistory } = nftItem
    let display = []
    for (let i = 0; i < itemOwnerHistory.length; i++) {
      display.push(
        <div key={itemOwnerHistory[i]}>
          <h1>{itemOwnerHistory[i]}</h1>
          <p>Price {itemPriceHistory[i]}</p>
        </div>
      )
    }
    return display
  }

  return (
    <div className='product-details-container'>
      <div className='product-details-about-container'>
        <div className='product-details'>
          <div className='card-tag'>
            <span
              className={
                nftItem?.status === '0' ? 'tag card-available' : 'tag card-sold'
              }
            >
              {nftItem?.status === '0' ? 'Available' : 'Sold'}
            </span>
          </div>
          <h1 className='about-title'>{nftItem?.title}</h1>
          <p className='about-date highlight'>NFT posted on {nftItem?.date}</p>
          <h4 className='about-description-heading'>Description</h4>
          <p className='about-description-content'>{nftItem?.description}</p>
          <p className='about-price-heading'>
            Price{' '}
            <span className='highlight small'>(in terms of POC20 tokens)</span>
          </p>
          <p className='about-price-content'>
            <span className='price'>{nftItem?.price} </span>tokens
          </p>
          <p className='about-contractAddress'>
            This NFT is at{' '}
            <span className='highlight'>{nftItem?.contractAddress}</span>
          </p>
          <p className='about-owner'>
            {nftItem?.owner === userAccount?.publicAddress
              ? 'You are the owner'
              : `Owner ${nftItem?.owner}`}
          </p>
        </div>
        {nftItem?.status === '0' &&
          nftItem?.owner !== userAccount?.publicAddress && (
            <div className='product-details-buy-container'>
              <button
                className='card-buy-button'
                onClick={(e) => handleBuyNFT(e, nftItem)}
              >
                Buy
              </button>
            </div>
          )}
        {nftItem?.status === '1' &&
          nftItem?.owner === userAccount?.publicAddress && (
            <div className='product-details-resell-container'>
              <div className='nft-form-field'>
                <label htmlFor='price'>
                  Price{' '}
                  <span className='highlight small'>
                    (in terms of POC20 tokens)
                  </span>
                </label>
                <input
                  className='width'
                  type='number'
                  id='price'
                  name='price'
                  min={1}
                  // value={price}
                  // onChange={onChangePrice}
                />
                <button
                  className='card-buy-button width'
                  onClick={(e) => handleBuyNFT(e, nftItem)}
                >
                  Resell
                </button>
              </div>
            </div>
          )}
      </div>
      <div className='product-details-history-container'>
        {nftItem && displayHistory()}
      </div>
    </div>
  )
}

export default ProductDetails
