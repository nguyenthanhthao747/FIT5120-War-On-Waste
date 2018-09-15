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
    console.log("initMap");
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
    //onload_map();
    onPlaceChanged();
}


var markers = [];
var type;
var lat;
var long;
var name;
var address;
var contentString = [];
var infoWindow = [];
var tableContent = [];

//calculate the distance between two locations
var dist;
var radlat1;
var radlat2;
var theta;
var radtheta;

//add markers to the map to default mel map
function onload_map() {
    console.log("onload_map");
    $.ajax({
            url: "./get_all_locations",
            success: function (the_json) {
                DATA = the_json;
                console.log(the_json);

                var datas=[];
                for (var i = 0; i < DATA.reuse.length; i++) {
                    type = "Reuse";
                    lat = parseFloat(DATA.reuse[i].lat);
                    long = parseFloat(DATA.reuse[i].long);
                    name = DATA.reuse[i].name;
                    address = DATA.reuse[i].address;

                    var data = {};
                    data["Type"] = type;
                    data["Name"] = name;
                    data["Address"] = address;
                    data["Distance"] = 1;
                    datas.push(data);
                }
                var jsonString = JSON.stringify(datas);  //[{"id":1,"name":"test1","age":2}]
                var result=eval("("+jsonString+")");

                for (i = 0; i < DATA['drop-off'].length; i++) {
                    type = "Drop-off";
                    lat = parseFloat(DATA['drop-off'][i].lat);
                    long = parseFloat(DATA['drop-off'][i].long);
                    name = DATA['drop-off'][i].name;
                    address = DATA['drop-off'][i].address;
                }

                for (i = 0; i < DATA.recycle.length; i++) {
                    type = "Recycle";
                    lat = parseFloat(DATA.recycle[i].lat);
                    long = parseFloat(DATA.recycle[i].long);
                    name = DATA.recycle[i].name;
                    address = DATA.recycle[i].address;
                }
                $(document).ready(function() {
                    $('#example').DataTable({
                        data:result,
                        columns: [
                            { data: 'Type'},
                            { data: 'Name'},
                            { data: 'Address'},
                            { data: 'Distance'}
                        ],
                        destroy:true
                    });
                } );
            }
        }
    );
}

// When the user input address, get the place details for the address and
// zoom the map.
var type1;
var lat1;
var long1;
var name1;
var address1;

var origin_lat;
var origin_long;
var radtheta2;
var dist2;
var radlat3;
var radlat4;

function onPlaceChanged() {
    console.log("onPlaceChanged");
    var place = autocomplete.getPlace();
    var val = document.getElementById('autocomplete').value;
    console.log("val:"+val);
    $.ajax({
        url: "./get_all_locations",
        success: function (the_json) {
            DATA = the_json;

            if (val) {
                var result=null;
                if (place.geometry) {
                    map.panTo(place.geometry.location);
                    origin_lat = place.geometry.location.lat();
                    origin_long = place.geometry.location.lng();
                    map.setZoom(13);


                    // document.getElementById('carddata').innerHTML = "";
                    var datas =[];
                    for (var i = 0; i < DATA.reuse.length; i++) {
                        type = "Reuse";
                        lat1 = parseFloat(DATA.reuse[i].lat);
                        long1 = parseFloat(DATA.reuse[i].long);
                        name = DATA.reuse[i].name;
                        address = DATA.reuse[i].address;
                        dist2 = calcDistance(origin_lat,origin_long,lat1,long1);
                        dist2 = dist2 / 1000;
                        dist2 = dist2.toFixed(2);
                        console.log("name1:"+name1+";dist1:"+dist2);

                        if (dist2 < 20000) {
                            console.log("name2:"+name1+";dist2"+dist2);

                            var data = {};
                            data["Type"] = type;
                            data["Name"] = name;
                            data["Address"] = address;
                            data["Distance"] = dist2;
                            datas.push(data);
                        }

                    }
                    var jsonString = JSON.stringify(datas);  //[{"id":1,"name":"test1","age":2}]
                    result=eval("("+jsonString+")");
                } else {
                    document.getElementById('autocomplete').placeholder = 'Search by address';
                }

                $('#example').DataTable({
                    data:result,
                    columns: [
                        { data: 'Type'},
                        { data: 'Name'},
                        { data: 'Address'},
                        { data: 'Distance'}
                    ],
                    destroy:true
                });
            } else {
                onload_map();
            }
        }
    });
}

function calcDistance (fromLat, fromLng, toLat, toLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
}