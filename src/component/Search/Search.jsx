import React, {useContext} from 'react'
import {useState} from 'react'
import styles from '../Search/Search.module.css'
import {Link, useParams, useHistory} from 'react-router-dom'
import SearchContextProvider from '../../state/Search/SearchContextProvider'
import {SearchContext} from '../../state/Search/SearchContextProvider'
import {useSearchContext} from 'state/Search/useSearchContext'
import {withSearchContext} from "state/Search/withSearchContext"

function Search(props) {
	
	const [query, setQuery] = useState('')
	const [checkboxCount, setCheckboxCount] = useState(0)
	const [checkboxValue, setCheckboxValue] = useState({})
	const searchContext = useSearchContext();
	const history = useHistory();
	const baseUrl = process.env.PUBLIC_URL;
	
	const handleSearch =(event)=>{
		setQuery(event.target.value)
	}

	const handleSubmit =(event)=>{
		searchContext.setUserInput(query)
		searchContext.setSearchType(checkboxValue)

		if(checkboxCount !== 1){
			event.preventDefault()
			alert('Please choose one option.')
		}
		else {
			history.push("/searchPage");
		}

		console.log(checkboxValue)
	}

	const handleCheckboxes =(value)=>{
		setCheckboxCount(checkboxCount + 1)
		setCheckboxValue(value)
	}

	return (

		<div id="search" className={styles.overlayContent}>
			<form className="form" onSubmit={handleSubmit}>
				<div className={styles.searchBar}>
					<img className={styles.searchIcon} src={baseUrl + "assets/search.svg"} alt="" />
					<input className={styles.searchInput} type="text" placeholder="Search for Podcasts" name="search" onChange={handleSearch}/>
				</div>
				<input type="submit" className={styles.searchEnter}/>
				<div className={styles.checkboxes}>
					<label><input type="checkbox" name="episodes" onChange={()=>handleCheckboxes('Search for episodes')}/>Search for episodes</label>
					<label><input type="checkbox" name="podcasts" onChange={()=>handleCheckboxes('Search for podcasts')}/>Search for podcasts</label>
				</div>
			</form>
		</div>
			
	)
}

export default Search;
