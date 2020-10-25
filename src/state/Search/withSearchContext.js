import SearchContextProvider from "./SearchContextProvider"
import React from "react"
export const withSearchContext = (Component) => (props) => (
       <SearchContextProvider>
              <Component {...props}/>
       </SearchContextProvider>
)