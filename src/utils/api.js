const { getAPI, postAPI } = require("./axios");

//landing
const getGenres = () => getAPI(`/getallgenres`); //all genres

//podcast results (search, genre)
const getGenrePodcasts = (data) => postAPI(`/getallpodcastsofgenre`, data); //get podcasts of specific genre

//search episodes
const searchEpisodes = (data) => postAPI(`searchepisodes/`, data); 

//search podcasts
const searchPodcasts = (data) => postAPI(`searchpodcasts/`, data); 

//podcast
const getPodcast = (data) => postAPI(`/getallepisodes`,  data );

// TODO : episode
// const getEpisode = (episodeId) => getAPI(`episode/${episodeId}`);

export { 
    getGenres,
    getGenrePodcasts,
    searchEpisodes,
    searchPodcasts, 
    getPodcast,
    // getEpisode,
}