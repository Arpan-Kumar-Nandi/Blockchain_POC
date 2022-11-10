import React, { useEffect, useState } from 'react'
import { createNFT, resetCreatedNFT } from '../../../store/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import './RegisterAsset.css'

const RegisterAsset = () => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)

  const { createdNFT } = useSelector((state) => state.user)

  const handleRegister = (e) => {
    e.preventDefault()
    dispatch(
      createNFT({
        title,
        description,
        price: parseInt(price),
      })
    )
  }

  useEffect(() => {
    setTitle('')
    setDescription('')
    setPrice(0)
  }, [createdNFT])

  const onChangeTitle = (e) => {
    dispatch(resetCreatedNFT())
    setTitle(e.target.value)
  }

  const onChangeDescription = (e) => {
    dispatch(resetCreatedNFT())
    setDescription(e.target.value)
  }

  const onChangePrice = (e) => {
    dispatch(resetCreatedNFT())
    setPrice(e.target.value)
  }

  return (
    <div className='register-asset-container'>
      <h1 className='nft-heading'>Enter item details and create a NFT</h1>
      <form onSubmit={handleRegister} className='nft-form'>
        <div className='nft-form-field'>
          <label htmlFor='title'>Title of the Product</label>
          <input
            type='text'
            id='title'
            name='title'
            value={title}
            onChange={onChangeTitle}
          />
        </div>
        <div className='nft-form-field'>
          <label htmlFor='price'>
            Price{' '}
            <span className='highlight small'>(in terms of POC20 tokens)</span>
          </label>
          <input
            type='number'
            id='price'
            name='price'
            min={1}
            value={price}
            onChange={onChangePrice}
          />
        </div>
        <div className='nft-form-field'>
          <label htmlFor='description'>Brief description of the Product</label>
          <textarea
            type='text'
            rows={7}
            id='description'
            name='description'
            value={description}
            onChange={onChangeDescription}
          />
        </div>

        <div className='nft-form-field'>
          <button>Create NFT</button>
        </div>
        {createdNFT && (
          <p className='nft-form-success'>
            NFT token minted successfully. Unique tokenId is{' '}
            {createdNFT?.tokenId} created at {createdNFT?.contractAddress}
          </p>
        )}
      </form>
    </div>
  )
}

export default RegisterAsset
