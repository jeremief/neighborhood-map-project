var map;

// Create a new blank array for all the listing markers.
var markers = [];


function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.856968, lng: 151.2127686},
        zoom: 13
    });

// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.
var locations = [
    {title: 'Sydney Opera House', location: {lat: -33.856968, lng: 151.2127686}},
    {title: 'Powerhouse Museum', location: {lat: -33.8785135, lng: 151.1973531}},
    {title: 'Harbour Bridge', location: {lat: -33.8523018, lng: 151.2085984}},
    {title: 'Australian Museum', location: {lat: -33.8522605, lng: 151.1932775}},
    {title: 'Taronga Zoo', location: {lat: -33.8435428, lng: 151.2391531}}
];

var largeInfowindow = new google.maps.InfoWindow();
var bounds = new google.maps.LatLngBounds();

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
            // Get the position from the location array.
            var position = locations[i].location;
            var title = locations[i].title;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });
            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
                var myMarker = this; 
                populateInfoWindow(this, largeInfowindow);
                this.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function(){
                    myMarker.setAnimation(null);
                },1300);
            });
            bounds.extend(markers[i].position);
        }
        // Extend the boundaries of the map for each marker
        map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }
 }
