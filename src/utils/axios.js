import axios from 'axios';

//check env for baseUrl
const API_URL =  ""; //put api url here

//create instance
const AxiosInstance = axios.create({
    baseURL: API_URL,  
});

const getAPI = (apiUrl) => AxiosInstance.get(apiUrl);

const postAPI = (apiUrl, data) => AxiosInstance.post(apiUrl, data);

const putAPI = (apiUrl, data) => AxiosInstance.put(apiUrl, data);

const deleteAPI = (apiUrl) => AxiosInstance.delete(apiUrl);

export { 
    postAPI,
    getAPI,
    putAPI,
    deleteAPI 
};
export default AxiosInstance;