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
enum Precedence {
    POWER = 10,
    MULTIPLY = 20,
    SUBSTRACT = 30
};

/**
 * Operator kinds - for now just use the ones in the examples
 * @enum {string}
 * @readonly
 */
type OpCode = 'subtract' | 'multiply' | 'power';

/**
 * Container for operators and operands in the expression tree
 */
class MathNode {

    numberValue: number | null;
    op: OpCode | null;
    precedence: Precedence | null;
    lhs: MathNode | null;
    rhs: MathNode | null;

    /**
     * Create a new `MathNode` with an operator and precedence.
     * @param {number} [numberValue] number, if this node holds a numerical value, null otherwise
     * @param {OpCode} [op] operation for this node, if this is an operation node, null otherwise
     * @param {Precedence} [precedence] precedence, if this is an operation node, null otherwise 
     * @param {MathNode} [lhs] left hand side child node, null for leaf (number) nodes
     * @param {MathNode} [rhs] right hand side child node, null for leaf (number) nodes
     */
    constructor(numberValue: number | null = null, op: OpCode | null = null, precedence: Precedence | null = null) {
        this.numberValue = numberValue;
        this.op = op;
        this.precedence = precedence;
        this.lhs = null;
        this.rhs = null;
    }

    /**
     * Insert an operation node and RHS operation into the tree at this point.
     * @param {MathNode} opNode Incoming node to be inserted in correct order.
     * @returns {MathNode} the new node at this position, or this node if its unchanged.
     */
    insert(opNode: MathNode): MathNode {
        const prec = this.precedence ?? 0;
        if (opNode.precedence) {
            if (prec > opNode.precedence) {
                // incoming is <= this, insert below, to the right
                const rhsPrec = this.rhs?.precedence ?? 0;
                if (this.rhs && rhsPrec > opNode.precedence) {
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
        throw new Error('Insert called with no precedence');
    }

    /**
     * Evaluate this subtree in pre-order traversal to find the numeric value of it.
     * @returns Numeric value of this node and the ones below it.
     */
    evaluate(): number {
        if (this.op) {
            if (this.lhs && this.rhs) {
                const lval = this.lhs?.evaluate();
                const rval = this.rhs?.evaluate();
                console.log(`Evaluating: ${lval} ${this.op} ${rval}`)
                switch (this.op) {
                    case 'multiply':
                        return lval * rval;
                    case 'subtract':
                        return lval - rval;
                    case 'power':
                        return Math.pow(lval, rval);
                    default:
                        throw TypeError(`Evaluate expected operator, got ${this.op}`);
                }
            } else {
                throw new Error(`Operation must have lhs and rhs, got ${this.lhs} and ${this.rhs}`);
            }
        }
        // assert that this must be a number node, if its not an operation node
        return this.numberValue as number;
    }
}

class MathExpression {

    root?: MathNode;
    error?: Error;
    input?: string;

    /**
     * Create a MathExpression
     * @param {MathNode} [root] 
     * @param {Error} [error] 
     * @param {string} [input]
     */
    constructor(root?: MathNode, error?:Error, input?: string) {
        this.input = input;
        if (input) {
            const expr = MathExpression.fromString(input);
            this.root = expr.root;
            this.e = expr.e;
            this.error = expr.error;
        } else {
            this.root = root;
            this.error = error;
        }
    }

    /// Token parser stream
    e: string[] = [];

    /**
     * Create a new MathExpression from a given string.
     * @param {string} expression 
     * @returns new MathExpression object
     */
    static fromString(expression: string) {
        let expr = new MathExpression();
        expr.e = expression.split(' ');
        try {
            expr.root = expr.expectValue()
            while (expr.e.length > 0) {
                const term = expr.expectExpression();
                expr.root = expr.root.insert(term);
            }
        } catch (error) {
            if (error instanceof Error) {
                expr.error = error;
            } else {
                expr.error = Error(`Error: ${error}`);
            }
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
    expectValue(): MathNode {
        const token = this.e.shift();
        if (token !== undefined) {
            let v = parseFloat(token)
            if (typeof v === 'number' && !Number.isNaN(v)) {
                return new MathNode(v);
            }
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
            return this.root?.evaluate() ?? NaN;
        }
    }
}

export { MathExpression, MathNode }