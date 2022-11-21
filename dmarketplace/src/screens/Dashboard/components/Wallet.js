import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  // fetchPOC20Balance,
  updatePOC20Balance,
  updateMetamaskBalance,
  // buyPOC20Tokens,
  updateTransactionStatus,
  resetTransactionStatus,
} from '../../../store/user/userSlice'
import Web3Util from '../../../utils/Web3Utils'
import './Wallet.css'

const web3Util = new Web3Util()

const Wallet = () => {
  const dispatch = useDispatch()
  const [ethersToSpend, setEthersToSpend] = useState(1)

  const { userAccount, transactionStatus, poc20balance } = useSelector(
    (state) => state.user
  )

  useEffect(() => {
    dispatch(resetTransactionStatus())
  }, [dispatch])

  const getMetamaskBalance = useCallback(async () => {
    const ethBalance = await web3Util.getMetamaskBalance(
      userAccount?.publicAddress
    )
    dispatch(updateMetamaskBalance(ethBalance))
  }, [userAccount, dispatch])

  const getPOC20Balance = useCallback(async () => {
    const poc20balance = await web3Util.getPOC20Balance(
      userAccount?.publicAddress
    )
    dispatch(updatePOC20Balance(poc20balance))
  }, [userAccount, dispatch])

  useEffect(() => {
    // dispatch(fetchPOC20Balance())
    getPOC20Balance()
    getMetamaskBalance()
  }, [transactionStatus, getMetamaskBalance, getPOC20Balance, dispatch])

  const handleBuyTokens = async (e) => {
    e.preventDefault()
    const status = await web3Util.buyPOC20Tokens(
      userAccount?.publicAddress,
      ethersToSpend
    )
    dispatch(updateTransactionStatus(status))
  }

  const onChangeEthersSpend = (e) => {
    dispatch(resetTransactionStatus())
    setEthersToSpend(e.target.value)
  }

  return (
    <section className='wallet-container'>
      <div className='wallet-transaction-container'>
        <div className='wallet-mint-container'>
          <h1>Buy POC20 Tokens</h1>
          <div className='wallet-mint-input'>
            <label htmlFor='ethersToSpend'>
              Enter ethers to buy POC20 tokens{' '}
              <span className='highlight'>(1 ETH = 10 POC20)</span>
            </label>
            <input
              type='number'
              name='ethersToSpend'
              id='ethersToSpend'
              min={1}
              className='wallet-exchange-input'
              value={ethersToSpend}
              onChange={onChangeEthersSpend}
            />
          </div>
          <button
            className='wallet-mint-input-button'
            onClick={handleBuyTokens}
          >
            Buy
          </button>
          {transactionStatus && (
            <p className='wallet-mint-success-msg'>
              Transaction Successfull. Transaction Hash:{' '}
              {transactionStatus?.transactionHash}
            </p>
          )}
        </div>
      </div>
      <div className='wallet-balance-container'>
        <h1>Poc Tokens</h1>
        <p>{poc20balance}</p>
      </div>
    </section>
  )
}

export default Wallet
