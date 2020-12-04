import React from 'react';
import { useState } from 'react';
import StarRating from '../StarRating/StarRating';
import styles from "./Review.module.scss";

function Review(props) {

    const [userReview, setUserReview] = useState({
        rating: 0,
        review: "",

    });

    const handleChange = (event) => {
      setUserReview({
        [event.target.name]: event.target.value
      });
    };

    const setRating = (rating) => {
      setUserReview({ rating: rating });
    };

    const submitReview = () => {
    };

    return (
      <div className={styles["form"]}>
        <div className={styles["form-heading"]}>What did you think about this episode?</div>
        <div className={styles["form-input--rating"]}>
          {/* <label htmlFor="rating">Rating:</label> */}
          <StarRating
            numberOfStars="5"
            currentRating="0"
            onClick={setRating}
          />
        </div>
        <div className={styles["form-input"]}>
          <label htmlFor="review">Review:</label>
          <textarea
            name="review"
            id="review"
            rows="5"
            cols="50"
            onChange={handleChange}
          />
        </div>
        <div className={styles["actions"]}>
          <button type="submit" onClick={submitReview}>
            Submit Rating
          </button>
        </div>
      </div>
    );
}


export default Review;