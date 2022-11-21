import React, { useEffect, useState } from 'react'
import web3 from '../../web3'
import axios from '../../axios'
import metamask from '../../assets/metamask-icon.png'
import './Login.css'
import { fetchUserDetails } from '../../store/user/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { MdEast } from 'react-icons/md'
import Web3Util from '../../utils/Web3Utils'

const web3Util = new Web3Util()

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)
  const [username, setUsername] = useState('')
  const [publicWalletAddress, setPublicWalletAddress] = useState('')
  const [ethBalance, setEthBalance] = useState('')
  const [poc20balance, setPoc20Balance] = useState('')
  const [chainId, setChainId] = useState('')

  const { userAccount } = useSelector((state) => state.user)

  useEffect(() => {
    userAccount && navigate('/dashboard/home')
  }, [userAccount, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const accounts = await web3.eth.getAccounts()
      const chainId = await web3.eth.getChainId()
      const ethBalance = await web3Util.getMetamaskBalance(accounts[0])
      const poc20balance = await web3Util.getPOC20Balance(accounts[0])
      setChainId(chainId)
      setEthBalance(ethBalance)
      setPoc20Balance(poc20balance)
      setPublicWalletAddress(accounts[0])

      const { data: user } = await axios.get(
        `/user/finduser?publicAddress=${accounts[0]}`
      )
      if (!user) {
        setIsFirstTimeUser(true)
      } else {
        const signature = await handleSignMessage(accounts[0], user.nonce)
        const accessToken = await handleAuthenticate(accounts[0], signature)
        saveUserInfo(ethBalance, poc20balance, chainId, accessToken)
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      )
    }
  }

  const signUpUser = async (e) => {
    e.preventDefault()
    const { data: user } = await axios.post('/user/signup', {
      username,
      publicAddress: publicWalletAddress,
    })
    const signature = await handleSignMessage(publicWalletAddress, user.nonce)
    const accessToken = await handleAuthenticate(publicWalletAddress, signature)
    saveUserInfo(ethBalance, poc20balance, chainId, accessToken)
  }

  const handleSignMessage = async (publicAddress, nonce) => {
    return web3.eth.personal.sign(
      `I am signing my one-time nonce: ${nonce}`,
      web3.utils.toChecksumAddress(publicAddress),
      (err, signature) => {
        if (err) return err
        return signature
      }
    )
  }

  const handleAuthenticate = async (publicAddress, signature) => {
    const {
      data: { access_token },
    } = await axios.post('/user/signin', {
      publicAddress,
      signature,
    })
    return access_token
  }

  const saveUserInfo = (
    metamaskBalance,
    poc20TokenBalance,
    chainId,
    accessToken
  ) => {
    dispatch(
      fetchUserDetails({
        metamaskBalance,
        poc20TokenBalance,
        chainId,
        accessToken,
      })
    )
  }

  return (
    <article className='login-screen'>
      <header className='login-header-container'>
        <h2 className='login-header-text'>
          Welcome to Decentralized Market Place
        </h2>
      </header>
      <section className='login-card-container'>
        <p className='login-card-heading'>Let's log you in</p>
        <button onClick={handleLogin} className='login-card-button-metamask'>
          <img
            src={metamask}
            alt='icon'
            className='login-card-button-metamask-logo'
          />
          <span className='login-card-button-text'>Login with metamask</span>
        </button>
        {isFirstTimeUser && (
          <section className='login-card-sign-up-container'>
            <p className='login-card-sign-up-container-text'>Please signup</p>
            <input
              placeholder='username'
              className='login-card-sign-up-container-input'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button
              onClick={signUpUser}
              className='login-card-sign-up-container-button'
            >
              <MdEast className='icon' />
            </button>
          </section>
        )}
      </section>
    </article>
  )
}

export default Login
