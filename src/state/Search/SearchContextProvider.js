import React, {createContext, useState} from 'react';

export const SearchContext = createContext(null)

function SearchContextProvider(props) {
	
	const [searchInput, setSearchInput] = useState("");
	const [searchType, setSearchType] = useState("tags");
	const userContext = {
		searchInput,
		setSearchInput,
		searchType,
		setSearchType
	}

	return (
		<SearchContext.Provider value={userContext}>
				{props.children}
		</SearchContext.Provider>
	)
}

export default SearchContextProvider;
