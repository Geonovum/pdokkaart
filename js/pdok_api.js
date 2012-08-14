/* File Created: augustus 14, 2012 */
function pdok_api_map_resize(w,h) {
    this.document.getElementById("map").style.height = h + 'px';
    this.document.getElementById("map").style.width = w + 'px';
    mapPDOKKaart.updateSize();
}


