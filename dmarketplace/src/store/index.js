import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'

const userInfoFromStorage = localStorage.getItem('userAccount')
  ? {
      loading: false,
      userAccount: JSON.parse(localStorage.getItem('userAccount')),
      error: null,
      metamaskBalance: 0,
      poc20balance: 0,
      transactionStatus: null,
      createdNFT: null,
      myNFTList: [],
      allItemsList: [],
      nftItem: null,
    }
  : {
      loading: false,
      userAccount: null,
      error: null,
      metamaskBalance: 0,
      poc20balance: 0,
      transactionStatus: null,
      createdNFT: null,
      myNFTList: [],
      allItemsList: [],
      nftItem: null,
    }

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: {
    user: userInfoFromStorage,
  },
})

export default store
