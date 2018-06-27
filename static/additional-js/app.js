var map;

// Create a new blank array for all the listing markers.
var markers = [];


function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.856968, lng: 151.2127686},
        zoom: 13
    });

    // Model 

    // These are the locations that will be shown to the user.
    var onLoadLocations = [
        {title: 'Sydney Opera House', type: 'Interest points', location: {lat: -33.856968, lng: 151.2127686}},
        {title: 'Sea Life Sydney Aquarium', type: 'Interest points', location: {lat: -33.8695027, lng: 151.1997733}},
        {title: 'Manly Beach', type: 'Interest points', location: {lat: -33.7964738, lng: 151.2867921}},
        {title: 'Luna Park Sydney', type: 'Interest points', location: {lat: -33.8476942, lng: 151.2076495}},
        {title: 'Sydney Olympic Park', type: 'Interest points', location: {lat: -33.8386349, lng: 151.0493947}},
        {title: 'Sydney Harbour National Park', type: 'Interest points', location: {lat: -33.8429407, lng: 151.2430716}},
        {title: 'The Star Casino', type: 'Interest points', location: {lat: -33.8679663, lng: 151.1930215}},
        {title: 'Art Gallery of New South Wales', type: 'Museums', location: {lat: -33.8688037,lng: 151.2152251 }},
        {title: 'Museum of Sydney', type: 'Museums', location: {lat: -33.8624307,lng: 151.204416 }},
        {title: 'Hyde Par Barracks Museum', type: 'Museums', location: {lat: -33.8696042,lng: 151.2106387 }},
        {title: 'Susannah Place Museum', type: 'Museums', location: {lat: -33.8601381,lng: 151.2052211 }},
        {title: 'Powerhouse Museum', type: 'Museums', location: {lat: -33.8785135, lng: 151.1973531}},
        {title: 'Justice and Police Museum', type: 'Museums', location: {lat: -33.8621697, lng: 151.2100951}},
        {title: 'Harbour Bridge', type: 'Interest points', location: {lat: -33.8523018, lng: 151.2085984}},
        {title: 'Australian Museum', type: 'Museums', location: {lat: -33.8522605, lng: 151.1932775}},
        {title: 'Taronga Zoo', type: 'Interest points', location: {lat: -33.8435428, lng: 151.2391531}},
        {title: 'Bondi Beach', type: 'Interest points', location: {lat: -33.8923496, lng: 151.2758928}},
        {title: 'Darling Harbour', type: 'Interest points', location: {lat: -33.8748755, lng: 151.1987113}},
        {title: 'The Rocks', type: 'Interest points', location: {lat: -33.8587478, lng: 151.2036359}},
        {title: 'Sydney Tower', type: 'Interest points', location: {lat: -33.8704465, lng: 151.2065713}},
        {title: 'Sydney Mint', type: 'Interest points', location: {lat: -33.8689869, lng: 151.2105598}}
    ];

    // This constructor sets up the Location class
    var Location = function(data){
        this.title = ko.observable(data.title);
        this.type = ko.observable(data.type);
        this.id = ko.observable(data.id);
    }


    // View Model

    var ViewModel = function() {

        // self will refer to the outer this, i.e. the view model
        var self = this;


        // Setting up our location types
        this.availableTypes = ko.observableArray(['All', 'Interest points', 'Museums']);
        this.selectedTypes = ko.observableArray(['All']);

        // Setting up our location lists: full list and visible list
        this.locationList = ko.observableArray([]);
        this.visibleLocations = ko.observableArray([]);

        // Building the full locations list
        var id = 0;
        onLoadLocations.forEach(function(locItem){
            locItem.id = id;
            self.locationList.push(new Location(locItem));
            id++;
        });

        // Creating the visible locations list
        for (var loc of this.locationList()){
                self.visibleLocations.push(loc);
        }

        // Setting the first location as the current one
        this.currentLoc = ko.observable(this.locationList()[0]);


        // Function that runs when the filter is used.
        // It rebuilds the visible locations list based on the filter's values
        this.activateFilter= function(){
            // This function defines the addition of markers on the map
            function setMapOnAll(map) {
                for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
              }
            }
            // Clearing the visible locations list
            self.visibleLocations.removeAll();

            // Rebuilding the visible locations list
            if (self.selectedTypes() == "All") {
                for (var loc of self.locationList()){
                    self.visibleLocations.push(loc);
                }
            } else {
                for (var loc of self.locationList()){
                    if (loc.type() == self.selectedTypes()) {
                        self.visibleLocations.push(loc);
                    }
                }
            }

            // Extracting the ids of the locations in the new visible list
            self.visibleIds = ko.observableArray([]);
            for (var loc of self.visibleLocations()){
                    self.visibleIds.push(loc.id());
                }

            // Adding makers based on visible ids
            if (self.selectedTypes() == 'All') {
                setMapOnAll(map);
            } else {
                setMapOnAll(null);
                for (var j = 0; j < self.visibleIds().length; j++) {
                    var myIndex = self.visibleIds()[j];
                    markers[myIndex].setMap(map);
                }   
            }
        };

        // Function that simulates the clicking of marker when a location is clicked on in the navigation bar
        self.clickMarker = function(clickedLoc){
            // Get the id of the location (an observable)
            var i = this.id();
            google.maps.event.trigger(markers[i], 'click');
        };
    }

    // Apply bindings
    ko.applyBindings(new ViewModel());

    // Set up the info window
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // The following for loop iterates through the original location list to create markers
    for (var i = 0; i < onLoadLocations.length; i++) {
        // Get the position from the location array.
        var position = onLoadLocations[i].location;
        var title = onLoadLocations[i].title;
        var searchedForText = title;

        // Function that creates a marker
        function makeMarker() {
            var marker = new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });

            // Retrieve picture data for the marker asynchronously
            fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
                headers: {
                    method:'get',
                    Authorization: 'Client-ID 4f1bbee00a76cff5bcc600b39b6895819ad62cf89eed2147f567dc2cd681a21b'
                }
            })
            .then(function(response){
                if (!response.ok) {
                    marker.errorMessage = '<div>There was an error loading this image.</div>'
                }
                return response;
            })
            .then(response => response.json())
            .then(function(myJason){
                if (myJason && myJason.results && myJason.results[0]){
                    // The unsplash api returns 10 pictures. Choose one at random
                    var randomImage = Math.floor((Math.random() * 9) + 0);
                    // Add the picture data to the marker
                    var pictureUrl = myJason.results[randomImage].urls.small;
                    var pictureAuthor = myJason.results[randomImage].user.name;
                    var pictureData = {url: pictureUrl, author: pictureAuthor};
                    marker.pictureUrl = pictureData.url;
                    marker.pictureAuthor = pictureData.author;
                    }
                else {
                    marker.pictureUrl = "./static/images/icon-no-image.png";
                }
            })
            .catch(function requestError(e){
              console.log(e);
                marker.errorMessage = '<div>There was a network error.</div>'
            });

            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
                var myMarker = this; 
                populateInfoWindow(this, largeInfowindow);
                this.setAnimation(google.maps.Animation.BOUNCE);
                map.setCenter(myMarker.getPosition());
                setTimeout(function(){
                    myMarker.setAnimation(null);
                },1300);
            });
        }
        
        // Create marker
        makeMarker();

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

        // Error handling
        if (marker.errorMessage){
            infowindow.setContent('<div>' + marker.title + '</div>'  + marker.errorMessage);
        }
        // Add picture to marker or handle case where none has been found.
        else {

            if (marker.pictureAuthor){
                infowindow.setContent('<div id="' + marker.id + '">'+  marker.title + '</div>' + '<img src="'+ marker.pictureUrl + '" class="ApiPicture">'
                    + '<div>Picture by ' + marker.pictureAuthor + '</div>');
            } 
            else {
                infowindow.setContent('<div>' + marker.title + '</div>' + '<img src="'+ marker.pictureUrl + '" class="ApiPicture">'
                    + '<div>No picture has been found.</div>');
            }
        }

        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }
 }

// This part of the code uses jQuery to reveal the sidenav on mobile devices
function toggleSideNav(){
  $("#mySidenav").toggleClass( "open" );
}

$("#hamburger").click(function() {
    toggleSideNav();
});


