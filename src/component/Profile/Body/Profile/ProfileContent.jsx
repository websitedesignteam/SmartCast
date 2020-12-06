import React, {useState, useEffect} from 'react'
import SectionContainer from '../../SectionContainer/SectionContainer'
import ProfileCard from '../Profile/ProfileCard'
import FavoritesThumbnail from '../../FavoritesThumbnail/FavoritesThumbnail'
import styles from '../Profile/ProfileContentContainer.module.scss'
import {getUser, favoriteAPodcast} from '../../../../utils/api'
import {useHistory} from 'react-router-dom'
function ProfileContent(props) {

       const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
       const [userData, setUserData] = useState({})
       const [favorites, setFavorites] = useState([])
       let history= useHistory()

       const sendToPodcastPage =(podcastID)=>{
              history.push(`/podcast/${podcastID}/`)
       }

       const unFavorite =(podcastID, podcastName)=>{
              let favoriteBody = {"podcastID": podcastID, "podcastName": podcastName, "command": "remove", "access_token": user.access_token}
              favoriteAPodcast(favoriteBody)
              .then((response)=>{
                     console.log(response)
              })
              .catch((error)=>{
                     console.log(error)
              })
       }

       useEffect(()=>{
              let getUserBody = {"access_token": user.access_token}
              getUser(getUserBody)
              .then((response)=>{
                     setUserData(response.data)
                     setFavorites(response.data.favoritePodcasts)
              })
              .catch((error)=>{
                     console.log(error)
              })

       }, [])

       if(favorites.length !=0){
              return (
                     <div className={styles.container}>
                            <SectionContainer label='Profile Card'>
                                   <ProfileCard profilePicture={userData.profilePicture} name={props.name} dateJoined={props.dateJoined} bio={props.bio}/>
                            </SectionContainer>
                            <SectionContainer label='My Favorites'>
                                   <div className={styles.disclaimerContainer}>
                                          {favorites.map((favorite, index)=><div onClick={()=>sendToPodcastPage(favorite.podcastID)}> <FavoritesThumbnail unFavoritePodcast={()=>unFavorite(favorite.podcastID, favorite.podcastName)}podcastName={favorite.podcastName}/></div>)}
                                   </div>
                            </SectionContainer>
                     </div>
              )
       }else if (favorites.length === 0){
              return (
                     <div className={styles.container}>
                            <SectionContainer label='Profile Card'>
                                   <ProfileCard profilePicture={userData.profilePicture} name={props.name} dateJoined={props.dateJoined} bio={props.bio}/>
                            </SectionContainer>
                            <SectionContainer label='My Favorites'>
                                   <div className={styles.disclaimerContainer}>
                                          <p>You have no favorites yet :(</p>
                                          <p> Browse our transcribed podcasts, here.</p>
                                   </div>
                            </SectionContainer>
                     </div>
              )
       }

}

export default ProfileContent;
