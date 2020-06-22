function createMap(eqSites) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the eqSites layer
  var overlayMaps = {
    "Earthquake Sites": eqSites
  };

  // Create the map object with options
  var map = L.map("map", {
    center: [30, -10],
	  zoom: 3,
    layers: [lightmap, eqSites]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {

  // Pull the "features" property off of response
  var features = response.features;

  // Initialize an array to hold earthquake markers
  var eqSites = [];

  // Loop through the sites array
  for (var index = 0; index < features.length; index++) {
    var site = features[index];

    // For each site, create a marker and bind a popup with the site's name
    var eqSite = L.marker([site.geometry.coordinates[1], site.geometry.coordinates[0]])
      .bindPopup("<h3>" + site.properties.place + "<h3><h3>Magnitude: " + site.properties.mag + "</h3>");

    // Add the marker to the eqSites array
    eqSites.push(eqSite);
  }

  // Create a layer group made from the earthquake markers array, pass it into the createMap function
  createMap(L.layerGroup(eqSites));
}


// Perform an API call to the Earthquake API to get site information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
