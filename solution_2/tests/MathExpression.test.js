import { describe, it, test } from "node:test";

import assert from "node:assert";

import { MathExpression } from '../src/MathExpression.js';

describe('MathExpression', () => {

    it('should handle empty string', () => {
        const expr = MathExpression.fromString('');
        const result = expr.evaluate()
        assert.strictEqual(result, NaN, `If '' should be NaN but got ${result}`);
    });

    it('should handle null', () => {
        const expr = MathExpression.fromString('');
        const result = expr.evaluate()
        assert.strictEqual(result, NaN, `If null should be NaN but got ${result}`);
    });

    it('should handle 0', () => {
        const expr = MathExpression.fromString('0');
        const result = expr.evaluate()
        assert.strictEqual(result, 0, `If '0' should be 0 but got ${result}`);
    });

    it('should handle single argument eg "5"', () => {
        const mathExpression = '5';
        const expr = MathExpression.fromString(mathExpression);
        const result = expr.evaluate()
        const expected = 5;

        assert.strictEqual(result, expected, `${mathExpression} should be ${expected} but got ${result}`);
    });

    it('should handle two operands', () => {
        const mathExpression = '5 * 4';
        const expr = MathExpression.fromString(mathExpression);
        const result = expr.evaluate()
        const expected = 20;

        assert.strictEqual(result, expected, `${mathExpression} should be ${expected} but got ${result}`);
    });

    it('should handle three operands', () => {
        const mathExpression = '5 * 4 - 2';
        const expr = MathExpression.fromString(mathExpression);
        const result = expr.evaluate()
        const expected = 18;

        assert.strictEqual(result, expected, `${mathExpression} should be ${expected} but got ${result}`);
    })

    it('should handle complex case with all operators and 7 operands', () => {
        const mathExpression = '7 * 5 * 3 - 2 * 8 - 7 ^ 2';
        const expr = MathExpression.fromString(mathExpression);
        const result = expr.evaluate()
        const expected = 40;

        assert.strictEqual(result, expected, `${mathExpression} should be ${expected} but got ${result}`);
    })

    it('should handle complex case with two power operators and 7 operands', () => {
        const mathExpression = '7 ^ 3 * 3 - 2 * 8 - 7 ^ 2';
        const expr = MathExpression.fromString(mathExpression);
        const result = expr.evaluate()
        const expected = 964;

        assert.strictEqual(result, expected, `${mathExpression} should be ${expected} but got ${result}`);
    })
});
