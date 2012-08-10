/**
 * @author SEdney
 * 
 * Purpose: Support functions for managing markers on mapbuilder map
 */

//variables for adding markers
var markersLayer, markerStyle, markerIcon, dragControl, lastMarkerEdit;
var checkMarkerClick = 0;
var iconsize = new OpenLayers.Size(33, 45);
var offsetm = new OpenLayers.Pixel(-16, -36);
var infoanchor = new OpenLayers.Pixel(16, 16);
var markerPng = "marker_red.png";

//create a marker based upon a map click
var func = function(e){
    var pt = osMap.getLonLatFromViewPortPx(e.xy);
	setMarkerIcon();
    osMap.createMarker(new OpenSpace.MapPoint(pt.lon, pt.lat), markerIcon.clone());
};


//delete single marker, after it has been clicked on
var deleteFunc = function(){
	osMap.removeMarker(this);
	osMap.closeInfoWindow();
 };
 
//repopulate text editor
var repopulateFunc  = function(){
	lastMarkerEdit = this;	
	//show html editor
	showEditor();
	//turn off keyboard navigation for text editor	
	osMap.controls[0].deactivate();
	osMap.controls[1].deactivate();		
	document.getElementById("savemarkerinfo").style.visibility = "visible";
	if(this.eventObj != null){
	   CKEDITOR.instances['editor1'].setData(this.eventObj.html);
	}	
	else{
	   CKEDITOR.instances['editor1'].setData("enter content here...");		
		
	}
	//set variable to give appropriate message if no marker clicked on prior to save
	checkMarkerClick = 1;		
}

//change marker image, based upon radio button selection
function setMarkerImage(markerType){	
	var markerGroup = document.getElementById("mapmarkers").className;
	var markerColour = markerGroup.substr(4);	
	
	if (markerType == 1){
		markerPng = "marker-cross-med-" + markerColour + ".png";
	    iconsize = new OpenLayers.Size(30, 39);
		offsetm = new OpenLayers.Pixel(-15, -36);
		infoanchor = new OpenLayers.Pixel(16, 16);	
		
	}
	if (markerType == 2){
		markerPng = "marker_" + markerColour + ".png";
		iconsize = new OpenLayers.Size(33, 45);
		offsetm = new OpenLayers.Pixel(-16, -36);
		infoanchor = new OpenLayers.Pixel(16, 16);			
	}
	
	if(markerType == 3){
		markerPng = "round-marker-lrg-" + markerColour + ".png";	
		iconsize = new OpenLayers.Size(17, 17);
		offsetm = new OpenLayers.Pixel(-8, -8);
		infoanchor = new OpenLayers.Pixel(8, 8);				
	}		
}

//create icon, based upon user selected marker image
function setMarkerIcon(){
    var markerStyle = './img_versions/img_1.1/OS/images/markers/' + markerPng;
    markerIcon = new OpenSpace.Icon(markerStyle, iconsize, offsetm, null, infoanchor);	
}
