import React, {useState, useEffect} from 'react'
import {getLatestComments} from '../../../utils/api'
import SectionContainer from '../../Profile/SectionContainer/SectionContainer'
import LiveFeedPill from '../LiveFeed/LiveFeedPill/LiveFeedPill'
import styles from '../LiveFeed/LiveFeedPill/LiveFeedPill.module.scss'
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {useHistory} from 'react-router-dom'

const LiveFeed=(props)=> {
       
       const [commentData, setCommentData] = useState([])
       const [test, setTest] = useState(0)
       const [loading, setIsLoading] = useState(false)
       let history= useHistory();

       const fetchLiveData = () => {
              setIsLoading(true)
              getLatestComments()
              .then((response)=>{
                     setIsLoading(false)
                     setCommentData(response.data.Data);
                     setTimeout(fetchLiveData, 50000);
              })
              .catch((error)=>{
                     console.log(error)
              })
       }

       useEffect(()=>{
       //       const interval = setInterval(()=> fetchLiveData(), 5000)
       //       return () => {
       //               clearInterval(interval)
       //       }
              fetchLiveData()
       }, [])

       const goToEpisodePage =(podcastID, episodeID)=>{
              history.push(`/podcast/${podcastID}/episode/${episodeID}`)
       }

              return (
                     <div className={styles.sectionWrapper}>
                            <SectionContainer label="Most Recent Comments">
                                   {commentData.map((comment, index)=><div onClick={()=>goToEpisodePage(comment.podcastID, comment.episodeID)}><LiveFeedPill profilePicture={comment.profilePicture} name={comment.name} comment={comment.review} rating={comment.rating} commentAge={comment.commentAge}/></div>)}
                            </SectionContainer>
                     </div>
              )
              // return(
              //        <div>
              //              <Loader />
              //        </div> 
              // )
}

export default LiveFeed;
