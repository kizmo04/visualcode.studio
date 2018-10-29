import React, { Component } from "react";
import styles from "./ScopeInfo.module.scss";
import _ from "lodash";

class ScopeInfo extends Component {
  render() {
    const { scopeHistory, currentScope, operationType } = this.props;
    return (
      <div className={`${styles.logBox}`}>
        <h2 className="subtitle has-text-success is-small">
          Operation: {operationType}
        </h2>
        {_.map([...scopeHistory, currentScope], (scope, index) =>
          _.map(scope, (value, key) => {
            if (key === "scopeName") {
              return (
                <h2 className="subtitle has-text-success is-small">
                  {value} Closure
                </h2>
              );
            } else {
              return (
                <p className="subtitle has-text-success is-small">{`${key}: ${value}`}</p>
              );
            }
          })
        )}
      </div>
    );
  }
}

export default ScopeInfo;
