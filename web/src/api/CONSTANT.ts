import axios from "axios";
import {useApiKeyStore} from "@/store/apiKeyStore.ts";

export const axiosInstance = axios.create({
    baseURL: 'https://api.lachs.rsbit.eu',
   // baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
})


axiosInstance.interceptors.request.use(
    (config) => {
        config.headers = {
            Authorization: `${useApiKeyStore.getState().apiKey}`,
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        useApiKeyStore.getState().setValid(true)
        return response
    },
    (error) => {
        if(error.response.status === 401) {
            useApiKeyStore.getState().setValid(false)
        }
        return Promise.reject(error)
    }
)