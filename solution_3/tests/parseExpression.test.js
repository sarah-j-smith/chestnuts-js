import { describe, it, test } from "node:test";

import assert from "node:assert";

import parseExpression from '../src/parseExpression.js';

test('some test', () => {
    assert.equal('4', 4);
});

describe('parseExpression', () => {

    it('should handle empty string', () => {
        const result = parseExpression('');
        assert.strictEqual(result, NaN, `If '' should be NaN but got ${result}`);
    });

    it('should handle null', () => {
        const result = parseExpression();
        assert.strictEqual(result, NaN, `If null should be NaN but got ${result}`);
    });

    it('should handle 0', () => {
        const result = parseExpression('0');
        assert.strictEqual(result, 0, `If '0' should be 0 but got ${result}`);
    });

    it('should handle single argument eg "5"', () => {
        const mathExpression = '5';
        const result = parseExpression(mathExpression);
        const expected = 5;

        assert.strictEqual(result, expected, `${mathExpression} should be ${expected} but got ${result}`);
    });

    it('should handle two operands', () => {
        const mathExpression = '5 * 4';
        const result = parseExpression(mathExpression);
        const expected = 20;

        assert.strictEqual(result, expected, `${mathExpression} should be ${expected} but got ${result}`);
    });

    it('should handle three operands', () => {
        const mathExpression = '5 * 4 - 2';
        const result = parseExpression(mathExpression);
        const expected = 18;

        assert.strictEqual(result, expected, `${mathExpression} should be ${expected} but got ${result}`);
    })

    it('should handle complex case with all operators and 7 operands', () => {
        const mathExpression = '7 * 5 * 3 - 2 * 8 - 7 ^ 2';
        const result = parseExpression(mathExpression);
        const expected = 40;

        assert.strictEqual(result, expected, `${mathExpression} should be ${expected} but got ${result}`);
    })
});
