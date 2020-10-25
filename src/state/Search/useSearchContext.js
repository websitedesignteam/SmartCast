import {useContext} from 'react';
import {SearchContext} from "./SearchContextProvider"
export const useSearchContext = () => {
       const context =useContext(SearchContext);
       if(context === undefined){
              throw new Error("Could not find search context")
       }
       return context;
}
