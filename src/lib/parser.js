import Interpreter from "./interpreter";
import _ from "lodash";

export const initFunc = function(interpreter, scope) {
  interpreter.setProperty(
    scope,
    "prompt",
    interpreter.createNativeFunction((...rest) => {
      var result = window.prompt(...rest);
      return result;
    })
  );

  interpreter.setProperty(
    scope,
    "alert",
    interpreter.createNativeFunction((...rest) => alert(...rest))
  );

  const obj = interpreter.createObject(interpreter.OBJECT);

  interpreter.setProperty(
    scope,
    "console",
    interpreter.createObjectProto(obj)
  );
  interpreter.setProperty(
    obj,
    "log",
    interpreter.createNativeFunction((...rest) => {
      const params = rest.map(p => {
        if (interpreter.isa(p, interpreter.ARRAY)) {
          return interpreter.pseudoToNative(p);
        }
        return p;
      });
      return console.log(...params);
    })
  );

  interpreter.setProperty(
    obj,
    "warn",
    interpreter.createNativeFunction((...rest) => console.warn(...rest))
  );

  interpreter.setProperty(
    obj,
    "clear",
    interpreter.createNativeFunction(() => console.clear())
  );
  interpreter.setProperty(
    obj,
    "error",
    interpreter.createNativeFunction((...rest) => console.error(...rest))
  );

  interpreter.setProperty(
    obj,
    "dir",
    interpreter.createNativeFunction(obj => console.dir(obj))
  );
};

export class InterpreterWrapper extends Interpreter {
  constructor(code, initFunc) {
    super(code, initFunc);
    this.code = code;
  }

  nextStep() {
    const hasNextStep = this.step();
    const stack = this.stateStack[
      this.stateStack.length - 1
    ];
    const start = stack.node.start;
    const end = stack.node.end;
    console.log(this);

    return {
      currentScope: stack.scope,
      operationType: stack.node.type,
      hasNextStep,
      start,
      end,
    };
  }
}

export function arrayToString(node) {
  return `[${Object.values(node.properties)}]`;
}

export function getHighlightOffset(charOffset, code) {
  const lines = code.split("\n");
  const linesLength = lines.map(line => line.length);
  let line = 0;
  let ch = 0;

  for (let i = 0; i < code.length + 1; i++) {
    if (i === charOffset) {
      return {
        line,
        ch:
          ch -
          linesLength
            .slice(0, line)
            .reduce((sum, lineLength) => sum + lineLength + 1, 0)
      };
    }

    if (code[i] === "\n") {
      line++;
    }

    ch++;
  }
}

export function getScopeProperties(scope) {
  let currentScope = {};

  if (!scope.parentScope) {
    currentScope = {
      window: "global Object",
      this: "window"
    };
  }

  _.forOwn(scope.properties, (value, key) => {
    if (!window.hasOwnProperty(key)) {
      if (value && typeof value === "object") {
        if (key === "this") {
          currentScope[key] = value.parentScope ? "" : "window";
        } else if (key === "arguments") {
          currentScope[key] = `${value.properties[0]}`;
        } else if (value.class === "Array") {
          currentScope[key] = arrayToString(value);
        } else if (value.class === "Function") {
          currentScope[key] = value.class;
        } else {
          currentScope[key] = `${value.properties}`;
        }
      } else {
        currentScope[key] = `${value}`;
      }
    } else if (window[key] !== scope.properties[key]) {
      console.log('in window same key', key, scope.properties[key])
      // currentScope[key] = value;
    }
  });

  return currentScope;
}
