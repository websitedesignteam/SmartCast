import React, {createContext, useState} from 'react'


export const SearchContext = createContext(null)

function SearchContextProvider(props) {
       

       const [userInput, setUserInput] = useState('')
       const [searchType, setSearchType] = useState('')
       const userContext = {
              userInput,
              setUserInput,
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
