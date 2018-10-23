import {
  CODE_CHANGED,
} from "../constants/actionTypes";

export function codeChanged(code) {
  return {
    type: CODE_CHANGED,
    code,
  };
}