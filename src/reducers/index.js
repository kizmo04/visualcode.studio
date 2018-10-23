import { CODE_CHANGED } from "../constants/actionTypes";

const initialState = {
  code: "// enter your code"
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case CODE_CHANGED:
      return Object.assign({}, state, {
        code: action.code,
      });
    default:
      return state;
  }
}

export default reducer;
