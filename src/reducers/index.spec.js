import deepFreeze from "deep-freeze";
import reducer, { initialState } from "./index";
import _ from "lodash";
import {
  codeChanged,
  currentScopeUpdated,
  nextStepDecided,
  operationTypeUpdated,
  interpreterRunning,
  interpreterStopped,
  runningSpeedChanged,
  interpreterStateReset,
  codeShared,
} from "../actions";

const initial = deepFreeze(_.cloneDeep(initialState));

describe('reducer', () => {

  it('should provide the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initial);
  });

  describe('CODE_SHARED action', () => {

    it('should handle CODE_SHARED action', () => {
      const stateBefore = {
        ...initial,
        sharedCodeId: ''
      };
      const action = codeShared('code');
      const stateAfter = {
        ...initial,
        sharedCodeId: 'code'
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('CODE_CHANGED', () => {

    it('should handle CODE_CHANGED action', () => {
      const stateBefore = {
        ...initial,
        code: ''
      };
      const action = codeChanged('function foo () { \n\n\n}');
      const stateAfter = {
        ...initial,
        code: 'function foo () { \n\n\n}'
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('NEXT_STEP_DECIDED', () => {

    it('should handle NEXT_STEP_DECIDED action', () => {
      const stateBefore = {
        ...initial,
        hasNextStep: false
      };
      const action = nextStepDecided(true);
      const stateAfter = {
        ...initial,
        hasNextStep: true
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('OPERATION_TYPE_UPDATED', () => {

    it('should handle OPERATION_TYPE_UPDATED action', () => {
      const stateBefore = {
        ...initial,
        operationType: ''
      };
      const action = operationTypeUpdated('FunctionDeclaration');
      const stateAfter = {
        ...initial,
        operationType: 'FunctionDeclaration'
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('INTERPRETER_STOPPED', () => {

    it('should INTERPRETER_STOPPED action', () => {
      const stateBefore = {
        ...initial,
        isRunning: true
      };
      const action = interpreterStopped(false);
      const stateAfter = {
        ...initial,
        isRunning: false
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('INTERPRETER_RUNNING', () => {

    it('should INTERPRETER_RUNNING action', () => {
      const stateBefore = {
        ...initial,
        isRunning: false
      };
      const action = interpreterRunning(true);
      const stateAfter = {
        ...initial,
        isRunning: true
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('RUNNING_SPEED_CHANGED', () => {

    it('should RUNNING_SPEED_CHANGED', () => {
      const stateBefore = {
        ...initial,
        runningSpeed: 100
      };
      const action = runningSpeedChanged(1);
      const stateAfter = {
        ...initial,
        runningSpeed: 1
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('INTERPRETER_STATE_RESET', () => {

    it('should INTERPRETER_STATE_RESET action', () => {
      const stateBefore = {
        ...initial,
        currentScope: {
          scopeName: {
            type: 'string',
            value: 'bubble sort'
          },
          arguments: {
            type: 'ArrayLike',
            value: [1, 5, 19]
          },
          i: {
            type: 'number',
            value: 2
          }
        },
        hasNextStep: true,
        operationType: 'FunctionDeclaration',
        isRunning: true
      };
      const action = interpreterStateReset();
      const stateAfter = {
        ...initial,
        currentScope: {},
        hasNextStep: true,
        operationType: '',
        isRunning: false
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toMatchObject(stateAfter);
    });
  });

  describe('CURRENT_SCOPE_UPDATED', () => {

    const globalScope = {
      scopeName: {
        type: 'string',
        value: 'Global'
      }
    };

    const bubbleScope = {
      scopeName: {
        type: 'string',
        value: 'bubble sort'
      },
      arr: {
        type: 'Array',
        value: [1, 2, 3]
      }
    };

    const sameBubbleScope = {
      ..._.cloneDeep(bubbleScope),
      i: {
        type: 'number',
        value: 2
      }
    };

    const quickScope = {
      ..._.cloneDeep(bubbleScope),
      scopeName: {
        type: 'string',
        value: 'quick sort'
      }
    };



    it('initial, should update current scope and not update scope history', () => {
      const stateBefore = {
        ...initial,
        scopeHistory: [],
        currentScope: {}
      };
      const action = currentScopeUpdated(bubbleScope);
      const stateAfter = {
        ...initial,
        scopeHistory: [],
        currentScope: bubbleScope
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(reducer(stateBefore, action)).toMatchObject(stateAfter);
    });

    it('should not update scope history if same scope name', () => {
      const stateBefore = {
        ...initial,
        currentScope: bubbleScope
      };
      const action = currentScopeUpdated(sameBubbleScope);
      const stateAfter = {
        ...initial,
        currentScope: sameBubbleScope
      };

      deepFreeze(stateBefore);
      deepFreeze(action);

      const expectedState = reducer(stateBefore, action);

      expect(expectedState).toMatchObject(stateAfter);
      expect(expectedState.scopeHistory.length).toBe(stateAfter.scopeHistory.length);
    });

    it("should pop scope history if and only if scope history length is greater than 0 and current scope's name is same as last history", () => {

      const actionGlobal = deepFreeze(currentScopeUpdated(globalScope));
      const updatedGlobal = deepFreeze(reducer(initial, actionGlobal));
      const actionQuick = deepFreeze(currentScopeUpdated(quickScope));
      const updatedQuick = deepFreeze(reducer(updatedGlobal, actionQuick));
      const actionBubble = deepFreeze(currentScopeUpdated(bubbleScope));
      const updatedBubble = deepFreeze(reducer(updatedQuick, actionBubble));

      expect(updatedBubble.currentScope.scopeName.value).toBe(bubbleScope.scopeName.value);
      expect(updatedBubble.scopeHistory.length).toBeGreaterThan(0);
      expect(updatedBubble.scopeHistory.length).toBe(2);

      const actionQuickAgain = deepFreeze(currentScopeUpdated(quickScope));
      const expected = deepFreeze(reducer(updatedBubble, actionQuickAgain));

      expect(expected.scopeHistory.length).toBe(1);
    });

    it("should append scope history if current scope's name not includes history and current scope'name is not same as previous scope'name", () => {

      const actionGlobal = deepFreeze(currentScopeUpdated(globalScope));
      const updatedGlobal = deepFreeze(reducer(initial, actionGlobal));
      const actionQuick = deepFreeze(currentScopeUpdated(quickScope));
      const updatedQuick = deepFreeze(reducer(updatedGlobal, actionQuick));

      expect(updatedQuick.scopeHistory.length).toBeGreaterThan(0);

      const actionBubble = deepFreeze(currentScopeUpdated(bubbleScope));
      const updatedBubble = deepFreeze(reducer(updatedQuick, actionBubble));

      expect(() => updatedQuick.scopeHistory.map(scope => scope.scopeName.value)).not.toContain(actionBubble.currentScope.scopeName.value);
      expect(updatedBubble.scopeHistory.length).toBe(updatedQuick.scopeHistory.length + 1);
    });
  });
});