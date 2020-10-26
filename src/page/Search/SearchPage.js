import React, {useEffect, useState} from 'react'
import Search from '../../component/Search/Search'
import { Link } from "react-router-dom"
import {searchEpisodes, searchPodcasts} from '../../utils/api'
import {withSearchContext} from "state/Search/withSearchContext"
import {useSearchContext} from "state/Search/useSearchContext"
import PodcastContainer from "component/PodcastContainer/PodcastContainer"
import EpisodeContainer from "component/EpisodeContainer/EpisodeContainer"
import styles from './SearchPage.module.css'

function SearchPage(props) {

       const searchContext = useSearchContext()

       const searchTerm = searchContext.userInput
       const [episodes, setEpisodes] = useState([])
       const [podcasts, setPodcasts] = useState([])
       const [isLoading, setIsLoading] = useState(true)
       const [userChoice, setUserChoice] = useState('')

       useEffect(() => {
              checkUserChoice(searchContext.searchType)
              let body = {"searchString": searchTerm}
              if(searchContext.searchType === 'Search for episodes'){
                     searchEpisodes(body, 1) 
                     .then((response) => {
                            setIsLoading(false)
                            setEpisodes(response.data.Data.episodes)
                     })
                     .catch((error) => {
                            console.log(error);
                     });
              }else if (searchContext.searchType === 'Search for podcasts'){
                     searchPodcasts(body, 1) 
                     .then((response) => {
                            setIsLoading(false)
                            setPodcasts(response.data.Data.podcasts)
                     })
                     .catch((error) => {
                            console.log(error);
                     });
              }
}, []) 
       const checkUserChoice = (searchType) => {
              if (searchType === 'Search for episodes'){
                     setUserChoice('episodes')
              }else if (searchType === 'Search for podcasts'){
                     setUserChoice('podcasts')
              }
       }

       if (isLoading == false){
              if (userChoice === 'episodes'){
                     return( <div>
                                   <h4>Episode Results for: "{searchTerm}"</h4>
                                   <p>{episodes.map((episodes)=>{
                                          return (
                                                 <Link to={`/podcast/${episodes.podcastID}/episode/${episodes.episodeID}`} className={styles.link}>
                                                        <EpisodeContainer episodeTitle={episodes.episodeTitle}
                                                               episodeDescription={episodes.episodeDescription}
                                                               imgSrc={episodes.episodeImage}/>
                                                 </Link> 
                                          )
                                   })}</p>
                            </div>)
              }else if (userChoice === 'podcasts'){
                     return( <div>
                            <h4>Podcast Results for: "{searchTerm}"</h4>
                            <p>{podcasts.map((podcasts)=>{
                                   return (
                                   <Link to={`/podcast/${podcasts.podcastID}`} className={styles.link}>
                                   <PodcastContainer podcastTitle={podcasts.podcastTitle}
                                                 podcastDescription={podcasts.podcastDescription}
                                                 imgSrc={podcasts.podcastImage}/>
                                                 </Link>
                                   )
                            })}</p>
                     </div>)
              }
       }else if (isLoading == true){
              return(<div>
                     <p>Loading...</p>
              </div>)
       }
}

export default SearchPage;
