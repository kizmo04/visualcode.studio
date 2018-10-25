import _ from "lodash";
import {
  CODE_CHANGED,
  SCOPE_UPDATED,
  HIGHLIGHT_MARKER_APPENDED,
  NEXT_STEP_DECIDED,
  OPERATION_TYPE_UPDATED,
} from "../constants/actionTypes";

const initialState = {
  code: "// enter your code",
  scope: {},
  markers: [],
  couldNextStep: true,
  operationType: "",
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case CODE_CHANGED:
      return Object.assign({}, state, {
        code: action.code
      });
    case SCOPE_UPDATED:
      return Object.assign({}, state, {
        scope: _.assign({}, state.scope, action.scope)
      });
    case HIGHLIGHT_MARKER_APPENDED:
      return Object.assign({}, state, {
        markers: action.markers
      });
    case NEXT_STEP_DECIDED:
      return Object.assign({}, state, {
        couldNextStep: action.couldNextStep
      });
    case OPERATION_TYPE_UPDATED:
      return Object.assign({}, state, {
        operationType: action.operationType
      });
    default:
      return state;
  }
}

export default reducer;
