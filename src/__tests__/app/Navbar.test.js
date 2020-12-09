import React from 'react';
import { shallow } from 'enzyme';
import Navbar from 'src/component/Navbar/Navbar';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
      pathname: "localhost:3000/"
    })
}));

test("should render the Navbar", () => {
    const props = {
        user: {}
    }
    const component = shallow(<Navbar {...props} />);
    // expect(component.getElements()).toMatchSnapshot();
});