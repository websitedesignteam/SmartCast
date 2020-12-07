import React, {useState, useEffect} from 'react'
import SectionContainer from '../../SectionContainer/SectionContainer'
import ProfileCard from '../Profile/ProfileCard'
import FavoritesThumbnail from '../../FavoritesThumbnail/FavoritesThumbnail'
import Loader from 'react-loader-spinner'
import styles from '../Profile/ProfileContentContainer.module.scss'
import {getUser, favoriteAPodcast} from '../../../../utils/api'
import {useHistory} from 'react-router-dom'
function ProfileContent(props) {

       const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || {});
       const [userData, setUserData] = useState({})
       const [favorites, setFavorites] = useState([])
       const [isLoading, setIsLoading]= useState(true)
       let history= useHistory()

       const sendToPodcastPage =(podcastID)=>{
              history.push(`/podcast/${podcastID}/`)
       }

       const unFavorite =(podcastID, podcastName)=>{
              let favoriteBody = {"podcastID": podcastID, "podcastName": podcastName, "command": "remove", "access_token": user.access_token}
              favoriteAPodcast(favoriteBody)
              .then((response)=>{
                     console.log(response)
                     window.location.reload()
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
                     setIsLoading(false)
              })
              .catch((error)=>{
                     console.log(error)
              })

       }, [])

       if(isLoading){
              return (
                     <div className={styles.container}>
                            <SectionContainer label='Profile Card'>
                                   <ProfileCard profilePicture={userData.profilePicture} name={props.name} dateJoined={props.dateJoined} bio={props.bio}/>
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
                                   <ProfileCard profilePicture={userData.profilePicture} name={props.name} dateJoined={props.dateJoined} bio={props.bio}/>
                            </SectionContainer>
                            <SectionContainer label='My Favorites'>
                                   <div className={styles.disclaimerContainer}>
                                          {(favorites.length != 0)?favorites.map((favorite, index)=><div className={styles.favoritesContainer}> <FavoritesThumbnail unFavoritePodcast={()=>unFavorite(favorite.podcastID, favorite.podcastName)} podcastName={favorite.podcastName} sendToPodcast={()=>sendToPodcastPage(favorite.podcastID)}/></div>):<div>no favorites</div>}
                                   </div>
                            </SectionContainer>
                     </div>
              )  
       }

}

export default ProfileContent;
