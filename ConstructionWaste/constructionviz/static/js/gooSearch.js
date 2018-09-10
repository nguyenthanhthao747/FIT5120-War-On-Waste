var map, places, infoWindow;
var autocomplete;
var countryRestrict = {'country': 'au'};
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');
var DATA = {};

var countries = {
    'au': {
        center: {lat: -37.814, lng: 144.96332},
        zoom: 10,
        mapTypeId: 'roadmap'
    }
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: countries['au'].zoom,
        center: countries['au'].center,
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
    onload_map();
}

// When the user input address, get the place details for the address and
// zoom the map.
function onPlaceChanged() {
    var place = autocomplete.getPlace();
    if (place.geometry) {
        map.panTo(place.geometry.location);
        map.setZoom(15);
    } else {
        document.getElementById('autocomplete').placeholder = 'Search by address';
    }
}

var lat = [];
var long = [];
var name = [];
var address = [];
var markers = [];
var contentString = [];
var infoWindow = [];

//add markers to the map to default mel map
function onload_map() {
    $.ajax({
            url: "./get_all_locations",
            success: function (the_json) {
                DATA = the_json;
                console.log(the_json);
                var i;

                for (i = 0; i < DATA.reuse.length; i++) {
                    lat = parseFloat(DATA.reuse[i].lat);
                    long = parseFloat(DATA.reuse[i].long);
                    name = DATA.reuse[i].name;
                    address = DATA.reuse[i].address;
                    markers[i] = new google.maps.Marker({
                        position: {lat: lat, lng: long},
                        map: map,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    });
                    contentString[i] = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                        '<h6 id="firstHeading" class="firstHeading">Reuse Location Name</h6>' + name + '<p></p>' +
                        '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                    infoWindow[i] = new google.maps.InfoWindow({
                        content: contentString[i]
                    });
                    var markerValue = markers[i];
                    google.maps.event.addListener(markers[i], 'mouseover', (function (markerValue, i) {
                        return function () {
                            infoWindow[i].open(map, markers[i]);
                        }

                    })(markers[i], i));
                    google.maps.event.addListener(markers[i], 'mouseout', (function (markerValue, i) {

                        return function () {
                            infoWindow[i].close();
                        }
                    })(markers[i], i));
                }

                for (i = 0; i < DATA['drop-off'].length; i++) {
                    lat = parseFloat(DATA['drop-off'][i].lat);
                    long = parseFloat(DATA['drop-off'][i].long);
                    name = DATA['drop-off'][i].name;
                    address = DATA['drop-off'][i].address;
                    markers[i] = new google.maps.Marker({
                        position: {lat: lat, lng: long},
                        map: map,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                    });
                    contentString[i] = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                        '<h6 id="firstHeading" class="firstHeading">Drop-off Location Name</h6>' + name + '<p></p>' +
                        '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                    infoWindow[i] = new google.maps.InfoWindow({
                        content: contentString[i]
                    });
                    var markerValue = markers[i];
                    google.maps.event.addListener(markers[i], 'mouseover', (function (markerValue, i) {
                        return function () {
                            infoWindow[i].open(map, markers[i]);
                        }

                    })(markers[i], i));
                    google.maps.event.addListener(markers[i], 'mouseout', (function (markerValue, i) {

                        return function () {
                            infoWindow[i].close();
                        }
                    })(markers[i], i));
                }

                for (i = 0; i < DATA.recycle.length; i++) {
                    lat = parseFloat(DATA.recycle[i].lat);
                    long = parseFloat(DATA.recycle[i].long);
                    name = DATA.recycle[i].name;
                    address = DATA.recycle[i].address;
                    markers[i] = new google.maps.Marker({
                        position: {lat: lat, lng: long},
                        map: map,
                        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                    });
                    contentString[i] = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                        '<h6 id="firstHeading" class="firstHeading">Recycle Location Name</h6>' + name + '<p></p>' +
                        '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                    infoWindow[i] = new google.maps.InfoWindow({
                        content: contentString[i]
                    });
                    var markerValue = markers[i];
                    google.maps.event.addListener(markers[i], 'mouseover', (function (markerValue, i) {
                        return function () {
                            infoWindow[i].open(map, markers[i]);
                        }

                    })(markers[i], i));
                    google.maps.event.addListener(markers[i], 'mouseout', (function (markerValue, i) {

                        return function () {
                            infoWindow[i].close();
                        }
                    })(markers[i], i));
                }
            }
        }
    );
}