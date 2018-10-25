import { connect } from "react-redux";
import AppComponent from "../components/App/App";
import {
  codeChanged,
  scopeUpdated,
  highlightMarkerAppended,
  nextStepDecided,
  operationTypeUpdated,
} from "../actions";

const mapStateToProps = state => Object.assign({}, state);

const mapDispatchToProps = dispatch => {
  return {
    setChangedCode(code) {
      dispatch(codeChanged(code));
    },
    updateScope(scope) {
      dispatch(scopeUpdated(scope));
    },
    decideNextStep(couldNextStep) {
      dispatch(nextStepDecided(couldNextStep));
    },
    appendHighlightMarker() {
      dispatch(highlightMarkerAppended());
    },
    updateOperationType(operationType) {
      dispatch(operationTypeUpdated(operationType));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
