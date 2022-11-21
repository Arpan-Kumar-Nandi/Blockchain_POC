import axios from '../../axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchUserDetails = createAsyncThunk(
  'user/whoami',
  async ({ metamaskBalance, poc20balance, chainId, accessToken }, thunkAPI) => {
    try {
      const { data } = await axios.get('/user/whoami', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      Object.assign(data, { chainId })
      const userAccount = {
        ...data,
        accessToken,
      }
      localStorage.setItem('userAccount', JSON.stringify(userAccount))

      return { data, metamaskBalance, poc20balance }
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message ?? err.message)
    }
  }
)

// export const fetchPOC20Balance = createAsyncThunk(
//   'user/POC20Balance',
//   async (_, thunkAPI) => {
//     try {
//       const { data } = await axios.get('/user/getpoc20balance')
//       return data
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data.message ?? err.message)
//     }
//   }
// )

// export const buyPOC20Tokens = createAsyncThunk(
//   'user/buyPOC20Tokens',
//   async ({ ethersToSpend }, thunkAPI) => {
//     try {
//       const { data } = await axios.post('/transaction/buyPOC20Tokens', {
//         ethersToSpend,
//       })
//       return data
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data.message ?? err.message)
//     }
//   }
// )

export const createNFT = createAsyncThunk(
  'user/createNFT',
  async (productDetails, thunkAPI) => {
    try {
      const { data } = await axios.post('/transaction/createNFT', {
        ...productDetails,
      })
      return data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message ?? err.message)
    }
  }
)

export const fetchMyNFTS = createAsyncThunk(
  'user/fetchMyNFTS',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/transaction/fetchMyNFTS')
      return data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message ?? err.message)
    }
  }
)

export const fetchAllItems = createAsyncThunk(
  'user/fetchAllItems',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/transaction/fetchAllItems')
      return data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message ?? err.message)
    }
  }
)

export const buyNFTToken = createAsyncThunk(
  'user/buyNFTToken',
  async ({ contractAddress, tokenId, price }, thunkAPI) => {
    try {
      const { data } = await axios.post('/transaction/buyNFTToken', {
        contractAddress,
        tokenId,
        price,
      })
      await thunkAPI.dispatch(fetchAllItems())
      //await thunkAPI.dispatch(fetchPOC20Balance())
      return data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message ?? err.message)
    }
  }
)

export const resellNFTToken = createAsyncThunk(
  'user/resellNFTToken',
  async ({ contractAddress, tokenId, price }, thunkAPI) => {
    try {
      const { data } = await axios.post('/transaction/resellNFTToken', {
        contractAddress,
        tokenId,
        price,
      })
      await thunkAPI.dispatch(fetchAllItems())
      return data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message ?? err.message)
    }
  }
)

export const fetchNFTItemDetails = createAsyncThunk(
  'user/fetchNFTItemDetails',
  async ({ contractAddress, tokenId }, thunkAPI) => {
    try {
      const { data } = await axios.post('/transaction/fetchNFTItemDetails', {
        contractAddress,
        tokenId,
      })
      return data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message ?? err.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    userAccount: null,
    metamaskBalance: 0,
    poc20balance: 0,
    error: null,
    transactionStatus: null,
    createdNFT: null,
    myNFTList: [],
    allItemsList: [],
    nftItem: null,
  },
  reducers: {
    logout(state) {
      state.loading = false
      state.userAccount = null
      state.error = null
      localStorage.removeItem('userAccount')
    },
    updateMetamaskBalance(state, action) {
      state.metamaskBalance = action.payload
    },
    updatePOC20Balance(state, action) {
      state.poc20balance = action.payload
    },
    updateTransactionStatus(state, action) {
      state.transactionStatus = action.payload
    },
    resetTransactionStatus(state) {
      state.transactionStatus = null
    },
    resetCreatedNFT(state) {
      state.resetCreatedNFT = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false
        state.userAccount = action.payload.data
        state.metamaskBalance = action.payload.metamaskBalance
        state.poc20balance = action.payload.poc20balance
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // .addCase(fetchPOC20Balance.pending, (state) => {
      //   state.loading = true
      //   state.error = null
      // })
      // .addCase(fetchPOC20Balance.fulfilled, (state, action) => {
      //   state.loading = false
      //   state.poc20balance = action.payload
      // })
      // .addCase(fetchPOC20Balance.rejected, (state, action) => {
      //   state.loading = false
      //   state.error = action.payload
      // })
      // .addCase(buyPOC20Tokens.pending, (state) => {
      //   state.loading = true
      //   state.error = null
      // })
      // .addCase(buyPOC20Tokens.fulfilled, (state, action) => {
      //   state.loading = false
      //   state.transactionStatus = action.payload
      // })
      // .addCase(buyPOC20Tokens.rejected, (state, action) => {
      //   state.loading = false
      //   state.error = action.payload
      // })
      .addCase(createNFT.pending, (state) => {
        state.loading = true
        state.error = null
        state.createdNFT = null
      })
      .addCase(createNFT.fulfilled, (state, action) => {
        state.loading = false
        state.createdNFT = action.payload
      })
      .addCase(createNFT.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.createdNFT = null
      })
      .addCase(fetchMyNFTS.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyNFTS.fulfilled, (state, action) => {
        state.loading = false
        state.myNFTList = action.payload
      })
      .addCase(fetchMyNFTS.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.myNFTList = null
      })
      .addCase(fetchAllItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.loading = false
        state.allItemsList = action.payload
      })
      .addCase(fetchAllItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.allItemsList = []
      })
      .addCase(fetchNFTItemDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNFTItemDetails.fulfilled, (state, action) => {
        state.loading = false
        state.nftItem = action.payload
      })
      .addCase(fetchNFTItemDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.nftItem = null
      })
  },
})

export const {
  logout,
  updateMetamaskBalance,
  updatePOC20Balance,
  updateTransactionStatus,
  resetCreatedNFT,
  resetTransactionStatus,
} = userSlice.actions
export default userSlice.reducer
