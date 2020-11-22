import React, {useState, useEffect} from 'react';
import Navbar from '../../component/Navbar/Navbar.js'
import styles from '../Home/Home.module.css'
import Thumbnail from '../../component/Home/Thumbnail/Thumbnail'
import Search from '../../component/Search/Search'
import TagPill from '../../component/Home/TagPill/TagPill'
import { getallCategories, getallTagsofACategory, getallEpisodesofATag } from '../../utils/api';
import axios from 'axios';
import Axios from 'axios';
import {Link, useParams, useHistory} from 'react-router-dom'
function Home(props) {

       const [categories, setCategories] = useState([]);
       const [tags, setTags] = useState([]);
       const [podcastID, setPodcastID] = useState();
       const [episodeID, setEpisodeID] = useState();
       const [episodes, setEpisodes] = useState();
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
                     let data = {"category": category}
                     getallTagsofACategory(data)
                     .then((response) => {
                            setEpisodes();
                            setTags(response.data.Data);
			})
			.catch((error) => {
                            console.log(error);
			});
       }

        const getEpisodeData = (tag)=>{
              let data = {"tag": tag}
              getallEpisodesofATag(data)
              .then((response) => {
                     setEpisodes(response.data.Data)
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

  return ( 
         <div className={styles.homeContainer}>
              <Search/>
              <div className={styles.genreSection}>
                     <div className={styles.subGenre}>
                            <div className={styles.skew}>
                            </div>
                            <div className={styles.thumbnailContainer}>
                           {categories.map((category, index)=><div key={category} onClick={() => getTags(category)}><TagPill key={category} label={category}/></div>)}
                            </div>
                            <div className={styles.tags}>
                            {tags ? tags.map((category, index)=><div key={category} onClick={()=> getEpisodeData(category.tag)}><TagPill key={category} label={category.tag} count= {category.episodeCount}/></div>): null}
                            </div>
                            <div className={styles.tags}>
                            {episodes ? episodes.map((episode, index)=><div key={episode} onClick={()=> sendToEpisodePage(episode.podcastID, episode.episodeID)}><TagPill key={episode} podcastTitle={episode.podcastTitle} label={episode.episodeTitle} /></div>): null}
                            </div>
                     </div>
              </div>
         </div>
  );
}

export default Home;