import React, { useEffect, useState } from 'react'
import { createNFT, resetCreatedNFT } from '../../../store/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import './RegisterAsset.css'
import axios from '../../../axios'
import Web3Util from '../../../utils/Web3Utils'

const web3Util = new Web3Util()

const RegisterAsset = () => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)

  const { createdNFT, userAccount } = useSelector((state) => state.user)

  const handleRegister = async (e) => {
    e.preventDefault()
    const { data: tokenId } = await axios.get('/transaction/generateNFTToken')
    const date = new Date().toDateString()

    const nft = {
      title,
      description,
      price: parseInt(price),
      tokenId,
      date,
      address: '0x85860320dE6Df0D9Bb9B6AC667D82Aa90Aee25C1',
    }

    const deployedContract = await web3Util.createNFT(
      userAccount?.publicAddress,
      nft
    )

    let name = await deployedContract.methods.name().call()
    name = name.split(' ')[0]

    const contractAddress = deployedContract.options.address

    dispatch(
      createNFT({
        name,
        contractAddress,
        owner: userAccount?.publicAddress,
        tokenId,
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
