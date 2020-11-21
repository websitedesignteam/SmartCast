const { getAPI, postAPI } = require("./axios");

//auth
const postLogin = (data) => postAPI(`/login`, data);
const postSignup = (data) => postAPI(`/signup`, data);
const postConfirmSignup = (data) => postAPI(`/confirmsignup`, data);
const postForgotPassword = (data) => postAPI(`/forgotpassword`, data);
const postConfirmPasswordReset = (data) => postAPI(`/confirmpasswordreset`, data);
const getUser = (data) => postAPI(`/getuser`, data);

//landing
const getGenres = () => getAPI(`/getallgenres`); //all genres

//podcast results (search, genre)
const getGenrePodcasts = (data) => postAPI(`/getallpodcastsofgenre`, data); //get podcasts of specific genre

//search episodes
const searchEpisodes = (data) => postAPI(`/searchepisodes`, data); 

//search podcasts
const searchPodcasts = (data) => postAPI(`/searchpodcasts`, data); 

//podcast
const getPodcast = (data) => postAPI(`/getallepisodes`, data);

//episode
const getEpisode = (data) => postAPI(`/getepisode`, data);
const postTranscribeEpisode = (data) => postAPI(`/posttranscribeepisode`, data);
const getTranscribeUpdate = (data) => postAPI(`/gettranscribeupdate`, data);

export { 
    getGenres,
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
}