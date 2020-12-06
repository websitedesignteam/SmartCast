//CREDIT: alibelaj 
//just changing the logic to LiveFeed to be reused for Episode ReviewFeed

import React, {useState, useEffect} from 'react';
import { getAllReviews } from "../../../utils/api";
import SectionContainer from '../../Profile/SectionContainer/SectionContainer'
import LiveFeedPill from "../../Home/LiveFeed/LiveFeedPill/LiveFeedPill";
import styles from '../../Home/LiveFeed/LiveFeedPill/LiveFeedPill.module.scss'
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const ReviewFeed=({podcastID, episodeID, ...props})=> {

const [commentData, setCommentData] = useState([])
const [loading, setIsLoading] = useState(false)

	const getAllReviewsAPI = () => {
		setIsLoading(true);
		const data = {
            podcastID,
            episodeID,
		}
		
		getAllReviews(data)
		.then((response)=>{
			setIsLoading(false)
			setCommentData(response.data.Data);
		})
		.catch((error)=>{
			console.log(error)
		})
	}

	useEffect(()=>{
		getAllReviewsAPI()
	}, [])

	return (
		<div className={styles.sectionWrapper}>
		<SectionContainer label="Most Recent Comments">
		{loading? <div className={styles.loader}><Loader type="TailSpin" color="#00BFFF" height={30} width={30}/></div>: commentData.map((comment, index)=><div ><LiveFeedPill profilePicture={comment.profilePicture} name={comment.name} comment={comment.review} rating={comment.rating} commentAge={comment.commentAge}/></div>)}
		</SectionContainer>
		</div>
	)
}

export default ReviewFeed;
