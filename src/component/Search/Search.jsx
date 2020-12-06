import React from 'react'
import {useState} from 'react'
import styles from '../Search/Search.module.scss'
import { useHistory } from 'react-router-dom'
import {useSearchContext} from 'state/Search/useSearchContext'
import { baseUrl } from "../../utils/constants"
import {searchByTags} from '../../utils/api'

function Search(props) {
	//vars
	const searchContext = useSearchContext();
	const history = useHistory();

	//states
       const [query, setQuery] = useState('')
       const [searchResults, setSearchResults]= useState()
	
	//util functions
	const handleSearch = (event) => {
		setQuery(event.target.value);
       }

       // const handleSearch = (event) => {

       // }

	const handleSubmit = (event) =>{
              event.preventDefault();
              
              if(props.searchWith==='tags'){
                     let body = {'searchQuery': query}
                     searchByTags(body)
                     .then((response)=>{
                            setSearchResults(response.data.Data)
                            alert('sucess')
                     })
                     .catch((error)=>{
                            console.log(error)
                     })
              }else{
                     if(!searchContext.searchType){
                            alert('Please choose one option');
                     } else if (!!query) {
                            searchContext.setSearchInput(query);
                            history.push(`/search/results/${query}/${searchContext.searchType}`);
                     } else {
                            alert('Please enter a search term');
                     }
              }
	}

	const handleCheckboxes = (value) => {
		searchContext.setSearchType(value);
	}

	return (
		<div id="search" className={styles.overlayContent}>
			<form id="search-form" onSubmit={handleSubmit}>
				<div className={styles.searchBar}>
					<img className={styles.searchIcon} src={baseUrl + "/assets/search.svg"} alt="" />
					<input className={styles.searchInput} type="text" placeholder="Search for Podcasts" name="search" onChange={handleSearch}/>
				</div>
				<div className={styles.checkboxes}>
					<label><input type="checkbox" name="episodes" onChange={()=>handleCheckboxes('episodes')} checked={searchContext.searchType==="episodes"} />Search for episodes</label>
					<label><input type="checkbox" name="podcasts" onChange={()=>handleCheckboxes('podcasts')} checked={searchContext.searchType==="podcasts"} />Search for podcasts</label>
				</div>
				<input type="submit" className={styles.searchEnter}/>
			</form>
		</div>
			
	)
}

export default Search;
