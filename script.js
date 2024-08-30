let map;


async function initMap() {
  const locationA = { lat: 12.838634046261177, lng: 77.66485691641428 };
  const locationB = { lat: 12.848444385186681, lng: 77.6580543476113 };

  // Load the Google Maps libraries
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 15,
    center: locationA,
    mapId: "DEMO_MAP_ID",
  });

  // InfoWindow instance to be reused
  const infoWindow = new google.maps.InfoWindow();

  // Directions Service and Renderer
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
  });

  // Function to create the content for the InfoWindow
  function createInfoWindowContent(title, address) {
    return `
      <div style="min-width:200px;">
        <strong>${title}</strong><br>
        <p>${address}</p>
      </div>
    `;
  }

  // Custom Marker for Location A with Title
  const markerA = new AdvancedMarkerElement({
    map: map,
    position: locationA,
    title: "Scaler Macro Campus", // Tooltip title
  });

  // Custom Marker for Location B with Title
  const markerB = new AdvancedMarkerElement({
    map: map,
    position: locationB,
    title: "Scaler Micro Campus", // Tooltip title
  });

  // Add click event listeners to open the InfoWindow with custom content
  markerA.addListener("click", () => {
    const content = createInfoWindowContent(markerA.title, "14, 3rd cross, Parappana Agrahara, Electronic City Rd, Electronics City Phase 1, Electronic City, Bengaluru, Karnataka 560100, India");
    infoWindow.setContent(content);
    infoWindow.open({
      anchor: markerA,
      map,
      shouldFocus: false,
    });
  });

  markerB.addListener("click", () => {
    const content = createInfoWindowContent(markerB.title, "RMX5+96R, Velankani Drive, Electronics City Phase 1, Electronic City, Bengaluru, Karnataka 560100, India");
    infoWindow.setContent(content);
    infoWindow.open({
      anchor: markerB,
      map,
      shouldFocus: false,
    });
  });

  // Define the route
  const request = {
    origin: locationA,
    destination: locationB,
    travelMode: 'DRIVING',
  };

  // Request the route
  directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);
    } else {
      console.error('Directions request failed due to ' + status);
    }
  });

  

  // Add geolocation button
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Your Current Location.");
          infoWindow.open(map);
          map.setCenter(pos);

          // Optionally add a marker at the current location
          new google.maps.marker.AdvancedMarkerElement({
            position: pos,
            map: map,
            title: "Current Location"
          });
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  trackUserLocation();
}


function trackUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        let userMarker;
        
        if (!userMarker) {
          // Create a marker if it doesn't exist using AdvancedMarkerElement
          userMarker = new google.maps.marker.AdvancedMarkerElement({
            position: pos,
            map: map,
            title: "Your Location",
            content: document.createTextNode("You are here"),
          });
        } else {
          // Update the marker position if it already exists
          userMarker.position = pos;
        }

        map.setCenter(pos);
      },
      () => {
        handleLocationError(true, map.getCenter());
      },
      {
        enableHighAccuracy: true, // Request high accuracy location updates
        maximumAge: 0, // Don't use cached positions
        timeout: 5000, // Wait at most 5 seconds for a position
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}



function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}





//Google Sign In Integration
function handleCredentialResponse(response) {
  // Decode the credential response
  const responsePayload = decodeJwtResponse(response.credential);
  validateLogin(responsePayload)

  console.log("ID: " + responsePayload.sub);
  console.log('Full Name: ' + responsePayload.name);
  console.log('Given Name: ' + responsePayload.given_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);
  let a = document.getElementById("loginButton")
  a.innerHTML = responsePayload.name;
  
}

function decodeJwtResponse(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

document.getElementById('loginButton').addEventListener('click', function(e) {
  e.preventDefault();
  google.accounts.id.prompt();
});


window.onload = function() {
  google.accounts.id.initialize({
      client_id: "117419704557-rpq5dlc7g3bcp20sdc7md3cd45k70etq.apps.googleusercontent.com",
      callback: handleCredentialResponse
  })
}
;


function validateLogin(responsePayload){
  if(responsePayload.email.includes("@sst.scaler.com")){
    document.getElementById("main").remove();
    const containerDiv = document.createElement("div");
    containerDiv.id = "container";
    const mapDiv = document.createElement("div");
    mapDiv.id = "map";
    containerDiv.appendChild(mapDiv);
    document.body.appendChild(containerDiv);
    let a = document.getElementById("loginButton1");
    a.innerHTML = responsePayload.name;
    initMap();
  }

  else if(responsePayload){
    let a = document.getElementById("loginButton1");
    a.innerHTML = responsePayload.name;
    const b = document.getElementById("loginButton");
    b.remove();
    b.style.display = "none";
  }
}






















