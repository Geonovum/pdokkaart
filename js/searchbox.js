/**
 * @author SEdney
 */
var postcodeService, inputStr, sectorFlag, globalGazArray, locationFound;
var zoomVal, eastVal, eastValstr, o, da;


function searchPostcode(){
   //hide and clear list box            
   document.getElementById('selectGaz').style.display='none';
   da = document.getElementById("selectGaz");  
   da.options.length = 0;   
   locationFound = 0;    
   eastValstr = "";
   //clear menu if already populated
   da.options.length = 0;  
   sectorFlag = 0;        
   var query = document.getElementById("searchArea");
   inputStr = query.value   
   document.getElementById("searchArea").value = "enter a place/postcode"; 

  //ascertain if postcode sector or full postcode
  if (inputStr.length < 5){
      sectorFlag = 1;
  }      

  //search postcode service
  postcodeService.getLonLat(inputStr, onResult);
  return;
}

 

//result of search postcode is passed here        
function onResult(mapPoint){
   //set zoom level depending on sector or full postcode
   if (sectorFlag == 0){
      zoomVal = 11;
   }
   else {
   	 zoomVal = 5
   }
                
   //if not a valid PostCode, pass to gazetteer search

   //an eastValStr of length three indicates no match found for postcode

   if (mapPoint != null){
      eastVal = mapPoint.getEasting();
      eastValstr = eastVal.toString();
   }

   //no postcode match, so search gazetteer
   if (eastValstr.length == 3 || mapPoint == null){
      var osGaz = new OpenSpace.Gazetteer;
      var gazArray = osGaz.getLocations(inputStr, gazOptions) 
   }     

   //zoom to postcode       
   if (mapPoint != null && eastValstr.length > 3){
      osMap.setCenter(mapPoint, zoomVal);
      locationFound = 1;
      document.getElementById("postcode").value = ""; 
   }       

   return false;   
}

function gazOptions(searchVal){
   //if one match found
   if (searchVal.length == 1){
      osMap.setCenter(searchVal[0].location, 7);
      locationFound = 1;
   }     

   //if several choices, create a list box
   if (searchVal != null && searchVal.length > 1){
      locationFound = 1;
      globalGazArray = searchVal;
      o = document.createElement("OPTION");
      o.text= "Select a place";
      da.options.add(o);

      //build list box
      for (var i=0 ; i < searchVal.length; i++){
          o = document.createElement("OPTION");
          o.text= searchVal[i].name + ", " + searchVal[i].county;
          da.options.add(o);
      }

      //make list box visible
      document.getElementById('selectGaz').style.display='block';
   }           

   if (locationFound == 0){
       alert("neither postcode or place found");
   }
}

//zoom to item selected from list box
function zoomGazSel(selObj){
   osMap.setCenter(globalGazArray[selObj.selectedIndex-1].location, 7);
   //hide list box
   document.getElementById('selectGaz').style.display='none';
   //clear text field
   document.getElementById("searchArea").value = "enter a place/postcode"; 
}
