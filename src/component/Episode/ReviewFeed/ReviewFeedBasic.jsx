import React from 'react';
import { useState } from 'react';
import styles from "./ReviewFeed.module.scss";
import { getAllReviews } from "../../../utils/api";
import { useEffect } from 'react';

function ReviewFeed({podcastID, episodeID, ...props}) {
    //states
    const [allReviews, setAllReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    //api call
    const getAllReviewsAPI = () => {
        setIsLoading(true);
        const data = {
            podcastID,
            episodeID,
        }

        getAllReviews(data)
        .then((response) => {
            setIsLoading(false);
            setAllReviews(response.data.Data);
        })
		.catch((error) => {
            setIsLoading(false);
			if (error?.data?.Error) {
				alert(error.data.Error);
			} else {
				alert(error);
			}
		})
    }

    useEffect(()=>{
        getAllReviewsAPI();
    }, [])

    return (
        <div className={styles["review"]}>
            {!isLoading 
            ? (allReviews.length > 1) && allReviews.map((review, index) => 
                <div className={styles["review-item"]} key={index}>
                    { review.profilePicture &&
                    <div className={styles["review-item--profile-pic"]}>
                        <img src={review.profilePicture} alt="" />
                    </div>
                    }
                    <div className={styles["review-item--name"]}>
                        {review.name}
                    </div>

                    <div className={styles["review-item--rating"]}>
                        {review.rating}
                    </div>
                    <div className={styles["review-item--review"]}>
                        {review.review}
                    </div>
                    <div className={styles["review-item--comment-age"]}>
                        {review.commentAge}
                    </div>
                </div>
            )
            : <div className="loaderSmall"/>}
        </div>
    );
}
    
export default ReviewFeed;