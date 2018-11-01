import React, { Component } from "react";
import styles from "./ScopeInfo.module.scss";
import _ from "lodash";

class ScopeInfo extends Component {
  render() {
    const { scopeHistory, currentScope, operationType } = this.props;
    return (
      <div className={`${styles.logBox}`}>
        <h2 className={`${styles.font} ${styles.underline} has-text-success operation-type`}>
          {operationType ? `${operationType}` : null}
        </h2>
        {_.map([...scopeHistory, currentScope], (scope, index) => (
          <div key={index} className={`${styles.scopeBox}`}>
            {_.map(scope, (info, key) => {
              if (key === "scopeName") {
                return (
                  <h2 key={index + key} className={`${styles.font} ${styles.closure} has-text-success closure`}>
                    {info.value} Closure
                  </h2>
                );
              } else {
                return (
                  <p key={index + key} ref className={`${styles.font} ${info.highlight ? 'has-background-danger has-text-warning' : 'has-text-success'} property`}>{`${key}: ${
                    info.value
                  }`}</p>
                );
              }
            })}
          </div>
        ))}
      </div>
    );
  }
}

export default ScopeInfo;
