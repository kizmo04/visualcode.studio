import React, { Component, Fragment } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import _ from "lodash";
import {
  getInterpreter,
  getHighlightOffset,
  getScopeProperties,
} from "../../lib/parser";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/shadowfox.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/javascript-lint.js";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/closebrackets.js";
import styles from "./App.module.scss";
import "./codeMirror.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.myInterpreter = null;
    this.codeMirror = React.createRef();
    this.handleBeforeChange = this.handleBeforeChange.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.markers = [];
  }
  handleBeforeChange(editor, data, codeString) {
    const { setChangedCode } = this.props;
    setChangedCode(codeString);
    try {
      this.myInterpreter = getInterpreter(codeString);
    } catch (error) {
      console.log(error);
    }
  }
  handleRun() {
    this.myInterpreter.run();
  }
  handleStep() {
    const { code, updateScope, updateOperationType } = this.props;
    this.markers.forEach(marker => marker.clear());
    this.myInterpreter.step();
    const stack = this.myInterpreter.stateStack[
      this.myInterpreter.stateStack.length - 1
    ];
    const start = stack.node.start;
    const end = stack.node.end;

    updateScope(getScopeProperties(stack.scope));
    updateOperationType(stack.node.type);

    try {
      this.markers.push(
        this.codeMirror.current.editor.doc.markText(
          getHighlightOffset(start, code),
          getHighlightOffset(end, code),
          { css: "background-color: white" }
        )
      );
    } catch (error) {
      console.error(error);
    }
  }
  render() {
    const { code, scope, operationType } = this.props;
    const options = {
      mode: "javascript",
      theme: "shadowfox",
      lineNumbers: true,
      lineWrapping: true,
      lint: true,
      tabSize: 2,
      lintOnChange: false,
      autoCloseBrackets: true,
      gutters: ["CodeMirror-lint-markers"]
    };
    return (
      <Fragment>
        <nav className="navbar">
          <div className="navbar-brand">
            <div className="navbar-item">See JS</div>
          </div>
          <div className="navbar-menu">
            <div className="navbar-start">
              <div className="navbar-item">
                <div className="field is-grouped">
                  <div
                    className={`${styles.margin} button is-small is-info`}
                    onClick={this.handleStep}
                  >
                    Next Step
                  </div>
                  <div
                    className={`${styles.margin} button is-small is-info`}
                    onClick={this.handleRun}
                  >
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
              ref={this.codeMirror}
              className={styles.codeMirrorSize}
              options={options}
              onBeforeChange={this.handleBeforeChange}
              value={code}
            />
          </div>
          <div className="column is-half">
            <h2>Operation: {operationType}</h2>
            {_.map(scope, (value, key, i) => (
              <p>
                {key}: {value}
              </p>
            ))}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
