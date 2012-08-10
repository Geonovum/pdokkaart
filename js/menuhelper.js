function generatecode(){
	
//need to display all markers and no clusters prior
//getting them from DOM, as below.
if (markersLayer.markers.length) {
   clusterControl.deactivate();
   osMap.removeControl(clusterControl);
   clusterControl.destroy();
}

var form = document.createElement("form");
method = "post"; 
path = "mapbuilder?actionType=generate";
form.setAttribute("method", method);
form.setAttribute("action", path);

// Zoom level
var hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "osMapZoom");
hiddenField.setAttribute("value", osMap.getZoom());
form.appendChild(hiddenField);

// Centre of map - Easting
hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "osMapCenterEasting");
hiddenField.setAttribute("value", osMap.getCenter().getEasting());
form.appendChild(hiddenField);

// Centre of map - Northing
hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "osMapCenterNorthing");
hiddenField.setAttribute("value", osMap.getCenter().getNorthing());
form.appendChild(hiddenField);

// Size of map - width
hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "osMapSizeWidth");
hiddenField.setAttribute("value", osMap.size.w);
form.appendChild(hiddenField);

// Size of map - height
hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "osMapSizeHeight");
hiddenField.setAttribute("value", osMap.size.h);
form.appendChild(hiddenField);

// Size of map radio buttons
hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "RADIOMAPSIZE");
hiddenField.setAttribute("value", get_radio_mapsize_value());
form.appendChild(hiddenField);

// Overview map tick box 
hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "OVERVIEWMAP");
hiddenField.setAttribute("value", get_radio_overviewmap_value());
form.appendChild(hiddenField);

// Postcode/gazetteer search box
hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "POSTCODE");
hiddenField.setAttribute("value", get_radio_postcode_value());
form.appendChild(hiddenField);

// Grid Coordinates tick box
hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "GRID");
hiddenField.setAttribute("value", get_radio_grid_value());
form.appendChild(hiddenField);

// Finding out the markers information
var markersArray = osMap.getMarkerLayer().markers;
hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "osMapNumberMarkers");
hiddenField.setAttribute("value", markersArray.length);
form.appendChild(hiddenField);

for (var i = 0; i < markersArray.length; i++) {
	// marker's position
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapMarkerEasting" + i);
	hiddenField.setAttribute("value", markersArray[i].lonlat.lon);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapMarkerNorthing" + i);
	hiddenField.setAttribute("value", markersArray[i].lonlat.lat);
	form.appendChild(hiddenField);
	
	// marker's icon details
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapMarkerIconUrl" + i);
	hiddenField.setAttribute("value", markersArray[i].icon.url);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapMarkerIconSizeH" + i);
	hiddenField.setAttribute("value", markersArray[i].icon.size.h);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapMarkerIconSizeW" + i);
	hiddenField.setAttribute("value", markersArray[i].icon.size.w);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapMarkerIconOffsetX" + i);
	hiddenField.setAttribute("value", markersArray[i].icon.offset.x);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapMarkerIconOffsetY" + i);
	hiddenField.setAttribute("value", markersArray[i].icon.offset.y);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapMarkerIconInfoWindowAnchorX" + i);
	hiddenField.setAttribute("value", markersArray[i].icon.infoWindowAnchor.x);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapMarkerIconInfoWindowAnchorY" + i);
	hiddenField.setAttribute("value", markersArray[i].icon.infoWindowAnchor.y);
	form.appendChild(hiddenField);
	
	// marker's popup
	if (!(markersArray[i].eventObj == null)) {
		hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "osMapMarkerPopupContent" + i);
		hiddenField.setAttribute("value", markersArray[i].eventObj.html);
		form.appendChild(hiddenField);
		
		hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "osMapMarkerPopupSizeH" + i);
		hiddenField.setAttribute("value", markersArray[i].eventObj.size.h);
		form.appendChild(hiddenField);
		
		hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "osMapMarkerPopupSizeW" + i);
		hiddenField.setAttribute("value", markersArray[i].eventObj.size.w);
		form.appendChild(hiddenField);
	}
}

// Finding out the routes information
var routesArray = linesLayer.features;
hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "osMapNumberRoutes");
hiddenField.setAttribute("value", routesArray.length);
form.appendChild(hiddenField);

for (var i = 0; i < routesArray.length; i++) {
	var lineComponentsArray = routesArray[i].geometry.components;
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "route" + i + "nbpoints");
	hiddenField.setAttribute("value", lineComponentsArray.length);
	form.appendChild(hiddenField);
	
	for (var j = 0; j < lineComponentsArray.length; j++) {
		hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "route" + i + "pointx" + j);
		hiddenField.setAttribute("value", lineComponentsArray[j].x);
		form.appendChild(hiddenField);
		
		hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", "route" + i + "pointy" + j);
		hiddenField.setAttribute("value", lineComponentsArray[j].y);
		form.appendChild(hiddenField);
	}
}

// Finding out the start route/end route markers information
var routeMarkersArray = routeMarkersLayer.markers;
hiddenField = document.createElement("input");
hiddenField.setAttribute("type", "hidden");
hiddenField.setAttribute("name", "osMapNumberRouteMarkers");
hiddenField.setAttribute("value", routeMarkersArray.length);
form.appendChild(hiddenField);

for (var i = 0; i < routeMarkersArray.length; i++) {
	// marker's position
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapRouteMarkerEasting" + i);
	hiddenField.setAttribute("value", routeMarkersArray[i].lonlat.lon);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapRouteMarkerNorthing" + i);
	hiddenField.setAttribute("value", routeMarkersArray[i].lonlat.lat);
	form.appendChild(hiddenField);
	
	// marker's icon details
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapRouteMarkerIconUrl" + i);
	hiddenField.setAttribute("value", routeMarkersArray[i].icon.url);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapRouteMarkerIconSizeH" + i);
	hiddenField.setAttribute("value", routeMarkersArray[i].icon.size.h);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapRouteMarkerIconSizeW" + i);
	hiddenField.setAttribute("value", routeMarkersArray[i].icon.size.w);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapRouteMarkerIconOffsetX" + i);
	hiddenField.setAttribute("value", routeMarkersArray[i].icon.offset.x);
	form.appendChild(hiddenField);
	
	hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "osMapRouteMarkerIconOffsetY" + i);
	hiddenField.setAttribute("value", routeMarkersArray[i].icon.offset.y);
	form.appendChild(hiddenField);
}

document.body.appendChild(form);

form.submit();
}

function get_radio_mapsize_value()
{
	for (var i=0; i < document.yourmap.mapsize.length; i++)
   	{
   		if (document.yourmap.mapsize[i].checked)
      	{
      		return rad_val = document.yourmap.mapsize[i].value;
      	}
   	}
}

function get_radio_overviewmap_value()
{
	for (var i=0; i < document.yourmap.overviewmap.length; i++)
   	{
   		if (document.yourmap.overviewmap[i].checked)
      	{
      		return rad_val = document.yourmap.overviewmap[i].value;
      	}
   	}
}

function get_radio_grid_value()
{
	for (var i=0; i < document.yourmap.gridcoordinates.length; i++)
   	{
   		if (document.yourmap.gridcoordinates[i].checked)
      	{
      		return rad_val = document.yourmap.gridcoordinates[i].value;
      	}
   	}
}

function get_radio_postcode_value()
{
	for (var i=0; i < document.yourmap.searchbox.length; i++)
   	{
   		if (document.yourmap.searchbox[i].checked)
      	{
      		return rad_val = document.yourmap.searchbox[i].value;
      	}
   	}
}


function savecode(){
	var form = document.createElement("form");
	method = "post"; 
	path = "mapbuilder?actionType=save";
	form.setAttribute("method", method);
	form.setAttribute("action", path);
	document.body.appendChild(form);
	form.submit();
}