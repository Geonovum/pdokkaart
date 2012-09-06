// TODO (after PoC): improve object handling and classes, but works for now :)
// So make config object, with anonymous function, proper getters/setters etc

var mapPDOKKaart, markers, activeFeature, dragControl, drawControl, layerSwitcher;
var mouseover,mouseout,click,touchend;
var pdokachtergrondkaart;
var activeFeature;

// The proxyhost is needed for the geocoder
//OpenLayers.ProxyHost = "../xmldata.php?url=";
OpenLayers.ProxyHost = "http://www.duif.net/cgi-bin/proxy.cgi?url=";

// Include the RD definition
Proj4js.defs["EPSG:28992"] = "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs";


function MeerMinderOpties() {

//if (document.getElementById('opties').value == "Meer opties") {
if ($("#opties").val() ==  "Meer opties") {
	$('#step3').toggle();
	$('#step4').toggle();
	$('#opties span').text('Minder opties');
	$("#opties").attr('value', 'Minder opties');

}
else {
	$('#step3').toggle();
	$('#step4').toggle();
	$('#opties span').text('Meer opties');
	$("#opties").attr('value', 'Meer opties');
}	
	
}

function SearchArray(arr, obj) {
    for(var i=0; i<arr.length; i++) {
        if (arr[i][0] == obj) return arr[i][1];
    }
}

function changeZoom1() {

mapPDOKKaart.zoomTo($("select#vanaf").val());
if (parseInt($("select#totenmet").val()) < parseInt($("select#vanaf").val())) {
	$("select#totenmet").val($("select#vanaf").val());
}
}

function changeZoom2() {

mapPDOKKaart.zoomTo($("select#totenmet").val());
if (parseInt($("select#totenmet").val()) < parseInt($("select#vanaf").val())) {
	$("select#vanaf").val($("select#totenmet").val());
}
}

function ZoomIn(x,y){

	mapPDOKKaart.setCenter(new OpenLayers.LonLat(x,y), 7);

};


// init is called after loading the settings page and initilizes the map and some GUI components, like the PDOK map layer selector and the "popin" windows
$(document).ready(function() {
	
	//setMapSize();
	//addFormEnhancements();
	//$(window).resize(setMapSize);
	$('input:radio[name=editmarker]')[0].checked = true;
	$('input:radio[name=mapsize]')[2].checked = true;
	$('input:radio[name=radiogroup_kp]')[0].checked = true;
	$("select#vanaf").val('1');
	$("select#totenmet").val('14');
	$(".radio_kp").click(function(event) {
		createFieldnameInput(this);
	});
	

	// initiate the Pdok API object
	var o = OpenLayers.Util.getParameters();
    //var lusc = new Pdok.Api(o);
	lusc = new Pdok.Api(o);
    // popups and selectionControl of Api interfears with modifyFeatureControl
    // we disable them while we find out how to handle this
    // TODO handle this ...
    lusc.disablePopups();
    lusc.selectControl.deactivate();
	
	// for convenience reasons to reuse the OpenLayers Map object from the API, set it to a global object
	mapPDOKKaart = lusc.getMapObject();
	markers = lusc.featuresLayer;
	pdok_api_map_resize(550,440);
    lusc.map.zoomToExtent([-15000,300000,300000,640000], true);
    
    $('#geocodeerresult').delegate('li/a','click', function (evt) {
		var x = $("span.x", this).text();
		var y = $("span.y", this).text();
		var z = $("span.z", this).text();
		var ft_id = $("span.ft_id", this).text();
		if(x && y){
			mapPDOKKaart.setCenter(new OpenLayers.LonLat(x, y), z);
			var ft = markers.getFeatureById(ft_id);
		    onFeatureSelect(ft, true, markersPopupText(ft, true)); // full=true
		    ft.popupFix = true;
		}
		else {
			alert("fout met coordinaten");
		}
		return false;
	});

	
	createStyleSelector();
	createEditAttributes ();
	createPdokLayers();
	
	$("#embedlink").click(function(){
    // Select input field contents
    this.select();
	});
	$("#embedhtmliframe").click(function(){
		// Select input field contents
		this.select();
	});
	$("#embedhtmlobject").click(function(){
    // Select input field contents
    this.select();
	});
	$("#scriptcodeHead").click(function(){
		// Select input field contents
		this.select();
	});
	$("#scriptcodeBody").click(function(){
		// Select input field contents
		this.select();
	});

  });

function disableStyleSelector(){

	$('#styleselector').hide();

}

function enableStyleSelector(){
	
	lusc.disableEditingTool();
	lusc.disableDrawingTool();

	$('#styleselector').show();
	$('#edit2a').hide();
	
	//default style selected
	featureCreatedCallback = function(feature){
            // you get a handle here to the feature last modified
            // console.log(feature);
			//ActiveFeature.fid = feature.fid;
			activeFeature = feature;
			createEditAttributes ();
			$('#edit2a').appendTo($('#edit2'));
			$('#edit2a').show();
    }
    // no popup during editing
    lusc.disablePopups();
    lusc.enableDrawingTool("mt0", featureCreatedCallback);
	
	$('#styleselector li').removeClass('styleselected');
	$('#mt0').addClass('styleselected');

}


function createStyleSelector(){

// dynamically creating the selectbox for the feature types

    $('#edit2').html('<div id="styleselector"><ul></ul></div>');
    var apiStyles = lusc.styles;
    pointStylesHtml = '';
    polygonStylesHtml = '';
    lineStylesHtml = '';

    for (styleId in apiStyles){
        // for now only point markers!
        if (styleId[0]=='m'){
            var style = apiStyles[styleId];
            pointStylesHtml += '\n<li id="'+styleId+'"><div><img src="'+style.externalGraphic+'"><div class="listyletext">'+style.name+'</div></div></li>';
        }
        else if (styleId[0]=='l'){
            var style = apiStyles[styleId];
            lineStylesHtml += '\n<li id="'+styleId+'"><div style="opacity:'+style.strokeOpacity+'; border-top: '+style.strokeWidth+'px '+style.strokeColor+' solid;border-left: '+style.strokeWidth+'px '+style.strokeColor+' solid;float:left;"><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="listyletext"> '+style.name+'</div></li>';
        }
        else if (styleId[0]=='p'){
            var style = apiStyles[styleId];
            polygonStylesHtml += '\n<li id="'+styleId+'"><div style="opacity:'+style.strokeOpacity+';border: '+style.strokeWidth+'px '+style.strokeColor+' solid;float:left;"><span style="opacity:'+style.fillOpacity+';background-color:'+style.fillColor+';">&nbsp;&nbsp;&nbsp;&nbsp;</span></div><div class="listyletext"> '+style.name+'</div></li>';
        }
    }
    $('#styleselector ul').append(pointStylesHtml+lineStylesHtml+polygonStylesHtml);
    $('#styleselector').delegate('li', 'click', function(){
        $('#styleselector li').removeClass('styleselected');
        $(this).addClass('styleselected');
        var styleId = $(this).attr('id');
        featureCreatedCallback = function(feature){
            // you get a handle here to the feature last modified
            // console.log(feature);
			activeFeature = feature;
			createEditAttributes ();
			$('#edit2a').appendTo($('#edit2'));
			$('#edit2a').show();
        }
        lusc.enableDrawingTool(styleId, featureCreatedCallback);
    });
	

}

function createPdokLayers(){

var html = '';

html = html + '<select id="pdokLayerSelector" onselect="addPdokLayer(this.value)">' +
			  '<option value="-">-- Kies een PDOK kaartlaag --</option>'

for (layer in lusc.defaultLayers){
	html = html + '<option value="'+ layer + '">' + lusc.defaultLayers[layer].name + '</option>'
    
}

html = html + '</select>'
$('#divpdoklayerselector').html(html);

}

function createEditAttributes () {

var html = '<input id="attr_name" type="text" value="Voer een titel in :" name="searchLocation" title="Postcode of plaatsnaam" />';
html = html + '<textarea id="description">Voer een omschrijving in : </textarea>';
html = html + '<button type="submit" class="filterbutton" onclick="saveAttributes();return false;">Opslaan tekst</button>';
html = html + '<button type="submit" class="filterbutton" onclick="deleteFeature();return false;">Verwijderen marker</button>';

$('#edit2a').html(html);
$("#attr_name").click(function(){
    // Select input field contents
    this.select();
});
$("#description").click(function(){
    // Select input field contents
    this.select();
});

//$('#edit3a').html(html);

}

function createFieldnameInput(radiobutton) {

 var  geometrie = $(radiobutton).attr('value') ;
 var html = ''; 
 
 if (geometrie == 'mt1') {

	html = html + '<label>X-coördinaat : <input id="xcoord" type="text" value=""  /></label></br>';
	html = html + '<label>Y-coördinaat : <input id="ycoord" type="text" value=""  /></label></br>';
 }
 
 else if (geometrie == 'lt1' || geometrie == 'pt1') {

	html = html + '<label>Veldnaam:<input id="veldnaam" type="text" value=""  /></label>';

 }
 else {
 
	html = '';

 };
	
$('#veldnaam').html(html);

};

function readFile () {


$( "#dialog" ).dialog({ modal: true });

}


function saveAttributes() {

    //console.log(activeFeature);
	
	activeFeature.attributes.name = $('#attr_name').val();
	activeFeature.attributes.description = $('#description').val();
	
	//console.log(activeFeature);
	
	$('#edit2a').hide();
	//$('#edit3a').hide();

}

function deleteFeature() {

    var ok = confirm ("Deze feature verwijderen?")
    if (ok) {
        markers.removeFeatures([activeFeature]);
        markers.refresh();
        // without this disabling and enabling we have a 
        // null pointer somewhere in the event handling of OL
        lusc.disableEditingTool();
        lusc.enableEditingTool(featureModifiedCallback);
    } else {
		lusc.disableEditingTool();
        lusc.enableEditingTool(featureModifiedCallback);
	//lusc.selectControl.activate();
	}
    $('#edit2a').hide();
    //$('#edit3a').hide();

}

function startEditingPoint() {
	lusc.disableEditingTool();
	lusc.disableDrawingTool();
	$('#edit2a').hide();
	disableStyleSelector();
	lusc.disableDrawingTool();
	featureModifiedCallback = function(domevent){
            // you get a handle here to the feature last modified
            // console.log(feature);
			activeFeature = domevent.feature;
			$('#edit2a').appendTo($('#edit3'));
			$('#edit2a').show();
			$('#attr_name').val(domevent.feature.attributes.name);
			$('#description').val(domevent.feature.attributes.description);
        }
	lusc.enableEditingTool(featureModifiedCallback);
	//registerEvents();

}


function stopDrawingEditingPoint() {
	//removePopups(markers);
	//unregisterEvents();
	lusc.disableEditingTool();
	lusc.disableDrawingTool();
	$('input:radio[name=editmarker]')[0].checked = true;
}


/****
    * For Proof of Concept only use some simple functions to perform searches. For advanced / full functionality: see Geozet and include / build on (Geo)Ext
 	*/

var gazetteerConfig = {};
var zoomScale = {
    adres: 13,
    postcode: 11,
    plaats: 8,
    gemeente: 8,
    provincie: 5,
    standaard: 9
};
gazetteerConfig.gazetteer = {
    url:"http://geodata.nationaalgeoregister.nl/geocoder/Geocoder?", 
    param:"zoekterm", 
    zoomScale: 
    zoomScale
};

// Thijs: code based on Geozet.widgets.Search
function searchLocationChanged() {
	var searchString = jQuery("#searchLocation").val();
    var params = {request: 'geocode'};
    params[gazetteerConfig.gazetteer.param] = searchString;
    if (searchString && searchString.length>0){            
        OpenLayers.Request.GET({
            url: gazetteerConfig.gazetteer.url,
            params: params,
            scope: this,
            success: handleGeocodeResponse
            // failure: this.handleError
        });
    }
    return false;
}

/** Thijs: code based on Geozet.widgets.Search
	 * params: 
	 *	req = the OpenLayers request
	 *	returnCoords - Boolean if False or None map will be zoomed/panned
     *  if True map will not change, but coordinates will be returned
     * 
     * Returns:
     * {OpenLayers.LonLat} - if returnCoords == True  one hit/result 
     * Boolean - if other == False OR more or no results
	**/ 

function handleGeocodeResponse(req, returnCoords){
    //removePopups(markers);
    //markers.destroyFeatures();
    $('#searchResults').html('').show();
    
    var responseText = req.responseText;
    if (responseText && (responseText.indexOf('FAILED') != -1 ||
        responseText.indexOf('Exception') != -1 )) {
        // fail silently
        return false;
    }
    var xlslusFormat = new Geozet.Format.XLSLUS();
    var xlslus = xlslusFormat.read(req.responseXML || req.responseText);
    var hits=xlslus[0].numberOfGeocodedAddresses;
    if (hits==0){
        // zero responses
        this.showError(OpenLayers.i18n("noLocationFound"));
    }
    else{
		var maxEx = mapPDOKKaart.restrictedExtent;
		// minx,miny,maxx,maxy are used to calcultate a bbox of the geocoding results
		// initializes these with the max/min values of the extent of the map, so swap the left /right and bottomo/top of the maxExtent
		// i.e.: the calculate minx will allways be smaller than the right-border of the map;
		// TODO: for production use the map's restricted Extent, so request a change to Lucs API
		/// For now: just values
		maxEx = new OpenLayers.Bounds(-285401.92, 22598.08, 595401.92, 903401.92);
		var minx = maxEx.right;
		var miny = maxEx.top;
		var maxx = maxEx.left;
		var maxy = maxEx.bottom;
		var minzoom = 15;
		var features = [];
        // > 0 hit show suggestions        
        if(hits>0){
            //$('#searchResults').html('<span class="searchedFor">Gezocht op: "'+jQuery("#searchLocation").val()+'"</span><h3>Zoekresultaten <a href="#" onclick="$(\'.geozetSuggestions\').toggle();return false;">Tonen/Verbergen</a></h3><ul class="geozetSuggestions"></ul>');
            $('#geocodeerresult').html('<span id="closedrawlocation" onclick="$(\'#geocodeerresult\').fadeOut(\'fast\')" class="closeWindow"><a onclick="return false;"><img src="js/theme/default/img/close.gif" alt="Sluiten" title="Sluiten"/></a></span>' +
                '<span class="searchedFor">Gezocht op: "'+jQuery("#searchLocation").val()+'"</span><h3>Zoekresultaten <a onclick="$(\'.geozetSuggestions\').toggle();return false;">Tonen/Verbergen</a></h3><ul class="geozetSuggestions"></ul>');
        }
        for (i=0;i<hits;i++){
            var suggestion='';
            var geom = xlslus[0].features[i].geometry;
            var address = xlslus[0].features[i].attributes.address;                 
            var plaats = address.place.MunicipalitySubdivision; // toont evt provincie afkorting
            var gemeente = address.place.Municipality;
            var prov = address.place.CountrySubdivision;
            var adres = '';
            var postcode = '';
            // determine zoom and hash
            var zoom = null;
            if (address.street && address.street.length>0){
                adres = address.street + ' - ' ;
                if (address.building){
                    var toevoeging = '';
                    if (address.building.subdivision){
                        toevoeging = address.building.subdivision
                    }
                    adres += address.building.number+toevoeging+' - ';
                }
                if(!zoom){zoom='adres'}
            }
            if (address.postalCode){
                adres += address.postalCode+' - ';
                if(!zoom){zoom='postcode'}
            }
            if(plaats){
                suggestion=adres+plaats+' (plaats)';
                if(!zoom){zoom='plaats'}
            }
            else if(gemeente){
                suggestion=adres+gemeente+' (gemeente)';
                if(!zoom){zoom='gemeente'}
            }
            else if(prov){
                suggestion=prov+' (provincie)';
                if(!zoom){zoom='provincie'}
            }
            if(!zoom){zoom='standaard'}

            if(hits>0){
                // Thijs: added calculation for bbox
                // only calulate if a geom is provided
                // hack to be able to handle results without geom
                var x = geom?geom.x:150000;
                var y = geom?geom.y:450000;
                var z = geom?gazetteerConfig.gazetteer.zoomScale[zoom]:gazetteerConfig.gazetteer.zoomScale['provincie'];
                var newId = -1;
                if (geom) {
                	minx = Math.min(minx, x);
                	miny = Math.min(miny, y);
                	maxx = Math.max(maxx, x);
                	maxy = Math.max(maxy, y);
                	minzoom = Math.min(minzoom, gazetteerConfig.gazetteer.zoomScale[zoom]);
					var newFt = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(x, y), {"title": suggestion, "postcode": postcode, "adres": adres, "plaats": plaats, "gemeente": gemeente, "provincie": prov}
					// ,{externalGraphic: 'js/img/marker.png', graphicHeight: 26, graphicWidth: 20}
					);
					newId = newFt.id;
					features.push(newFt);
                }
				var gazHtml = '<li id="listitem_'+newId.split('.')[2]+'"><a href="#">('+(i+1) + ") " + suggestion +' <span class="x">'+x+'</span> <span class="y">'+y+'</span> <span class="z">'+z+'</span> <span class="ft_id" id="searchresult_'+newId.split('.')[2]+'">'+newId+'</span></a></li>';
                $("ul.geozetSuggestions").append(gazHtml);

                // set (calculated) height for the result div
                /* var height = Math.max(Ext.get('geozetAside').getHeight(), Ext.get('geozetArticle').getHeight());
                Ext.get(this.contentWrapperId).setHeight(height); */
            }
            else{
                // hack to be able to handle results without geom
                var x = geom?geom.x:150000;
                var y = geom?geom.y:450000;
                var z = geom?gazetteerConfig.gazetteer.zoomScale[zoom]:gazetteerConfig.gazetteer.zoomScale['provincie'];
                mapPDOKKaart.setCenter(new OpenLayers.LonLat(x, y), z);
                if (returnCoords === true) {
                    return {
                        center: new OpenLayers.LonLat(x, y),
                        zoom: z
                    };
                } 
                else 
                {
                    mapPDOKKaart.setCenter(new OpenLayers.LonLat(x, y), z);
                }
            }
        }
        //$("ul.geozetSuggestions").show();
        $('#geocodeerresult').show()
        // calculate the new bbox, if hits > 0
        if (hits > 0) {
	        // first calculate the center of the new bbox	        
	        var newBounds = new OpenLayers.Bounds([minx, miny, maxx, maxy]);
			// compare the zoomlevels of the extent and the calulated zoomlevel, to make sure all results are fetched.
			var minzoom = Math.min(mapPDOKKaart.getZoomForExtent(newBounds), minzoom);
	        // now use the lowest zoomlevel for all results, to make sure that not so fine locations (like provinces) are contained as well
	        mapPDOKKaart.setCenter(newBounds.getCenterLonLat(), minzoom);
        }
		//markers.addFeatures(features);
    }
    return false;
}


 function addWmsLayer() {
	/* var layername=$('#wmsLayer').val();
	var layerUrl=$('#wmsUrl').val().replace("request=GetCapabilities","","i") // remove the request=GetCapabilities (case insensitive) part if provided;
	$('#tmsLayer').val("");
	$('#tmsUrl').val("");
	
	var wmsLayer = new OpenLayers.Layer.WMS(
							layername, // layername as title for now
							layerUrl,
							{layers: layername, transparent: 'true',format: "image/png"},
							{visibility: true, isBaseLayer:false, opacity: 0.8},
							{singleTile: true}
	);
	addOverlay(wmsLayer) */
}

function addWmtsLayer() {
/* 	var layername=$('#tmsLayer').val();
	var layerUrl=$('#tmsUrl').val();
	$('#wmsLayer').val("");
	$('#wmsUrl').val("");
	var tmsLayer = new OpenLayers.Layer.TMS(
			layername,
			layerUrl,
			{layername: layername, type:"png", visibility: true, isBaseLayer:false, opacity:0.8}
		);
	addOverlay(tmsLayer); */
} 

function addPdokLayer() {
	// TODO: add PDOK layer to map, need API function for this --> not implemented in PoC version of API
	lusc.addLayers([$("#pdokLayerSelector").val()]);
}

/* function addOverlay(layer) {
	// remove all WMS and TMS layers (if not basemap)
	for (var lr in mapPDOKKaart.layers) {
		var l = mapPDOKKaart.layers[lr];
		if (l.name!="Markers" && l.isBaseLayer == false) { // not Geocoderesults or markers?
			mapPDOKKaart.removeLayer(l);
		}
	}
	$("#pdokLayerSelector").val("-");
	layerSwitcher.maximizeControl();
	mapPDOKKaart.addLayer(layer);
}
 */
 
function linkToMapOpened(permalink) {

	
}

function removeFeature (ft_id) {
	var ok = confirm ("Deze locatie verwijderen?")
	if (ok) {
		$('#listitem_'+ft_id.split('.')[2]).remove()
		var ft = markers.getFeatureById(ft_id);
		mapPDOKKaart.removePopup(ft.popup);
		markers.removeFeatures([ft]);
		// also from the list
	}
} 


/** GUI functions **/
function setMapSize() {
    var wW=jQuery(window).width();
    var wH=jQuery(window).height();
    jQuery("#container").width(wW);
    jQuery("#container").height(wH);
    
    jQuery("#content").width(wW-10);
    jQuery("#content").height(wH-105);
    jQuery("#map").width(wW-470);    
}


function updateMarkerTitle(markerTitle, ft_id) {
	var ft = markers.getFeatureById(ft_id);
	ft.attributes.title = markerTitle;
} 


 function updateMarkerText(markerText, ft_id) {
	var ft = markers.getFeatureById(ft_id);
	ft.attributes.description = markerText;
}
 

function pdok_api_map_resize(w,h) {
    this.document.getElementById("map").style.height = h + 'px';
    this.document.getElementById("map").style.width = w + 'px';
    mapPDOKKaart.updateSize();
	
}
