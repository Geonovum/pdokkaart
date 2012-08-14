/**
 * @author S.R.Edney
 */

//map variables
var osMap, mapOV, screenOverlay, searchBox; 

//initialise map and controls 
/* function init(){
   var options = {resolutions: [2500, 1000, 500, 200, 100, 50, 25, 10, 5, 4, 2.5, 2, 1]};
   osMap = new OpenSpace.Map('map', options); 
   setglobaloptions();     
   osMap.setCenter(new OpenSpace.MapPoint(414350, 297010), 1);  
   setmapbuilderoptions(); 
   //set-up postcode/gazetteer search
   addSearchBox(1);
   osMap.setCenter(osMap.getCenter());   
} */

function setglobaloptions(){
   //add overview map   
   mapOV = new OpenSpace.Control.OverviewMap();
   osMap.addControl(mapOV);
  
   //fix to put copyright on top of overview map: Needs api fix for later version
   var ccControl = osMap.getControlsByClass("OpenSpace.Control.CopyrightCollection")
   osMap.removeControl(ccControl[0]);
   ccControl = new OpenSpace.Control.CopyrightCollection();
   osMap.addControl(ccControl);
   ccControl.activate();
   //end of fix       
   postcodeService = new OpenSpace.Postcode();
   return false; 
}

function setmapbuilderoptions(){
   //set-up help functionality
   addHelp();
   //set-up route creation functionality
   setRouteFunctions();	
}

//change size of map based on checkbox selection  
//not atlogin introduced to solve defect CQ8852
function changeSize(size,notatlogin){
   //refer to map element	
    var e = document.getElementById("map");
    debugger;
   //remove zoom controls
   var control;
   for(i=0; i < osMap.controls.length; i++){
      control = osMap.controls[i];
	  if(control.CLASS_NAME == "OpenSpace.Control.LargeMapControl" || control.CLASS_NAME == "OpenSpace.Control.SmallMapControl"){
         osMap.removeControl(control);
	  }
   }

   //remove coords box if it exists as it will be repositioned	
   if (notatlogin) { 
   		var checkVal = document.getElementById("gridcoordinates1");
   		if(checkVal.checked == true) {
      		checkVal.checked = false;
   	  		var checkVal = document.getElementById("gridcoordinates2");
	  		checkVal.checked = true;
	  		osMap.removeLayer(screenOverlay);
   		}
   }
	  
   if(size == 1){
      //small map size
	  document.getElementById("overviewdiv").style.visibility = "hidden";
	  document.getElementById("gridcoordsdiv").style.visibility = "hidden";
	  document.getElementById("searchboxdiv").style.visibility = "hidden";

      e.style.height = 250 + 'px'; e.style.width = 300 + 'px';
	  osMap.addControl(new OpenSpace.Control.SmallMapControl());	 
	  mapOV.minimizeControl();	
	  //if there is a search box then remove it
 	  var checkVal = document.getElementById("searchbox1");
  	  if(checkVal.checked == true) {	  	 
	     osMap.removeLayer(searchBox);	
		 checkVal.checked = false;
		 var checkVal = document.getElementById("searchbox2");
		 checkVal.checked = true;
	  }	
   }	
   else{
   	  document.getElementById("overviewdiv").style.visibility = "visible";
	  document.getElementById("gridcoordsdiv").style.visibility = "visible";
	  document.getElementById("searchboxdiv").style.visibility = "visible";
      osMap.addControl(new OpenSpace.Control.LargeMapControl());
	  addOverViewMap();





	  //medium map size	  
   	  if (size ==2){
         e.style.height = 350 + 'px'; e.style.width = 400 + 'px';		 	
	  } 
	  //large map size
	  if (size ==3){
	     e.style.height = 440 + 'px'; e.style.width = 540 + 'px';
	  }
   } 	  
   
   //re-add coordinates box in correct position
   var checkVal = document.getElementById("gridcoordinates1");
   if (checkVal.checked == true) {
      addCoordinates();
   }
   
   osMap.setCenter(osMap.getCenter());
}
  
//add overview map 
function addOverViewMap(radioval){
   var checkVal = document.getElementById("overviewmap1");
   if (checkVal.checked == true){
      mapOV.maximizeControl();
   }
   var checkVal = document.getElementById("overviewmap2");
   if (checkVal.checked == true){
      mapOV.minimizeControl();
   }
}

//add coordinates to map that respond to mouse move 
function addCoordinates(){
   var checkVal = document.getElementById("gridcoordinates1");
   if (checkVal.checked == true) {	 
	  makegrid();
	 } 	
	 else{
	 	if (screenOverlay) {
	       osMap.removeLayer(screenOverlay);			
		}	
	 }
  }
  
//make a coordinates grid - used by mapbuilder and generated code  
function makegrid(){	
      var e=document.getElementById("map");
  	  screenOverlay = new OpenSpace.Layer.ScreenOverlay("coords");
	  var leftPos = osMap.div.clientWidth - 116;
      screenOverlay.setPosition(new OpenLayers.Pixel(leftPos, 5));
      osMap.addLayer(screenOverlay);
      var gridProjection = new OpenSpace.GridProjection();
      osMap.events.register("mousemove", osMap, function(e) {
      var pt = osMap.getLonLatFromViewPortPx(e.xy);
      var lonlat = gridProjection.getLonLatFromMapPoint(pt);
      screenOverlay.setHTML("<DIV style=\"width: 108px; height=86px; padding-left: 4px; color: white; background-color: #222; font-size: 12px\">" +
      "EAST : " + (pt.lon).toFixed(0) + "<BR>" + "NORTH: " + (pt.lat).toFixed(0) + "<BR>" +  "LON: " + (lonlat.lon).toFixed(8) + "<BR>" +
      "LAT: " + (lonlat.lat).toFixed(8) + " </DIV>"); });		
}  
    
//add postcode/gazetteer search box  
function addSearchBox(searchval){	
   if (searchval == 1) {	
	  //define an overlay for search box		 
  	  searchBox = new OpenSpace.Layer.ScreenOverlay("search");
	  //set its position		
	  searchBox.setPosition(new OpenLayers.Pixel(80, 0));
	  //and add to the map
      osMap.addLayer(searchBox);
      searchBox.setHTML("<div id=\"OpenSpace.Layer.ScreenOverlay_132\" style=\"position: absolute; width: 200px; height: 100%; z-index: 340; left: 0px; top: 3px;\" class=\"olLayerDiv\">" +
      "<div id=\"div1\" style=\"z-index:999; padding-left: 0px; font-size: 14px;\">" +
      "<form name=\"searchForm\" onsubmit=\"return false;\">" + 
            "<input type=\"text\" name=\"searchArea\" id=\"searchArea\" onclick=\"clearText()\" value=\"enter a place/postcode\"/><input type=\"button\" onclick=\"searchPostcode();\" value=\"Find\" title=\"find place by postcode or 1:50,000 gazetteer\"></button>" +
            "<select name=\"select\" id=\"selectGaz\" onchange=\"zoomGazSel(this.form.select)\" style=\"display: block\">" +
             "<option>Select a place</option><option></option></select></form></div></div>");

      document.getElementById('selectGaz').style.display='none'; //hide list box select	
      
      //stop all marker/route function when a "mousover" event occurs on search area
      searchBox.events.register("mouseover", searchBox, function(){
	  	
	  	 //de-activate keyboard and navigation controls
	     osMap.controls[0].deactivate();
		 osMap.controls[1].deactivate();
		 
		 //deactivate marker functions
		 if (!(document.getElementById("editmarker2").checked == true)) {//don't close ck editor if open	  
		    manageMarkers(0);		
		 }
		 
		 //deactivate route functions
		 if (document.getElementById("radio_routes_1").checked == true) {
		 	clickControl.deactivate();
		 } 		 			  			 
      });
		 
      //start marker/route functions, when a "mouseout" event occurs on search area	 
	  searchBox.events.register("mouseout", searchBox, function(){ 
	  	  
	     //activate keyboard and navigation controls
	  	 osMap.controls[0].activate();
		 osMap.controls[1].activate();
		 
		 //put in correct markers mode	
         if (document.getElementById("editmarker3").checked == true) {	
		    manageMarkers(4);	 	
		 }
		 
		 else if (document.getElementById("editmarker4").checked == true) {
      		 manageMarkers(1);
			 return;
		 }	
		 
		 else if (document.getElementById("editmarker5").checked == true) {
		 	manageMarkers(0);
		 } 
		 				 
		 //put in correct routes mode
		 if (document.getElementById("radio_routes_1").checked == true) {
		 	//re-start click control i.e. double to complete route
			clickControl.activate();
		 }
			
		 else if (document.getElementById("radio_routes_2").checked == true) { 
		    manageRoutes(2);
		 }
		 
		 else if (document.getElementById("radio_routes_3").checked == true) {
		    manageRoutes(3);				
		 }				
		
		 else if (document.getElementById("radio_routes_4").checked == true) {
			manageRoutes(4);				
	  	 }				
		 
		 else if (document.getElementById("radio_routes_5").checked == true) {
		    manageRoutes(5);				
		 }				
		
		 else if (document.getElementById("radio_routes_6").checked == true) {
		    manageRoutes(6);				
		 }				
      });  	
   }	
   
   //remove postcode/gazetteer search box  
   if (searchval == 2){
      if(searchBox){
	     osMap.removeLayer(searchBox);			
	  }
   }  		
}
  
//clear search box when clicked on,to allow free entry of text
function clearText(){
    document.getElementById("searchArea").value = "";
}  