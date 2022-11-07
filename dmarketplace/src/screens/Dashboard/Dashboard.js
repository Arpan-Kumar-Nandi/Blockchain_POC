import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router'
import {
  logout,
  updateMetamaskBalance,
  fetchPOC20Balance,
} from '../../store/user/userSlice'
import mainlogo from '../../assets/mainlogo.png'
import './Dashboard.css'
import {
  MdAccountBalanceWallet,
  MdOutlinePowerSettingsNew,
} from 'react-icons/md'
import web3 from '../../web3'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userAccount, metamaskBalance, poc20balance } = useSelector(
    (state) => state.user
  )

  const getMetamaskBalance = useCallback(async () => {
    let ethBalance = await web3.eth.getBalance(userAccount.publicAddress)
    ethBalance = web3.utils.fromWei(ethBalance, 'ether')

    dispatch(updateMetamaskBalance(ethBalance))
  }, [userAccount, dispatch])

  useEffect(() => {
    !userAccount && navigate('/login')
    dispatch(fetchPOC20Balance())
    getMetamaskBalance()
  }, [userAccount, navigate, getMetamaskBalance, dispatch])

  const onDisconnect = async () => {
    dispatch(logout())
    navigate('/dashboard')
  }
  return (
    <>
      <header className='dashboard-header'>
        <section
          className='dashboard-header-logo-container'
          onClick={() => navigate('/dashboard')}
        >
          <img
            src={mainlogo}
            alt='mainlogo'
            className='dashboard-header-logo'
          />
          <span className='dashboard-header-logo-title'>DMarketplace</span>
        </section>
        <section className='dashboard-header-user-info-container'>
          <div className='dashboard-header-user-info-user-details'>
            <h4>Hello {userAccount?.username}</h4>
            <p>{userAccount?.publicAddress}</p>
          </div>
          <div
            className='dashboard-header-user-info-wallet-details'
            onClick={() => navigate('/dashboard/wallet')}
          >
            <MdAccountBalanceWallet className='dashboard-header-user-info-wallet-details-icon' />
            <p className='metamaskbalance'>
              Account Balance: {metamaskBalance}{' '}
              <span className='balance-unit'>ETH</span>
            </p>
            <p>POC20 Balance: {poc20balance} </p>
          </div>
          <MdOutlinePowerSettingsNew
            className='logout-button'
            onClick={onDisconnect}
          />
        </section>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Dashboard
