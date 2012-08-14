/* File Created: augustus 14, 2012 */
function pdok_api_map_resize(w,h) {
    var frame = this.document.getElementById("map");
    frame.style.height = h+'px';
    frame.style.width = w + 'px';
    markers.redraw();
    var center = mapPDOKKaart.getCenter();
    var zoomlevel = 2;//  mapPDOKKaart.getZoom();
    mapPDOKKaart.setCenter(new OpenLayers.LonLat(center.lon, center.lat),zoomlevel);
}


