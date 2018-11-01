// import React from "react";
import { shallow } from "enzyme";
// import App from "./App";

describe.skip("App", () => {
  // const envOrigin = process.env;

  beforeEach(() => {
    // process.env = { ...envOrigin };
    // delete process.env.NODE_ENV;
  });

  afterEach(() => {
    // process.env = envOrigin;
  });

  const setup = (setupProps = {}) => {
    const defaultProps = {
      code: "// your code",
      isRunning: false,
      hasNextStep: true,
      runningSpeed: 100,
      scopeHistory: [],
      currentScope: {},
      operationType: "",
      updateCurrentScope: jest.fn(),
      updateOperationType: jest.fn(),
      decideNextStep: jest.fn(),
      stopInterpreter: jest.fn(),
      resetInterpreterState: jest.fn(),
      getSharedCodeId: jest.fn(),
      runInterpreter: jest.fn(),
      setChangedCode: jest.fn()
    };
    const prototypeMethods = {};
    const props = { ...defaultProps, ...setupProps };
    // const component = shallow(<App {...props} />);

    return {
      // component,
      props,
      prototypeMethods
    };
  };

  it("renders without crashing", () => {
    // process.env.REACT_APP_FIREBASE_API_KEY = "AIzaSyCdJgBtU8m1tvjK9p9PWz7wk6N1ZKTARnM";
    // process.env.REACT_APP_FIREBASE_AUTH_DOMAIN = "js-visualizer.firebaseapp.com"
    // process.env.REACT_APP_FIREBASE_DATABASE_URL = "https://js-visualizer.firebaseio.com";
    // process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID = 117286326239;
    // process.env.REACT_APP_FIREBASE_PROJECT_ID = "js-visualizer";
    // process.env.REACT_APP_FIREBASE_STORAGE_BUCKET = "js-visualizer.appspot.com";

    const { component } = setup();

    expect(component).toMatchSnapshot();
  });
});
