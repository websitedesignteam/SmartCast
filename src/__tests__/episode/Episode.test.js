import React from 'react';
import { shallow } from 'enzyme';
import Episode from 'src/page/Episode/Episode';

function mockFunction() {
    const original = jest.requireActual('react-router');
    return {
      ...original,
      useParams: jest.fn().mockReturnValue({
        episodeID: '88076a90cd47459ead4702700be55290',
        podcastID: "d5b2fe9bee744bc5b3b60fab397447b4"
      }),
    };
  }

jest.mock('react-router-dom', () => mockFunction());

test("should render the Episode", () => {
    const validateToken = () => {}
    const openAudioPlayer = () => {}
    const user = {}
    const props = {
        validateToken,
        openAudioPlayer,
        user,
    }

    const match = { 
        params: { 
            episodeID: '88076a90cd47459ead4702700be55290',
            podcastID: "d5b2fe9bee744bc5b3b60fab397447b4"
        } 
    }

    const component = shallow(
        <Episode {...props} match={match} />
    )
    expect(component.getElements()).toMatchSnapshot();
});