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
  routerMiddleware
} from "connected-react-router";

const history = createBrowserHistory();
export const store = createStore(
  connectRouter(history)(reducer),
  compose(applyMiddleware(routerMiddleware(history), logger))
);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App {...store} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
