const { getAPI, postAPI } = require("./axios");

//home and search api calls
const getHome = () => getAPI(`home/`);
const postSearch = (data) => postAPI(`search/`, data);

//podcast api calls
const getPodcast = (podcastId) => getAPI(`podcast/${podcastId}`);

//episode api calls
const getEpisode = (episodeId) => getAPI(`episode/${episodeId}`);

export { 
    getHome,
    postSearch, 
    getPodcast,
    getEpisode,
}