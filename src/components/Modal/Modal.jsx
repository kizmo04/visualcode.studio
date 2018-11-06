import React, { Component } from "react";
import styles from "./Modal.module.scss";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.props.onModalCloseButtonClick();
  }
  render() {
    const { sharedCodeId, isActive } = this.props;
    return (
      <div className={`modal ${isActive ? "is-active" : ""}`}>
        <div className="modal-background" />
        <div className="modal-content">
          <div className="card">
            <div className="card-header">
              <div className="card-header-title">
                {sharedCodeId ? "Copy Share URL" : "Read me"}
              </div>
              <button
                className="modal-close is-large"
                onClick={this.handleClick}
              />
            </div>
            <div className="card-content">
              {sharedCodeId ? (
                <div className={styles.font}>
                  {`visualcode.studio/${sharedCodeId}`}
                </div>
              ) : (
                <div className="info-content">
                  <p className={styles.fontInfo}>
                    스크립트에서 실행되고 있는 지점을 기준으로 closure의 실행
                    context 속성들이 배경에 나타납니다.
                  </p>
                  <p className={styles.fontInfoSubTitle}>타입 별 형태</p>
                  <p className={styles.fontInfo}>
                    Array or ArrayLike: length에 따라 길이가 다른 긴 줄
                  </p>
                  <p className={styles.fontInfo}>
                    undefined: 크기와 색상이 정해지지 않은 원
                  </p>
                  <p className={styles.fontInfo}>
                    String: length에 따라 width가 다른 직사각형
                  </p>
                  <p className={styles.fontInfo}>
                    Number: value에 따른 n각형(3 미만의 값은 삼각형)
                  </p>
                  <p className={styles.fontInfo}>
                    Boolean: true - 보라색 원, false - 노란색 원
                  </p>
                  <p className={styles.fontInfo}>Object: 하늘색 사각형</p>
                </div>
              )}
            </div>
            <div className="card-footer" />
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
