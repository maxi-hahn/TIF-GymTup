import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// TODO: Attach the JWT token from AuthContext or localStorage to the
// Authorization header before every outgoing request.
axiosClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

// TODO: Intercept 401 Unauthorized responses globally and redirect the user
// to the login page or trigger a token refresh flow.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default axiosClient
