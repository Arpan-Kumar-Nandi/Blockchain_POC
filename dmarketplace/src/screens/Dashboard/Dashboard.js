import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router'
import {
  logout,
  updateMetamaskBalance,
  updatePOC20Balance,
} from '../../store/user/userSlice'
import mainlogo from '../../assets/mainlogo.png'
import './Dashboard.css'
import {
  MdAccountBalanceWallet,
  MdOutlinePowerSettingsNew,
} from 'react-icons/md'
import Web3Util from '../../utils/Web3Utils'

const web3Util = new Web3Util()

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userAccount, metamaskBalance, poc20balance } = useSelector(
    (state) => state.user
  )

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
    !userAccount && navigate('/login')
    //dispatch(fetchPOC20Balance())
    getPOC20Balance()
    getMetamaskBalance()
  }, [userAccount, navigate, getMetamaskBalance, getPOC20Balance])

  const onDisconnect = async () => {
    dispatch(logout())
    navigate('/dashboard/home')
  }
  return (
    <>
      <header className='dashboard-header'>
        <section
          className='dashboard-header-logo-container'
          onClick={() => navigate('/dashboard/home')}
        >
          <img
            src={mainlogo}
            alt='mainlogo'
            className='dashboard-header-logo'
          />
          <span className='dashboard-header-logo-title'>DMarketplace</span>
        </section>
        <section className='dashboard-header-user-info-container'>
          <div
            className='dashboard-header-user-info-user-details'
            onClick={() => navigate('/dashboard/account/register')}
          >
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
      <main className='main-dashboard-container'>
        <Outlet />
      </main>
    </>
  )
}

export default Dashboard
