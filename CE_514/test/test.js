// Initialize map
var map = L.map('map').setView([41.8, -111.48], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define your WMS layers (one for each river)
const layers = {
    'RioGrande': L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
        layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Loganw', 
        format: 'image/png',
        transparent: true,
        attribution: 'Hydroshare GeoServer'
    }),
    'River2': L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
        layers: 'your_layer_2', 
        format: 'image/png',
        transparent: true,
        attribution: 'Hydroshare GeoServer'
    }),
    // Add more rivers as needed, like River3, River4, etc.
};

// Store the current active layer
let currentLayer = null;

// Function to show or hide forecast details for a river
function showForecast(riverName) {
    const forecastElement = document.getElementById('forecastDetails');
    if (!forecastElement) {
        const newForecastDiv = document.createElement('div');
        newForecastDiv.id = 'forecastDetails';
        newForecastDiv.style.marginTop = '20px';
        document.getElementById('selection').appendChild(newForecastDiv);
    }
    
    const forecastDetails = document.getElementById('forecastDetails');
    forecastDetails.innerHTML = `<p>Forecast for ${riverName}:</p>`;
    forecastDetails.innerHTML += `<p>Water flow prediction, temperature, and other stats will be shown here...</p>`;
}

// Function to toggle checkboxes, layers, and additional actions
function toggleCheckbox(checkbox, riverName) {
    const riverLayer = layers[riverName]; // Get the correct river layer based on the checkbox id

    if (checkbox.checked) {
        if (currentLayer) {
            map.removeLayer(currentLayer); // Remove the existing layer if any
        }
        currentLayer = riverLayer; // Set new layer to be the current one
        currentLayer.addTo(map); // Add the selected layer
        showForecast(riverName); // Show forecast or river-specific data
        console.log(`${riverName} checkbox is checked`);
    } else {
        if (currentLayer === riverLayer) {
            map.removeLayer(riverLayer); // Remove the layer if unchecked
            currentLayer = null;
        }
        const forecastElement = document.getElementById('forecastDetails');
        if (forecastElement) {
            forecastElement.innerHTML = ''; // Clear forecast details
        }
        console.log(`${riverName} checkbox is unchecked`);
    }
}

// Attach to the checkbox change events
document.getElementById('RioGrande').addEventListener('change', function() {
    toggleCheckbox(this, 'RioGrande');
});

document.getElementById('River2').addEventListener('change', function() {
    toggleCheckbox(this, 'River2');
});

// Add similar event listeners for other rivers as needed...
