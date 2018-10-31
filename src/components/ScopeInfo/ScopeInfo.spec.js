import React from "react";
import { shallow } from 'enzyme';
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
      />
    );

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

    const { component } = setup(firstProp);

    it("renders scope name", () => {

      expect(component).toMatchSnapshot();
      expect(component.find(".closure").text()).toContain("Global");
    });

    it("renders scope properties", () => {

      expect(component.find(".property").length).toBe(2);
    });

    it("renders operation type", () => {

      expect(component.find(".operation-type").text()).toBe("Program")
    });
  });
});
