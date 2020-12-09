const isFormComplete = (inputDict) => {
    for (const key in inputDict) {
        if (!inputDict[key]) return false;
    }
    return true;
}

const isInFavoritePodcasts = (podcastID, favoritePodcasts) => {
    if (!!favoritePodcasts) {
        return favoritePodcasts.reduce( 
            (accumulator, currentValue) => 
                ((currentValue["podcastID"] === podcastID) || accumulator) 
            , false)
    }
} 

const getNameInFavoritePodcasts = (podcastID, favoritePodcasts) => {
    if (!!favoritePodcasts && !!favoritePodcasts.length) {
        const index = favoritePodcasts.findIndex((element) => element["podcastID"] === podcastID );
        return favoritePodcasts[index]?.["podcastName"];
        // .podcastName;
    }
} 

const formatEpisodeLength = (episodeAudioLength) => {
    const episodeMin = Math.floor(episodeAudioLength/60);
    const episodeSec = episodeAudioLength%60;
    return `${episodeMin}:${episodeSec > 9 ? episodeSec : `0`+episodeSec}`;
}

export { 
    isFormComplete,
    isInFavoritePodcasts,
    getNameInFavoritePodcasts,
    formatEpisodeLength,
};

export default  {
    isFormComplete,
    isInFavoritePodcasts,
    getNameInFavoritePodcasts,
    formatEpisodeLength,
};