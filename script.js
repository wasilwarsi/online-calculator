// setting up Calculator's different state variables
        let currentInput = '0';
        let previousInput = '';
        let operation = null;
        let resetInput = false;

        // DOM elements
        const display = document.getElementById('display');
        const historyDisplay = document.getElementById('history');
        const numberButtons = document.querySelectorAll('.btn-number');
        const operatorButtons = document.querySelectorAll('.btn-operator, .btn-special');
        const clearButton = document.getElementById('clear');
        const equalsButton = document.getElementById('equals');
        const decimalButton = document.getElementById('decimal');
        const squareButton = document.getElementById('square');
        const moduloButton = document.getElementById('modulo');

        // this function updates the display
        function updateDisplay() {
            display.textContent = currentInput;
            if (operation) {
                historyDisplay.textContent = `${previousInput} ${operation}`;
            } else {
                historyDisplay.textContent = '';
            }
        }

        // this function adds a number to the display
        function inputNumber(number) {
            if (currentInput === '0' || resetInput) {
                currentInput = number;
                resetInput = false;
            } else {
                currentInput += number;
            }
            updateDisplay();
        }

        // this function adds a decimal point
        function inputDecimal() {
            if (resetInput) {
                currentInput = '0.';
                resetInput = false;
                updateDisplay();
                return;
            }
            
            if (!currentInput.includes('.')) {
                currentInput += '.';
                updateDisplay();
            }
        }

        // This function handles operator selection
        function selectOperator(op) {
            // to check if there's a previous operation waiting, calculate it first
            if (operation && !resetInput) {
                calculate();
            }

            // Special operations like square and modulo are calculated immediately
            if (op === '²') {
                square();
                return;
            }
            
            if (op === '%') {
                modulo();
                return;
            }
            
            // For standard operators
            previousInput = currentInput;
            operation = op;
            resetInput = true;
            updateDisplay();
        }

        // this function helps with the calculation
        function calculate() {
            let result;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            switch (operation) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '×':
                    result = prev * current;
                    break;
                case '/':
                    result = prev / current;
                    break;
                default:
                    return;
            }
            
            currentInput = result.toString();
            operation = null;
            resetInput = true;
            updateDisplay();
        }

        // this function squares the current number
        function square() {
            const num = parseFloat(currentInput);
            if (isNaN(num)) return;
            
            currentInput = (num * num).toString();
            updateDisplay();
        }

        // this function performs the modulo operation
        function modulo() {
            const num = parseFloat(currentInput);
            if (isNaN(num)) return;
            
            // For modulo, we'll divide by 100 to get percentage
            currentInput = (num / 100).toString();
            updateDisplay();
        }

        // this function clears the calculator
        function clear() {
            currentInput = '0';
            previousInput = '';
            operation = null;
            updateDisplay();
        }

        // Event listeners for number buttons
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                inputNumber(button.textContent);
            });
        });

        // Event listeners for operator buttons
        operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                selectOperator(button.textContent);
            });
        });

        // Event listener for decimal button
        decimalButton.addEventListener('click', inputDecimal);

        // Event listener for equals button
        equalsButton.addEventListener('click', calculate);

        // Event listener for clear button
        clearButton.addEventListener('click', clear);

        // Event listener for square button
        squareButton.addEventListener('click', () => selectOperator('²'));

        // Event listener for modulo button
        moduloButton.addEventListener('click', () => selectOperator('%'));

        // for the keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                inputNumber(e.key);
            } else if (e.key === '.') {
                inputDecimal();
            } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                selectOperator(e.key === '*' ? '×' : e.key);
            } else if (e.key === '%') {
                selectOperator('%');
            } else if (e.key === 'Enter' || e.key === '=') {
                calculate();
            } else if (e.key === 'Escape') {
                clear();
            } else if (e.key === 'Backspace') {
                if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
                    currentInput = '0';
                } else {
                    currentInput = currentInput.slice(0, -1);
                }
                updateDisplay();
            }
        });

        // Initialize the display
        updateDisplay();