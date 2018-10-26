import { connect } from "react-redux";
import AppComponent from "../components/App/App";
import {
  codeChanged,
  currentScopeUpdated,
  highlightMarkerAppended,
  nextStepDecided,
  operationTypeUpdated,
  interpreterRunning,
  interpreterStopped,
} from "../actions";

const mapStateToProps = state => Object.assign({}, state);

const mapDispatchToProps = dispatch => {
  return {
    setChangedCode(code) {
      dispatch(codeChanged(code));
    },
    updateCurrentScope(currentScope) {
      dispatch(currentScopeUpdated(currentScope));
    },
    decideNextStep(hasNextStep) {
      dispatch(nextStepDecided(hasNextStep));
    },
    appendHighlightMarker() {
      dispatch(highlightMarkerAppended());
    },
    updateOperationType(operationType) {
      dispatch(operationTypeUpdated(operationType));
    },
    runInterpreter() {
      dispatch(interpreterRunning());
    },
    stopInterpreter() {
      dispatch(interpreterStopped());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
