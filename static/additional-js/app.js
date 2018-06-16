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

    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    var onLoadLocations = [
        {title: 'Sydney Opera House', location: {lat: -33.856968, lng: 151.2127686}},
        {title: 'Powerhouse Museum', location: {lat: -33.8785135, lng: 151.1973531}},
        {title: 'Harbour Bridge', location: {lat: -33.8523018, lng: 151.2085984}},
        {title: 'Australian Museum', location: {lat: -33.8522605, lng: 151.1932775}},
        {title: 'Taronga Zoo', location: {lat: -33.8435428, lng: 151.2391531}}
    ];


    var Location = function(data){
        this.title = ko.observable(data.title);

    }


    // View Model

    var ViewModel = function() {

        // self will refer to the outer this, i.e. the view model
        var self = this;

        this.locationList = ko.observableArray([]);

        onLoadLocations.forEach(function(locItem){
            self.locationList.push(new Location(locItem));
        });
        
        this.currentLoc = ko.observable(this.locationList()[0]);


        this.setLoc = function(clickedLoc){
            self.currentLoc(clickedLoc);
        };
    }

    ko.applyBindings(new ViewModel());


    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < onLoadLocations.length; i++) {
        // Get the position from the location array.
        var position = onLoadLocations[i].location;
        var title = onLoadLocations[i].title;
        // Create a marker per location, and put into markers array.


        var searchedForText = title;

        function makeMarker() {

            console.log("Entering makeMarker")

            var marker = new google.maps.Marker({
                map: map,
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });

            fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 4f1bbee00a76cff5bcc600b39b6895819ad62cf89eed2147f567dc2cd681a21b'
            }
            }).then(response => response.json())
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
            .catch(e => requestError(e, 'image'));

            function requestError(e, part) {
                console.log(e);
            }  

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
        }
        
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

        if (marker.pictureAuthor){
            infowindow.setContent('<div>' + marker.title + '</div>' + '<img src="'+ marker.pictureUrl + '" class="ApiPicture">'
                + '<div>Picture by ' + marker.pictureAuthor + '</div>');
        } 
        else {
            infowindow.setContent('<div>' + marker.title + '</div>' + '<img src="'+ marker.pictureUrl + '" class="ApiPicture">'
                + '<div>No picture has been found.</div>');
        }

        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }
 }
