const expressionField = document.getElementById('math-expression-input');
const calculateButton = document.getElementById('math-expression-button');
const errorDisplay = document.getElementById('math-expression-error');
const resultDisplay = document.getElementById('math-expression-result');

/**
 * Handler for the form submit event to suppress default behaviours
 * @param {Event} ev 
 */
function formSubmitInitialiser(ev) {
    ev.preventDefault();
    ev.stopPropagation();
}

document.getElementsByTagName('form')[0]?.addEventListener('submit', formSubmitInitialiser);

/**
 * Handler for the calculate button. Invokes the MathExpression evaluator.
 * @param {Event} ev 
 */
async function clickHandler(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    const { default: parseExpression } = await import('./src/parseExpression.js');

    let resultValue = parseExpression(expressionField.value);
    if (isNaN(resultValue)) {
        const errorText = 'Invalid expression';
        errorDisplay.style.visibility = 'visible';
        errorDisplay.textContent = `Error: ${errorText}`
    } else {
        resultDisplay.style.visibility = 'visible';
        resultDisplay.innerText = `Result: ${resultValue}`
    }
}

calculateButton?.addEventListener('click', clickHandler)
