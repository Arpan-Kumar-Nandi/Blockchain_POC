import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App'
import Login from './screens/Login/Login'
import reportWebVitals from './reportWebVitals'
import './index.css'
import store from './store/index'
import Dashboard from './screens/Dashboard/Dashboard'
import Wallet from './screens/Dashboard/components/Wallet'
import Home from './screens/Dashboard/components/Home'
import Account from './screens/Dashboard/components/Account'
import RegisterAsset from './screens/Dashboard/components/RegisterAsset'
import MyItems from './screens/Dashboard/components/MyItems'
import ProductDetails from './screens/Dashboard/components/ProductDetails'

const container = document.getElementById('root')
const root = createRoot(container)

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      {
        path: 'wallet',
        element: <Wallet />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'product/:id',
        element: <ProductDetails />,
      },
      {
        path: 'account',
        element: <Account />,
        children: [
          {
            path: 'register',
            element: <RegisterAsset />,
          },
          {
            path: 'myitems',
            element: <MyItems />,
          },
          {
            path: 'product/:id',
            element: <ProductDetails />,
          },
        ],
      },
    ],
  },
])

// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>
// );
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
