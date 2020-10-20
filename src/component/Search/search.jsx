import React from 'react'
import styles from '../Search/Search.module.css'
function Search(props) {
       
       return (
              <div className="overlayContent">
                     <form>
                            <input type="text" placeholder="Search.." name="search"/>
                            <button type="submit"></button>
                     </form>
              </div>
       )
}

export default Search;
