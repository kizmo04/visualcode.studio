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
import Modal from "../Modal/Modal";

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
      isRunning,
      resetInterpreterState,
    } = this.props;
    try {
      if (!this._interpreter || this._interpreter.code !== code) {
        this._interpreter = new InterpreterWrapper(code, initFunc);
      }
      const {
        currentScope,
        operationType,
        hasNextStep,
        start,
        end
      } = this._interpreter.nextStep();
      if ((isRunning && !hasNextStep) || operationType === "End") {
        stopInterpreter();
        clearInterval(this._interval);
      }
      if (operationType === "End") {
        resetInterpreterState();
      } else {
        this._codeHighlighter.clear();
        decideNextStep(hasNextStep);
        updateCurrentScope(getScopeProperties(currentScope));
        updateOperationType(operationType);
        this._codeHighlighter.mark(start, end, code);
      }
    } catch (error) {
      console.error(error);
    }
  }
  handleBeforeChange(editor, data, code) {
    this.props.setChangedCode(code);
  }
  handleChange(speed) {
    this.props.changeRunningSpeed(speed);
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
      }, !runningSpeed ? 600 : 20 * runningSpeed);
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
      sharedCodeId,
      isModalActive,
      closeModal,
      openInfoModal,
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

    // console.log(scopeHistory);
    return (
      <Fragment>
        {
          isModalActive ? <Modal sharedCodeId={sharedCodeId} isActive={isModalActive} onModalCloseButtonClick={closeModal} /> : null
        }
        {
          operationType !== "End" ? Object.values(_.mapValues(currentScope, (value, key) => ({ ...value, identifier: key }))).map((value, index) => (
              <PtsCanvas className="pts-canvas" key={index} variable={value} operationType={operationType} />
          )) :
          null
        }
        <NavBar
          isRunning={isRunning}
          hasNextStep={hasNextStep}
          runningSpeed={runningSpeed}
          code={code}
          onStepButtonClick={this.handleStep}
          onShareButtonClick={this.handleShare}
          onRestartButtonClick={this.handleRestart}
          onRunButtonClick={this.handleRun}
          onRunningSpeedChange={this.handleChange}
          onInfoButtonClick={openInfoModal}
        />
        <div className="columns is-multiline">
          <div className="column is-half">
            <Switch>
              <Route
                exact
                path={`/`}
                render={({ match }) => {
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
                path={`/:code_id`}
                render={({ match }) => {
                  console.log('MATCH: ', match)
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
          </div>
          <div className="column is-half">
            <ScopeInfo
              scopeHistory={scopeHistory}
              currentScope={currentScope}
              operationType={operationType}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
