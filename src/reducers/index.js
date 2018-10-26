import _ from "lodash";
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
} from "../constants/actionTypes";

const initialState = {
  code: "// enter your code",
  currentScope: {},
  hasNextStep: true,
  operationType: "",
  isRunning: false,
  runningSpeed: 100,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case CODE_CHANGED:
      return Object.assign({}, state, {
        code: action.code
      });
    case CURRENT_SCOPE_UPDATED:
      return Object.assign({}, state, {
        currentScope: _.assign({}, state.currentScope, action.currentScope)
      });
    case HIGHLIGHT_MARKER_APPENDED:
      return Object.assign({}, state, {
        markers: action.markers
      });
    case NEXT_STEP_DECIDED:
      return Object.assign({}, state, {
        hasNextStep: action.hasNextStep
      });
    case OPERATION_TYPE_UPDATED:
      return Object.assign({}, state, {
        operationType: action.operationType
      });
    case INTERPRETER_RUNNING:
      return Object.assign({}, state, {
        isRunning: action.isRunning,
      });
    case INTERPRETER_STOPPED:
      return Object.assign({}, state, {
        isRunning: action.isRunning,
      });
    case RUNNING_SPEED_CHANGED:
      return Object.assign({}, state, {
        runningSpeed: action.runningSpeed,
      });
    case INTERPRETER_STATE_RESET:
      return Object.assign({}, state, {
        currentScope: action.currentScope,
        hasNextStep: action.hasNextStep,
        operationType: action.operationType,
        isRunning: action.isRunning,
      });
    default:
      return state;
  }
}

export default reducer;
