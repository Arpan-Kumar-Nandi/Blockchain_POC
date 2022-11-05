import React, { useState, useEffect } from 'react'
import web3 from '../../web3'
import axios from '../../axios'
import metamask from '../../assets/metamask-icon.png'
import './Login.css'
import { fetchUserDetails } from '../../store/user/userSlice'
import { useSelector, useDispatch } from 'react-redux'

const Login = () => {
  const dispatch = useDispatch()
  const { loading, userAccount, error } = useSelector((state) => state.user)

  const [isConnected, setIsConnected] = useState(false)
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false)
  const [username, setUsername] = useState('')
  const [publicWalletAddress, setPublicWalletAddress] = useState('')
  const [ethBalance, setEthBalance] = useState('')
  const [chainId, setChainId] = useState('')
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    const checkConnectedWallet = () => {
      // const userData = JSON.parse(localStorage.getItem('userAccount'))
      // if (userData != null) {
      //   setUserInfo(userData)
      //   setIsConnected(true)
      // }
    }
    checkConnectedWallet()
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const accounts = await web3.eth.getAccounts()
      const chainId = await web3.eth.getChainId()
      let ethBalance = await web3.eth.getBalance(accounts[0])
      ethBalance = web3.utils.fromWei(ethBalance, 'ether')
      setChainId(chainId)
      setEthBalance(ethBalance)
      setPublicWalletAddress(accounts[0])

      const { data: user } = await axios.get(
        `/user/finduser?publicAddress=${accounts[0]}`
      )
      if (!user) {
        setIsFirstTimeUser(true)
      } else {
        const signature = await handleSignMessage(accounts[0], user.nonce)
        const accessToken = await handleAuthenticate(accounts[0], signature)
        saveUserInfo(ethBalance, accounts[0], chainId, accessToken)
      }
    } catch (err) {
      console.log(err)
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
    saveUserInfo(ethBalance, publicWalletAddress, chainId, accessToken)
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

  const saveUserInfo = (metamaskBalance, account, chainId, accessToken) => {
    // const userAccount = {
    //   account: account,
    //   balance: ethBalance,
    //   connectionid: chainId,
    //   access_token,
    // }
    // window.localStorage.setItem('userAccount', JSON.stringify(userAccount)) //user persisted data
    dispatch(fetchUserDetails({ metamaskBalance, chainId, accessToken }))
    // setUserInfo(userData)
    setIsConnected(true)
  }

  const onDisconnect = async () => {
    await axios.get(`/user/logout`)
    window.localStorage.removeItem('userAccount')
    setUserInfo({})
    setIsConnected(false)
    setIsFirstTimeUser(false)
  }

  return (
    <article>
      <header>Welcome to Decentralized Market Place</header>

      <button onClick={handleLogin}>
        <img src={metamask} alt='icon' />
        Login with metamask
      </button>
      {isConnected ? (
        <section>
          <div className='app-details'>
            <h2>✅ You are connected to metamask.</h2>
            <div className='app-account'>
              <span>Account number:</span>
              {userInfo.account}
            </div>
            <div className='app-balance'>
              <span>Balance:</span>
              {userInfo.balance}
            </div>
            <div className='app-connectionid'>
              <span>Connection ID:</span>
              {userInfo.connectionid}
            </div>
          </div>
        </section>
      ) : (
        isFirstTimeUser && (
          <section>
            <form>
              <label htmlFor='username'>Username</label>
              <input
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <button onClick={signUpUser}>Continue</button>
            </form>
          </section>
        )
      )}
      <section>
        <button onClick={onDisconnect}>Logout</button>
      </section>
    </article>
  )
}

export default Login
