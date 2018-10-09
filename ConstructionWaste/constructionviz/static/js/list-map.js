//This js file is for search location function

//define variables
var map, places, infoWindow;
var autocomplete;
var countryRestrict = {'country': 'au'};
var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');
var DATA = {};

//restrict area be au
var countries = {
    'au': {
        center: {lat: -37.814, lng: 144.96332},
        zoom: 10,
        mapTypeId: 'roadmap'
    }
};

var latcurrent;
var lngcurrent;

//define the initial map
function initMap() {
    console.log("initMap");
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: countries['au'].zoom,
        center: countries['au'].center,
    });

    autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('autocomplete')), {
            componentRestrictions: countryRestrict
        });
    places = new google.maps.places.PlacesService(map);

    // autocomplete.addListener('place_changed', onPlaceChanged);

    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            //window.alert("No details available for input: '" + place.name + "', Please choose address from list.");

            document.getElementById("popup").style.display="block";
            document.getElementById("overlay").style.display="block";


            return false;

        }else onPlaceChanged();

    });

    $(".col_distance").hide();

    onpageload_add_data();
}

//function for close the popup diagram
function popupClose(){
    document.getElementById("popup").style.display="none";
    document.getElementById("overlay").style.display="none";
}

//function for handle error
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

var type;
var lat;
var long;
var name;
var address;
var contentString = [];
var markers = [];
var markers2 = [];
var markers3 = [];

//calculate the distance between two locations
var dist;
var infoWindowArr = [];
var infoWindowArr2 = [];
var infoWindowArr3 = [];
//add markers to the map to default mel map
function onload_map() {
    console.log("onload_map");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            latcurrent = pos.lat;
            lngcurrent = pos.lng;
            console.log("latcurrent:"+latcurrent);
            console.log("lngcurrent:"+lngcurrent);
            var marker = new google.maps.Marker({position: pos, map: map, title: "Now your are here"});

            map.setCenter(pos);

            //get data from server
            $.ajax({
                    url: "./get_all_locations",
                    success: function (the_json) {
                        DATA = the_json;
                        console.log(the_json);

                        var datas = [];
                        for (var i = 0; i < DATA.reuse.length; i++) {
                            type = "Reuse";
                            lat = parseFloat(DATA.reuse[i].lat);
                            long = parseFloat(DATA.reuse[i].long);
                            name = DATA.reuse[i].name;
                            address = DATA.reuse[i].address;

                            var distcurrent = calcDistance(latcurrent, lngcurrent, lat, long);
                            distcurrent = distcurrent / 1000;
                            distcurrent = distcurrent.toFixed(2);
                            console.log("distcurrent:"+distcurrent);
                            var data = {};
                            data["Type"] = type;
                            data["Name"] = name;
                            data["Address"] = address;
                            data["Distance"] = distcurrent;
                            datas.push(data);

                            markers[i] = new google.maps.Marker({
                                position: {lat: lat, lng: long},
                                map: map,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                            });

                            contentString[i] = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                                '<h6 id="firstHeading" class="firstHeading">Reuse Location Name</h6>' + name + '<p></p>' +
                                '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                            infoWindowArr[i] = new google.maps.InfoWindow({
                                content: contentString[i]
                            });

                            var markerValue = markers[i];
                            google.maps.event.addListener(markers[i], 'click', (function (markerValue, i) {
                                return function () {
                                    infoWindowArr[i].open(map, markers[i]);
                                }

                            })(markers[i], i));
                        }

                        for (i = 0; i < DATA['drop-off'].length; i++) {
                            type = "Drop-off";
                            lat = parseFloat(DATA['drop-off'][i].lat);
                            long = parseFloat(DATA['drop-off'][i].long);
                            name = DATA['drop-off'][i].name;
                            address = DATA['drop-off'][i].address;

                            var distcurrent2 = calcDistance(latcurrent, lngcurrent, lat, long);
                            distcurrent2 = distcurrent2 / 1000;
                            distcurrent2 = distcurrent2.toFixed(2);
                            console.log("distcurrent2:"+distcurrent2);
                            var data2 = {};
                            data2["Type"] = type;
                            data2["Name"] = name;
                            data2["Address"] = address;
                            data2["Distance"] = distcurrent2;
                            datas.push(data2);

                            markers2[i] = new google.maps.Marker({
                                position: {lat: lat, lng: long},
                                map: map,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                            });
                            contentString[i] = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                                '<h6 id="firstHeading" class="firstHeading">Drop-off Location Name</h6>' + name + '<p></p>' +
                                '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                            infoWindowArr[i] = new google.maps.InfoWindow({
                                content: contentString[i]
                            });
                            var markerValue2 = markers2[i];
                            google.maps.event.addListener(markers2[i], 'click', (function (markerValue2, i) {
                                return function () {
                                    infoWindowArr[i].open(map, markers2[i]);
                                }
                            })(markers2[i], i));
                        }

                        for (i = 0; i < DATA.recycle.length; i++) {
                            type = "Recycle";
                            lat = parseFloat(DATA.recycle[i].lat);
                            long = parseFloat(DATA.recycle[i].long);
                            name = DATA.recycle[i].name;
                            address = DATA.recycle[i].address;

                            var distcurrent3 = calcDistance(latcurrent, lngcurrent, lat, long);
                            distcurrent3 = distcurrent3 / 1000;
                            distcurrent3 = distcurrent3.toFixed(2);
                            console.log("distcurrent2:"+distcurrent3);
                            var data3 = {};
                            data3["Type"] = type;
                            data3["Name"] = name;
                            data3["Address"] = address;
                            data3["Distance"] = distcurrent3;
                            datas.push(data3);

                            markers3[i] = new google.maps.Marker({
                                position: {lat: lat, lng: long},
                                map: map,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                            });
                            contentString[i] = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                                '<h6 id="firstHeading" class="firstHeading">Recycle Location Name</h6>' + name + '<p></p>' +
                                '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                            infoWindowArr[i] = new google.maps.InfoWindow({
                                content: contentString[i]
                            });

                            var markerValue3 = markers3[i];
                            google.maps.event.addListener(markers3[i], 'click', (function (markerValue3, i) {
                                return function () {

                                    // markers1.forEach(function(marker) {
                                    //     marker.infowindow.close(map, marker);
                                    // });
                                    // markers2.forEach(function(marker) {
                                    //     marker.infowindow.close(map, marker);
                                    // });

                                    infoWindowArr[i].open(map, markers3[i]);
                                }

                            })(markers3[i], i));
                        }

                        var jsonString = JSON.stringify(datas);  //[{"id":1,"name":"test1","age":2}]
                        var result = eval("(" + jsonString + ")");

                        $(document).ready(function () {
                            $(".col_distance").show();

                            //define data table
                            var table = $('#example').DataTable({
                                data: result,
                                columns: [
                                    {data: 'Type'},
                                    {data: 'Name'},
                                    {data: 'Address'},
                                    {data: 'Distance'}
                                ],
                                destroy: true,
                                searching: false
                            });
                            table.column( '3:visible' )
                                .order( 'asc' )
                                .draw();
                        });
                    }
                }
            );

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }



}

// When the user input address, get the place details for the address and
// zoom the map.
var lat1;
var long1;
var origin_lat;
var origin_long;
var dist2;

function removeMarkers(markers) {
    for (var i=0; i< markers.length; i++){
        markers[i].setMap(null);
    }
}

//function for load map after change place
function onPlaceChanged() {
    console.log("onPlaceChanged");
    var place = autocomplete.getPlace();
    var val = document.getElementById('autocomplete').value;

    //remove all markers and prepare to add new markers
    removeMarkers(markers);
    removeMarkers(markers2);
    removeMarkers(markers3);

    $.ajax({
        url: "./get_all_locations",
        success: function (the_json) {
            DATA = the_json;

            if (val) {
                var result = null;
                if (place.geometry) {
                    map.panTo(place.geometry.location);
                    origin_lat = place.geometry.location.lat();
                    origin_long = place.geometry.location.lng();
                    map.setZoom(11);

                    // document.getElementById('carddata').innerHTML = "";
                    var datas = [];
                    var i = 0;

                    for (i = 0; i < DATA.reuse.length; i++) {
                        type = "Reuse";
                        lat1 = parseFloat(DATA.reuse[i].lat);
                        long1 = parseFloat(DATA.reuse[i].long);
                        name = DATA.reuse[i].name;
                        address = DATA.reuse[i].address;
                        dist2 = calcDistance(origin_lat, origin_long, lat1, long1);
                        dist2 = dist2 / 1000;
                        dist2 = dist2.toFixed(2);

                        if (dist2 < 6) {
                            var data_reuse = {};
                            data_reuse["Type"] = type;
                            data_reuse["Name"] = name;
                            data_reuse["Address"] = address;
                            data_reuse["Distance"] = dist2;
                            datas.push(data_reuse);

                            var markers_new1 = new google.maps.Marker({
                                position: {lat: lat1, lng: long1},
                                map: map,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                            });

                            markers.push(markers_new1);

                            var contentString_new1 = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                            '<h6 id="firstHeading" class="firstHeading">Reuse Location Name</h6>' + name + '<p></p>' +
                            '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                            var infoWindow_new1 = new google.maps.InfoWindow({
                                content: contentString_new1
                            });
                            infoWindowArr.push(infoWindow_new1);

                            var markerValue = markers[i];
                            google.maps.event.addListener(markers_new1, 'click', (function (markers_new1, info) {
                                return function () {
                                    infoWindow_new1.open(map, markers_new1);
                                }

                            })(markers_new1, infoWindowArr.length));
                        }
                    }

                    for (i = 0; i < DATA['drop-off'].length; i++) {
                        type = "Drop-off";
                        lat1 = parseFloat(DATA['drop-off'][i].lat);
                        long1 = parseFloat(DATA['drop-off'][i].long);
                        name = DATA['drop-off'][i].name;
                        address = DATA['drop-off'][i].address;
                        dist2 = calcDistance(origin_lat, origin_long, lat1, long1);
                        dist2 = dist2 / 1000;
                        dist2 = dist2.toFixed(2);


                        //judge the distance from user input address to all locations
                        //if distance < 6 km, show the data in the list
                        if (dist2 < 6) {
                            var data_drop = {};
                            data_drop["Type"] = type;
                            data_drop["Name"] = name;
                            data_drop["Address"] = address;
                            data_drop["Distance"] = dist2;
                            datas.push(data_drop);

                            var markers_new2 = new google.maps.Marker({
                                position: {lat: lat1, lng: long1},
                                map: map,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                            });

                            markers2.push(markers_new2);

                            var contentString_new2 = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                                '<h6 id="firstHeading" class="firstHeading">Drop-off Location Name</h6>' + name + '<p></p>' +
                                '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                            var infoWindow_new2 = new google.maps.InfoWindow({
                                content: contentString_new2
                            });
                            infoWindowArr2.push(infoWindow_new2);

                            var markerValue2 = markers2[i];
                            google.maps.event.addListener(markers_new2, 'click', (function (markers_new2, info) {
                                return function () {
                                    infoWindow_new2.open(map, markers_new2);
                                }

                            })(markers_new2, infoWindowArr2.length));
                        }
                    }

                    for (i = 0; i < DATA.recycle.length; i++) {
                        type = "Recycle";
                        lat1 = parseFloat(DATA.recycle[i].lat);
                        long1 = parseFloat(DATA.recycle[i].long);
                        name = DATA.recycle[i].name;
                        address = DATA.recycle[i].address;
                        dist2 = calcDistance(origin_lat, origin_long, lat1, long1);
                        dist2 = dist2 / 1000;
                        dist2 = dist2.toFixed(2);
                        markers3[i].setMap(null);

                        if (dist2 < 6) {
                            var data_recycle = {};
                            data_recycle["Type"] = type;
                            data_recycle["Name"] = name;
                            data_recycle["Address"] = address;
                            data_recycle["Distance"] = dist2;
                            datas.push(data_recycle);

                            var markers_new3 = new google.maps.Marker({
                                position: {lat: lat1, lng: long1},
                                map: map,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                            });

                            markers3.push(markers_new3);

                            var contentString_new3 = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                                '<h6 id="firstHeading" class="firstHeading">Recycle Location Name</h6>' + name + '<p></p>' +
                                '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                            var infoWindow_new3 = new google.maps.InfoWindow({
                                content: contentString_new3
                            });
                            infoWindowArr3.push(infoWindow_new3);

                            var markerValue3 = markers3[i];
                            google.maps.event.addListener(markers_new3, 'click', (function (markers_new3, info) {
                                return function () {
                                    infoWindow_new3.open(map, markers_new3);
                                }

                            })(markers_new3, infoWindowArr3.length));

                        }
                    }

                    var jsonString = JSON.stringify(datas);  //[{"id":1,"name":"test1","age":2}]
                    result = eval("(" + jsonString + ")");
                } else {
                    document.getElementById('autocomplete').placeholder = 'Search by address';
                }

                $(".col_distance").show();
                
                var table = $('#example').DataTable({
                    data: result,
                    columns: [
                        {data: 'Type'},
                        {data: 'Name'},
                        {data: 'Address'},
                        {data: 'Distance'}
                    ],
                    destroy: true,
                    searching:false
                });
                table.column( '3:visible' )
                    .order( 'asc' )
                    .draw();
            } else {
                onload_map();
            }
        }
    });
}
//the function to calculate distance
function calcDistance(fromLat, fromLng, toLat, toLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
}

function onpageload_add_data(){
    $.ajax({
        url: "./get_all_locations",
        success: function (the_json) {
            DATA = the_json;
                var result = null;

                    // document.getElementById('carddata').innerHTML = "";
                    var datas = [];
                    var i = 0;

                    for (i = 0; i < DATA.reuse.length; i++) {
                        type = "Reuse";
                        lat1 = parseFloat(DATA.reuse[i].lat);
                        long1 = parseFloat(DATA.reuse[i].long);
                        name = DATA.reuse[i].name;
                        address = DATA.reuse[i].address;
                        
                        var data_reuse = {};
                        data_reuse["Type"] = type;
                        data_reuse["Name"] = name;
                        data_reuse["Address"] = address;
                        data_reuse["Distance"] = "";
                        datas.push(data_reuse);
                        
                        var markers_new1 = new google.maps.Marker({
                                position: {lat: lat1, lng: long1},
                                map: map,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                            });
                        markers.push(markers_new1);
                        
                        var contentString_new1 = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                            '<h6 id="firstHeading" class="firstHeading">Reuse Location Name</h6>' + name + '<p></p>' +
                            '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                            var infoWindow_new1 = new google.maps.InfoWindow({
                                content: contentString_new1
                            });
                            infoWindowArr.push(infoWindow_new1);

                            var markerValue = markers[i];
                            google.maps.event.addListener(markers_new1, 'click', (function (markers_new1, info) {
                                return function () {
                                    infoWindow_new1.open(map, markers_new1);
                                }

                            })(markers_new1, infoWindowArr.length));

                    }

                    for (i = 0; i < DATA['drop-off'].length; i++) {
                        type = "Drop-off";
                        lat1 = parseFloat(DATA['drop-off'][i].lat);
                        long1 = parseFloat(DATA['drop-off'][i].long);
                        name = DATA['drop-off'][i].name;
                        address = DATA['drop-off'][i].address;

                        var data_drop = {};
                        data_drop["Type"] = type;
                        data_drop["Name"] = name;
                        data_drop["Address"] = address;
                        data_drop["Distance"] = "";
                        datas.push(data_drop);

                        var markers_new2 = new google.maps.Marker({
                            position: {lat: lat1, lng: long1},
                            map: map,
                            icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        });

                        markers2.push(markers_new2);

                        var contentString_new2 = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                            '<h6 id="firstHeading" class="firstHeading">Drop-off Location Name</h6>' + name + '<p></p>' +
                            '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                        var infoWindow_new2 = new google.maps.InfoWindow({
                            content: contentString_new2
                        });
                        infoWindowArr2.push(infoWindow_new2);

                        var markerValue2 = markers2[i];
                        google.maps.event.addListener(markers_new2, 'click', (function (markers_new2, info) {
                            return function () {
                                infoWindow_new2.open(map, markers_new2);
                            }

                        })(markers_new2, infoWindowArr2.length));
                    }

                    for (i = 0; i < DATA.recycle.length; i++) {
                        type = "Recycle";
                        lat1 = parseFloat(DATA.recycle[i].lat);
                        long1 = parseFloat(DATA.recycle[i].long);
                        name = DATA.recycle[i].name;
                        address = DATA.recycle[i].address;

//                        markers3[i].setMap(null);

                        var data_recycle = {};
                        data_recycle["Type"] = type;
                        data_recycle["Name"] = name;
                        data_recycle["Address"] = address;
                        data_recycle["Distance"] = "";
                        datas.push(data_recycle);

                        var markers_new3 = new google.maps.Marker({
                            position: {lat: lat1, lng: long1},
                            map: map,
                            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        });

                        markers3.push(markers_new3);

                        var contentString_new3 = '<div id="content">' + '<div id="siteNotice">' + '</div>' +
                            '<h6 id="firstHeading" class="firstHeading">Recycle Location Name</h6>' + name + '<p></p>' +
                            '<h6 id="firstHeading" class="firstHeading">Address</h6>' + address;

                        var infoWindow_new3 = new google.maps.InfoWindow({
                            content: contentString_new3
                        });
                        infoWindowArr3.push(infoWindow_new3);

                        var markerValue3 = markers3[i];
                        google.maps.event.addListener(markers_new3, 'click', (function (markers_new3, info) {
                            return function () {
                                infoWindow_new3.open(map, markers_new3);
                            }

                        })(markers_new3, infoWindowArr3.length));

                    }

                    var jsonString = JSON.stringify(datas);  //[{"id":1,"name":"test1","age":2}]
                    result = eval("(" + jsonString + ")");

                var table = $('#example').DataTable({
                    data: result,
                    columns: [
                        {data: 'Type'},
                        {data: 'Name'},
                        {data: 'Address'},
                    ],
                    destroy: true,
                    searching:false
                });
                table.column( '3:visible' )
                    .order( 'asc' )
                    .draw();
        }
    });
}