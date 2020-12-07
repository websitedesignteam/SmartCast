import React, {useState} from 'react'
import styles from '../ProfilePicture/ProfilePicture.module.scss'
const baseUrl = process.env.PUBLIC_URL;

const ProfilePicture=(props)=> {
       const [selectedFile, setSelectedFile]= useState({})
       const [b64, setB64]= useState('')
       const [errorMsg, setErrorMsg] = useState('')

       const imgToB64 = (file)=>{
              var reader = new FileReader()
              reader.readAsDataURL(file)
              reader.onload = () =>{
                     var base64= reader.result.replace(/^data:image.+;base64,/, '')
                     console.log(base64)
                     setB64(base64);
                     props.grabB64(base64)
              }
       };

       const handleChoice =(e)=>{
              if (e.target.files[0].type === 'image/png' || 'image/jpg'){
                     imgToB64(e.target.files[0])
                     props.updateError('')
              }else{
                     props.updateError('Please upload either .png or .jpg!')
              }
       }
      
       return (
              <div className={styles.container}>
                     <div className={styles.circle}>
                            <img className={styles.profilePicture} src={props.profilePicture}/>
                     </div>
                     <div className={styles.addButton}>
                            <label htmlFor="uploadFile">
                                   <img className={styles.plusSign}src={baseUrl + "/assets/Profile/plus-sign.svg"}/>
                            </label>
                            <input id="uploadFile" style={{display: 'none'}} type={"file"} onChange={(e)=>handleChoice(e)}/>
                     </div>
              </div>
       )
}

export default ProfilePicture;