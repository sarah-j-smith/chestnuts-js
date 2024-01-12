/**
 * @module MathExpression
 */

/**
 * Evaluation precedence of operators. Default value for number nodes 
 * is null, which is coerced to zero. The lower the precedence, the 
 * lower in the tree. We think of root at the top. For now, there's 
 * no unary operators, and only 3 operations are supported. 
 * @enum {number}
 * @readonly
 */
const Precedence = {
    POWER: 10,
    MULTIPLY: 20,
    SUBSTRACT: 30
};

/**
 * Operator kinds - for now just use the ones in the examples
 * @enum {string}
 * @readonly
 */
const OpCode = {
    SUBTRACT: 'subtract',
    MULTIPLY: 'multiply',
    POWER: 'power'
};

/**
 * Container for operators and operands in the expression tree
 */
class MathNode {

    op;
    precedence;
    numberValue;
    lhs;
    rhs;

    /**
     * Create a new `MathNode` with an operator and precedence.
     * @param {number} [numberValue] number, if this node holds a numerical value, null otherwise
     * @param {OpCode} [op] operation for this node, if this is an operation node, null otherwise
     * @param {Precedence} [precedence] precedence, if this is an operation node, null otherwise 
     * @param {MathNode} [lhs] left hand side child node, null for leaf (number) nodes
     * @param {MathNode} [rhs] right hand side child node, null for leaf (number) nodes
     */
    constructor(numberValue, op, precedence, lhs, rhs) {
        this.numberValue = numberValue;
        this.op = op;
        this.precedence = precedence;
        this.lhs = lhs;
        this.rhs = rhs;
    }

    /**
     * Insert an operation node and RHS operation into the tree at this point.
     * @param {MathNode} opNode Incoming node to be inserted in correct order.
     * @returns {MathNode} the new node at this position, or this node if its unchanged.
     */
    insert(opNode) {
        if (this.precedence > opNode.precedence) {
            // incoming is <= this, insert below, to the right
            if (this.rhs.precedence > opNode.precedence) {
                this.rhs = this.rhs.insert(opNode);
            } else {
                opNode.lhs = this.rhs;
                this.rhs = opNode;
            }
            return this;
        } else {
            // incoming is > this, insert above, to the right
            opNode.lhs = this;
            return opNode;
        }
    }

    /**
     * Evaluate this subtree in pre-order traversal to find the numeric value of it.
     * @returns Numeric value of this node and the ones below it.
     */
    evaluate() {
        if (this.op) {
            const lval = this.lhs.evaluate();
            const rval = this.rhs.evaluate();
            console.log(`Evaluating: ${lval} ${this.op} ${rval}`)
            switch (this.op) {
                case OpCode.MULTIPLY:
                    return lval * rval;
                case OpCode.SUBTRACT:
                    return lval - rval;
                case OpCode.POWER:
                    return Math.pow(lval, rval);
                default:
                    throw TypeError(`Evaluate expected operator, got ${this.op}`);
            }
        } else {
            return this.numberValue;
        }
    }
}

class MathExpression {

    root;
    error;
    input;

    /**
     * Create a MathExpression
     * @param {MathNode} [root] 
     * @param {Error} [error] 
     * @param {string} [input]
     */
    constructor(root, error, input) {
        this.root = root;
        this.error = error;
        if (input) {
            this.root = MathExpression.fromString(input);
        }
    }

    /// Token parser stream
    e = [];

    /**
     * Create a new MathExpression from a given string.
     * @param {string} expression 
     * @returns new MathExpression object
     */
    static fromString(expression) {
        let expr = new MathExpression();
        expr.e = expression.split(' ');
        try {
            expr.root = expr.expectValue()
            while (expr.e.length > 0) {
                const term = expr.expectExpression();
                expr.root = expr.root.insert(term);
            }
        } catch (error) {
            expr.error = error;
        }

        return expr;
    }

    /**
     * Parse and consume two tokens and expect an operator and a number
     * @param {Array<string>} tokens 
     * @returns {MathNode}
     */
    expectExpression() {
        const opNode = this.expectOperation();
        opNode.rhs = this.expectValue();
        return opNode;
    }

    /**
     * Parse and consume a token and expect a number
     * @returns {MathNode} with a number value
     */
    expectValue() {
        const token = this.e.shift();
        let v = parseFloat(token)
        if (typeof v === 'number' && v !== NaN) {
            return new MathNode(v);
        }
        throw new TypeError(`Expected value, got ${token}`)
    }

    /**
     * Parse a token and expect an operation
     * @returns {OpCode} or throws TypeError
     */
    expectOperation() {
        const token = this.e.shift();
        switch (token) {
            case '*':
                return new MathNode(null, 'multiply', Precedence.MULTIPLY);
            case '-':
                return new MathNode(null, 'subtract', Precedence.SUBSTRACT);
            case '^':
                return new MathNode(null, 'power', Precedence.POWER);
            default:
                throw new TypeError(`Expected operation, got ${token}`)
        }
    }

    /**
     * Calculate the arithmetic value of the tree, or NaN if there is an error.
     * @returns number value from  evaluation of the expression
     */
    evaluate() {
        if (this.error) {
            return NaN;
        } else {
            return this.root.evaluate();
        }
    }
}

export { MathExpression, MathNode }