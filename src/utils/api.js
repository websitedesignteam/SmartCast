const { getAPI, postAPI } = require("./axios");

//landing
const getGenres = () => getAPI(`/getallgenres`); //all genres

//podcast results (search, genre)
const getGenrePodcasts = () => getAPI(`/getallpodcastsofgenre`); //get podcasts of specific genre

// TODO : search
// const postSearch = (data) => postAPI(`search/`, data); 

//podcast
const getPodcast = (data) => postAPI(`/getallepisodes`,  data );

// TODO : episode
// const getEpisode = (episodeId) => getAPI(`episode/${episodeId}`);

export { 
    getGenres,
    getGenrePodcasts,
    // postSearch, 
    getPodcast,
    // getEpisode,
}