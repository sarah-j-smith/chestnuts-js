import { MathExpression } from '../MathExpression';

describe('MathExpression', () => {

    it('should handle empty string', () => {
        const expr = MathExpression.fromString('');
        const result = expr.evaluate()
        expect(result).toBe(NaN);
    });

    it('should handle null', () => {
        const expr = MathExpression.fromString('');
        const result = expr.evaluate()
        expect(result).toBe(NaN);
    });

    it('should handle 0', () => {
        const expr = MathExpression.fromString('0');
        const result = expr.evaluate()
        expect(result).toEqual(0);
    });

    it('should handle single argument eg "5"', () => {
        const mathExpression = '5';
        const expr = MathExpression.fromString(mathExpression);
        const result = expr.evaluate()
        const expected = 5;

        expect(result).toEqual(expected);
    });

    it('should handle two operands', () => {
        const mathExpression = '5 * 4';
        const expr = MathExpression.fromString(mathExpression);
        const result = expr.evaluate()
        const expected = 20;

        expect(result).toEqual(expected);
    });

    it('should handle three operands', () => {
        const mathExpression = '5 * 4 - 2';
        const expr = MathExpression.fromString(mathExpression);
        const result = expr.evaluate()
        const expected = 18;

        expect(result).toEqual(expected);
    })

    it('should handle complex case with all operators and 7 operands', () => {
        const mathExpression = '7 * 5 * 3 - 2 * 8 - 7 ^ 2';
        const expr = MathExpression.fromString(mathExpression);
        const result = expr.evaluate()
        const expected = 40;

        expect(result).toEqual(expected);
    })

    it('should handle complex case with two power operators and 7 operands', () => {
        const mathExpression = '7 ^ 3 * 3 - 2 * 8 - 7 ^ 2';
        const expr = MathExpression.fromString(mathExpression);
        const result = expr.evaluate()
        const expected = 964;

        expect(result).toEqual(expected);
    })
});
