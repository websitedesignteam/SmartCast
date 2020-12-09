import React, {useState, useEffect} from 'react'
import SectionContainer from '../../SectionContainer/SectionContainer'
import ProfileCard from '../Profile/ProfileCard'
import FavoritesThumbnail from '../../FavoritesThumbnail/FavoritesThumbnail'
import Loader from 'react-loader-spinner'
import styles from '../Profile/ProfileContentContainer.module.scss'
import {favoriteAPodcast} from '../../../../utils/api'
import {useHistory} from 'react-router-dom'
function ProfileContent({user, ...props}) {
       const { favoritePodcasts } = user;
       const [isLoading, setIsLoading]= useState(false)
       let history= useHistory()

       const sendToPodcastPage =(podcastID)=>{
              history.push(`/podcast/${podcastID}/`)
       }

       const unFavorite =(podcastID, podcastName)=>{
              setIsLoading(true);
              let favoriteBody = {"podcastID": podcastID, "podcastName": podcastName, "command": "remove", "access_token": user.access_token}
              favoriteAPodcast(favoriteBody)
              .then((response)=>{
                     setIsLoading(false);
                     console.log(response)
                     window.location.reload()
              })
              .catch((error)=>{
                     setIsLoading(false);
                     console.log(error)
              })
       }

       useEffect(()=>{
       }, [])

       if(isLoading){
              return (
                     <div className={styles.container}>
                            <SectionContainer label='Profile Card'>
                                   <ProfileCard profilePicture={user.profilePicture} name={user.name} dateJoined={user.dateJoined} bio={user.bio}/>
                            </SectionContainer>
                            <SectionContainer label='My Favorites'>
                                   <div className={styles.disclaimerContainer}>
                                          <Loader type="TailSpin" color="#00BFFF" height={30} width={30} />
                                   </div>
                            </SectionContainer>
                     </div>
              )
       }else{
              return (
                     <div className={styles.container}>
                            <SectionContainer label='Profile Card'>
                                   <ProfileCard profilePicture={user.profilePicture} name={user.name} dateJoined={user.dateJoined} bio={user.bio}/>
                            </SectionContainer>
                            <SectionContainer label='My Favorites'>
                                   <div className={styles.disclaimerContainer}>
                                          {(favoritePodcasts.length !== 0)?favoritePodcasts.map((favorite, index)=><div className={styles.favoritesContainer}> <FavoritesThumbnail unFavoritePodcast={()=>unFavorite(favorite.podcastID, favorite.podcastName)} podcastName={favorite.podcastName} sendToPodcast={()=>sendToPodcastPage(favorite.podcastID)}/></div>):<div>No Favorite Podcasts Yet</div>}
                                   </div>
                            </SectionContainer>
                     </div>
              )  
       }

}

export default ProfileContent;
