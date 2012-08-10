/**
 * @author S.R. Edney, Ordnance Survey
 * Novemeber 2009
 */

//All button or similar events for routes are filtered through this function
function manageRoutes(caseVal){
	//set controls to be deactivated by default
	deleteControl.deactivate();
	modFeatureCont.deactivate();
	reverseControl.deactivate();
	clickControl.deactivate();
	//unregister temp line overlay (used befor each definite route waypoint is added to map)
	osMap.events.unregister("mousemove", osMap, tempLine);
	
	switch (caseVal) {
		case 1:
				//start create routes functionality
			    clickControl.activate();
			    wpNum = 0;
	            points = new Array();	
			    e = document.getElementById("map");
			    osMap.events.register("mousemove", osMap, tempLine);
		break;
		case 2:
		    //edit route
			modFeatureCont.activate();
		break;
		case 3:
		    //delete individual route
            deleteControl.activate();	
		break;
		case 4:		
			//reverse route
			reverseControl.activate();	
		break;
		case 5:
		    //delete all routes
		    if (confirm('Delete all routes - cannot be undone?')) {
			   linesLayer.destroyFeatures();
			   routeMarkersLayer.clearMarkers();
			   if (lineFeatureTemp) {
			      linesLayerTemp.destroyFeatures([lineFeatureTemp]);
			   }
			}
			document.getElementById("radio_routes_6").checked = true;
		break;
		case 6:			
	}
}