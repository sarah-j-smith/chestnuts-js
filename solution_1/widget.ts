import { MathExpression } from './MathExpression.js';

const expressionField = document.getElementById('math-expression-input') as HTMLInputElement;
const calculateButton = document.getElementById('math-expression-button');
const errorDisplay = document.getElementById('math-expression-error') as HTMLParagraphElement;
const resultDisplay = document.getElementById('math-expression-result') as HTMLParagraphElement;

/**
 * Handler for the form submit event to suppress default behaviours
 * @param {Event} ev 
 */
function formSubmitInitialiser(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
}

document.getElementsByTagName('form')[0]?.addEventListener('submit', formSubmitInitialiser);

/**
 * Handler for the calculate button. Invokes the MathExpression evaluator.
 * @param {Event} ev 
 */
function clickHandler(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    let expr = MathExpression.fromString(expressionField.value)
    let resultValue = expr.evaluate();
    if (expr.error) {
        const errorText = `${expr.error.name}: ${expr.error.message}`
        errorDisplay.style.visibility = 'visible';
        errorDisplay.textContent = `Error: ${errorText}`
    } else {
        resultDisplay.style.visibility = 'visible';
        resultDisplay.innerText = `Result: ${resultValue}`
    }
}

calculateButton?.addEventListener('click', clickHandler)

console.log('Typescript loaded successfully!')
