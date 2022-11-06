import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  mintPOC20Tokens,
  fetchPOC20Balance,
  updateMetamaskBalance,
  fetchDeployedContractsToBuyFrom,
} from '../../../store/user/userSlice'
import web3 from '../../../web3'

const Wallet = () => {
  const dispatch = useDispatch()

  const { mintedContract, userAccount, buyTokensFromContracts } = useSelector(
    (state) => state.user
  )

  console.log(buyTokensFromContracts)

  useEffect(() => {
    dispatch(fetchDeployedContractsToBuyFrom())
  }, [dispatch])

  const handleMinting = async (e) => {
    e.preventDefault()
    await dispatch(mintPOC20Tokens())
    await dispatch(fetchPOC20Balance())
    let ethBalance = await web3.eth.getBalance(userAccount.publicAddress)
    ethBalance = web3.utils.fromWei(ethBalance, 'ether')
    dispatch(updateMetamaskBalance(ethBalance))
  }

  const displayListOfContractsToBuyFrom = () => {
    return (
      <ul>
        {buyTokensFromContracts.map((item) => (
          <li key={item.contract.contractAddress}>
            <p>
              {item.contract.name} is at {item.contract.contractAddress} minted
              by {item.contract.mintedBy}
            </p>
            <p>Available tokens: {item.balance}</p>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div>
      <button onClick={handleMinting}>Mint</button>
      {mintedContract && (
        <p>Contract minted successfully at: {mintedContract.contractAddress}</p>
      )}
      {buyTokensFromContracts.length && (
        <>
          <h2>You can buy POC tokens from</h2>
          {displayListOfContractsToBuyFrom()}
        </>
      )}
    </div>
  )
}

export default Wallet
