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
var origin_lat;
var origin_long;
function onPlaceChanged() {
    var place = autocomplete.getPlace();
    if (place.geometry) {
        map.panTo(place.geometry.location);
        origin_lat = place.geometry.location.lat();
        origin_long = place.geometry.location.lng();
        map.setZoom(13);
    } else {
        document.getElementById('autocomplete').placeholder = 'Search by address';
    }
}

//add data table

var type;
var lat = [];
var long = [];
var name = [];
var address = [];
var markers = [];
var contentString = [];
var infoWindow = [];
var tableContent=[];

//calculate the distance between two locations
function distance(origin_lat, origin_long, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}

//add markers to the map to default mel map
function onload_map() {
    $.ajax({
            url: "./get_all_locations",
            success: function (the_json) {
                DATA = the_json;
                console.log(the_json);

                var i;

                for (i = 0; i < DATA.reuse.length; i++) {
                    type = "Reuse";
                    lat = parseFloat(DATA.reuse[i].lat);
                    long = parseFloat(DATA.reuse[i].long);
                    name = DATA.reuse[i].name;
                    address = DATA.reuse[i].address;

                    tableContent[i] = '<tr><td id="type">' + type + '</td>' +'<td id="name">' + name +'</td>'
                        +'<td id="address">' + address + '</td></tr>';

                    document.getElementById('carddata').innerHTML += tableContent[i];
                }

                for (i = 0; i < DATA['drop-off'].length; i++) {
                    type = "Drop-off";
                    lat = parseFloat(DATA['drop-off'][i].lat);
                    long = parseFloat(DATA['drop-off'][i].long);
                    name = DATA['drop-off'][i].name;
                    address = DATA['drop-off'][i].address;

                    tableContent[i] = '<tr><td id="type">' + type + '</td>' +'<td id="name">' + name +'</td>'
                        +'<td id="address">' + address + '</td></tr>';

                    document.getElementById('carddata').innerHTML += tableContent[i];
                }

                for (i = 0; i < DATA.recycle.length; i++) {
                    type = "Recycle";
                    lat = parseFloat(DATA.recycle[i].lat);
                    long = parseFloat(DATA.recycle[i].long);
                    name = DATA.recycle[i].name;
                    address = DATA.recycle[i].address;

                    tableContent[i] = '<tr><td id="type">' + type + '</td>' +'<td id="name">' + name +'</td>'
                        +'<td id="address">' + address + '</td></tr>';

                    document.getElementById('carddata').innerHTML += tableContent[i];
                }
                $(document).ready(function() {
                    $('#example').DataTable();
                } );

                var radlat1 = Math.PI * origin_lat/180
                var radlat2 = Math.PI * lat/180
                var theta = origin_long-long
                var radtheta = Math.PI * theta/180
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist)
                dist = dist * 180/Math.PI
                dist = dist * 60 * 1.1515
                return dist

            }
        }
    );
}
