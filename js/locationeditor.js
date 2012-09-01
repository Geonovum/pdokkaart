//var pdokmarkerpath = "http://nieuwsinkaart.nl/pdok/kaart/markertypes/information_blue.png"

// custom editing function, to be loaded after the rest of the API
function addLocationEditor(apiObject, options, style) {
	// options: geomType, x_id, y_id, geom_id, editorMaxZoom, editorMinZoom

	var map = apiObject.getMapObject();
	/* var markers = new OpenLayers.Layer.Vector("Features", {
                displayInLayerSwitcher: false
            });
	map.addLayer(markers);
 */
	function updateFormElement(feature) {
	   if (style=="mt1" && options.x_id && options.y_id) {
		   jQuery("#"+options.x_id).val(Math.round(feature.geometry.x))
		   jQuery("#"+options.y_id).val(Math.round(feature.geometry.y))
	   } else {
	   	   // TODO: round all coordinates
	   	   // TODO: now WKT format, could also be GeoJSON
   		   jQuery("#"+options.geom_id).val(feature.geometry)
	   }
	}

	var dragControl = new OpenLayers.Control.DragFeature(apiObject.featuresLayer, {	
			onComplete: function(feature){
				updateFormElement(feature);
		   }
	}); 
	
	//if (!geomType) geomType="point";
	var cl;
	switch(style) {
		case "mt1":
			cl = OpenLayers.Handler.Point;
			handlerOptions = {}
			break;
		case "lt1":
			cl = OpenLayers.Handler.Path;
			handlerOptions = {}
			break;
		case "pt1":
			cl = OpenLayers.Handler.Polygon;
			handlerOptions = {}
			break;
		/* case "bbox":
			cl = OpenLayers.Handler.RegularPolygon;
			handlerOptions = {sides: 4, irregular: true};
			break; */
	}
/* 	var drawControl = new OpenLayers.Control.DrawFeature(markers, cl, handlerOptions);

	drawControl.featureAdded = function(feature){
		   updateFormElement(feature);
		   drawControl.deactivate();
		   dragControl.activate();
	}

	map.addControls([dragControl, drawControl]); */
 
	map.addControls([dragControl]); 
 
	// TODO: add gui element upper right corner for activate / deactivate drawControl and dragControl?
	// var mapDivId = map.div.id;
	// jQuery("#"+mapDivId) // append an element for the drawControl?

	// depending on the zoomlevel, activate the appropriate control for drawing or dragging
	if (!options.editorMaxZoom){
		editorMaxZoom = map.getNumZoomLevels();}
	else
		{
		editorMaxZoom = options.editorMaxZoom;
	};
	if (!options.editorMinZoom) {
		editorMinZoom = 0;
		}
	else {
		editorMinZoom = options.editorMinZoom;
	};
	/* if (map.getZoom() >= editorMinZoom && map.getZoom() <= editorMaxZoom) {
		featureCreatedCallback = function(feature){updateFormElement(feature);};
		apiObject.enableDrawingTool(style, featureCreatedCallback);
	} else {
		apiObject.disableDrawingTool();
	}  */ 
	
	map.events.register("zoomend", map, function(e) {
		if (apiObject.featuresLayer.features.length > 0) {
			dragControl.activate() ;
			apiObject.disableDrawingTool();		
		}		
		else if (map.getZoom() >= editorMinZoom && map.getZoom() <= editorMaxZoom) {
			featureCreatedCallback = function(feature){updateFormElement(feature);};
			apiObject.enableDrawingTool(style, featureCreatedCallback);
		} else {
			apiObject.disableDrawingTool();
		}		
	}); 
}


