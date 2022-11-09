import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchPOC20Balance,
  updateMetamaskBalance,
  buyPOC20Tokens,
  resetTransactionStatus,
} from '../../../store/user/userSlice'
import web3 from '../../../web3'
import './Wallet.css'

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
    let ethBalance = await web3.eth.getBalance(userAccount.publicAddress)
    ethBalance = web3.utils.fromWei(ethBalance, 'ether')
    dispatch(updateMetamaskBalance(ethBalance))
  }, [userAccount, dispatch])

  useEffect(() => {
    dispatch(fetchPOC20Balance())
    getMetamaskBalance()
  }, [transactionStatus, getMetamaskBalance, dispatch])

  const handleBuyTokens = async (e) => {
    e.preventDefault()
    dispatch(
      buyPOC20Tokens({
        ethersToSpend,
      })
    )
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
