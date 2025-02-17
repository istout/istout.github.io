//set map positioning

var map = L.map('map').setView([41.8, -111.48], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const layer1 = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-a51c74b3a8734324a53bb2c29ae9df3b/wms', { 
    layers: 'a51c74b3a8734324a53bb2c29ae9df3b:Loganw', 
format: 'image/png',
transparent: true,
attribution: 'Hydroshare GeoServer'
});



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


