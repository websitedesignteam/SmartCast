//CORS tag means there is an ISSUE with CORS policy

const { getAPI, postAPI, putAPI, PROXY_URL, API_URL } = require("./axios");

//auth
const postLogin = (data) => postAPI(`/login`, data);
const postSignup = (data) => postAPI(`/signup`, data);
const postConfirmSignup = (data) => postAPI(`/confirmsignup`, data);
const postForgotPassword = (data) => postAPI(`/forgotpassword`, data);
const postConfirmPasswordReset = (data) => postAPI(`/confirmpasswordreset`, data);
const getUser = (data) => postAPI(`/getuser`, data);
const getTokenValidation = (data) => postAPI(`/checktokenvalidity`, data);
const getNewToken = (data) => postAPI(`/refreshtoken`, data);

//landing
const getallCategories = () => getAPI(PROXY_URL+API_URL+`/getallcategories`); //CORS
const getLatestComments = () => getAPI(`/getlatestcomments`);
const getallTagsofACategory = (data) => postAPI(PROXY_URL+API_URL+'/getalltagsofacategory', data) //CORS
const getallEpisodesofATag = (data) => postAPI('/getallepisodesofatag', data)

//podcast results (search, genre)
const getGenrePodcasts = (data) => postAPI(`/getallpodcastsofgenre`, data);

//search
const searchEpisodes = (data) => postAPI(`/searchepisodes`, data); 
const searchPodcasts = (data) => postAPI(PROXY_URL+API_URL+`/searchpodcasts`, data); //CORS
const searchTags = (data) =>postAPI(PROXY_URL+API_URL+`/searchbytags`, data); //CORS

//podcast
const getPodcast = (data) => postAPI(`/getallepisodes`, data);
const postFavoritePodcast = (data) => postAPI(`/favoriteapodcast`, data);
const getAllReviews = (data) => postAPI(`/getallreviews`, data);

//episode
const getEpisode = (data) => postAPI(`/getepisode`, data);
const postTranscribeEpisode = (data) => postAPI(`/posttranscribeepisode`, data);
const getTranscribeUpdate = (data) => postAPI(`/gettranscribeupdate`, data);
const postRequestTranscription = (data) => postAPI(`/requesttranscription`, data);
const postEditTranscription = (data) => postAPI(`/edittranscription`, data);

//review
const putSubmitReview = (data) => putAPI(`/submitreview`, data);

export { 
    getallCategories,
    getallEpisodesofATag,
    getallTagsofACategory,
    getGenrePodcasts,
    searchEpisodes,
    searchPodcasts, 
    getPodcast,
    getEpisode,
    postTranscribeEpisode,
    getTranscribeUpdate,
    postLogin,
    postSignup,
    postConfirmSignup,
    getUser,
    postConfirmPasswordReset,
    postForgotPassword,
    postRequestTranscription,
    postEditTranscription,
    getTokenValidation,
    getNewToken,
    postFavoritePodcast,
    putSubmitReview,
    getLatestComments,
    getAllReviews,
    searchTags,
}