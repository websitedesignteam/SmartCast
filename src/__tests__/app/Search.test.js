import React from 'react';
import { shallow } from 'enzyme';
import Search from 'src/component/Search/Search';
import SearchContextProvider from 'src/state/Search/SearchContextProvider'

test("should render the Search", () => {
    const props = {
        searchContext: {
            searchInput: "",
            searchType: "",
        }
    }

    const searchComponent = shallow(
        <SearchContextProvider {...props}>
            <Search />
        </SearchContextProvider>)
    expect(searchComponent.getElements()).toMatchSnapshot();
});