import React from 'react';
import { useState } from 'react';
import StarRating from '../StarRating/StarRating';
import styles from "./Review.module.scss";
import { isFormComplete } from "../../../utils/helper"; 

function Review({isLoadingReview, submitReview, ...props}) {
  	//states
    const [userReview, setUserReview] = useState({rating: 0, review: ""});

    const handleChange = (event) => {
		setUserReview({
			...userReview,
			[event.target.name]: event.target.value
		});
    };

    const setRating = (rating) => {
      	setUserReview({
			...userReview, 
			rating,
		});
    };

    const onClickSubmit = () => {
		submitReview(userReview);
    };

    return (
		<div className={styles["form"]}>
			<div className={styles["form-heading"]}>What did you think about this episode?</div>
			<div className={styles["form-input--rating"]}>
			<StarRating
				numberOfStars="5"
				currentRating="0"
				onClick={setRating}
				userReview={userReview}
			/>
			</div>
			<div className={styles["form-input--text"]}>
			<textarea
				name="review"
				rows="5"
				placeholder="Tell us your thoughts!"
				onChange={handleChange}
			/>
			</div>
			<div className={styles["form-bottom"]}>
			{!isLoadingReview
				? <button 
					className={styles["form-bottom--submit"]} 
					type="submit" 
					disabled={!isFormComplete(userReview)}
					onClick={onClickSubmit}
				>
					Submit Rating
				</button>
				: <div className="loaderTiny"></div>}
			</div>
		</div>
    );
}


export default Review;