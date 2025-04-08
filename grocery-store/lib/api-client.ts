import axios, { AxiosResponse } from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  error => {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Request failed')
    }
    throw error
  }
)

export default apiClient
