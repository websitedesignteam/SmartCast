import React, {useContext} from 'react'
import {useState} from 'react'
import styles from '../Search/Search.module.css'
import {Link, useParams} from 'react-router-dom'
import SearchContextProvider from '../../state/Search/SearchContextProvider'
import {SearchContext} from '../../state/Search/SearchContextProvider'
import {useSearchContext} from 'state/Search/useSearchContext'
import {withSearchContext} from "state/Search/withSearchContext"

function Search(props) {
       
       const [query, setQuery] = useState('')
       const [checkboxCount, setCheckboxCount] = useState(0)
       const [checkboxValue, setCheckboxValue] = useState({})
       const searchContext = useSearchContext();
       
       const handleSearch =(event)=>{
              setQuery(event.target.value)
       }

       const handleSubmit =(event)=>{
              searchContext.setUserInput(query)
              searchContext.setSearchType(checkboxValue)

              if(checkboxCount != 1){
                      event.preventDefault()
                      alert('Please choose one option.')
              }

              console.log(checkboxValue)
              
       }

       const handleCheckboxes =(value)=>{
              setCheckboxCount(checkboxCount + 1)
              setCheckboxValue(value)
       }

       return (

                     <div className={styles.overlayContent}>
                            <form className="form">
                                   <input  className={styles.searchBar}type="text" placeholder="Search.." name="search" onChange={handleSearch}/>
                                   <Link to="/searchPage">
                                          <button className={styles.searchButton} type="submit" onClick={handleSubmit}>Search</button>
                                   </Link>
                                   <div className={styles.checkboxes}>
                                          <label><input type="checkbox" name="episodes" onChange={()=>handleCheckboxes('Search for episodes')}/>Search for episodes</label>
                                          <label><input type="checkbox" name="podcasts" onChange={()=>handleCheckboxes('Search for podcasts')}/>Search for podcasts</label>
                                   </div>
                            </form>
                     </div>
              
       )
}

export default Search;
