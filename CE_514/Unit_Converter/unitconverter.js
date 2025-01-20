//This part makes it so as the input is entered, it does the conversion automatically without having to push any "convert" button
document.addEventListener('DOMContentLoaded', () => { //The AddEventListener makes it so it waits for the DOM to be fully loaded. DOM means Document Object Model
    const inputField = document.getElementById('value'); //const means a constant variable that cannot be reassigned
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const resultField = document.getElementById('result');

    // This is setting my default units
    fromUnitSelect.value = 'inches';
    toUnitSelect.value = 'feet';

    // Add event listeners
    inputField.addEventListener('input', convertvalue);
    fromUnitSelect.addEventListener('change', convertvalue); //it is listening for the "change" event
    toUnitSelect.addEventListener('change', convertvalue);
    
});

// Function to convert units of length
function convert(value, fromUnit, toUnit) {
    const units = {
        meters: {
            meters: 1,
            kilometers: 0.001,
            miles: 0.000621371,
            feet: 3.28084,
            inches: 39.3701
        },
        kilometers: {
            meters: 1000,
            kilometers: 1,
            miles: 0.621371,
            feet: 3280.84,
            inches: 39370.1
        },
        miles: {
            meters: 1609.34,
            kilometers: 1.60934,
            miles: 1,
            feet: 5280,
            inches: 63360
        },
        feet: {
            meters: 0.3048,
            kilometers: 0.0003048,
            miles: 0.000189394,
            feet: 1,
            inches:12
        },
        inches: {
            meters: 0.0254,
            kilometers: 0.0000254,
            miles: 0.0000157828,
            feet: 1/12,
            inches: 1
                }
    };

 // Check if the units are valid
 if (!units[fromUnit] || !units[toUnit]) {
    throw new Error('Invalid unit input');
}

// Convert the value to the target unit
const convertedValue = value * units[fromUnit][toUnit];
return convertedValue;
}

function convertvalue() {
    const value = parseFloat(document.getElementById('value').value); //the parseFloat 
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const resultField = document.getElementById('result');

    if (isNaN(value)) {
        resultField.innerText = 'Please enter a valid number';
        return;
    }
    
    try {
        const convertedValue = convert(value, fromUnit, toUnit);
        resultField.innerText = `${value} ${fromUnit} is equal to ${convertedValue} ${toUnit}`;
    } catch (e) {
        resultField.innerText = e.message;
    }
}
