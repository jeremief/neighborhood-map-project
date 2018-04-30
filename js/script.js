var map;
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.856968, lng: 151.2127686},
        zoom: 13
    });
}
