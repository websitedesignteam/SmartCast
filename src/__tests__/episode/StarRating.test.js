import React from 'react';
import { shallow } from 'enzyme';
import StarRating from 'src/component/Episode/StarRating/StarRating';

test("should render the StarRating", () => {
    const onClick = () => {}
    const props = {
        onClick,

    }
    const component = shallow(<StarRating {...props} />);
    // expect(component.getElements()).toMatchSnapshot();
});