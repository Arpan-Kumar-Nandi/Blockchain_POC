import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:5555',
})

instance.interceptors.request.use((config) => {
  const userAccount = JSON.parse(localStorage.getItem('userAccount'))
  if (userAccount && userAccount.accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${userAccount.accessToken}`,
    }
  }

  return config
})

export default instance
