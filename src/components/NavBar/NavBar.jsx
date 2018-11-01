import React, { Component } from "react";
import styles from "./NavBar.module.scss";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.handleInputRangeChange = this.handleInputRangeChange.bind(this);
  }
  handleInputRangeChange (e) {
    this.props.onRunningSpeedChange(e.target.value);
  }
  render() {
    const { isRunning, onStepButtonClick, onRunButtonClick, onRestartButtonClick, onShareButtonClick } = this.props;
    return (
      <nav className={`${styles.backgroundTransparent} navbar`}>
        <div className="navbar-brand">
          <div className="navbar-item">VisualCode.Studio</div>
          <div className="navbar-start">
            <div className="navbar-item">
              <div className="field is-grouped">
                <div
                  className={`${styles.marginRight} button is-small is-info step-button`}
                  onClick={onStepButtonClick}
                >
                  Next Step
                </div>
                <div
                  className={`${styles.marginRight} button is-small is-info run-button`}
                  onClick={onRunButtonClick}
                >
                  {isRunning ? "Stop" : "Run"}
                </div>
                <input
                  className={`${
                    styles.marginRight
                  } slider is-fullwidth is-info running-speed-slider`}
                  step="1"
                  min="0"
                  max="100"
                  defaultValue="50"
                  type="range"
                  onChange={this.handleInputRangeChange}
                />
                <div
                  className={`${styles.marginNone} button is-small is-info restart-button`}
                  onClick={onRestartButtonClick}
                >
                  Restart
                </div>
              </div>
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div
                className="button is-info is-small share-button"
                onClick={onShareButtonClick}
              >
                Share
              </div>
            </div>
          </div>
        </div>
        {/* <div className="navbar-menu">
        </div> */}
      </nav>
    );
  }
}

export default NavBar;
