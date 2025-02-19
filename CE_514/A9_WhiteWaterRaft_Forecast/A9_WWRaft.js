// Initialize map
var map = L.map('map').setView([36.5, -106], 8.5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



// Define your WMS layers (one for each river)
const layers = {
    'River1': L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-d6eeb177c15544fc9976b15278368adc/wms', { 
      	  	layers: 'd6eeb177c15544fc9976b15278368adc:Rio_Chama_below_ElVado_Dam', 
            format: 'image/png',
            transparent: true,
            attribution: 'Hydroshare GeoServer'
    }),

    'River2': L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-d6eeb177c15544fc9976b15278368adc/wms', { 
      layers: 'd6eeb177c15544fc9976b15278368adc:Rio_Chama_below_Abiquiu', 
      format: 'image/png',
      transparent: true,
      attribution: 'Hydroshare GeoServer'
    }),

    'River3': L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-d6eeb177c15544fc9976b15278368adc/wms', { 
      layers: 'd6eeb177c15544fc9976b15278368adc:Rio_Chama_near_Chamita', 
      format: 'image/png',
      transparent: true,
      attribution: 'Hydroshare GeoServer'
    }),

    'River4': L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-d6eeb177c15544fc9976b15278368adc/wms', { 
      layers: 'd6eeb177c15544fc9976b15278368adc:Rio_Grande_below_Taos', 
      format: 'image/png',
      transparent: true,
      attribution: 'Hydroshare GeoServer'
    }),
    'River5': L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-d6eeb177c15544fc9976b15278368adc/wms', { 
      layers: 'd6eeb177c15544fc9976b15278368adc:Rio_Grande_near_Cerro', 
      format: 'image/png',
      transparent: true,
      attribution: 'Hydroshare GeoServer'
    })
};

const reachID ={
    'River1': '17844046', //Rio Chama below El Vado Dam
    'River2': '17846986', //Rio Chama below Abiquiu
    'River3': '17848906', //Rio Chama near Chamita
    'River4': '17864594', //Rio Grande below Taos
    'River5': '17863292' //Rio Grande near Cerro
}

// Variable to track the current layer displayed on the map
let currentLayer = null;

// Function to toggle checkboxes, layers, and additional actions
function toggleCheckbox(checkbox, riverName) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Loop through all checkboxes and uncheck them except the one that triggered the event
    checkboxes.forEach(function(item) {
        if (item !== checkbox) {
            item.checked = false;  // Uncheck the other checkboxes
        }
    });

    const riverLayer = layers[riverName]; // Get the corresponding river layer based on the river name

    // If the checkbox is checked, add the river layer to the map
    if (checkbox.checked) {
        // If there's already a layer displayed, remove it
        if (currentLayer) {
            map.removeLayer(currentLayer);
        }

        // Add the selected river layer to the map
        currentLayer = riverLayer;
        currentLayer.addTo(map);

        // Optionally, show forecast or river-specific data
        showForecast(riverName);
        console.log(`${riverName} checkbox is checked`);
    } else {
        // If the checkbox is unchecked, remove the corresponding river layer from the map
        if (currentLayer === riverLayer) {
            map.removeLayer(riverLayer);
            currentLayer = null;
        }

        // Optionally, clear forecast data
        const forecastElement = document.getElementById('forecastDetails');
        if (forecastElement) {
            forecastElement.innerHTML = ''; // Clear forecast details
        }
        console.log(`${riverName} checkbox is unchecked`);
    }
}

// Function to show forecast details for the selected river
async function showForecast(riverName) {

  const forecastcontainer = document.getElementById('forecast-container'); //makes it so this section waits to display the forecast container until after "showforecast" is clicked
  forecastcontainer.style.display = 'block';  
  try {
    // Get the selected series type (short_range, medium_range, etc.) from the dropdown
    const seriesType = document.getElementById('Series_Type').value;

    // Retrieve the reachId based on riverName
    const riverReachID = reachID[riverName];
    
    // Construct the API URL using the river's Reach ID and the selected series type
    const apiUrl = `https://api.water.noaa.gov/nwps/v1/reaches/${riverReachID}/streamflow?series=${seriesType}`;
    
    console.log("Constructured API URL: ", apiUrl);

    // Make the API call to fetch the streamflow data
    const response = await fetch(apiUrl);
    
    // Check for successful response
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status} - ${response.statusText}`);
    }

    // Parse the response as JSON
    const json_data = await response.json();

    // Validate that forecast data is available
    if (!json_data[seriesType] || !json_data[seriesType].series || !json_data[seriesType].series.data || json_data[seriesType].series.data.length === 0) {
      throw new Error("No forecast data available for this Reach ID.");
    }

    // Extract the streamflow data
    const streamflowData = json_data[seriesType].series.data;
    const timestamps = streamflowData.map(item => item.validTime);
    const flowValues = streamflowData.map(item => item.flow);

    // Update the timeseries table with the data
    const table = document.getElementById('timeseries-datatable').getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Clear previous table rows

    for (let i = 0; i < streamflowData.length; i++) {
      const row = table.insertRow();
      const timestampCell = row.insertCell();
      const flowCell = row.insertCell();
      timestampCell.textContent = timestamps[i];
      flowCell.textContent = flowValues[i];
    }

    // Update or create the chart to display the streamflow data
    const ctx = document.getElementById('streamflowChart').getContext('2d');
    let chart = Chart.getChart('streamflowChart');

    if (chart) {
      chart.destroy(); // Destroy the existing chart if present
    }

    // Create a new chart
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets: [{
          label: `${seriesType} Streamflow Forecast`,
          data: flowValues,
          borderColor: 'blue',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Streamflow (cfs)'
            }
          }
        }
      }
    });

  } catch (error) {
    // Handle any errors that occur during the fetch or processing
    console.error('Error fetching or processing data:', error);
    alert("Error fetching forecast: " + error.message);

    // Clear the table and chart if an error occurs
    const table = document.getElementById('timeseries-datatable').getElementsByTagName('tbody')[0];
    table.innerHTML = "";

    const chartCanvas = document.getElementById('streamflowChart');
    chartCanvas.innerHTML = ""; // Clear the chart canvas
  }
}


// Attach the toggleCheckbox function to the checkboxes in HTML
document.getElementById('River1').addEventListener('change', function() {
    toggleCheckbox(this, 'River1');
});

document.getElementById('River2').addEventListener('change', function() {
    toggleCheckbox(this, 'River2');
});
document.getElementById('River3').addEventListener('change', function() {
    toggleCheckbox(this, 'River3');
});
document.getElementById('River4').addEventListener('change', function() {
  toggleCheckbox(this, 'River4');
});
document.getElementById('River5').addEventListener('change', function() {
  toggleCheckbox(this, 'River5');
});