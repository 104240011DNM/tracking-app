let map;
let marker;
let path = [];
let polyline;
let totalDistance = 0;
const caloriesPerKm = 50; // Average calories burned per kilometer

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

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat)/2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon))/2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

function updateStats() {
    const distanceElement = document.getElementById('distance');
    const caloriesElement = document.getElementById('calories');
    distanceElement.textContent = `Distance: ${totalDistance.toFixed(2)} km`;
    caloriesElement.textContent = `Calories: ${(totalDistance * caloriesPerKm).toFixed(2)} kcal`;
}

function updatePosition(position) {
    console.log("Position updated:", position);
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const newPosition = [lat, lng];

    // Calculate distance from last position
    if (path.length > 0) {
        const lastPosition = path[path.length - 1];
        const distance = calculateDistance(lastPosition[0], lastPosition[1], lat, lng);
        totalDistance += distance;
    }

    // Update marker
    if (!marker) {
        marker = L.marker(newPosition).addTo(map).bindPopup("Current Position").openPopup();
    } else {
        marker.setLatLng(newPosition);
    }

    // Update path
    path.push(newPosition);
    polyline.setLatLngs(path);

    // Update stats
    updateStats();

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


