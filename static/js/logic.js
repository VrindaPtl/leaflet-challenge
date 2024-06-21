// Fetch earthquake data
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson').then(data => {
    // Initialize map
    const map = L.map('map').setView([37.75, -122.44], 5);
  
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

    // Define color scale for depth
    const depthColor = d => d > 90 ? '#8b0000' :
                             d > 70 ? '#b22222' :
                             d > 50 ? '#dc143c' :
                             d > 30 ? '#ff4500' :
                             d > 10 ? '#ff6347' :
                                      '#ffc0cb';

    // Create markers
    data.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const depth = coordinates[2];

      L.circle([coordinates[1], coordinates[0]], {
        radius: magnitude * 40000,
        color: depthColor(depth),
        fillOpacity: 0.8
      })
      .bindPopup(`<h2>${feature.properties.place}</h2><p>Magnitude: ${magnitude}<br>Depth: ${depth}</p>`)
      .addTo(map);
    });

// Create a legend
const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 10, 30, 50, 70, 90];
    const colors = ['#FFEDA0', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
  });