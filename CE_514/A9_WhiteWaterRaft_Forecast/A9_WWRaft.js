//set map positioning
var map = L.map('map').setView([41.8, -111.48], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const RioGrande = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
    layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Loganw', 
format: 'image/png',
transparent: true,
attribution: 'Hydroshare GeoServer'
});

RioGrande.addTo(map);

let currentLayer = null; //variable to store the current layer



//make checkboxes show different highlighted area on the map and show the forecast. 
//could do it by the box areas los rivers shows on their websit. 

function toggleCheckbox(checkbox) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Loop through all checkboxes and uncheck them except the one that triggered the event
    checkboxes.forEach(function(item) {
      if (item !== checkbox) {
        item.checked = false;
      }
    });
  }


function toggleRioGrande() {
    const rioGrandeCheckbox = document.getElementById('RioGrande');
    if (rioGrandeCheckbox.checked) {
      L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
        layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Loganw', 
    format: 'image/png',
    transparent: true,
    attribution: 'Hydroshare GeoServer'
    }).addTo(map);

      console.log('Rio Grande checkbox is checked');
    } else {
      console.log('Rio Grande checkbox is unchecked');
    }
  }






  function toggleCheckbox(checkbox, functionName) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Loop through all checkboxes and uncheck them except the one that triggered the event
    checkboxes.forEach(function(item) {
      if (item !== checkbox) {
        item.checked = false;
      }
    });
    
    // Call the function based on which checkbox is checked
    if (checkbox.checked) {
      window[functionName]();
    }
  }

  function RioGrandeFunction() {
    console.log('Rio Grande is checked');
    // Add any other logic you want to run when Rio Grande is selected
  }

  function River2Function() {
    console.log('River 2 is checked');
    // Add any other logic you want to run when River 2 is selected
  }

  function River3Function() {
    console.log('River 3 is checked');
    // Add any other logic you want to run when River 3 is selected
  }

  function River4Function() {
    console.log('River 4 is checked');
    // Add any other logic you want to run when River 4 is selected
  }

  function River5Function() {
    console.log('River 5 is checked');
    // Add any other logic you want to run when River 5 is selected
  }


///// show the forecast after clicking the button
try {
  const apiUrl = `https://api.water.noaa.gov/nwps/v1/reaches/${reachId}/streamflow?series=short_range`;
  const response = await fetch(apiUrl);``
  if (!response.ok) {
    throw new Error(`HTTP error status: ${response.status} - ${response.statusText}`);
  }

  const json_data = await response.json();

  if (!json_data.shortRange || !json_data.shortRange.series || !json_data.shortRange.series.data || json_data.shortRange.series.data.length === 0) {
      throw new Error("No forecast data available for this Reach ID.");
  }

  const streamflowData = json_data.shortRange.series.data;
  const timestamps = streamflowData.map(item => item.validTime);
  const flowValues = streamflowData.map(item => item.flow);

  // // Update the table
  // const table = document.getElementById('timeseries-datatable').getElementsByTagName('tbody')[0];
  // table.innerHTML = "";

  // for (let i = 0; i < streamflowData.length; i++) {
  //   const row = table.insertRow();
  //   const timestampCell = row.insertCell();
  //   const flowCell = row.insertCell();
  //   timestampCell.textContent = timestamps[i];
  //   flowCell.textContent = flowValues[i];
  // }

  // Update or create the chart
  const ctx = document.getElementById('streamflowChart').getContext('2d');
  let chart = Chart.getChart('streamflowChart');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: [{
        label: 'Streamflow Forecast (Short Range)',
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
  console.error('Error fetching or processing data:', error);
  alert("Error fetching forecast: " + error.message);

  const table = document.getElementById('timeseries-datatable').getElementsByTagName('tbody')[0];
  table.innerHTML = "";

  const chartCanvas = document.getElementById('streamflowChart');
  chartCanvas.innerHTML = "";

}
}