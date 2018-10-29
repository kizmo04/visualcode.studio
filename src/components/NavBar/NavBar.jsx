import React, { Component } from "react";
import styles from "./NavBar.module.scss";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.handleInputRangeChange = this.handleInputRangeChange.bind(this);
  }
  handleInputRangeChange (e) {
    const { handleChange } = this.props;
    handleChange(e.target.value);
  }
  render() {
    const { isRunning, handleStep, handleRun, handleChange, handleRestart, handleShare } = this.props;
    return (
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
                  onClick={handleStep}
                >
                  Next Step
                </div>
                <div
                  className={`${styles.marginRight} button is-small is-info`}
                  onClick={handleRun}
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
                  onChange={this.handleInputRangeChange}
                />
                <div
                  className={`${styles.marginNone} button is-small is-info`}
                  onClick={handleRestart}
                >
                  Restart
                </div>
              </div>
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div
                className="button is-info is-small"
                onClick={handleShare}
              >
                Share
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
