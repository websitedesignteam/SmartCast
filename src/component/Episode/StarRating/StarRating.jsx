import React from 'react';
import { useRef, useState, useEffect } from 'react';
import styles from "./StarRating.module.scss";
import { yellow, gray } from "../../../utils/constants";

function Rating(props) {
  const [currentRating, setCurrentRating] = useState(0);
  const [data, setData] = useState([]);
  const ratingRef = useRef();
  const starRef = useRef([]);

  const hoverHandler = (event) => {
    const el = starRef.current;
    const hoverValue = event.target.dataset.value;
    Array.from(el).forEach(star => {
      star.style.color = hoverValue >= star.dataset.value ? yellow : gray;
    });
  };

  const setRating = (event) => {
    const el = starRef.current;
    if (!el) return;
    Array.from(el).forEach(star => {
    star.style.color =
        currentRating >= star.dataset.value ? yellow : gray;
    });
  };

  const starClickHandler = (event) => {
    const rating = event.target.dataset.value;
    setCurrentRating(rating); // set state so the rating stays highlighted
    if(props.onClick){
      props.onClick(rating); // emit the eventent up to the parent
    }
  };

  useEffect( () => {
    let data = ["star", "star", "star", "star", "star"];
    starRef.current = new Array(data.length);
    setData(data);

}, []);


  return (
    <div
      className={styles["rating"]}
      ref={ratingRef}
      data-rating={currentRating}
      onMouseOut={setRating}
    >
      {data.map((element, i) => 
          <span
            className={styles["star"]}
            ref={el => starRef.current[i] = el}
            key={i+1}
            data-value={i+1}
            onMouseOver={hoverHandler}
            onClick={starClickHandler}
          >
            &#9733;
          </span>
      )}
    </div>
  );
}

export default Rating;