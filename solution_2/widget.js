import { MathExpression } from './src/MathExpression.js';

const expressionField = document.getElementById('math-expression-input');
const calculateButton = document.getElementById('math-expression-button');
const errorDisplay = document.getElementById('math-expression-error');
const resultDisplay = document.getElementById('math-expression-result');

function formSubmitInitialiser(ev) {
    ev.preventDefault();
    ev.stopPropagation();
}

document.getElementsByTagName('form')[0]?.addEventListener('submit', formSubmitInitialiser);

/**
 * Handler for the calculate button. Invokes the MathExpression evaluator.
 * @param {Event} ev 
 */
function clickHandler(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    let expr = MathExpression.fromString(expressionField.value)
    let resultValue = expr.evaluate();
    if (expr.error) {
        const errorText = `${expr.error.name}: ${expr.error.message}`
        // resultDisplay.style.visibility = 'hidden';
        errorDisplay.style.visibility = 'visible';
        errorDisplay.textContent = `Error: ${errorText}`
    } else {
        resultDisplay.style.visibility = 'visible';
        // errorDisplay.style.visibility = 'hidden';
        resultDisplay.innerText = `Result: ${resultValue}`
    }
}

calculateButton?.addEventListener('click', clickHandler)
expressionField?.addEventListener('keyup', function(ev) {
    if (ev.key === 'Enter') {
        clickHandler(ev);
    }
})