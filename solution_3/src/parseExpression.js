const evaluate = (lhs, rhs, op) => {
    switch (op) {
        case '*':
            return lhs * rhs
        case '-':
            return lhs - rhs
        case '^':
            return Math.pow(lhs, rhs)
        default:
            throw TypeError(`Evaluate expected operator, got ${op}`);
    }
}

const precedence = (op) => {
    switch (op) {
        case '*':
            return 20;
        case '-':
            return 10; 
            break;
        case '^':
            return 30;
        default:
            return -1;
    }
}

const parseExpressionString = (mathExpression) => {
    const tokens = mathExpression.split(' ')
    const token_count = tokens.length

    if (token_count === 0) {
        throw Error(`Could not parse tokens from expression '${mathExpression}'`);
    }
    
    if (token_count === 1) {
        let result = parseFloat(tokens[0]);
        if (result === NaN) {
            throw Error(`Could not parse number from single token expression '${tokens[0]}'`)
        }
        return result
    }

    let e = [];

    // Parse token stream into values & operators + precedence
    // and check for validity, with alternating operators and values
    let expect = 'number';
    for (let ix = 0; ix < token_count; ix += 1) {
        const tok = tokens[ix];
        let prec = precedence(tok); // try if its an operator
        if (prec === -1) {
            let num = parseFloat(tok);  // not operator, try if its a value
            if (num === NaN) {
                throw Error(`Expected number, got '${tok}' in '${mathExpression}'`);
            }
            if (expect === 'number') {
                e.push({ num, 'prec': null, 'op': null });
                expect = 'operator';
            } else {
                throw Error(`Expected ${expect}, got '${tok}' in '${mathExpression}'`);
            }
        } else {
            let op = tok;
            if (expect === 'operator') {
                e.push({ 'num': null, prec, op })
                expect = 'number';
            } else {
                throw Error(`Expected ${expect}, got '${tok}' in '${mathExpression}'`);
            }
        }
    }
    
    while (e.length > 1) {

        // Find the highest precedence in the expr stream
        let hi = e.reduce((prev, curr) => { 
            return curr.prec > prev ? curr.prec : prev 
        }, -1);

        // Find successive expr's with that precedence
        let ix = e.findIndex((tok) => (tok.prec === hi));
        while (ix > 0) {
            e[ix] = { 
                num: evaluate(e[ix-1].num, e[ix+1].num, e[ix].op),
                prec: null,
                op: null
            }
            e[ix - 1] = null;
            e[ix + 1] = null;
            e = e.filter((term) => term !== null);
            ix = e.slice(ix-1).findIndex((expr) => (expr.prec === hi))
        }
    }
    return e[0].num;
}

/**
* Evaluate a string that contains a mathematical expression.
* @param {string} mathExpression
* @returns number value of the result, or NaN if it could not be evaluated.
*/
const parseExpression = (mathExpression) => {
    if (mathExpression) {
        try {
            return parseExpressionString(mathExpression);
        } catch (err) {
            console.log(err);
            return NaN;
        }
    } else {
        return NaN;
    }
}

export default parseExpression
