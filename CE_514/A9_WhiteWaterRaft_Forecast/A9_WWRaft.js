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
const viewSettings = {
  'River1': { center: [36.5, -106.7], zoom: 9.5},  // Example for Rio Chama below El Vado Dam
  'River2': { center: [36.2, -106.4], zoom: 9.5 },  // Example for Rio Chama below Abiquiu
  'River3': { center: [36.0, -106.1], zoom: 9.5 }, // Example for Rio Chama near Chamita
  'River4': { center: [36.25, -105.8], zoom: 9.5 },  // Example for Rio Grande below Taos
  'River5': { center: [36.7, -105.7], zoom: 9.5 }  // Example for Rio Grande near Cerro
}
  

const floodreturnperiods = { 
    //values give flow for each return period in cfs
  //return_periods: [return_period_2,return_period_5,return_period_10,return_period_25,return_period_50,return_period_100

  'River1': {
    feature_id: 17844046,
    return_periods: [50.82, 82.98, 104.28, 131.18, 151.14, 170.95]  
  },
  'River2': {
    feature_id: 17846986,
    return_periods: [57.83, 93.27, 116.74, 146.39, 168.38, 190.22]
  },
  'River3': {
    feature_id: 17848906,
    return_periods: [69.3, 113.35, 142.52, 179.38, 206.72, 233.86]
  },
  'River4': {
    feature_id: 17864594,
    return_periods: [347.51, 601.2, 769.17, 981.39, 1138.83, 1295.11]
  },
  'River5': {
    feature_id: 17863292,
    return_periods: [329.57, 575.15, 737.74, 943.18, 1095.58, 1246.86]
  }
};
////Could combine reach id, view settings, and flood return periods into one object and then call it in the functions. Thats a way to clean up the code. 


// Variable to track the current layer displayed on the map
let currentLayer = null;

// Function to toggle checkboxes, layers, and additional actions
function toggleCheckbox(checkbox, riverName) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    //allows only one checkbox to be selected at a time
    checkboxes.forEach(function(item) {
        if (item !== checkbox) {
            item.checked = false;  
        }
    });

    const riverLayer = layers[riverName]; // Get the corresponding river layer based on the river name

    clearForecastData(); //clear the forecast data before showing new one

    // If the checkbox is checked, add the river layer to the map
    if (checkbox.checked) {
        // If there's already a layer displayed, remove it
        if (currentLayer) {
            map.removeLayer(currentLayer);
        }

        // Add the selected river layer to the map
        currentLayer = riverLayer;
        riverLayer.addTo(map);
        
        const { center, zoom } = viewSettings[riverName];
        map.setView(center, zoom);

        //  show forecast or river-specific data
        showForecast(riverName);


     //   console.log(`${riverName} checkbox is checked`);
    } else {
        // If the checkbox is unchecked, remove the corresponding river layer from the map
        if (currentLayer === riverLayer) {
            map.removeLayer(riverLayer);
            currentLayer = null;
        }

        // Clear the chart and table if no river is selected
        const chartCanvas = document.getElementById('streamflowChart');
        chartCanvas.innerHTML = ""; // Clear the chart canvas


        // Hide the forecast container if no river is selected
        const forecastcontainer = document.getElementById('forecast-container');
        forecastcontainer.style.display = 'none';

        // clear forecast data
        const forecastElement = document.getElementById('forecastDetails');
        if (forecastElement) {
            forecastElement.innerHTML = ''; // Clear forecast details
        }
        //console.log(`${riverName} checkbox is unchecked`);
    }
}

// Listen for changes in the series type dropdown
document.getElementById('Series_Type').addEventListener('change', function() {
  clearForecastData(); // Clear the forecast data before showing new one ////////////////////////////

  const checkedRiver = document.querySelector('input[type="checkbox"]:checked'); // Check if any river checkbox is selected
  if (checkedRiver) {
      const riverName = checkedRiver.id; // Get the river name from the selected checkbox
      showForecast(riverName);  // Call showForecast with the riverName to update the forecast based on the new series type
  }
});

// Function to show forecast details for the selected river
async function showForecast(riverName) {

  const forecastcontainer = document.getElementById('forecast-container'); //makes it so this section waits to display the forecast container until after "showforecast" is clicked
  forecastcontainer.style.display = 'block';  

  try {
    // Get the selected series type (short_range, medium_range, etc.) from the dropdown
    const seriesType = document.getElementById('Series_Type').value;
    let seriesTypeshort = "";
    let seriesTypeDisplay="";

    if (seriesType === 'short_range') {
      seriesTypeshort = 'shortRange';
      seriesTypeDisplay="Short Range";
    } else if (seriesType === 'medium_range') { 
      seriesTypeshort = 'mediumRange';
      seriesTypeDisplay="Medium Range";
    } else if (seriesType === 'long_range') {
        seriesTypeshort = 'longRange';
        seriesTypeDisplay="Long Range";
     } else if (seriesType === "medium_range_blend"){
        seriesTypeshort = 'mediumRangeBlend';
        seriesTypeDisplay="Medium Range Blend";
      }

      console.log("seriesType", seriesTypeshort);

       // Retrieve the reachId based on riverName
    const riverReachID = reachID[riverName];
    
    // Construct the API URL using the river's Reach ID and the selected series type
    const apiUrl = `https://api.water.noaa.gov/nwps/v1/reaches/${riverReachID}/streamflow?series=${seriesType}`;
    
    console.log("Constructured API URL: ", apiUrl);

    // Make the API call to fetch the streamflow data
    const response = await fetch(apiUrl);
    
    console.log("response", response);

    // Check for successful response
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status} - ${response.statusText}`);
    }

    // Parse the response as JSON
    const json_data = await response.json();

    console.log("json_data", json_data); 

    // Extract the streamflow data
   
// const streamflowData = json_data[seriesTypeshort].series.data; // not always in the series bucket

  // //This is hardcoded. e.g. If the medium range ever used member 5 it wouldn't work. Later: could make it loop through the different categories and pull data from the ones that have data. 

  let streamflowData = "";
  if (seriesType === 'short_range') {
    streamflowData = json_data[seriesTypeshort].series.data;
    //streamflowData = json_data.shortRange.series.data;
  } else if (seriesType === 'medium_range') {
    streamflowData = json_data.mediumRange.member6.data;
  }else if (seriesType === 'long_range') {
    streamflowData = json_data.longRange.member4.data;
  }else if (seriesType === 'medium_range_blend') {
  //  streamflowData = json_data.mediumRangeBlend.series.data;
    streamflowData = json_data[seriesTypeshort].series.data;
  }

   // Check if the streamflow data is empty
   if (!streamflowData || streamflowData.length === 0) {
    throw new Error('No forecast data available for selected series type. Please try another range. Or try again but let it load for a few seconds. Sometimes the API is unable to grab data when several calls to the API are made too quickly.');
  }
    
    //const timestamps = streamflowData.map(item => item.validTime); NEXT ROW CONVERTS THE TIMESTAMP TO A READABLE STRING
    const timestamps = streamflowData.map(item => {
      const date = new Date(item.validTime); // Convert to Date object
      return date.toLocaleString(); // Format it to a readable string (you can customize the format)
  });

    //const flowValues = streamflowData.map(item => item.flow); next row rounds the flow values to 2 decimal places
    const flowValues = streamflowData.map(item => parseFloat(item.flow.toFixed(2))); 

    console.log("streamflowData", streamflowData); /////this is working!!


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
          label: `${seriesTypeDisplay} Streamflow Forecast`,
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

    clearForecastData(); // Clear the forecast data before showing new one
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

function clearForecastData() {
  // Clear forecast container and its content
  const forecastContainer = document.getElementById('forecast-container');
  forecastContainer.style.display = 'none'; // Hide forecast container

  // Clear forecast table
  const table = document.getElementById('timeseries-datatable').getElementsByTagName('tbody')[0];
  table.innerHTML = "";

  // Clear the chart canvas
  const chartCanvas = document.getElementById('streamflowChart');
  chartCanvas.innerHTML = ""; 
  // Destroy the existing chart
    const chart = Chart.getChart('streamflowChart');
  if (chart) {
    chart.destroy(); 
  }
  // Clear forecast details
  const forecastElement = document.getElementById('forecastDetails');
  if (forecastElement) {
      forecastElement.innerHTML = ''; 
  }
}

