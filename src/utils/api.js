const { getAPI, postAPI } = require("./axios");

//landing
const getGenres = () => getAPI(`/getallgenres`); //all genres

//podcast results (search, genre)
const getGenrePodcasts = (data) => getAPI(`/getallpodcastsofgenre`, data); //get podcasts of specific genre

// TODO : search
// const postSearch = (data) => postAPI(`search/`, data); 

//podcast
const getPodcast = (data) => postAPI(`/getallepisodes`, data );

// episode
const getEpisode = (data) => postAPI(`/getepisode`, data);

export { 
    getGenres,
    getGenrePodcasts,
    // postSearch, 
    getPodcast,
    getEpisode,
}