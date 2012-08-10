/**
 * @author SEdney
 * 
 * Purpose: Manage markers for create markers tab
 * For support functions see markersupport.js
 */

var markersLayer, dragControl, clusterControl;
var dragMode = "false";

function manageMarkers(caseVal){
	//refer to markers layer at each event
	markersLayer = osMap.getMarkerLayer();	
	//unregister add marker functionality
	osMap.events.unregister("click", osMap, func);
	//remove drag control from map if one exists   
	if(dragControl){
	   dragControl.deactivate();
	   osMap.removeControl(dragControl);	
	}
	//hide html editor
	hideEditor();
	document.getElementById("savemarkerinfo").style.visibility = "hidden";
	
		
	//unregister all click listeners on markers
    for (var i = 0; i < markersLayer.markers.length; i++) {
		markersLayer.markers[i].events.unregister("click", markersLayer.markers[i], deleteFunc);
		markersLayer.markers[i].events.unregister("click", markersLayer.markers[i], repopulateFunc);
		//make sure that all markers have just one mousedown event registered for pop-ups
		if(!(markersLayer.markers[i].events.listeners.mousedown.length)){
		   markersLayer.markers[i].events.register("mousedown", markersLayer.markers[i].eventObj, markersLayer.markers[i].eventFunc);
		}
    }
	//close any open info windows
	osMap.closeInfoWindow();
	
	//assess if a clustering control exists or not
	var clustercontvar = osMap.getControlsByClass("OpenSpace.Control.ClusterManager");
	
	//add cluster manager as appropriate
	if (caseVal == 0 && clustercontvar.length == 0 && markersLayer.markers.length){
		clusterControl = new OpenSpace.Control.ClusterManager();
	    osMap.addControl(clusterControl);   
		clusterControl.activate();

	}
	else if (caseVal!= 0 && clustercontvar.length > 0){
		clusterControl.deactivate();
		osMap.removeControl(clusterControl);
		clusterControl.destroy();
	}		
			
    switch(caseVal) {
		case 1:
			//case - add markers
			if (document.getElementById("editmarker4").checked == true) {
				osMap.events.register("click", osMap, func);
			}
            break;
		case 2:
			//case - save marker info object
			//if neither case 1 or 5:
			//recreate selected marker with html in text editor
		    var editor_data = CKEDITOR.instances.editor1.getData();
			if (markersLayer.markers.length) {
			   lastMarker = lastMarkerEdit;
			   if (checkMarkerClick == 1){
                  var markerPos = lastMarker.lonlat;
			      var markerIcon = lastMarker.icon;
			      osMap.removeMarker(lastMarker);
				  //target fix to make sure html content always opens in new window
				  editor_data = editor_data.replace(/\bhref="([^"]*)"/ig, 'href="$1" onclick="var win=window.open(\'$1\');win.focus();return false;"');
				  //end fix		  
				  osMap.createMarker(markerPos, markerIcon.clone(), editor_data, new OpenLayers.Size(250, 150));
				  checkMarkerClick = 0;	
				  //turn on keyboard navigation for text editor	 
	              osMap.controls[0].activate();
	              osMap.controls[1].activate();				  
			   }
               else{
                  alert("Need to click a marker before saving pop-up info to it");
               }			   
			}
			break;		
		case 3:
			//remove all markers and info windows from document
			if (confirm('Delete all markers - cannot be undone?')) {
				osMap.clearMarkers();				
		        document.getElementById("editmarker5").checked = "true";
			}
		    break;
		case 4:
			//select and delete individual markers 
			if (document.getElementById("editmarker3").checked == true) {
				markersLayer.setDragMode(true); //remove pop-up listeners
				
				for (var i = 0; i < markersLayer.markers.length; i++) {
					markersLayer.markers[i].events.register("click", markersLayer.markers[i], deleteFunc);
				}
			}
		    break;
		case 5:
			//edit/drag markers in markers layer 
			if (document.getElementById("editmarker2").checked == true) {

				dragControl = new OpenSpace.Control.DragMarkers(markersLayer);
				osMap.addControl(dragControl);
				dragControl.activate();
				markersLayer.setDragMode(true);
				//set a listener to populate text area
				for (var i = 0; i < markersLayer.markers.length; i++) {
					markersLayer.markers[i].events.register("click", markersLayer.markers[i], repopulateFunc);
				}
			}
    }	
}
