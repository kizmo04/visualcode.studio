import React, { Component, Fragment } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import _ from "lodash";
import {
  getScopeProperties,
  initFunc,
  InterpreterWrapper,
} from "../../lib/parser";
import { Highlighter } from "../../lib/editor";
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
import PtsCanvas from "../PtsCanvas/PtsCanvas";

class App extends Component {
  constructor(props) {
    super(props);
    this.codeMirror = React.createRef();
    this._interpreter = null;
    this._codeHighlighter = null;
    this.handleBeforeChange = this.handleBeforeChange.bind(this);
    this.handleRun = this.handleRun.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.id = null;
  }
  componentDidMount() {
    this._codeHighlighter = new Highlighter(this.codeMirror.current.editor);
  }
  handleBeforeChange(editor, data, code) {
    const { setChangedCode } = this.props;
    setChangedCode(code);
  }
  handleRun(e) {
    const {
      stopInterpreter,
      runInterpreter,
      hasNextStep,
      isRunning,
      runningSpeed,
    } = this.props;
    if (!isRunning && hasNextStep) {
      runInterpreter();
      this.id = setInterval(() => {
        this.runInterpreter();
      }, (2000 * runningSpeed) / 100);
    } else {
      stopInterpreter();
      clearInterval(this.id);
    }
  }
  handleStep() {
    const { hasNextStep, isRunning } = this.props;
    if (!isRunning && hasNextStep) {
      this.runInterpreter();
    }
  }
  runInterpreter() {
    const {
      code,
      updateCurrentScope,
      updateOperationType,
      decideNextStep,
    } = this.props;
    try {
      if (!this._interpreter || this._interpreter.code !== code) {
        this._interpreter = new InterpreterWrapper(code, initFunc);
      }
      const {
        parent,
        currentScope,
        operationType,
        hasNextStep,
        start,
        end
      } = this._interpreter.nextStep();
      this._codeHighlighter.clear();
      decideNextStep(hasNextStep);
      updateCurrentScope(getScopeProperties(currentScope));
      if (parent) getScopeProperties(parent);
      updateOperationType(operationType);
      this._codeHighlighter.mark(start, end, code);
    } catch (error) {
      console.error(error);
    }
  }
  handleChange(e) {
    const { changeRunningSpeed } = this.props;
    changeRunningSpeed(e.target.value);
  }
  handleRestart() {
    const { code, resetInterpreterState } = this.props;
    this._interpreter = new InterpreterWrapper(code, initFunc);
    resetInterpreterState();
  }
  render() {
    const {
      scopeHistory,
      code,
      currentScope,
      operationType,
      isRunning,
    } = this.props;
    const options = {
      mode: "javascript",
      theme: "shadowfox",
      lineNumbers: true,
      lineWrapping: true,
      lint: true,
      tabSize: 2,
      lintOnChange: false,
      autoCloseBrackets: true,
      gutters: ["CodeMirror-lint-markers"],
    };
    let scopePropertiesToDraw = _.map(currentScope, (value, name) => {
      return typeof value === "string" ? value.charCodeAt(0) : parseInt(value);
    });
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
                    className={`${styles.marginRight} button is-small is-info`}
                    onClick={this.handleStep}
                  >
                    Next Step
                  </div>
                  <div
                    className={`${styles.marginRight} button is-small is-info`}
                    onClick={this.handleRun}
                  >
                    {isRunning ? "Stop" : "Run"}
                  </div>
                  <input
                    className={`${
                      styles.marginRight
                    } slider is-fullwidth is-info`}
                    step="1"
                    min="0"
                    max="100"
                    defaultValue="50"
                    type="range"
                    onChange={this.handleChange}
                  />
                  <div
                    className={`${styles.marginNone} button is-small is-info`}
                    onClick={this.handleRestart}
                  >
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
            <PtsCanvas points={scopePropertiesToDraw} />
            <h2>Operation: {operationType}</h2>
            {_.map([...scopeHistory, currentScope], (scope, index) =>
              _.map(scope, (value, key) => {
                if (key === "scopeName") {
                  return <h2>{value} Closure</h2>;
                } else {
                  return <p>{`${key}: ${value}`}</p>;
                }
              })
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
