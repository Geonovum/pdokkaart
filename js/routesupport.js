/**
 * @author SEdney
 * 
 * Notes: Case refers to switch cases in createroutes.js
 * 
 */
//*** global variables: Start

var wpNum, routeNum;
var linesLayer, linesLayerTemp, lineString, lineFeature, pointVal, deleteControl, modFeatureCont, reverseControl;
var lineStringTemp, lineFeatureTemp, clickControl, editFeature, editVertex;
var routeMarkersLayer;
var style_blue = {strokeColor: "#0000CD", strokeOpacity: 0.5, strokeWidth: 4.5};
var points = new Array();

//set up style for hover select
var hoverStyle =   {fillColor: "white", fillOpacity: 0,  strokeColor: "#FFA500", strokeWidth: 5, strokeOpacity: 1};
var iconStart, iconEnd, iconStartEnd;

//set up for creation of routes, called from basicmap.js
function setRouteFunctions(){
	//define start marker
    iconStart = new OpenLayers.Icon('./img_versions/img_1.1/mapbuilder/routemarker-start.png',
    new OpenLayers.Size(33, 45),new OpenLayers.Pixel(-5, -37));
    //define end marker
    iconEnd = new OpenLayers.Icon('./img_versions/img_1.1/mapbuilder/routemarker-end.png',
    new OpenLayers.Size(33, 45),new OpenLayers.Pixel(-5, -37));
    //define start/end marker
    iconStartEnd = new OpenLayers.Icon('./img_versions/img_1.1/mapbuilder/routemarker-startend.png',
    new OpenLayers.Size(33, 45),new OpenLayers.Pixel(-5, -37));
	
	linesLayer = osMap.getVectorLayer();
	linesLayerTemp = new OpenLayers.Layer.Vector("Temp Lines Layer");
	osMap.addLayer(linesLayerTemp);	
	osMap.raiseLayer(linesLayerTemp, -3);
	
	//control to set up single and double clicks on map for end route
    clickControl = new OpenLayers.Control.Click({
                        handlerOptions: {
                            "single": true,
                            "double": true,
							"stopDouble": true
                        }
                    });	
					
	osMap.addControl(clickControl);
	
	//control to modify a route
    var options = {onModificationStart: moveStart, onModificationEnd: moveEnd}
    modFeatureCont = new OpenLayers.Control.ModifyFeature(linesLayer, options);
    osMap.addControl(modFeatureCont);	
	
	//control to delete an existing route
    deleteControl = new OpenLayers.Control.SelectFeature(linesLayer,{
    multiple: false, hover:false,  clickout: true, onSelect: deleteFeature, onUnselect: offFeature, selectStyle: hoverStyle });
    osMap.addControl(deleteControl);	
	
	//control to reverse route
	reverseControl = new OpenLayers.Control.SelectFeature(linesLayer,{
    multiple: false, hover:false,  clickout:true, onSelect:reverseFeature});
    osMap.addControl(reverseControl);
	
	//set up layer for route markers
	routeMarkersLayer = new OpenLayers.Layer.Markers("Route Markers");
	osMap.addLayer(routeMarkersLayer);		
}


//class to handle map clicks(case 1)
OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
                defaultHandlerOptions: {
                    'single': true,
                    'double': true,
                    'pixelTolerance': 0,
                    'stopSingle': false,
                    'stopDouble': false
                },

                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    ); 
                    this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'click': this.onClick,
                            'dblclick': this.onDblclick 
                        }, this.handlerOptions
                    );
                }, 

                onClick: function(evt) {
                addWayPoint(evt);
                },

                onDblclick: function(evt) { 
				finishRoute(evt);
                } 	

            });
			
//add a new waypoints(case 1)
var addWayPoint = function(e){
	removeTempLine();
	pt = osMap.getLonLatFromViewPortPx(e.xy);
	if (wpNum > 0){
	   linesLayer.removeFeatures([lineFeature]);	
	}

	if (wpNum == 0){
		routeMarkersLayer.addMarker(new OpenLayers.Marker(new OpenSpace.MapPoint(pt.lon, pt.lat),iconStart.clone()));		
	}
	var waypointSize = new OpenLayers.Size(7, 7);
	points.push(new OpenLayers.Geometry.Point(pt.lon, pt.lat));
	lineString = new OpenLayers.Geometry.LineString(points);
    lineFeature = new OpenLayers.Feature.Vector(lineString, null, style_blue);
    linesLayer.addFeatures([lineFeature]);
	wpNum = wpNum + 1;
};
 
//remove a temp line when waypoint added(case 1) 
function removeTempLine(){
    if(lineFeatureTemp){
	   linesLayerTemp.destroyFeatures([lineFeatureTemp]);		
	}	
}

//add a temp line before map add waypoint(case 1) 
var tempLine = function(e){
	if(lineFeatureTemp){
	   linesLayerTemp.destroyFeatures([lineFeatureTemp]);		
	}
	pt = osMap.getLonLatFromViewPortPx(e.xy);
	var tempLine = new Array();
	tempLine.push(new OpenLayers.Geometry.Point(pt.lon, pt.lat));
	tempLine.push(points[points.length -1]);
	lineStringTemp = new OpenLayers.Geometry.LineString(tempLine);
    lineFeatureTemp = new OpenLayers.Feature.Vector(lineStringTemp, null, style_blue);
    linesLayerTemp.addFeatures([lineFeatureTemp]);	
}

//add end marker to route(case 1)
function finishRoute(finishPoint){	

    console.log("wpNum =" + wpNum);
	//deal with defect OSPRJ00009045
		if (wpNum == 0){
		alert("not enough points");
		return false;
	}	
	
   //get location of map click
   pt = osMap.getLonLatFromViewPortPx(finishPoint.xy);
   
   //test to see if start point is near finish point to create circular route
   var routeSP = lineFeature.geometry.components[0];
   
   var pixelDistVal = pixelDistFunction(routeSP, pt); 
   
   //potential circular route
   if (pixelDistVal < 30){
 	  if (confirm('Start point the same as end point?')) {
         points.push(new OpenLayers.Geometry.Point(routeSP.x, routeSP.y));
		 routeMarkersLayer.removeMarker(routeMarkersLayer.markers[routeMarkersLayer.markers.length-1]);
	     routeMarkersLayer.addMarker(new OpenLayers.Marker(new OpenSpace.MapPoint(routeSP.x, routeSP.y),iconStartEnd.clone()));
      }
	  else{
	  	 points.push(new OpenLayers.Geometry.Point(pt.lon, pt.lat));
         routeMarkersLayer.addMarker(new OpenLayers.Marker(new OpenSpace.MapPoint(pt.lon, pt.lat),iconEnd.clone()));	  	
	  }
   }
   else{
   	  //non-circular route
      points.push(new OpenLayers.Geometry.Point(pt.lon, pt.lat));
      routeMarkersLayer.addMarker(new OpenLayers.Marker(new OpenSpace.MapPoint(pt.lon, pt.lat),iconEnd.clone()));   	
   }
	
   //final route	    
   linesLayer.removeFeatures([lineFeature]);
   lineString = new OpenLayers.Geometry.LineString(points);
   lineFeature = new OpenLayers.Feature.Vector(lineString, null, style_blue);
   linesLayer.addFeatures([lineFeature]);  
   wpNum = wpNum + 1;
   manageRoutes(1);
   
   //remove temp line uses for creating a route
   removeTempLine();
   
}

//remove start/end markers when a route modify event occurs(case2)
function moveStart(feature){
	var componentsLen = feature.geometry.components.length;
    var startPointVal = new OpenSpace.MapPoint(feature.geometry.components[0].x, feature.geometry.components[0].y);
	var endPointVal = new OpenSpace.MapPoint(feature.geometry.components[componentsLen-1].x, feature.geometry.components[componentsLen-1].y);

	for (var i = 0; i < routeMarkersLayer.markers.length; i++) {
		var markerPoint = new OpenSpace.MapPoint(routeMarkersLayer.markers[i].lonlat.lon, routeMarkersLayer.markers[i].lonlat.lat);
		//remove route start marker if there is one
		if (markerPoint.lon == startPointVal.lon && markerPoint.lat == startPointVal.lat||markerPoint.lon == endPointVal.lon && markerPoint.lat == endPointVal.lat) {
			routeMarkersLayer.removeMarker(routeMarkersLayer.markers[i]);
			i--;
		}
	}
}

//re-add start/end markers when a route modify event stops(case 2)
function moveEnd(feature){
	osMap.setCenter(osMap.getCenter());
	var startPoint = feature.geometry.components[0];
	var componentsLen = feature.geometry.components.length;
	//var endPoint = new OpenSpace.MapPoint(feature.geometry.components[componentsLen-1].x, feature.geometry.components[componentsLen-1].y)
	var endPoint = new OpenLayers.LonLat(feature.geometry.components[componentsLen-1].x, feature.geometry.components[componentsLen-1].y)
	var pixelDistVal = pixelDistFunction(startPoint, endPoint); 
	if (pixelDistVal < 30 && document.getElementById("radio_routes_3").checked == false && pixelDistVal != 0){
       if (confirm('Start point the same as end point?')) {
	  	  //get points for feature and rebuild
		  var newPoints = new Array();
	  	  for (var i = 0; i < componentsLen-1; i++){
		  	newPoints.push(feature.geometry.components[i]);
		  }
		  newPoints.push(new OpenLayers.Geometry.Point((feature.geometry.components[0].x)-1, (feature.geometry.components[0].y)-1));
		  //newPoints.push(feature.geometry.components[0]);
		  osMap.removeFeatures(feature);
		  lineString = new OpenLayers.Geometry.LineString(newPoints);
          lineFeature = new OpenLayers.Feature.Vector(lineString, null, style_blue);
          linesLayer.addFeatures([lineFeature]);
		  routeMarkersLayer.addMarker(new OpenLayers.Marker(new OpenSpace.MapPoint(feature.geometry.components[0].x, feature.geometry.components[0].y),iconStartEnd.clone()));		
		  return false;
       }
       else{
	   }
    }
	
   //case: startpoint already the same as end point	
   if(pixelDistVal == 0){
      routeMarkersLayer.addMarker(new OpenLayers.Marker(new OpenSpace.MapPoint(feature.geometry.components[0].x, feature.geometry.components[0].y),iconStartEnd.clone()));			
	  return false;
   }
   routeMarkersLayer.addMarker(new OpenLayers.Marker(new OpenSpace.MapPoint(feature.geometry.components[0].x, feature.geometry.components[0].y),iconStart.clone()));		
   routeMarkersLayer.addMarker(new OpenLayers.Marker(new OpenSpace.MapPoint(feature.geometry.components[componentsLen-1].x, feature.geometry.components[componentsLen-1].y),iconEnd.clone()));					
}

//delete a route line(case 3)
function deleteFeature(feature){
   if (confirm('delete selected route?'))
      {
	   var featuresSelectedArray = new Array();
	   featuresSelectedArray.push(feature);
	   //deleteControl.deactivate();
	   
	   deleteControl.unselect(feature);
	   moveStart(feature);
	   osMap.removeFeatures(feature);
   }   
   else{
	   deleteControl.unselect(feature);   	
   }
}

function offFeature(feature){
	//osMap.removeControl(deleteControl);	
}

//reverse a route(case 4)
function reverseFeature(feature){
	
	var reversedArray = new Array();
	for (var i = feature.geometry.components.length; i > -1; i--){
	   reversedArray.push(feature.geometry.components[i]);		
	}
    reverseControl.unselect(feature);
	linesLayer.removeFeatures(feature);	
	
   	lineString = new OpenLayers.Geometry.LineString(reversedArray);
    lineFeature = new OpenLayers.Feature.Vector(lineString, null, style_blue);
    linesLayer.addFeatures([lineFeature]);
	moveEnd(lineFeature);
}

function stopReverse(feature){
		reverseControl.deactivate();	
}			

//calculate distance between two points on map in pixels
function pixelDistFunction(routeSP, routeEP){
   //make a new lonlat from first point of route line
   var startP = new OpenLayers.LonLat(routeSP.x, routeSP.y);
   
   var startPixel = osMap.getPixelFromLonLat(startP);
   var endPixel = osMap.getPixelFromLonLat(routeEP);
			
   //get the pixels x and ys for pythag
   var startPixelX = startPixel.x;
   var startPixelY = startPixel.y;
   var endPixelX= endPixel.x;
   var endPixelY = endPixel.y;
   
			
   //calculate distance between marker and each marker in markersLayer
   var diffX = (startPixelX - endPixelX) * (startPixelX - endPixelX);
   var diffY = (startPixelY - endPixelY) * (startPixelY - endPixelY);
   var pixelDist = Math.sqrt(diffX + diffY);
   return pixelDist;
}