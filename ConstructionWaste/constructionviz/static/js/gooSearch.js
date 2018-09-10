var map, places, infoWindow;
var markers = [];
var autocomplete;
var countryRestrict = {'country': 'au'};
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');
var DATA = {};
var lat = {};
var long = {};

var countries = {
    'au': {
        center: {lat: -37.814, lng: 144.96332},
        zoom: 13
    }
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: countries['au'].zoom,
        center: countries['au'].center,
        mapTypeControl: false,
        panControl: false,
        zoomControl: false,
        streetViewControl: false
    });

    // Create the autocomplete object and associate it with the UI input control.
    // Restrict the search to the default country, and to place type "cities".
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */ (
            document.getElementById('autocomplete')), {
            componentRestrictions: countryRestrict
        });
    places = new google.maps.places.PlacesService(map);

    autocomplete.addListener('place_changed', onPlaceChanged);

    // Add a DOM event listener to react when the user selects a country.
    // document.getElementById('country').addEventListener(
    //     'change', setAutocompleteCountry);

    $.ajax({
        url: "./get_all_locations",
        success: function(the_json){

            console.log(the_json);

        }
    });
}

// When the user input address, get the place details for the address and
// zoom the map.
function onPlaceChanged() {
    var place = autocomplete.getPlace();
    if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
        search();
    } else {
        document.getElementById('autocomplete').placeholder = 'Search by address';
    }
}

// var lat = {};
// var long = {};
// var location = {};
// var name = {};
// var contentString = {};



//add markers to the map
function onload_map() {

//
//     var infowindow = new google.maps.InfoWindow({
//         content: contentString
//     });
//
//     var marker = new google.maps.Marker({
//         position: location,
//         map: map,
//         title: 'Uluru (Ayers Rock)'
//     });
//     marker.addListener('click', function() {
//         infowindow.open(map, marker);
//     });
};
