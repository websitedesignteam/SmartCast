//CORS tag means there is an ISSUE with CORS policy

const { getAPI, postAPI, putAPI, PROXY_URL, API_URL } = require("./axios");

//auth
const postLogin = (data) => postAPI(`/login`, data); //CORS
const postSignup = (data) => postAPI(`/signup`, data);
const postConfirmSignup = (data) => postAPI(`/confirmsignup`, data);
const postForgotPassword = (data) => postAPI(`/forgotpassword`, data);
const postConfirmPasswordReset = (data) => postAPI(`/confirmpasswordreset`, data);
const getUser = (data) => postAPI(`/getuser`, data); //CORS
const getTokenValidation = (data) => postAPI(`/checktokenvalidity`, data);
const getNewToken = (data) => postAPI(`/refreshtoken`, data);

//landing
const getallCategories = () => getAPI(`/getallcategories`); //CORS
const getLatestComments = () => getAPI(`/getlatestcomments`);
const getallTagsofACategory = (data) => postAPI('/getalltagsofacategory', data); //CORS
const getallEpisodesofATag = (data) => postAPI('/getallepisodesofatag', data); //CORS

//podcast results (search, genre)
const getGenrePodcasts = (data) => postAPI(`/getallpodcastsofgenre`, data);

//search
const searchEpisodes = (data) => postAPI(`/searchepisodes`, data); 
const searchPodcasts = (data) => postAPI(`/searchpodcasts`, data); //CORS
const searchTags = (data) =>postAPI(`/searchbytags`, data); //CORS

//podcast
const getPodcast = (data) => postAPI(`/getallepisodes`, data); //CORS
const postFavoritePodcast = (data) => postAPI(`/favoriteapodcast`, data);
const getAllReviews = (data) => postAPI(`/getallreviews`, data);

//profile
const getRequestedTranscriptions = (data) => postAPI(`/getrequestedtranscriptions`, data)
const getRequestedEdits = (data) => postAPI(`/getrequestededits`, data)
const changePassword = (data) => postAPI(`/confirmpasswordreset`, data)
const emailPassword = (data) => postAPI(`/forgotpassword`, data)
const favoriteAPodcast = (data) => postAPI(`/favoriteapodcast`, data)
const updateBio = (data)=> putAPI(`/updatebio`, data)
const updateProfilePicture = (data)=> putAPI(`/updateprofilepicture`, data)
const getAllUsers = (data) => postAPI(`/getallusers`, data)
const changeStatus = (data) => postAPI(`/changestatus`, data)
const approveEdits = (data) => postAPI( `/approveedits`, data)

//episode
const getEpisode = (data) => postAPI('/getepisode', data);
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
    getRequestedTranscriptions,
    getRequestedEdits,
    changePassword,
    emailPassword,
    favoriteAPodcast,
    updateBio,
    updateProfilePicture,
    getAllUsers,
    changeStatus,
    approveEdits
}