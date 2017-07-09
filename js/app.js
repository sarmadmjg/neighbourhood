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

function initMap () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 38.889496, lng: -77.035317},
        zoom: 14
    });
}

// function ViewModel () {

// };

// ko.applyBindings(new ViewModel());
