import React from 'react';
import { shallow } from 'enzyme';
import App from 'src/App';

test("should render the App", () => {
    const component = shallow(<App />);
    // expect(component.getElements()).toMatchSnapshot();
});