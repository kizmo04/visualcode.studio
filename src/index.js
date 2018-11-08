import React from "react";
import { render } from "react-dom";
import "./index.scss";
import App from "./containers/App";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducers";
import logger from "redux-logger";
import { createBrowserHistory } from "history";
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware,
} from "connected-react-router";
import { JSHINT } from "jshint";

window.JSHINT = JSHINT;

const history = createBrowserHistory();
const middlewares = process.env.NODE_ENV === "development" ? [routerMiddleware(history), logger] : [routerMiddleware(history)];

export const store = createStore(
  connectRouter(history)(reducer),
  compose(applyMiddleware(...middlewares))
);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App {...store} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
