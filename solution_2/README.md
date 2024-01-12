# Solution 2

Tree in Javascript

# Prerequisites

Requires the following installed locally:

* [Node](https://nodejs.org/en/download) - v20.9.0 was used

# Setup

```bash
cd solution_1
```

## Run Tests 

```bash
node --test tests/
```

Note there is currently no Visual Studio Code support for Node TestRunner.

## View in Browser

```bash
npx serve
```

# Description

* Language: Javascript ES6
* Test framework: Node TestRunner
* Method: 
    1. Parse expression to [AST](https://dev.to/balapriya/abstract-syntax-tree-ast-explained-in-plain-english-1h38)
    2. Evaluate AST

Benefits (over [Solution 1]):

* No `node_modules` is required, as the `node` package > 18.0 includes the test runner.
* Simple setup and initialisation. If node is installed it runs out of the box.
* More succinct JS code - can still use JsDoc

Drawbacks:

* Not supported for test GUI runner in Visual Studio code
* Javascript is not typed 

[Solution 1]: ../solution_1/README.md