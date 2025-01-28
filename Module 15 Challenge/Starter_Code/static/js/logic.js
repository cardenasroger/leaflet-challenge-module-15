<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Earthquake Map</title>
  <!-- Leaflet CSS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <!-- Leaflet JS -->
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <!-- D3.js -->
  <script src="https://d3js.org/d3.v5.min.js"></script>
</head>

<body>
  <!-- Map container -->
  <div id="map" style="height: 600px;"></div>

  <script>
    // Replace with your actual Mapbox API key
    const API_KEY = 'YOUR_MAPBOX_API_KEY';

    // URL for fetching earthquake data (GeoJSON)
    const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

    // Fetch earthquake data and create features for the map
    d3.json(queryUrl).then(function (data) {
      createFeatures(data.features);
    }).catch(function (error) {
      console.error("Error fetching data: ", error);
    });

    // Function to create map features
    function createFeatures(earthquakeData) {
      // Function to display earthquake details in a popup
      function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3>
                         <hr><p>${new Date(feature.properties.time)}</p>
                         <h4>Magnitude: ${feature.properties.mag}</h4>`);
      }

      // Function to determine the color based on magnitude
      function quakeColor(magnitude) {
        if (magnitude <= 1.0) return "red";
        if (magnitude <= 2.0) return "orange";
        if (magnitude <= 3.0) return "yellow";
        if (magnitude <= 4.0) return "green";
        if (magnitude <= 5.0) return "blue";
        if (magnitude <= 6.0) return "indigo";
        return "violet";
      }

      // Function to create circle markers for each earthquake
      function circleMaker(feature, latlng) {
        const circleOptions = {
          radius: feature.properties.mag * 8, // Magnitude-based radius
          fillColor: quakeColor(feature.properties.mag),
          color: quakeColor(feature.properties.mag),
          opacity: 1.0,
          fillOpacity: 0.5
        };
        return L.circleMarker(latlng, circleOptions);
      }

      // Create a GeoJSON layer for earthquakes
      const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: circleMaker
      });

      // Call function to create the map
      createMap(earthquakes);
    }

    // Function to create the map
    function createMap(earthquakes) {
      // Tile layers for different map views
      const streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });

      const satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
        maxZoom: 18,
        accessToken: API_KEY
      });

      const lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
        maxZoom: 18,
        accessToken: API_KEY
      });

      // Base map layers
      const baseMaps = {
        "Street Map": streetmap,
        "Satellite": satellite,
        "Light Map": lightmap
      };

      // Create the map with initial settings
      const map = L.map("map", {
        center: [37.09, -95.71], // Center of the US
        zoom: 5,
        layers: [streetmap] // Default base layer
      });

      // Add earthquake data layer to the map
      earthquakes.addTo(map);

      // Add a layer control to toggle between map views
      L.control.layers(baseMaps).addTo(map);
    }
  </script>
</body>

</html>

