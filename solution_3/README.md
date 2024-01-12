# Solution 3

Tabulation in Javascript

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
* Method: Tabulation

Benefits (over above):

* Less storage/memory space 
    - tabulation can store pre-calculated objects (memo-ization)
    - node objects do not require LHS and RHS pointers
    - no recursion means stack memory is not used
* Simpler and dramatically smaller code
* Does not require creation of objects on the heap
* Executes about 4 x faster than tree based solution
    - based on execution times for tests

Drawbacks:

* Terse solution may be more difficult to understand
* May require understanding of tabulation and dynamic programming to maintain

# Algorithm

This solution does the following:

1. Parse the expression into a table
    * operator cells are decorated with the precedence 
2. Traverse the table by operator in precedence then left to right order
    * replace each operator by its evaluation 

This is effectively a dynamic programming (tabulation) approach for the
tree traversal.

## Precedence

The `5` here represents _any_ number, including `0`, `85` and `4.1`.

| operator |  name     |  precedence |
|----------|-----------|-------------|
|   `5`    | number    |    `null`   |
|   `^`    | power     |    `10`     |
|   `x`    | multiply  |    `20`     |
|   `-`    | subtract  |    `30`     |

For now unary operators such as `-5` and also parentheses are not supported.

Also there's only one operator for each precedence level as the others are trivially added.

Note that we calculated the precedence once for each operator node and store it with the
operator, effectively memo-izing it for that node.

## Precedence and table cells

To build the table I used nodes that have alternate structure:

* value nodes - always a odd-numbered cells: 

```javascript
{ 
    num: 5, 
    op: null, 
    prec: null
}
```

* operations  - always even numbered cells: 

```javascript
{ 
    num: null, 
    op: `multiply`, 
    prec: 20
}
```

For the tabulated solution no LHS or RHS child references are required.

## Evaluation

Evaluation is not challenging. 

1. Determine precedence of lowest precedence operator
2. Working left-to-right, for each operator with that precedence
    * _Evaluate()_ it
    * Replace it with its evaluation
    * Null out the values to LHS and RHS of it
    * Coalesce

_Evaluate()_  
* Case 1: Operator
    3. _return_ Operator(LHS, RHS)
* Case 2: Number
    1. _return_ number

## Evaluation Example

Consider `7 * 5 * 3 - 2 * 8 ^ 2`

### Step 0 - After Parse - with precedence memoised

|         |  0  |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  |  10 |
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  op     |  7  |  *  |  5  |  *  |  3  |  -  |  2  |  *  |  8  |  ^  |  2  |
| prec    |     |  20 |     |  20 |     |  30 |     |  20 |     |  10 |     |


### Step 1 - Precedence 10 operators

* Lowest precedence is 10 - `^`
* Evaluate all precedence 10 operators, left to right

|         |  0  |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  |  10 |
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  op     |  7  |  *  |  5  |  *  |  3  |  -  |  2  |  *  |     |  64 |     |
| prec    |     |  20 |     |  20 |     |  30 |     |  20 |     |     |     |


### Step 2 - Precedence 20 operators

* Lowest precedence is 20 - `*`
* Evaluate all precedence 20 operators, left to right

`Coalesce, Evaluate( *, 7, 5 )`

|         |  0  |  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  | 
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  op     |     |  35 |     |  *  |  3  |  -  |  2  |  *  | 64  |
| prec    |     |     |     |  20 |     |  30 |     |  20 |     |

`Coalesce`

|         |  0  |  1  |  2  |  3  |  4  |  5  |  6  | 
| ------- | --- | --- | --- | --- | --- | --- | --- |
|  op     |  35 |  *  |  3  |  -  |  2  |  *  | 64  |
| prec    |     |  20 |     |  30 |     |  20 |     |

`Evaluate( *, 35, 3 )`

|         |  0  |  1  |  2  |  3  |  4  |  5  |  6  | 
| ------- | --- | --- | --- | --- | --- | --- | --- |
|  op     |     | 105 |     |  -  |  2  |  *  | 64  |
| prec    |     |     |     |  30 |     |  20 |     |

`Coalesce`

|         |  0  |  1  |  2  |  3  |  4  |
| ------- | --- | --- | --- | --- | --- |
|  op     | 105 |  -  |  2  |  *  | 64  |
| prec    |     |  30 |     |  20 |     |

`Evaluate( *, 2, 64 )`

|         |  0  |  1  |  2  |  3   |  4  |
| ------- | --- | --- | --- | ---  | --- |
|  op     | 105 |  -  |     |  128 |     |
| prec    |     |  30 |     |      |     |

`Coalesce`

|         |  0  |  1  |  2   | 
| ------- | --- | --- | ---- | 
|  op     | 105 |  -  |  128 |
| prec    |     |  30 |      | 


### Step 3 - Precedence 30 operators

* Lowest precedence is 30 - `-`
* Evaluate all precedence 30 operators, left to right

`Evaluate( -, 105, 128 )`

|         |  0  |  1  |  2   | 
| ------- | --- | --- | ---- | 
|  op     |     | -23 |      |
| prec    |     |     |      | 

`Coalesce`

|         |  0  | 
| ------- | --- | 
|  op     | -23 |
| prec    |     |

### Step 4 - Table size is 1, read answer from 0th element

`Answer: -23`