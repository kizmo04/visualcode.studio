import {
  CODE_CHANGED,
  CURRENT_SCOPE_UPDATED,
  HIGHLIGHT_MARKER_APPENDED,
  NEXT_STEP_DECIDED,
  OPERATION_TYPE_UPDATED,
  INTERPRETER_RUNNING,
  INTERPRETER_STOPPED,
} from "../constants/actionTypes";

export function codeChanged(code) {
  return {
    type: CODE_CHANGED,
    code,
  };
}

export function currentScopeUpdated(currentScope) {
  return {
    type: CURRENT_SCOPE_UPDATED,
    currentScope,
  };
}

export function highlightMarkerAppended(markers) {
  return {
    type: HIGHLIGHT_MARKER_APPENDED,
    markers,
  };
}

export function nextStepDecided(hasNextStep) {
  return {
    type: NEXT_STEP_DECIDED,
    hasNextStep,
  };
}

export function operationTypeUpdated(operationType) {
  return {
    type: OPERATION_TYPE_UPDATED,
    operationType,
  };
}

export function interpreterRunning() {
  return {
    type: INTERPRETER_RUNNING,
    isRunning: true,
  };
}

export function interpreterStopped() {
  return {
    type: INTERPRETER_STOPPED,
    isRunning: false,
  };
}