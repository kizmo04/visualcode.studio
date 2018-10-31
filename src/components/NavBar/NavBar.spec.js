import React from "react";
import { shallow, mount } from "enzyme";
import NavBar from "./NavBar";

const setup = (setupProps = {}) => {
  const defaultProps = {
    isRunning: false,
    hasNextStep: true,
    runningSpeed: 100,
    code: "",
    onStepButtonClick: jest.fn(),
    onShareButtonClick: jest.fn(),
    onRestartButtonClick: jest.fn(),
    onRunButtonClick: jest.fn(),
    onRunningSpeedChange: jest.fn()
  };
  const prototypeMethods = {
    onChangeSpy: jest.spyOn(NavBar.prototype, "handleInputRangeChange")
  };
  const props = { ...defaultProps, ...setupProps };
  const component = shallow(
    <NavBar {...props} />
  );

  return {
    component,
    props,
    prototypeMethods
  }
};

describe("NavBar", () => {

  it("renders without crashing", () => {
    const { component } = setup();

    expect(component).toMatchSnapshot();
  });

  describe("with props", () => {

    it("first render run button should contain 'run'", () => {
      const { component } = setup();

      expect(component.find(".run-button").text()).toBe("Run");
    });

    it("render run button to display 'stop' if isRunning is false", () => {
      const { component } = setup({
        isRunning: true
      });

      expect(component.find(".run-button").text()).toBe("Stop");
    });
  });

  describe("events", () => {

    it("onClick calls onRunButtonClick", () => {
      const { component, props } = setup();

      component.find(".run-button").simulate("click");
      expect(props.onRunButtonClick).toHaveBeenCalled();
    });

    it("onChange calls onRunningSpeedChange", () => {
      const { component, props, prototypeMethods } = setup();
      const e = { target: { value: 50 } };

      component.update();
      component.find(".running-speed-slider").simulate("change", e);

      expect(prototypeMethods.onChangeSpy).toHaveBeenCalledWith(e);
      expect(props.onRunningSpeedChange).toHaveBeenCalledWith(50);
    });

    it("onClick calls onRestartButtonClick", () => {
      const { component, props } = setup();

      component.find(".restart-button").simulate("click");
      expect(props.onRestartButtonClick).toHaveBeenCalled();
    });

    it("onClick calls onShareButtonClick", () => {
      const { component, props } = setup();

      component.find(".share-button").simulate("click");
      expect(props.onShareButtonClick).toHaveBeenCalled();
    });

    it("onClick calls onStepButtonClick", () => {
      const { component, props } = setup();

      component.find(".step-button").simulate("click");
      expect(props.onStepButtonClick).toHaveBeenCalled();
    });
  });
});