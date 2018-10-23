import React, { Component, Fragment } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/shadowfox.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/javascript-lint.js";
import "codemirror/addon/lint/lint.css";
import styles from "./App.module.scss";

class App extends Component {
  render() {
    const { setChangedCode, code } = this.props;
    const options = {
      mode: "javascript",
      theme: "shadowfox",
      lineNumbers: true,
      lineWrapping: true,
      lint: true,
      gutters: ["CodeMirror-lint-markers"]
    };
    return (
      <Fragment>
        <nav className="navbar">
          <div className="navbar-brand">
            <div className="navbar-item">JS-Visualizer</div>
          </div>
          <div className="navbar-menu">
            <div className="navbar-start">
              <div className="navbar-item">
                <div className="field is-grouped">
                  <div className={`${styles.margin} button is-small is-info`}>
                    Next Step
                  </div>
                  <div className={`${styles.margin} button is-small is-info`}>
                    Run
                  </div>
                  <div className={`${styles.margin} button is-small is-info`}>
                    Restart
                  </div>
                </div>
              </div>
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="button is-info is-small">Share</div>
              </div>
            </div>
          </div>
        </nav>
        <div className="columns is-multiline">
          <div className="column is-half">
            <CodeMirror
              options={options}
              onBeforeChange={setChangedCode}
              value={code}
            />
          </div>
          <div className="column is-half">
            <p>view</p>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
