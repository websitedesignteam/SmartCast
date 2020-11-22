const { getAPI, postAPI } = require("./axios");
const PROXY = 'https://cors-anywhere.herokuapp.com/'
const APIURL = 'https://g0rjpqharl.execute-api.us-east-1.amazonaws.com/test'
//landing
const getallCategories = () => getAPI(PROXY + APIURL+ `/getallcategories`); //all categories

const getallTagsofACategory = (data) => postAPI('/getalltagsofacategory', data)
const getallEpisodesofATag = (data) => postAPI('/getallepisodesofatag', data)

//podcast results (search, genre)
const getGenrePodcasts = (data) => postAPI(`/getallpodcastsofgenre`, data); //get podcasts of specific genre

//search episodes
const searchEpisodes = (data) => postAPI(`searchepisodes/`, data); 

//search podcasts
const searchPodcasts = (data) => postAPI(`searchpodcasts/`, data); 

//podcast
const getPodcast = (data) => postAPI(`/getallepisodes`, data );

// episode
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
}