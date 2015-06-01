

var map;
var oGeoLa = topojson.feature(oLaTopo, oLaTopo.objects.collection);
var initialCenter = new google.maps.LatLng(53,-2.5);
var initialZoom = 6;

function getIdList(oGeo){
    var aList = [];
    for(var index = 0; index < oGeo.features.length; index++){
        aList.push(oGeo.features[index].properties.geo_code)
    }
    return aList
}
var aLaList = getIdList(oGeoLa);

//function extend_bounds(bounds, arr){
//    arr.forEach(function(path){
//        path.getArray().forEach(function(latLng){
//            bounds.extend(latLng);
//        });
//    });
//    return bounds
//}

function initialiseMap(gmap) {
  map = gmap;

  map.setOptions({
    center: initialCenter,
    zoom: initialZoom,
    styles: mapStyle,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: centrePoint.useTouch ? google.maps.ControlPosition.RIGHT_CENTER : google.maps.ControlPosition.TOP_RIGHT
    }
  });

  map.data.addGeoJson(oGeoLa);
}

function resetMap() {
  map.setCenter(initialCenter);
  map.setZoom(initialZoom);
}