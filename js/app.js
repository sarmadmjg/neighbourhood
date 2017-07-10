// define a few static locations
var locations = [
    {
        name: 'Lincoln Memorial',
        position: {lat: 38.889296, lng: -77.050209}
    },
    {
        name: 'Washington Monument',
        position: {lat: 38.889496, lng: -77.035296}
    },
    {
        name: 'Smithsonian National Museum of American History',
        position: {lat: 38.891313, lng: -77.029999}
    },
    {
        name: 'Smithsonian National Museum of Natural History',
        position: {lat: 38.891608, lng: -77.026125}
    },
    {
        name: 'National Gallery of Art',
        position: {lat: 38.891033, lng: -77.019739}
    },
    {
        name: 'Smithsonian Castle',
        position: {lat: 38.888758, lng: -77.025939}
    },
    {
        name: 'Smithsonian National Air and Space Museum',
        position: {lat: 38.888084, lng: -77.020086}
    }
];

var map;

var infoWindow;

// Called after loading of google maps API
function initMap () {
    map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        gestureHandling: 'greedy'
    });

    var bounds = new google.maps.LatLngBounds();

    // Create a merker for each location and extend the bounds
    for (var i=0; i < locations.length; i += 1) {
        locations[i].marker = new google.maps.Marker({
            position: locations[i].position,
            map: map
        });

        // Handle marker clicks
        addMarkerListener(locations[i]);

        bounds.extend(locations[i].position);
    }

    // It was done this way bc JSHint kept giving warning about
    // referencing outer variable (selectMarker)
    // in declared functions inside loops
    function addMarkerListener(location){
        location.marker.addListener('click', function() {
            selectMarker(location);
        });
    }

    // set padding to accomodate for side bar
    var padding = ($(window).width() <= 768) ? 50 : 285;

    map.fitBounds(bounds, padding);

    infoWindow = new google.maps.InfoWindow();
}

// Google maps API loading error
function mapError() {
    alert('Error while loading the google maps API');
}

// handle clicks of markers and list items passed from listeners
function selectMarker (location) {
    map.panTo(location.position);

    // Put placeholder info in infoWindow
    infoWindow.setContent('<h3>' + location.name + '</h3>' +
                          '<p>Loading wiki article...</p>');
    infoWindow.open(map, location.marker);

    // Bounce! Bounce! 1400ms is about 2 bounces
    location.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () { location.marker.setAnimation(null); }, 1400);

    // Load wiki article
    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            format: 'json',
            formatversion: 2,
            action: 'query',
            // get only the intro of the article
            prop: 'extracts',
            exchars: 300,
            exintro: 1,
            explaintext: 1,
            generator: 'search',
            gsrsearch: location.name,
            // search for articles only
            gsrnamespace: 0,
            // return only one result
            gsrlimit: 1
        },
        success: function (result) {
            infoWindow.setContent('<h3>' + location.name + '</h3>' +
                                  '<p>' + result.query.pages[0].extract + '</p>' +
                                  '<a target="_blank" href="https://en.wikipedia.org/?curid=' +
                                  result.query.pages[0].pageid +
                                  '">Read More</a>');

            // calling open will pan the map to fit the new infowindow
            infoWindow.open(map, location.marker);
        },
        error: function () {
            infoWindow.setContent('<h3>' + location.name + '</h3>' +
                                  '<p>Failed to load article</p>');
        }
    });
}

function ViewModel () {
    var self = this;

    this.locations = ko.observableArray(locations);

    // updated in real time with text in filter input
    this.filterText = ko.observable('');

    this.filter = function () {
        var filtered = [];

        for (var i=0; i < locations.length; i += 1) {
            if ( locations[i].name.toLowerCase().indexOf(self.filterText().trim().toLowerCase()) >= 0) {
                locations[i].marker.setVisible(true);
                filtered.push(locations[i]);
            } else {
                locations[i].marker.setVisible(false);
            }
        }

        self.locations(filtered);
    };

    // call this.filter every time the user changes filter text
    this.filterText.subscribe(this.filter);

    // handle list item clicks
    this.selectItem = function (location) {
        // collapse sidebar in mobile devices
        if ($(window).width() < 768) {
           self.toggleSideBar();
        }

        selectMarker (location);
    };

    // show or collapse sidebar
    this.showSideBar = ko.observable(true);

    // toggle sidebar after clicking the hamburger
    this.toggleSideBar = function () {
        self.showSideBar(! self.showSideBar());

        if (self.showSideBar()) {
            $('.side-bar').css('transform', 'translate(0, 0)');
        } else {
            $('.side-bar').css('transform', 'translate(-100%, 0)');
        }
    };
}

var viewModel = new ViewModel();

ko.applyBindings(viewModel);
