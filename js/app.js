'use strict';

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

var showSideBar = true;

function initMap () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 38.889496, lng: -77.035317},
        zoom: 14,
        mapTypeControl: false
    });

    for (var i in locations) {
        locations[i].marker = new google.maps.Marker({
            position: locations[i].position,
            map: map
        });

        locations[i].marker.addListener('click', (function (location) {
            return function () { selectMarker(location); }
        })(locations[i]));
    };

    infoWindow = new google.maps.InfoWindow();
}

function selectMarker (location) {
    infoWindow.setContent('Loading wiki article...');
    infoWindow.open(map, location.marker);

    location.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {location.marker.setAnimation(null);}, 750);

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
            var info = '<h3>' + location.name + '</h3>';
            info += '<p>' + result.query.pages[0].extract + '</p>';
            info += '<a href="#">Full article</a>';
            infoWindow.setContent(info);
            // calling open will pan the map to fit the new infowindow
            infoWindow.open(map, location.marker);
        }
    })
}

function ViewModel () {
    var self = this;

    this.locations = ko.observableArray(locations);

    this.filterText = ko.observable('');

    this.filter = function () {
        var filtered = [];

        for (var i in locations) {
            if ( locations[i].name.toLowerCase().indexOf(self.filterText().trim().toLowerCase()) >= 0) {
                locations[i].marker.setMap(map);
                filtered.push(locations[i]);
            } else {
                locations[i].marker.setMap(null);
            }
        }

        self.locations(filtered);
    }

    this.filterText.subscribe(this.filter);

    this.selectItem = function () {
        // collapse sidebar in mobile devices
        if ($(window).width() < 768) {
           self.toggleSideBar();
        }

        selectMarker (this);
    }

    this.toggleSideBar = function () {
        showSideBar = !showSideBar;

        if (showSideBar) {
            $('.side-bar').css('transform', 'translate(0, 0)');
        } else {
            $('.side-bar').css('transform', 'translate(-100%, 0)');
        }

    }
}

var viewModel = new ViewModel();

ko.applyBindings(viewModel);
