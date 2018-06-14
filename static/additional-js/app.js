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

        // var apiPicture = {url:"https://images.unsplash.com/photo-1527915676329-fd5ec8a12d4b?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjIyNDQwfQ&s=153a3276e887a6f74a521bc62142bc17",
        //                     author: "Me"};


        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 4f1bbee00a76cff5bcc600b39b6895819ad62cf89eed2147f567dc2cd681a21b'
            }
        }).then(response => response.json())
        .then(function(myJason){

            var pictureUrl = myJason.results[0].urls.small;
            var pictureAuthor = myJason.results[0].user.name;
            var pictureData = {url: pictureUrl, author: pictureAuthor};

            console.log("pictureData: " + pictureData);

            // return pictureData;


        })
        .catch(e => requestError(e, 'image'));

        // }


        // console.log("Picture data" + getPictureData());

        // var apiPicture =  getPictureData()
        console.log("apiPicture: " + apiPicture);



        function requestError(e, part) {
            console.log(e);
            // responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }  


        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i,
            pictureUrl: apiPicture.url
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

        infowindow.setContent('<div>' + marker.title + '</div>' + '<img src="'+ marker.pictureUrl + '" class="ApiPicture">');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }
 }
