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
  PARENT_SCOPE_UPDATED,
} from "../constants/actionTypes";

const initialState = {
  code: "// enter your code",
  scopeHistory: [],
  currentScope: {},
  hasNextStep: true,
  operationType: "",
  isRunning: false,
  runningSpeed: 100,
};

function reducer(state = initialState, action) {
  const newScopeHistory = _.cloneDeep(state.scopeHistory);
  const newCurrentScope = _.cloneDeep(state.currentScope);
  switch (action.type) {
    case CODE_CHANGED:
      return Object.assign({}, state, {
        code: action.code,
      });
    case CURRENT_SCOPE_UPDATED:
      if (state.currentScope.scopeName === action.currentScope.scopeName) {
        return Object.assign({}, state, {
          currentScope: _.assign({}, state.currentScope, action.currentScope),
        });
      } else if (
        state.scopeHistory.length &&
        state.scopeHistory[state.scopeHistory.length - 1].scopeName ===
          action.currentScope.scopeName
      ) {
        newScopeHistory.pop();
        return Object.assign({}, state, {
          scopeHistory: [...newScopeHistory],
          currentScope: action.currentScope,
        });
      } else {
        return Object.assign({}, state, {
          scopeHistory: [...state.scopeHistory, newCurrentScope],
          currentScope: action.currentScope,
        });
      }
    case PARENT_SCOPE_UPDATED:
      const scopeProperties = _.map(state.scopeHistory, (scope, index) =>
        Object.keys(scope)
      );
      _.forOwn(action.parentScope, (value, key) => {
        for (let i = 0; i < scopeProperties.length; i++) {
          if (scopeProperties[i].includes(key)) {
            newScopeHistory[i][key] = value;
          }
        }
      });
      return Object.assign({}, state, {
        scopeHistory: newScopeHistory,
      });
    case HIGHLIGHT_MARKER_APPENDED:
      return Object.assign({}, state, {
        markers: action.markers,
      });
    case NEXT_STEP_DECIDED:
      return Object.assign({}, state, {
        hasNextStep: action.hasNextStep,
      });
    case OPERATION_TYPE_UPDATED:
      return Object.assign({}, state, {
        operationType: action.operationType,
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
