import React, { Component } from "react";
import styles from "./Modal.module.scss";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick () {
    this.props.onModalCloseButtonClick();
  }
  render() {
    const { sharedCodeId } = this.props;
    return (
      <div className={`modal ${sharedCodeId ? 'is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <div className="card">
            <div className="card-header">
              <div className="card-header-title">Copy Share URL</div>
              <button className="modal-close is-large" onClick={this.handleClick}></button>
            </div>
            <div className="card-content">
              <div className={styles.font}>
                {`visualcode.studio/${sharedCodeId}`}
              </div>
            </div>
            <div className="card-footer">
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
