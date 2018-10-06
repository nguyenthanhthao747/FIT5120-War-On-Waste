var map = L.map('map').setView(['-37.819505', '144.959863'], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidG5ndTAwMTUiLCJhIjoiY2psZDc4emJuMDg5cjNwcDExbXBlMjlwaSJ9._eL7VaMuTYJJzFct2p34Mw', {
    maxZoom: 25,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Choropleth Map</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' thousand tonnes'
        : 'Hover over a suburd');
};

info.addTo(map);


// get color depending on population density value
function getColor(d) {
    return d > 25000 ? '#800026' :
        d > 20000  ? '#BD0026' :
            d > 10000  ? '#E31A1C' :
                d > 1500  ? '#FC4E2A' :
                    d > 1000   ? '#FD8D3C' :
                        d > 150   ? '#FEB24C' :
                            d > 100   ? '#FED976' :
                                '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.density)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var loaded_data = {};

// remember to add in year here
function on_change_load_data(){
    $.ajax({
        url: "./get_json_data/2018/",
        success: function(the_json){
            loaded_data = the_json;

            console.log("thao's loaded data", loaded_data);

            geojson = L.geoJson(loaded_data, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
        }
    });
}

// on page load load the data
on_change_load_data();

map.attributionControl.addAttribution('Construction waste data &copy; <a href="https://data.melbourne.vic.gov.au/Property-Planning/Major-development-projects-Development-Activity-Mo/gh7s-qda8">Melbourne Construction Waste</a>');

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 100, 150, 1000, 1500, 10000, 20000, 25000],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);