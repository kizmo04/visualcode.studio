import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.scss";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.handleInputRangeChange = this.handleInputRangeChange.bind(this);
    this.handleInfoButtonClick = this.handleInfoButtonClick.bind(this);
  }
  handleInputRangeChange(e) {
    this.props.onRunningSpeedChange(e.target.value);
  }
  handleInfoButtonClick() {
    this.props.onInfoButtonClick();
  }
  render() {
    const {
      isRunning,
      onStepButtonClick,
      onRunButtonClick,
      onRestartButtonClick,
      onShareButtonClick,
    } = this.props;
    return (
      <nav className={`${styles.backgroundTransparent} navbar`}>
        <div className="navbar-brand">
          <div className="navbar-item">
            <Link to="/" className="subtitle has-text-info">
              VisualCode.Studio
            </Link>
          </div>
          <div className="navbar-item">
            <div className="field is-grouped">
              <div
                className={`${
                  styles.marginRight
                } button is-white is-small info-button`}
                onClick={this.handleInfoButtonClick}
              >
                <i className={`${styles.icon} material-icons has-text-info`}>help_outline</i>
              </div>
              <div
                className={`${
                  styles.marginRight
                } button is-info is-small share-button`}
                onClick={onShareButtonClick}
              >
                Share
              </div>
              <div
                className={`${
                  styles.marginRight
                } button is-small is-info run-button`}
                onClick={onRunButtonClick}
              >
                {isRunning ? "Stop" : "Run"}
              </div>
            </div>
          </div>
          <div className="navbar-menu">
            <div className="navbar-start">
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
              <div className="navbar-item">
                <div className="field is-grouped" />
                <div
                  className={`${
                    styles.marginRight
                  } button is-small is-info step-button`}
                  onClick={onStepButtonClick}
                >
                  Next Step
                </div>
                <div
                  className={`${
                    styles.marginRight
                  } button is-small is-info restart-button`}
                  onClick={onRestartButtonClick}
                >
                  Restart
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
