import React from "react";
import { shallow, mount, render } from 'enzyme';
import ScopeInfo from "./ScopeInfo";


describe("ScopeInfo", () => {

  const setup = (setupProps = {}) => {
    const defaultProps = {
      scopeHistory: [],
      currentScope: {},
      operationType: ""
    };
    const props = { ...defaultProps, ...setupProps };
    const component = shallow(
      <ScopeInfo
        scopeHistory={props.scopeHistory}
        currentScope={props.currentScope}
        operationType={props.operationType}
      />);

    return {
      props,
      component
    };
  };

  it("renders without crashing", () => {
    const { component } = setup();

    expect(component).toMatchSnapshot();
  });

  describe("with scope props", () => {

    const firstProp = {
      scopeHistory: [],
      currentScope: {
        scopeName: {
          type: "string",
          value: "Global"
        },
        this: {
          type: "string",
          value: "window"
        },
        num: {
          type: "number",
          value: 5
        }
      },
      operationType: "Program"
    };

    it("renders scope name", () => {
      const { component } = setup(firstProp);

      expect(component).toMatchSnapshot();
      expect(component.find('.closure')).to.have.lengthOf(1);
    });
  });
});
