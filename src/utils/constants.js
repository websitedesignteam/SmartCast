const baseUrl = process.env.PUBLIC_URL;
const errorDefault = "We're sorry, but something wrong happened! We are working to resolve the issue.";
const errorEpisode = "Sorry! We couldn't find that episode.";
const errorTranscribe = "Sorry! We couldn't transcribe that episode.";
const errorPodcast = "Sorry! We couldn't find that podcast.";
const errorFavoritePodcast = "Please make sure the nickname doesn't match the podcast name!"
const podcastDisclaimer = "You might be wondering why we are doing this! We are a free service powered by Listen Notes with restrictions on what kind of data we can keep. We hope you can understand!"
const podcastCommands = {
    "favorite":"add", 
    "unfavorite":"remove"
}

export {
    baseUrl,
    errorEpisode,
    errorTranscribe,
    errorPodcast,
    errorDefault,
    podcastCommands,
    errorFavoritePodcast,
    podcastDisclaimer,
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
};