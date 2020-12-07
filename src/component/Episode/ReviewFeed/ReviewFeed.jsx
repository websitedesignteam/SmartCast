//CREDIT: alibelaj 
//just changing the logic to LiveFeed to be reused for Episode ReviewFeed

import React, {useState, useEffect} from 'react';
import { getAllReviews } from "../../../utils/api";
import SectionContainer from '../../Podcast/SectionContainer/SectionContainer'
import LiveFeedPill from "./LiveFeedPill/LiveFeedPill";
import styles from './ReviewFeed.module.scss'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const ReviewFeed=({podcastID, episodeID, ...props})=> {

const [commentData, setCommentData] = useState([])
const [isLoading, setIsLoading] = useState(false)

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
			setTimeout(getAllReviewsAPI, 90000);
		})
		.catch((error)=>{
			console.log(error)
		})
	}

	useEffect(()=>{
		getAllReviewsAPI()
	}, [podcastID, episodeID])

	return (
		<div className={styles.reviewFeed}>
			<div className={styles.sectionWrapper}>
				<SectionContainer label="Reviews">
					{commentData.length === 0 && !isLoading && "No Reviews Yet"}
					{commentData.map((comment, index) =>
					<div >
						<LiveFeedPill profilePicture={comment.profilePicture} name={comment.name} comment={comment.review} rating={comment.rating} commentAge={comment.commentAge}/>
					</div>)}
				</SectionContainer>
			</div>
		</div>
	)
}

export default ReviewFeed;
