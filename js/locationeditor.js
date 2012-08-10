var pdokmarkerpath = "http://nieuwsinkaart.nl/pdok/kaart/markertypes/information_blue.png"

// custom editing function, to be loaded after the rest of the API
function addLocationEditor(apiObject, geomType, options) {
	// options: geomType, x_id, y_id, geom_id, editorMaxZoom, editorMinZoom

	var map = apiObject.getMapObject();
	var markers = new OpenLayers.Layer.Vector("Editing layer", {
                styleMap: getStyleMap(),
                displayInLayerSwitcher: false
            });
	map.addLayer(markers);

	function updateFormElement(feature) {
	   if (geomType=="point" && options.x_id && options.y_id) {
		   jQuery("#"+options.x_id).val(Math.round(feature.geometry.x))
		   jQuery("#"+options.y_id).val(Math.round(feature.geometry.y))
	   } else {
	   	   // TODO: round all coordinates
	   	   // TODO: now WKT format, could also be GeoJSON
   		   jQuery("#"+options.geom_id).val(feature.geometry)
	   }
	}

	var dragControl = new OpenLayers.Control.DragFeature(markers, {	
			onComplete: function(feature){
				updateFormElement(feature);
		   }
	});

	if (!geomType) geomType="point";
	var cl;
	switch(geomType) {
		case "point":
			cl = OpenLayers.Handler.Point;
			handlerOptions = {}
			break;
		case "line":
			cl = OpenLayers.Handler.Path;
			handlerOptions = {}
			break;
		case "polygon":
			cl = OpenLayers.Handler.Polygon;
			handlerOptions = {}
			break;
		case "bbox":
			cl = OpenLayers.Handler.RegularPolygon;
			handlerOptions = {sides: 4, irregular: true};
			break;
	}
	var drawControl = new OpenLayers.Control.DrawFeature(markers, cl, handlerOptions);

	drawControl.featureAdded = function(feature){
		   updateFormElement(feature);
		   drawControl.deactivate();
		   dragControl.activate();
	}

	map.addControls([dragControl, drawControl]);

	// TODO: add gui element upper right corner for activate / deactivate drawControl and dragControl?
	// var mapDivId = map.div.id;
	// jQuery("#"+mapDivId) // append an element for the drawControl?

	// depending on the zoomlevel, activate the appropriate control for drawing or dragging
	if(!options.editorMaxZoom) editorMaxZoom = map.getNumZoomLevels();
	else editorMaxZoom = options.editorMaxZoom;
	if(!options.editorMinZoom) editorMinZoom = 0;
	else editorMinZoom = options.editorMinZoom;
	if (map.getZoom() >= editorMinZoom && map.getZoom() <= editorMaxZoom) {
		drawControl.activate();
	} else {
		drawControl.deactivate();
	}
	
	map.events.register("zoomend", map, function(e) {
		var activeControl = drawControl;
		if (markers.features.length > 0) activeControl = dragControl;		
		if (map.getZoom() >= editorMinZoom && map.getZoom() <= editorMaxZoom) {
			activeControl.activate();
		} else {
			activeControl.deactivate();
		}		
	});
}

function getStyleMap() {

	var defaultStyle = new OpenLayers.Style({
	  'pointRadius': 14,
	  // graphicwidth/height fail in IE...
	  //'graphicWidth':'16',
	  //'graphicHeight':'19',
	  'externalGraphic': pdokmarkerpath,
  	  'graphicYOffset':-28,
	  'fillColor':'#ffffff',
	  'fillOpacity':'0.7',
	  'strokeColor':'#FF5C00',
	  'strokeWidth':'3',
	  'opacity':'0.7'
	});

	var selectStyle = new OpenLayers.Style({
	  'pointRadius': 15,
      'externalGraphic': pdokmarkerpath,
	  'fillColor':'#ffffff',
	  'fillOpacity':'0.7',
	  // graphicwidth/height fail in IE...
	  //'graphicWidth':'20',
	  //'graphicHeight':'24',
  	  'graphicYOffset':-30
	});

	var styleMap = new OpenLayers.StyleMap({'default': defaultStyle,
			         'select': selectStyle, 'temporary': selectStyle});
	return styleMap;
}
