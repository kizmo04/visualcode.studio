import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { Controlled as CodeMirror } from "react-codemirror2";
import _ from "lodash";
import {
  getScopeProperties,
  initFunc,
  InterpreterWrapper,
} from "../../lib/parser";
import { Highlighter } from "../../lib/editor";
import { setCodeUptream, getCodeUpstream } from "../../lib/firebase";
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
    this.handleShare = this.handleShare.bind(this);
  }
  componentDidMount() {
    this._codeHighlighter = new Highlighter(this.codeMirror.current.editor);
  }
  handleShare () {
    const { code, getSharedCodeId } = this.props;
    setCodeUptream(code, getSharedCodeId);
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
      stopInterpreter,
      isRunning,
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
      if (isRunning && !hasNextStep) {
        stopInterpreter();
        clearInterval(this.id);
      }
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
    this._codeHighlighter.clear();
    resetInterpreterState();
  }
  render() {
    const {
      scopeHistory,
      code,
      currentScope,
      operationType,
      isRunning,
      setChangedCode,
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

    console.log('to draw', scopePropertiesToDraw)
    return (
      <Fragment>
        <PtsCanvas className="pts-canvas" scopes={scopePropertiesToDraw} />
        <nav className={`${styles.backgroundTransparent} navbar`}>
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
                <div className="button is-info is-small" onClick={this.handleShare}>Share</div>
              </div>
            </div>
          </div>
        </nav>
        <div className="columns is-multiline">
          <div className="column is-half">
            <Switch>
              <Route exact path="/" render={() => {
                return  <CodeMirror
                ref={this.codeMirror}
                className={styles.codeMirrorSize}
                options={options}
                onBeforeChange={this.handleBeforeChange}
                value={code}
              />;
              }} />
              <Route path="/:code_id" render={({ match }) => {
                getCodeUpstream(match.params.code_id, setChangedCode);
                return <CodeMirror
                ref={this.codeMirror}
                className={styles.codeMirrorSize}
                options={options}
                onBeforeChange={this.handleBeforeChange}
                value={code}
              />;
              }} />
          </Switch>
            <div className={`${styles.logBox}`}>
              <h2 className="subtitle has-text-success is-small">Operation: {operationType}</h2>
              {_.map([...scopeHistory, currentScope], (scope, index) =>
                _.map(scope, (value, key) => {
                  if (key === "scopeName") {
                    return <h2 className="subtitle has-text-success is-small">{value} Closure</h2>;
                  } else {
                    return <p className="subtitle has-text-success is-small">{`${key}: ${value}`}</p>;
                  }
                })
                )}
            </div>
          </div>
          <div className="column is-half">
          </div>
          <div className="column is-fullwidth">
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
