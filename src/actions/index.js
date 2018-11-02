import {
  CODE_CHANGED,
  CURRENT_SCOPE_UPDATED,
  HIGHLIGHT_MARKER_APPENDED,
  NEXT_STEP_DECIDED,
  OPERATION_TYPE_UPDATED,
  INTERPRETER_RUNNING,
  INTERPRETER_STOPPED,
  RUNNING_SPEED_CHANGED,
  INTERPRETER_STATE_RESET,
  PARENT_SCOPE_UPDATED,
  CODE_SHARED,
  INFO_MODAL_OPENED,
  MODAL_CLOSED,
} from "../constants/actionTypes";

export const codeChanged = code => (
  {
    type: CODE_CHANGED,
    code,
  }
);

export const currentScopeUpdated = currentScope => (
  {
    type: CURRENT_SCOPE_UPDATED,
    currentScope,
  }
);

export const parentScopeUpdated = parentScope => (
  {
    type: PARENT_SCOPE_UPDATED,
    parentScope,
  }
);

export const highlightMarkerAppended = markers => (
  {
    type: HIGHLIGHT_MARKER_APPENDED,
    markers,
  }
);

export const nextStepDecided = hasNextStep => (
  {
    type: NEXT_STEP_DECIDED,
    hasNextStep,
  }
);

export const operationTypeUpdated = operationType => (
  {
    type: OPERATION_TYPE_UPDATED,
    operationType,
  }
);

export const interpreterRunning = () => (
  {
    type: INTERPRETER_RUNNING,
    isRunning: true,
  }
);

export const interpreterStopped = () => (
  {
    type: INTERPRETER_STOPPED,
    isRunning: false,
  }
);

export const runningSpeedChanged = runningSpeed => (
  {
    type: RUNNING_SPEED_CHANGED,
    runningSpeed,
  }
);

export const interpreterStateReset = () => (
  {
    type: INTERPRETER_STATE_RESET,
    scopeHistory: [],
    currentScope: {},
    hasNextStep: true,
    operationType: "",
    isRunning: false,
  }
);

export const codeShared = sharedCodeId => (
  {
    type: CODE_SHARED,
    sharedCodeId,
    isModalActive: true
  }
);

export const infoModalOpened = () => (
  {
    type: INFO_MODAL_OPENED,
    isModalActive: true,
    sharedCodeId: null
  }
);

export const modalClosed = () => (
  {
    type: MODAL_CLOSED,
    isModalActive: false,
    sharedCodeId: null
  }
);