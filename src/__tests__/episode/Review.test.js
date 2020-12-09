import React from 'react';
import { shallow } from 'enzyme';
import Review from 'src/component/Episode/Review/Review';

test("should render the Review", () => {
    const submitReview = () => {}
    const props = {
        submitReview,

    }
    const component = shallow(<Review {...props} />);
    // expect(component.getElements()).toMatchSnapshot();
});