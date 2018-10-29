import Interpreter from "./interpreter";
import _ from "lodash";

// global to ignore
const LITERAL = "Literal";
const ARRAY_EXPRESSION = "ArrayExpression";
const IDENTIFIER = "Identifier";
const VARIABLE_DECLARATOR = "VariableDeclarator";
const VARIABLE_DECLARATION = "VariableDeclaration";
const BINARY_EXPRESSION = "BinaryExpression";
const CREATION = "CREATION";
const EXCUTION = "EXCUTION";
const EXCUTION_IF = "EXCUTION_IF";
const EXCUTION_LOOP = "EXCUTION_LOOP";
const EXCUTION_LOOP_BEGIN = "EXCUTION_LOOP_BEGIN";
const EXPRESSION_STATEMENT = "ExpressionStatement";

const BLOCK_STATEMENT = "BlockStatement";
const IF_STATEMENT = "IfStatement";
const CONDITIONAL_EXPRESSION = "ConditionalExpression";
const UPDATE_EXPRESSION = "UpdateExpression";
const MEMBER_EXPRESSION = "MemberExpression";
const FOR_STATEMENT = "ForStatement";
const ASSIGNMENT_EXPRESSION = "AssignmentExpression";

const ignoreWindowProperties = [
  "window",
  "this",
  "NaN",
  "Infinity",
  "undefined",
  "self",
  "Function",
  "Object",
  "Array",
  "String",
  "Boolean",
  "Number",
  "Date",
  "RegExp",
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  "Math",
  "JSON",
  "eval",
  "parseInt",
  "parseFloat",
  "isNaN",
  "isFinite",
  "prompt",
  "alert",
  "console",
  "setTimeout",
];

const mapPropsStepFunctionKeys = node => ({
  ArrayExpression: {},
  BinaryExpression: {},
  AssignmentExpression: {},
  CallExpression: {
    callee: parseNode(node.callee),
    arguments: parseNode(node.arguments.map(node => parseNode(node)))
  },
  IfStatement: {},
  ForStatement: {
    init: parseNode(node.init),
    test: parseNode(node.test),
    update: parseNode(node.update)
  },
  BlockStatement: {},
  BreakStatement: {},
  FunctionDeclaration: {
    name: node.id.name,
    params: node.params.map(node => node.name)
  },
  CatchClause: {},
  ConditionalExpression: {},
  ContinueStatement: {},
  DebuggerStatement: {},
  DoWhileStatement: {
    test: parseNode(node.test)
  },
  EmptyStatement: {},
  EvalProgram_: {},
  ExpressionStatement: {
    type: node.expression.type,
    callee: node.expression.callee.name
    // arguments: node.expression.arguments.map(node => )
  },
  ForInStatement: {},
  FunctionExpression: {},
  Identifier: {},
  LabeledStatement: {},
  Literal: {},
  LogicalExpression: {},
  MemberExpression: {},
  NewExpression: {},
  ObjectExpression: {},
  Program: {
    // state에 done: boolean 이 있음
  },
  ReturnStatement: {},
  SequenceExpression: {},
  SwitchStatement: {},
  ThisExpression: {},
  ThrowStatement: {},
  TryStatement: {},
  UnaryExpression: {},
  UpdateExpression: {},
  VariableDeclaration: {
    kind: node.kind,
    declarations: parseNode(node.declarations.map(node => parseNode(node)))
  },
  WithStatement: {},
  WhileStatement: {},
});

function nodeToString(node) {
  switch (node.type) {
    case BINARY_EXPRESSION:
      return `${nodeToString(node.left)} ${node.operator} ${nodeToString(
        node.right
      )}`;
    case IDENTIFIER:
      return node.name;
    case LITERAL:
      return typeof node.value === "string"
        ? node.value
        : node.value.toString();
    case ARRAY_EXPRESSION:
      return `[${node.elements.map(node => parseNode(node))}]`;
    default:
      break;
  }
}

function parseNode(state) {
  const node = state.node;
  switch (node.type) {
    case LITERAL:
      return node.value;
    case ARRAY_EXPRESSION:
      return node.elements.map(node => parseNode(node));
    case IDENTIFIER:
      return node.name;
    case VARIABLE_DECLARATION:
      return {
        type: CREATION,
        kind: node.kind,
        declarations: parseNode(node.declarations.map(node => parseNode(node))),
      };
    case VARIABLE_DECLARATOR:
      return {
        type: EXCUTION,
        initValue: node.init instanceof Node ? parseNode(node.init) : node.init,
        name: parseNode(node.id),
      };
    case MEMBER_EXPRESSION:
      const key = `${nodeToString(node.object)}[${nodeToString(
        node.property
      )}]`;
      if (node.computed) {
        return {
          name: key,
          value: state.value,
        };
      }
      return {
        name: key,
      };
    case BINARY_EXPRESSION:
      if (state["doneRight_"]) {
        const result = eval(
          `${state.leftValue_} ${node.operator} ${state.value}`
        );
        return {
          result,
          type: EXCUTION,
          left: parseNode(node.left),
          right: parseNode(node.right),
          operator: node.operator,
          leftValue: state.leftValue_,
          rightValue: state.value,
        };
      } else if (state["doneLeft_"]) {
        return {
          type: EXCUTION,
          left: parseNode(node.left),
          right: parseNode(node.right),
          operator: node.operator,
          leftValue: state.value,
        };
      }
      break;
    case UPDATE_EXPRESSION:
      return {
        type: EXCUTION_LOOP,
        argument: parseNode(node.argument),
        operator: node.operator,
        prefix: node.prefix,
      };
    case FOR_STATEMENT:
      if (state["mode_"] === 1) {
        //for 시작
      } else if (state["mode_"] === 2) {
        // test 로 분기 -> 종료냐 body 실행이냐
      } else if (state["mode_"] === 3) {
        // update 실행
      }
      return {
        type: EXCUTION_LOOP_BEGIN,
        init: parseNode(node.init),
        test: parseNode(node.test),
        update: parseNode(node.update),
      };
    case IF_STATEMENT || CONDITIONAL_EXPRESSION:
      if (state["mode_"] === 1) {
        // 시작
      } else if (state["mode_"] === 2) {
      } else if (state["mode_"] === 3) {
      }
      return {
        type: EXCUTION_IF,
        test: parseNode(node.test),
        // consequent,
      };
    case BLOCK_STATEMENT:
      return {
        node,
      };
    case EXPRESSION_STATEMENT:
      if (node["done_"]) {
        return {
          type: EXCUTION,
          done: true,
          value: node.value,
        };
      } else {
        return {
          type: EXCUTION,
          done: false,
        };
      }
    case ASSIGNMENT_EXPRESSION:
      if (node["doneRight_"]) {
        return {
          left: node.leftReference_[node.leftReference_.length - 1],
          value: node.value,
        };
      } else if (node["nodeLeft_"]) {
      }
      break;
    default:
      break;
  }
}

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

  interpreter.setProperty(scope, "console", interpreter.createObjectProto(obj));
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
    this.scopeNames = ["Global"];
  }

  nextStep() {
    const hasNextStep = this.step();
    const currentState = this.stateStack[this.stateStack.length - 1];
    const start = currentState.node.start;
    const end = currentState.node.end;

    if (currentState.func_) {
      const { name } = currentState.func_.node.id;
      this.scopeNames.push(name);
      return;
    }
    // if (currentState.node.type === "CallExpression" && currentState["doneCallee_"] && currentState.doneCallee_ === 1) {
    //   const { name } = currentState.node.callee;
    //   this.scopeNames.push(name);
    // }

    // if (currentState.node.type === "CallExpression" && currentState["doneCallee_"] && currentState.doneCallee_ === 2) {
    //   this.scopeNames.pop();
    // }
    // ignore window properties
    return {
      currentScope: {
        scopeName: this.scopeNames[this.scopeNames.length - 1],
        ...currentState.scope.properties
      },
      parent: currentState.scope.parentScope
        ? {
            ...currentState.scope.parentScope.properties
          }
        : null,
      operationType: currentState.node.type,
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
  const currentScope = {};
  _.forOwn(scope, (value, key) => {
    if (!ignoreWindowProperties.includes(key) && key !== scope.scopeName) {
      currentScope[key] = value;
      if (value && typeof value === "object") {
        if (key === "this") {
          currentScope[key] = {
            type: 'Object',
            value: value.parentScope ? "" : "window"
          };
        } else if (key === "arguments") {
          currentScope[key] = {
            type: 'ArrayLike',
            value: `${value.properties[0]}`
          };
        } else if (value.class === "Array") {
          currentScope[key] = {
            type: 'Array',
            value: arrayToString(value)
          };
        } else if (value.class === "Function") {
          currentScope[key] = {
            type: 'Function',
            value: value.class
          };
        } else {
          currentScope[key] = {
            type: typeof value.properties,
            value: `${value.properties}`
          };
        }
      } else {
        currentScope[key] = {
          type: typeof value,
          value: `${value}`
        };
      }
    }
  });

  if (scope.scopeName === "Global") {
    currentScope.window = {
      value: "global Object",
      type: "string"
    };
    currentScope.this = {
      value: "window",
      type: "string"
    };
  }

  return currentScope;
}
