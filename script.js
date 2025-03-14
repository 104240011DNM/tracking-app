let map;
let marker;
let path = [];
let polyline;

function initMap() {
    map = L.map('map', { preferCanvas: true }).setView([51.505, -0.09], 13); // Added 'preferCanvas: true' to force SVG
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Initialize polyline
    polyline = L.polyline(path, { color: 'blue' }).addTo(map);
}

function startTracking() {
    if (navigator.geolocation) {
        console.log("Geolocation is supported.");
        navigator.geolocation.watchPosition(updatePosition, showError, { enableHighAccuracy: true });
    } else {
        alert("Your browser does not support geolocation.");
    }
}

function updatePosition(position) {
    console.log("Position updated:", position);
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const newPosition = [lat, lng];

    // Update marker
    if (!marker) {
        marker = L.marker(newPosition).addTo(map).bindPopup("Current Position").openPopup();
    } else {
        marker.setLatLng(newPosition);
    }

    // Update path
    path.push(newPosition);
    polyline.setLatLngs(path);

    // Move map to new position
    map.setView(newPosition, 15);
}

function showError(error) {
    console.error("Error getting location:", error);
    alert("Error getting location: " + error.message);
}

// Initialize the map on page load
initMap();
L.svg();
try {
    if (document.namespaces) {
        document.namespaces.add = function () {
            console.warn("VML is blocked.");
        };
    }
} catch (error) {
    console.warn("VML disabling failed:", error);
}


