import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AUTH_TOKEN} from "../constants/Keys";

const api = axios.create({
    baseURL: 'http://7a7e-102-244-223-19.ngrok.io/api',
});

api.interceptors.request.use(
    async (config) => {
        // Exclude the login request from having the token added in the header
        if (config.url && config.url.includes('/authenticate')) {
            return config;
        }

        const token = await AsyncStorage.getItem(AUTH_TOKEN); // Replace 'userToken' with your token key
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// Request interceptor
api.interceptors.request.use(
    (request) => {
       // console.log('Starting Request', JSON.stringify(request, null, 2))
        return request
    },
    (error) => {
      // console.log('Request Error', error)
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    (response) => {
     //console.log('Response:', JSON.stringify(response, null, 2))
        return response
    },
    (error) => {
     //   console.log('Response Error', error)
        return Promise.reject(error)
    }
)



export default api;
