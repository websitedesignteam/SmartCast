import React from 'react';
import { shallow } from 'enzyme';
import Podcast from 'src/page/Podcast/Podcast';

function mockFunction() {
    const original = jest.requireActual('react-router');
    return {
      ...original,
      useParams: jest.fn().mockReturnValue({
        podcastID: "d5b2fe9bee744bc5b3b60fab397447b4"
      }),
    };
  }

jest.mock('react-router-dom', () => mockFunction());

test("should render the Podcast", () => {
    const validateToken = () => {}
    const setUser = () => {}
    const user = {}
    const props = {
        validateToken,
        setUser,
        user,
    }

    const match = { 
        params: { 
            podcastID: "d5b2fe9bee744bc5b3b60fab397447b4"
        } 
    }

    const component = shallow(
        <Podcast {...props} match={match} />
    )
    // expect(component.getElements()).toMatchSnapshot();
});