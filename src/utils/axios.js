import axios from 'axios';

//check env for baseUrl
const API_URL =  "https://g0rjpqharl.execute-api.us-east-1.amazonaws.com/test/"; //put api url here
const API_KEY = process.env.REACT_APP_API_KEY;
const PROXY_URL= 'https://cors-anywhere.herokuapp.com/'
//create instance
const AxiosInstance = axios.create({
    baseURL: API_URL,  
    headers : {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization' : API_KEY,
        'X-API-KEY' : API_KEY,
    }
});


const getAPI = (apiUrl) => AxiosInstance.get(apiUrl);

const postAPI = (apiUrl, data) => AxiosInstance.post(apiUrl, data);

const putAPI = (apiUrl, data) => AxiosInstance.put(apiUrl, data);

const deleteAPI = (apiUrl) => AxiosInstance.delete(apiUrl);

export { 
    postAPI,
    getAPI,
    putAPI,
    deleteAPI,
    API_URL,
    PROXY_URL,
};
export default AxiosInstance;