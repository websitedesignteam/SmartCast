import React from 'react';
import { useRef, useState } from 'react';
import styles from "./StarRating.module.scss";

function Rating(props) {
  const [currentRating, setCurrentRating] = useState(0);
  const ratingRef = useRef();

  const hoverHandler = (event) => {
    const stars = event.target.parentElement.getElementsByClassName('star');
    const hoverValue = event.target.dataset.value;
    Array.from(stars).forEach(star => {
      star.style.color = hoverValue >= star.dataset.value ? 'yellow' : 'gray';
    });
  };

  const setRating = (event) => {
    Array.from(ratingRef).forEach(star => {
    star.style.color =
        currentRating >= star.dataset.value ? 'yellow' : 'gray';
    });
  };

  const starClickHandler = (event) => {
    const rating = event.target.dataset.value;
    setCurrentRating(rating); // set state so the rating stays highlighted
    if(props.onClick){
      props.onClick(rating); // emit the eventent up to the parent
    }
  };


  return (
    <div
      className={styles["rating"]}
      ref="rating"
      data-rating={currentRating}
      onMouseOut={setRating}
    >
      {[...Array(+props.numberOfStars).keys()].map(n => {
        return (
          <span
            className={styles["star"]}
            ref={ratingRef}
            key={n+1}
            data-value={n+1}
            onMouseOver={hoverHandler}
            onClick={starClickHandler}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
}

export default Rating;