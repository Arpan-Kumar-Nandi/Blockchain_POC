import React, { Fragment, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  mintPOC20Tokens,
  fetchPOC20Balance,
  updateMetamaskBalance,
  fetchDeployedContractsToBuyFrom,
  buyPOC20Tokens,
  resetMintedContract,
  resetTransactionStatus,
} from '../../../store/user/userSlice'
import web3 from '../../../web3'
import './Wallet.css'

const Wallet = () => {
  const dispatch = useDispatch()

  const [exchangeRate, setExchangeRate] = useState(0)
  const [selectedContract, setSelectedContract] = useState(null)
  const [ethersToSpend, setEthersToSpend] = useState(1)

  const {
    mintedContract,
    userAccount,
    buyTokensFromContracts,
    transactionStatus,
    poc20balance,
  } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchDeployedContractsToBuyFrom())
  }, [dispatch])

  const getMetamaskBalance = useCallback(async () => {
    let ethBalance = await web3.eth.getBalance(userAccount.publicAddress)
    ethBalance = web3.utils.fromWei(ethBalance, 'ether')
    dispatch(updateMetamaskBalance(ethBalance))
  }, [userAccount, dispatch])

  useEffect(() => {
    dispatch(fetchDeployedContractsToBuyFrom())
    dispatch(fetchPOC20Balance())
    getMetamaskBalance()
  }, [transactionStatus, getMetamaskBalance, dispatch])

  const handleMinting = async (e) => {
    e.preventDefault()
    await dispatch(mintPOC20Tokens(exchangeRate))
    await dispatch(fetchPOC20Balance())
    let ethBalance = await web3.eth.getBalance(userAccount.publicAddress)
    ethBalance = web3.utils.fromWei(ethBalance, 'ether')
    dispatch(updateMetamaskBalance(ethBalance))
  }

  const onChangeSelectContract = (e) => {
    dispatch(resetTransactionStatus())
    setSelectedContract(e.target.value)
  }
  const displayListOfContractsToBuyFrom = () => {
    return (
      <form className='list-contracts'>
        {buyTokensFromContracts.map((item) => (
          <div
            className='list-contracts-selection-container'
            key={item.contract.contractAddress}
          >
            <input
              id={item.contract.contractAddress}
              type='radio'
              name='buytokens'
              value={item.contract.contractAddress}
              onChange={onChangeSelectContract}
            />
            <label
              htmlFor={item.contract.contractAddress}
              className='list-contracts-label'
            >
              <h2>
                {item.contract.name} is at{' '}
                <span className='highlight'>
                  {item.contract.contractAddress}
                </span>{' '}
                minted by{' '}
                <span className='highlight'>{item.contract.mintedBy}</span>
              </h2>
              <p>
                Exchange rate of ether to {item.contract.name} is{' '}
                <span className='highlight'>{item.exchangeRate}</span>
              </p>
              <p>
                Available tokens:{' '}
                <span className='highlight'>{item.balance}</span>
              </p>
            </label>
          </div>
        ))}
      </form>
    )
  }

  const handleBuyTokens = async (e) => {
    e.preventDefault()
    dispatch(
      buyPOC20Tokens({
        contractAddress: selectedContract,
        ethersToSpend,
      })
    )
  }

  const onChangeExchangeRate = (e) => {
    dispatch(resetMintedContract())
    setExchangeRate(e.target.value)
  }

  const onChangeEthersSpend = (e) => {
    dispatch(resetTransactionStatus())
    setEthersToSpend(e.target.value)
  }

  return (
    <section className='wallet-container'>
      <div className='wallet-transaction-container'>
        <div className='wallet-mint-container'>
          <h1>Mint POC20 Tokens</h1>
          <div className='wallet-mint-input'>
            <label htmlFor='exchangeRate'>Enter exchange rate</label>
            <input
              type='number'
              name='exchangeRate'
              id='exchangeRate'
              className='wallet-exchange-input'
              value={exchangeRate}
              onChange={onChangeExchangeRate}
            />
          </div>
          <button className='wallet-mint-input-button' onClick={handleMinting}>
            Mint
          </button>
          {mintedContract && (
            <p className='wallet-mint-success-msg'>
              Contract minted successfully at: {mintedContract.contractAddress}
            </p>
          )}
        </div>
        <div className='wallet-buy-container'>
          {buyTokensFromContracts.length && (
            <>
              <h1>You can buy POC20 tokens from</h1>
              {displayListOfContractsToBuyFrom()}
            </>
          )}
          {selectedContract && (
            <div className='wallet-buy-form-container'>
              <div className='wallet-buy-form-input'>
                <label htmlFor='ethersToSpend'>Enter amount of ethers</label>
                <input
                  type='number'
                  name='ethersToSpend'
                  id='ethersToSpend'
                  className='wallet-buy-input'
                  value={ethersToSpend}
                  onChange={onChangeEthersSpend}
                />
              </div>
              <button
                className='wallet-buy-form-button'
                onClick={handleBuyTokens}
              >
                Buy
              </button>
              {transactionStatus && (
                <p className='wallet-transaction-success-msg'>
                  Transaction successful. Transaction Hash:{' '}
                  {transactionStatus.transactionHash}
                </p>
              )}
            </div>
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
