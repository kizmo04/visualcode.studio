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
import { getCodeUpstream, setCodeUptream } from "../../lib/firebase";
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
import ScopeInfo from "../ScopeInfo/ScopeInfo";
import NavBar from "../NavBar/NavBar";

class App extends Component {
  constructor(props) {
    super(props);
    this.codeMirror = React.createRef();
    this._interpreter = null;
    this._codeHighlighter = null;
    this._interval = null;
    this.handleRun = this.handleRun.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleBeforeChange = this.handleBeforeChange.bind(this);
    this.runInterpreter = this.runInterpreter.bind(this);
  }
  componentDidMount() {
    this._codeHighlighter = new Highlighter(this.codeMirror.current.editor);
  }
  runInterpreter() {
    const {
      code,
      updateCurrentScope,
      updateOperationType,
      decideNextStep,
      stopInterpreter,
      isRunning
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
        clearInterval(this._interval);
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
  handleBeforeChange(editor, data, code) {
    const { setChangedCode } = this.props;
    setChangedCode(code);
  }
  handleChange(speed) {
    const { changeRunningSpeed } = this.props;
    changeRunningSpeed(speed);
  }
  handleRestart() {
    const { code, resetInterpreterState } = this.props;
    this._interpreter = new InterpreterWrapper(code, initFunc);
    this._codeHighlighter.clear();
    resetInterpreterState();
  }
  handleShare() {
    const { code, getSharedCodeId } = this.props;
    setCodeUptream(code, getSharedCodeId);
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
      this._interval = setInterval(() => {
        this.runInterpreter();
      }, (2000 * runningSpeed) / 100);
    } else {
      stopInterpreter();
      clearInterval(this._interval);
    }
  }
  handleStep() {
    const { hasNextStep, isRunning } = this.props;
    if (!isRunning && hasNextStep) {
      this.runInterpreter();
    }
  }
  render() {
    const {
      scopeHistory,
      code,
      currentScope,
      operationType,
      isRunning,
      setChangedCode,
      runningSpeed,
      hasNextStep,
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

    // console.log(scopeHistory);
    return (
      <Fragment>
        {
          Object.values(currentScope).map((key, index) => (
            <PtsCanvas className="pts-canvas" key={index} variable={key} operationType={operationType} />
          ))
        }
        <NavBar
          isRunning={isRunning}
          hasNextStep={hasNextStep}
          runningSpeed={runningSpeed}
          code={code}
          handleReset={this.handleReset}
          handleStep={this.handleStep}
          handleShare={this.handleShare}
          handleRestart={this.handleRestart}
          handleRun={this.handleRun}
          handleChange={this.handleChange}
        />
        <div className="columns is-multiline">
          <div className="column is-half">
            <Switch>
              <Route
                exact
                path="/"
                render={() => {
                  return (
                    <CodeMirror
                      ref={this.codeMirror}
                      className={styles.codeMirrorSize}
                      options={options}
                      onBeforeChange={this.handleBeforeChange}
                      value={code}
                    />
                  );
                }}
              />
              <Route
                path="/:code_id"
                render={({ match }) => {
                  getCodeUpstream(match.params.code_id, setChangedCode);
                  return (
                    <CodeMirror
                      ref={this.codeMirror}
                      className={styles.codeMirrorSize}
                      options={options}
                      onBeforeChange={this.handleBeforeChange}
                      value={code}
                    />
                  );
                }}
              />
            </Switch>
            {/* <ScopeInfo
              scopeHistory={scopeHistory}
              currentScope={currentScope}
              operationType={operationType}
            /> */}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
