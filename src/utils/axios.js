import axios from 'axios';

//check env for baseUrl
// const API_URL = "https://3ph6j09fna.execute-api.us-east-2.amazonaws.com/develop/helloWorld";
const API_URL =  "https://g0rjpqharl.execute-api.us-east-1.amazonaws.com/test"; //put api url here
const API_KEY = process.env.REACT_APP_API_KEY;
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

//create instance
const AxiosInstance = axios.create({
    baseURL: API_URL,  
    headers : {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "Authorization" : API_KEY,
    }
    //     // 'X-API-KEY': API_KEY,
    //     'Authorization': 'Basic ' + API_KEY,
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET,OPTIONS'
    // }
});

// AxiosInstance.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
// AxiosInstance.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

//authtoken in header
AxiosInstance.interceptors.request.use((config) => {
    config.headers.Authorization = API_KEY;
    // config.headers.crossorigin = true;
    return config;
});

const getAPI = (apiUrl, data) => AxiosInstance.get(apiUrl, data);

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