const { getAPI, postAPI , putAPI} = require("./axios");

//auth
const postLogin = (data) => postAPI(`/login`, data);
const postSignup = (data) => postAPI(`/signup`, data);
const postConfirmSignup = (data) => postAPI(`/confirmsignup`, data);
const postForgotPassword = (data) => postAPI(`/forgotpassword`, data);
const postConfirmPasswordReset = (data) => postAPI(`/confirmpasswordreset`, data);
const getUser = (data) => postAPI(`/getuser`, data);

//landing
const getallCategories = () => getAPI( `/getallcategories`); //all categories

const getallTagsofACategory = (data) => postAPI('/getalltagsofacategory', data)
const getallEpisodesofATag = (data) => postAPI('/getallepisodesofatag', data)

//podcast results (search, genre)
const getGenrePodcasts = (data) => postAPI(`/getallpodcastsofgenre`, data); //get podcasts of specific genre

//search episodes
const searchEpisodes = (data) => postAPI(`/searchepisodes`, data); 

//search podcasts
const searchPodcasts = (data) => postAPI(`/searchpodcasts`, data); 

//search by ML tags
const searchByTags = (data) => postAPI(`/searchbytags`, data);

//podcast
const getPodcast = (data) => postAPI(`/getallepisodes`, data);

const getRequestedTranscriptions = (data) => postAPI(`/getrequestedtranscriptions`, data)

const getRequestedEdits = (data) => postAPI(`/getrequestededits`, data)

const getLatestComments = () => getAPI(`/getlatestcomments`)

const changePassword = (data) => postAPI(`/confirmpasswordreset`, data)

const emailPassword = (data) => postAPI(`/forgotpassword`, data)

const favoriteAPodcast = (data) => postAPI(`/favoriteapodcast`, data)

const updateBio = (data)=> putAPI(`/updatebio`, data)

const updateProfilePicture = (data)=> putAPI(`/updateprofilepicture`, data)

//episode
const getEpisode = (data) => postAPI(`/getepisode`, data);
const postTranscribeEpisode = (data) => postAPI(`/posttranscribeepisode`, data);
const getTranscribeUpdate = (data) => postAPI(`/gettranscribeupdate`, data);

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
    searchByTags,
    getRequestedTranscriptions,
    getRequestedEdits,
    getLatestComments,
    changePassword,
    emailPassword,
    favoriteAPodcast,
    updateBio,
    updateProfilePicture
}