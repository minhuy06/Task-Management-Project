import axios from 'axios'

// instance
const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type' : 'application/json'
    },
    timeout: 10000
})

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token')
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if(error.response && error.response.status === 401){
            console.error("Error 401: Invalid or expired token")
            localStorage.removeItem('jwt_token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)
export default axiosClient