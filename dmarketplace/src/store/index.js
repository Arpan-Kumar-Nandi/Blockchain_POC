import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'

const userInfoFromStorage = localStorage.getItem('userAccount')
  ? {
      loading: false,
      userAccount: JSON.parse(localStorage.getItem('userAccount')),
      error: null,
    }
  : {
      loading: false,
      userAccount: null,
      error: null,
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
