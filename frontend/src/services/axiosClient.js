import axios from 'axios'

// instance
const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type' : 'application/json'
    },
    timeout: 10000
})

axios.interceptors.request.use(

)