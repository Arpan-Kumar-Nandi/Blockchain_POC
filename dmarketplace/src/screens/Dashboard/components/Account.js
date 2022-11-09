import React from 'react'
import { Outlet, useNavigate } from 'react-router'
import './Account.css'

const Account = () => {
  const navigate = useNavigate()

  return (
    <article className='account'>
      <section className='account-sidebar'>
        <button onClick={() => navigate('/dashboard/account/register')}>
          Register Asset
        </button>
        <button onClick={() => navigate('/dashboard/account/myitems')}>
          My Items
        </button>
      </section>
      <section className='account-outlet'>
        <Outlet />
      </section>
    </article>
  )
}

export default Account
