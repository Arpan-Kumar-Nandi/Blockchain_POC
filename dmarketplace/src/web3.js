import Web3 from 'web3'

const detectCurrentProvider = () => {
  let provider

  if (window.ethereum) {
    provider = window.ethereum
  } else if (window.web3) {
    provider = window.web3.currentProvider
  } else {
    alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
  return provider
}

const initWeb3 = () => {
  const currentProvider = detectCurrentProvider()
  if (currentProvider) {
    if (currentProvider !== window.ethereum) {
      alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    }
    currentProvider.request({ method: 'eth_requestAccounts' })
    return new Web3(currentProvider)
  }
}

const web3 = initWeb3()
export default web3
