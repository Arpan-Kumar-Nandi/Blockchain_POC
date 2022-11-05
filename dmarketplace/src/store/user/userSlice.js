import axios from '../../axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchUserDetails = createAsyncThunk(
  'user/whoami',
  async ({ metamaskBalance, chainId, accessToken }, thunkAPI) => {
    console.log(accessToken)
    try {
      const { data } = await axios.get('/user/whoami', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      Object.assign(data, { metamaskBalance, chainId })
      const userAccount = {
        ...data,
        accessToken,
      }
      localStorage.setItem('userAccount', JSON.stringify(userAccount))
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
    error: null,
  },
  reducers: {
    logout(state) {
      state.loading = false
      state.userAccount = null
      state.error = null
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
        state.userAccount = action.payload
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout } = userSlice.actions
export default userSlice.reducer
