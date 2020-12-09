const baseUrl = process.env.PUBLIC_URL;
const errorDefault = "We're sorry, but something wrong happened! We are working to resolve the issue.";
const errorSearch = "Sorry! We don't have any results related to your search. Try a different search term, or search with all episodes or podcasts instead!";
const errorEpisode = "Sorry! We couldn't find that episode.";
const errorTranscribe = "Sorry! We couldn't transcribe that episode.";
const errorPodcast = "Sorry! We couldn't find that podcast.";
const errorFavoritePodcast = "Please make sure the nickname doesn't match the podcast name!"
const errorSessionExpired = "Your session has expired. Please login again.";
const errorTooBusy = "We are experiencing a high amount of traffic. Thank you for your patience!";
const podcastDisclaimer = "You might be wondering why we are doing this! We are a free service powered by Listen Notes with restrictions on what kind of data we can keep. We hope you can understand!"
const podcastCommands = {
    "favorite":"add", 
    "unfavorite":"remove"
}
const searchTypes = ["tags", "podcasts", "episodes"]

//colors
const yellow = "#ffd726";
const gray = "#6b6b6b";

export {
    baseUrl,
    errorEpisode,
    errorTranscribe,
    errorPodcast,
    errorDefault,
    podcastCommands,
    errorFavoritePodcast,
    podcastDisclaimer,
    yellow,
    gray,
    searchTypes,
    errorSearch,
    errorSessionExpired,
    errorTooBusy,
};

export default {
    baseUrl,
    errorEpisode,
    errorTranscribe,
    errorPodcast,
    errorDefault,
    podcastCommands,
    errorFavoritePodcast,
    podcastDisclaimer,
    yellow,
    gray,
    searchTypes,
    errorSearch,
    errorSessionExpired,
    errorTooBusy,
};