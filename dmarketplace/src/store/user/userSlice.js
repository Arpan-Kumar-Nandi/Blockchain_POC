import axios from '../../axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchUserDetails = createAsyncThunk(
  'user/whoami',
  async ({ metamaskBalance, chainId, accessToken }, thunkAPI) => {
    try {
      const { data } = await axios.get('/user/whoami', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const { data: poc20balance } = await axios.get('/user/getpoc20balance', {
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

export const fetchPOC20Balance = createAsyncThunk(
  'user/POC20Balance',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/user/getpoc20balance')
      return data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message ?? err.message)
    }
  }
)

export const mintPOC20Tokens = createAsyncThunk(
  'user/mintPOC20Tokens',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/transaction/mintPOC20Tokens')
      return data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message ?? err.message)
    }
  }
)

export const fetchDeployedContractsToBuyFrom = createAsyncThunk(
  'user/fetchDeployedContractsToBuyFrom',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(
        '/transaction/fetchDeployedContractsToBuyFrom'
      )
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
    mintedContract: null,
    error: null,
    buyTokensFromContracts: [],
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
      .addCase(fetchPOC20Balance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPOC20Balance.fulfilled, (state, action) => {
        state.loading = false
        state.poc20balance = action.payload
      })
      .addCase(fetchPOC20Balance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(mintPOC20Tokens.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(mintPOC20Tokens.fulfilled, (state, action) => {
        state.loading = false
        state.mintedContract = action.payload
      })
      .addCase(mintPOC20Tokens.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchDeployedContractsToBuyFrom.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDeployedContractsToBuyFrom.fulfilled, (state, action) => {
        state.loading = false
        state.buyTokensFromContracts = action.payload
      })
      .addCase(fetchDeployedContractsToBuyFrom.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, updateMetamaskBalance } = userSlice.actions
export default userSlice.reducer
