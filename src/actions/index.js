import {
  CODE_CHANGED,
  SCOPE_UPDATED,
  HIGHLIGHT_MARKER_APPENDED,
  NEXT_STEP_DECIDED,
  OPERATION_TYPE_UPDATED,
} from "../constants/actionTypes";

export function codeChanged(code) {
  return {
    type: CODE_CHANGED,
    code,
  };
}

export function scopeUpdated(scope) {
  return {
    type: SCOPE_UPDATED,
    scope,
  };
}

export function highlightMarkerAppended(markers) {
  return {
    type: HIGHLIGHT_MARKER_APPENDED,
    markers,
  };
}

export function nextStepDecided(couldNextStep) {
  return {
    type: NEXT_STEP_DECIDED,
    couldNextStep,
  };
}

export function operationTypeUpdated(operationType) {
  return {
    type: OPERATION_TYPE_UPDATED,
    operationType,
  };
}
