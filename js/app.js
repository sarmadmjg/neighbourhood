'use strict';

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
