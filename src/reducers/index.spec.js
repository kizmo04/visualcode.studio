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

const setup = (setupBefore = {}, setupAfter = {}, action = {}) => {
  const defaultState = deepFreeze(_.cloneDeep(initialState));
  const stateBefore = { ...defaultState, ...setupBefore };
  const stateAfter = { ...defaultState, ...setupAfter };

  deepFreeze(stateBefore);
  deepFreeze(action);

  return {
    stateBefore,
    stateAfter,
    action
  };
};

describe('reducer', () => {

  it('should provide the initial state', () => {
    const { stateAfter } = setup();

    expect(reducer(undefined, {})).toEqual(stateAfter);
  });

  describe('CODE_SHARED action', () => {

    it('should handle CODE_SHARED action', () => {
      const { stateBefore, stateAfter, action } = setup(
        {},
        {
          sharedCodeId: 'code'
        },
        codeShared('code')
      );

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('CODE_CHANGED', () => {

    it('should handle CODE_CHANGED action', () => {
      const { stateBefore, stateAfter, action } = setup(
        {},
        {
          code: 'function foo () \n\n\n}'
        },
        codeChanged('function foo () \n\n\n}')
      );

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('NEXT_STEP_DECIDED', () => {

    it('should handle NEXT_STEP_DECIDED action', () => {
      const { stateBefore, stateAfter, action } = setup(
        {
          hasNextStep: false
        },
        {
          hasNextStep: true
        },
        nextStepDecided(true)
      );

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('OPERATION_TYPE_UPDATED', () => {

    it('should handle OPERATION_TYPE_UPDATED action', () => {
      const { stateBefore, stateAfter, action } = setup(
        {
          operationType: ''
        },
        {
          operationType: 'FunctionDeclaration'
        },
        operationTypeUpdated('FunctionDeclaration')
      );

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('INTERPRETER_STOPPED', () => {

    it('should INTERPRETER_STOPPED action', () => {
      const { stateBefore, stateAfter, action } = setup(
        {
          isRunning: true
        },
        {
          isRunning: false
        },
        interpreterStopped(false)
      );

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('INTERPRETER_RUNNING', () => {

    it('should INTERPRETER_RUNNING action', () => {
      const { stateBefore, stateAfter, action } = setup(
        {
          isRunning: false
        },
        {
          isRunning: true
        },
        interpreterRunning(false)
      );

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('RUNNING_SPEED_CHANGED', () => {

    it('should RUNNING_SPEED_CHANGED', () => {
      const { stateBefore, stateAfter, action } = setup(
        {
          runningSpeed: 100
        },
        {
          runningSpeed: 1
        },
        runningSpeedChanged(1)
      );

      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('INTERPRETER_STATE_RESET', () => {

    it('should INTERPRETER_STATE_RESET action', () => {
      const { stateBefore, stateAfter, action } = setup(
        {
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
        },
        {
          currentScope: {},
          hasNextStep: true,
          operationType: '',
          isRunning: false
        },
        interpreterStateReset()
      );

      expect(reducer(stateBefore, action)).toMatchObject(stateAfter);
    });
  });

  describe('CURRENT_SCOPE_UPDATED', () => {

    let globalScope, bubbleScope, sameBubbleScope, quickScope;

    beforeEach(() => {
      globalScope = {
        scopeName: {
          type: 'string',
          value: 'Global'
        }
      };

      bubbleScope = {
        scopeName: {
          type: 'string',
          value: 'bubble sort'
        },
        arr: {
          type: 'Array',
          value: [1, 2, 3]
        }
      };

      sameBubbleScope = {
        ..._.cloneDeep(bubbleScope),
        i: {
          type: 'number',
          value: 2
        }
      };

      quickScope = {
        ..._.cloneDeep(bubbleScope),
        scopeName: {
          type: 'string',
          value: 'quick sort'
        }
      };
    });

    it('initial, should update current scope and not update scope history', () => {
      const { stateBefore, stateAfter, action } = setup(
        {
          scopeHistory: [],
          currentScope: {}
        },
        {
          scopeHistory: [],
          currentScope: bubbleScope
        },
        currentScopeUpdated(bubbleScope)
      );

      expect(reducer(stateBefore, action)).toMatchObject(stateAfter);
    });

    it('should not update scope history if same scope name', () => {
      const { stateBefore, stateAfter, action } = setup(
        {
          scopeHistory: [],
          currentScope: bubbleScope
        },
        {
          scopeHistory: [],
          currentScope: sameBubbleScope
        },
        currentScopeUpdated(sameBubbleScope)
      );

      const receivedState = reducer(stateBefore, action);

      expect(receivedState).toMatchObject(stateAfter);
      expect(receivedState.scopeHistory.length).toBe(stateAfter.scopeHistory.length);
    });

    it("should pop scope history if and only if scope history length is greater than 0 and current scope's name is same as last history", () => {
      const defaultState = deepFreeze(_.cloneDeep(initialState));

      const actionGlobal = deepFreeze(currentScopeUpdated(globalScope));
      const updatedGlobal = deepFreeze(reducer(defaultState, actionGlobal));
      const actionQuick = deepFreeze(currentScopeUpdated(quickScope));
      const updatedQuick = deepFreeze(reducer(updatedGlobal, actionQuick));
      const actionBubble = deepFreeze(currentScopeUpdated(bubbleScope));
      const updatedBubble = deepFreeze(reducer(updatedQuick, actionBubble));

      // state before
      expect(updatedBubble.currentScope.scopeName.value).toBe(bubbleScope.scopeName.value);
      expect(updatedBubble.scopeHistory.length).toBeGreaterThan(0);
      expect(updatedBubble.scopeHistory.length).toBe(2);

      const actionQuickAgain = deepFreeze(currentScopeUpdated(quickScope));
      const expected = deepFreeze(reducer(updatedBubble, actionQuickAgain));

      // state after
      expect(expected.scopeHistory.length).toBe(1);
    });

    it("should append scope history if current scope's name not includes history and current scope'name is not same as previous scope'name", () => {
      const defaultState = deepFreeze(_.cloneDeep(initialState));

      const actionGlobal = deepFreeze(currentScopeUpdated(globalScope));
      const updatedGlobal = deepFreeze(reducer(defaultState, actionGlobal));
      const actionQuick = deepFreeze(currentScopeUpdated(quickScope));
      const updatedQuick = deepFreeze(reducer(updatedGlobal, actionQuick));

      // state before
      expect(updatedQuick.scopeHistory.length).toBeGreaterThan(0);

      const actionBubble = deepFreeze(currentScopeUpdated(bubbleScope));
      const updatedBubble = deepFreeze(reducer(updatedQuick, actionBubble));

      // state after
      expect(() => updatedQuick.scopeHistory.map(scope => scope.scopeName.value)).not.toContain(actionBubble.currentScope.scopeName.value);
      expect(updatedBubble.scopeHistory.length).toBe(updatedQuick.scopeHistory.length + 1);
    });
  });
});