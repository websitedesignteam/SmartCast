import React, {useState, useEffect} from 'react';
import styles from '../Home/Home.module.css'
import Thumbnail from '../../component/Home/Thumbnail/Thumbnail'
import Search from '../../component/Search/Search'
import TagPill from '../../component/Home/TagPill/TagPill'
import LiveFeed from '../../component/Home/LiveFeed/LiveFeed'
import SearchResults from '../../component/Search/SearchResults/SearchResults'
import { getallCategories, getallTagsofACategory, getallEpisodesofATag } from '../../utils/api';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import axios from 'axios';
import Axios from 'axios';
import {Link, useParams, useHistory} from 'react-router-dom'
function Home(props) {

       const [categories, setCategories] = useState([]);
       const [tags, setTags] = useState([]);
       const [podcastID, setPodcastID] = useState();
       const [episodeID, setEpisodeID] = useState();
       const [episodes, setEpisodes] = useState();
       const [isModalOpen, setisModalOpen] = useState(false);
       const [loading, setIsLoading] = useState(false);
       let history = useHistory();

       useEffect(() => {
			getallCategories()
			.then((response) => {
                            setCategories(response.data.Data);
			})
			.catch((error) => {
                            console.log(error);
			});
       }, []) 

       const getTags=(category)=>{
                     setTags([])
                     setIsLoading(true)
                     if (category === 'COMMERCIAL ITEM'){
                            var data = {"category": 'COMMERCIAL_ITEM'}
                     }else{
                            var data = {"category": category}
                     }
                     getallTagsofACategory(data)
                     .then((response) => {
                            setEpisodes();
                            setTags(response.data.Data);
                            setIsLoading(false)
			})
			.catch((error) => {
                            console.log(error);
			});
       }

        const getEpisodeData = (tag)=>{
               setIsLoading(true)
              let data = {"tag": tag}
              getallEpisodesofATag(data)
              .then((response) => {
                     setEpisodes(response.data.Data)
                     openModal()
                     setIsLoading(false)
                     // setPodcastID(response.data.Data[0].podcastID.toString());
                     // setEpisodeID(response.data.Data[0].episodeID.toString());
                     // history.push(`/podcast/${response.data.Data[0].podcastID}/episode/${response.data.Data[0].episodeID}`)
              })
              .catch((error) => {
                     console.log(error);
              });
        }

        const sendToEpisodePage = (podcastID, episodeID)=>{
              history.push(`/podcast/${podcastID}/episode/${episodeID}`)
        }

        const openModal = () =>{
              setisModalOpen(true)
        }

        const closeModal = () => {
              setisModalOpen(false)
        }

        if (isModalOpen === false){

              return ( 
                     <div className={styles.homeContainer}>
                          <div className={styles.genreSection}>
                                 <div className={styles.subGenre}>
                                        <div className={styles.skew}>
                                        </div>
                                        <div className={styles.thumbnailContainer}>
                                          {categories.map((category, index)=><div key={category} onClick={() => getTags(category)}><TagPill key={category} label={category}/></div>)}
                                        </div>
                                        <div className={styles.tags}>
                                          {tags ? tags.map((category, index)=><div key={category} onClick={()=> {getEpisodeData(category.tag)}}><TagPill key={category} label={category.tag} count= {category.episodeCount}/></div>):null}
                                        </div>
                                        <div className={styles.tags}>
                                          {loading? <div><Loader type="TailSpin" color="#00BFFF" height={30} width={30} /></div>:null}
                                        </div>
                                 </div>
                          </div>
                          <LiveFeed profilePicture={props.user.profilePicture} />
                     </div>
              );

        } else if (isModalOpen === true) {
              return ( 
                     <div className={styles.homeContainer}>
                          <div className={styles.genreSection}>
                                 <div className={styles.subGenre}>
                                        <div className={styles.skew}>
                                        </div>
                                        <div className={styles.thumbnailContainer}>
                                       {categories.map((category, index)=><div key={category} onClick={() => getTags(category)}><TagPill key={category} label={category}/></div>)}
                                        </div>
                                        <div className={styles.tags}>
                                        {tags ? tags.map((category, index)=><div key={category} onClick={()=> getEpisodeData(category.tag)}><TagPill key={category} label={category.tag} count= {category.episodeCount}/></div>):null}
                                        </div>
                                        {/* <div className={styles.tags}>
                                        {episodes ? episodes.map((episode, index)=><div key={episode} onClick={()=> openModal()}><TagPill key={episode} podcastTitle={episode.podcastTitle} label={episode.episodeTitle} /></div>): null}
                                        </div> */}
                                 </div>
                          </div>
                          <SearchResults episodeData={episodes} closeModal={()=>closeModal()} />
                          <LiveFeed />
                     </div>

              );
        }
}

export default Home;