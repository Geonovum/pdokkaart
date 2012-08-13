// TODO (after PoC): improve object handling and classes, but works for now :)
// So make config object, with anonymous function, proper getters/setters etc

var mapPDOKKaart, markers, activeFeature, dragControl, drawControl, layerSwitcher;
var pdokachtergrondkaart;

// The proxyhost is needed for the geocoder
OpenLayers.ProxyHost = "../xmldata.php?url=";

// Include the RD definition
Proj4js.defs["EPSG:28992"] = "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs";

// Use the same marker at several places in the settingspage, change the defaultmarkerpath to use a different one
var defaultmarkerpath = "markertypes/information_blue.png";

function ZetMarkersOpKaart(strInvoerfile) {

      //parse de invoer-string en zet de markers op de kaart in de laag markers
      
      //var size = new OpenLayers.Size(21,25);
      //var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
      
      var str_rest;
      
      var x;
      var y;
      var titel;
      var beschrijving;
      var iconpath;
      var cs;
      var pos;
      var teller = 1;
      var fid = 1000
      
      if (strInvoerfile == "") {
      
      	return;
      
      };
      
      try
          {
          
          //markers2 = new OpenLayers.Layer.Vector("Markers2",{
          //  displayInLayerSwitcher: false
          //});
          
          lines= strInvoerfile.split(/\r\n|\r|\n/);
          
          for(var i = 0; i < lines.length; i++)
              {
          
              str_rest = lines[i]; 
          
              do
                   {
              
                   pos = str_rest.indexOf(";");
              	
                   if (teller == 1) {
                  
                        x = str_rest.substring(0,pos);     
                        str_rest = str_rest.substring(pos+1);
    
                   };
                   
                   if (teller == 2) {
                  
                        y = str_rest.substring(0,pos);     
                        str_rest = str_rest.substring(pos+1);
    
                   };
                   
                   if (teller == 3) {
                  
                        titel = str_rest.substring(0,pos);     
                        str_rest = str_rest.substring(pos+1);
    
                   };
                   
                   if (teller == 4) {
                  
                        beschrijving = str_rest.substring(0,pos);     
                        str_rest = str_rest.substring(pos+1);
    
                   };
                   
                   if (teller == 5) {
                  
                        iconpath = str_rest.substring(0,pos);     
                        str_rest = str_rest.substring(pos+1);
    
                   };
                   
                	if (teller == 6) {
               	     
                	    cs = str_rest     
                                             
                        //var icon = new OpenLayers.Icon('http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/' + iconpath, size, offset);
                        //markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(x,y),icon));
                        
                        
                        var style =new OpenLayers.StyleMap({
                		// Set the external graphic and background graphic images.
                		externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/" + iconpath,
                         //externalGraphic: "/markertypes/" + iconpath,
                		//backgroundGraphic: "../theme/app/img/marker-shadow.png",
                		
                		// Makes sure the background graphic is placed correctly relative
                		// to the external graphic.
                		//backgroundXOffset:  0,
                		//backgroundYOffset: -22,
                		
                		graphicXOffset: -10,
                		graphicYOffset: -32,
                		
                		// Set the z-indexes of both graphics to make sure the background
                		// graphics stay in the background (shadows on top of markers looks
                		// odd; let's not do that).
                		//graphicZIndex: 10,
                		//backgroundGraphicZIndex: 11,
                		pointRadius: 15
                		});
                        
                         var punt = new OpenLayers.Geometry.Point();
                        punt.x = x;
                        punt.y = y;
                        			
                        var feature = new OpenLayers.Feature.Vector(style);
                        feature.fid = fid;
                        feature.geometry = punt;
                        			
                        //markers.removeAllFeatures();
                        markers.addFeatures([feature],{styleMap:style});
                        //markers.drawFeature(feature, style);
                        //markers.redraw();
                                                       
                		teller = 0 ;		
                	}; 
                	
                	teller = teller + 1;
                   fid = fid + 1;
                
                   } while (str_rest.indexOf(";") != -1);
              }
          //mapPDOKKaart.addLayers([markers2]);
          }
      catch(err)
          {
          txt="Er is een fout opgetreden bij het inlezen van het bestand.\n\n";
          txt+="Fout beschrijving: " + err.message + "\n\n";
          txt+="Click OK om door te gaan.\n\n";
          alert(txt);
          }
      }
      
      

// init is called after loading the settings page and initilizes the map and some GUI components, like the PDOK map layer selector and the "popin" windows

function init_pdok()
{
	setMapSize();
	addFormEnhancements();
	$(window).resize(setMapSize);
	$(".defaultmarker").attr("src",defaultmarkerpath);

	// initiate the Lusc API object
	var o = OpenLayers.Util.getParameters();
    var lusc = new Lusc.Api(o);

	// for convenience reasons to reuse the OpenLayers Map object from the API, set it to a global object
	mapPDOKKaart = lusc.getMapObject();
	//mapPDOKKaart = new OpenLayers.Map('map');
	
	// Thijs: a vector layer is used to show Geocoderesults
	markers = new OpenLayers.Layer.Vector("Markers",{
            styleMap: getStyleMap(),
            displayInLayerSwitcher: false
        });

	// add popup functions for geocoding results
	/* */
	markers.events.register("mouseover", markers, function(e) {
		this.div.style.cursor = "pointer";
		var feature = this.getFeatureFromEvent(e);
	    
		if (feature) {
		    // add a popup
		    onFeatureSelect(feature, false, markersPopupText(feature, false));
	        feature.popupFix = false;
		}
	});

	markers.events.register("mouseout", markers, function(e) {
		this.div.style.cursor = "default";
		var feature = this.getFeatureFromEvent(e);
		if (feature) {
		   // add a popup
		   // onFeatureSelect(feature);
		   if (!feature.popupFix) {
			onPopupClose(null, feature);
		   }
		}
	}); 

	markers.events.register("click", markers, function(e) {
		this.div.style.cursor = "default";
		var feature = this.getFeatureFromEvent(e);
		if (feature) {
		   // add a popup
		   onFeatureSelect(feature, true, markersPopupText(feature, true)); // full=true
		   feature.popupFix = true;			   
		}
	});

	markers.events.register("touchend", markers, function(e) {
		this.div.style.cursor = "default";
		var feature = this.getFeatureFromEvent(e);
		if (feature) {
		   // add a popup
		   onFeatureSelect(feature, true, markersPopupText(feature, true)); // full=true
		   feature.popupFix = true;
		} else {
		    return true;
		}	
	});
	
	// add the markers
	mapPDOKKaart.addLayers([markers]);

    // TouchNavigation
    /* */
	var touchNav = new OpenLayers.Control.TouchNavigation({
            dragPanOptions: {
                enableKinetic: true
            }
        })
	
	// controls for the redlining objects (locatieprikker)
	dragControl = new OpenLayers.Control.DragFeature(markers);
	drawControl = new OpenLayers.Control.DrawFeature(markers, OpenLayers.Handler.Point);
	
	drawControl.featureAdded = function(feature){
		   feature.attributes.title="Voer een titel in:";
		   feature.attributes.description="Voer een omschrijving in:";
		   //startFeatureEdit(feature.id);
		   //stopDrawingPoint();
		   onFeatureSelect(feature, true, markersPopupText(feature, true)); // full=true
		   feature.popupFix = true;
		   return false;
	}
	
	dragControl.clickFeature = function(feature){
		   //feature.attributes.title="Voer een titel in:";
		   //feature.attributes.description="Voer een omschrijving in:";
		   //startFeatureEdit(feature.id);
		   //stopDrawingPoint();
		   onFeatureSelect(feature, true, markersPopupText(feature, true)); // full=true
		   feature.popupFix = true;
		   return false;
	}
	
	// use a global object for the layerswitcher, to open/close it programmatically
	layerSwitcher = new OpenLayers.Control.LayerSwitcher()
	
	controls = [
		new OpenLayers.Control.MousePosition()
		, dragControl
		, drawControl
		, layerSwitcher
		// , new OpenLayers.Control.KeyboardDefaults() // don't use KeyboardDefaults, since this may interfere with other functionality on a page
		, touchNav
	]

	// for the future upcoming searchresults
	// attach click to the li-suggestions (if available)
	// delegate..

	$('#searchResults').delegate('li/a','click', function (evt) {
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
	
	
	$('#searchResults').delegate('li/a','mouseover', function (evt) {
		var x = $("span.x", this).text();
		var y = $("span.y", this).text();
		var z = $("span.z", this).text();
		var ft_id = $("span.ft_id", this).text();
		if(x && y){
			var ft = markers.getFeatureById(ft_id);
		    onFeatureSelect(ft, false, markersPopupText(ft, false)); // full=true
		}
		else {
			alert("fout met coordinaten");
		}
		return false;
	});
	$('#searchResults').delegate('li/a','mouseout', function (evt) {
		// removePopups(markers);			
		return false;
	});
	
	mapPDOKKaart.addControls(controls);

	//dragControl.activate();
	
	// only set the map center if not already done by lusc api
	if (!mapPDOKKaart.getCenter()) {
	 	mapPDOKKaart.setCenter(new OpenLayers.LonLat(155000,463000), 3);
	}	
	
	var pdokLayers = lusc.getLayers();
	for (var l in pdokLayers) {
		$("#pdokLayerSelector").append("<option value='"+pdokLayers[l]+"'>"+pdokLayers[l]+"</option>");
	}
}

function startDrawingPoint() {
	
	document.getElementById('editmarker4').checked = true;
	
	// before adding, remove all existing markers
    removePopups(markers);
    //markers.destroyFeatures();
    $('#searchResults').html('')
	$("#drawlocationhelp").fadeIn();
	$("#cancelDrawingPoint").fadeIn();
	//dragControl.activate();
	drawControl.activate();
	var blockPanning = false; // to block panning while drawing
    drawControl.handler.stopDown = blockPanning;
    drawControl.handler.stopUp = blockPanning;    
}

function startEditingPoint() {
	// before adding, remove all existing markers
    removePopups(markers);
    //markers.destroyFeatures();
    $('#searchResults').html('')
	$("#drawlocationhelp").fadeIn();
	$("#cancelDrawingPoint").fadeIn();
	//dragControl.activate();
	drawControl.deactivate();
	dragControl.activate();
	var blockPanning = false; // to block panning while drawing
    dragControl.handler.stopDown = blockPanning;
    dragControl.handler.stopUp = blockPanning;    
}


function stopDrawingPoint() {
	drawControl.deactivate();
	$("#cancelDrawingPoint").fadeOut();	
	$("#drawlocationhelp").fadeOut();	
}

function verwijderAlleMarkers(){

	removePopups(markers);
	markers.destroyFeatures();	

}


/****
    * For Proof of Concept only use some simple functions to perform searches. For advanced / full functionality: see Geozet and include / build on (Geo)Ext
 	*/

var gazetteerConfig = {};
var zoomScale = {
    adres: 11,
    postcode: 10,
    plaats: 8,
    gemeente: 8,
    provincie: 5,
    standaard: 9
};
gazetteerConfig.gazetteer = {url:"http://geodata.nationaalgeoregister.nl/geocoder/Geocoder?", param:"zoekterm", zoomScale: zoomScale};

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
    removePopups(markers);
    markers.destroyFeatures();
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
            $('#searchResults').html('<span class="searchedFor">Gezocht op: "'+jQuery("#searchLocation").val()+'"</span><h3>Zoekresultaten <a href="#" onclick="$(\'.geozetSuggestions\').toggle();return false;">Tonen/Verbergen</a></h3><ul class="geozetSuggestions"></ul>');
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
        $("ul.geozetSuggestions").show();
        // calculate the new bbox, if hits > 0
        if (hits > 0) {
	        // first calculate the center of the new bbox	        
	        var newBounds = new OpenLayers.Bounds([minx, miny, maxx, maxy]);
			// compare the zoomlevels of the extent and the calulated zoomlevel, to make sure all results are fetched.
			var minzoom = Math.min(mapPDOKKaart.getZoomForExtent(newBounds), minzoom);
	        // now use the lowest zoomlevel for all results, to make sure that not so fine locations (like provinces) are contained as well
	        mapPDOKKaart.setCenter(newBounds.getCenterLonLat(), minzoom);
        }
		markers.addFeatures(features);
    }
    return false;
}

function addWmsLayer() {
	var layername=$('#wmsLayer').val();
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
	addOverlay(wmsLayer)
}

function addTmsLayer() {
	var layername=$('#tmsLayer').val();
	var layerUrl=$('#tmsUrl').val();
	$('#wmsLayer').val("");
	$('#wmsUrl').val("");
	var tmsLayer = new OpenLayers.Layer.TMS(
			layername,
			layerUrl,
			{layername: layername, type:"png", visibility: true, isBaseLayer:false, opacity:0.8}
		);
	addOverlay(tmsLayer);
}

function addPdokLayer(pdokLayerName) {
	// TODO: add PDOK layer to map, need API function for this --> not implemented in PoC version of API
}

function addOverlay(layer) {
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

function linkToMapOpened(permalink){
	if (!permalink) permalink = document.location.href;
	// $('#drawlocation').hide();	
	$('#createlink').fadeIn();
		
	// add the parameters, serialize them just explicitly now.
	var apiParams = "&loc=" + mapPDOKKaart.getCenter().lon + "," +mapPDOKKaart.getCenter().lat;
	apiParams += "&zl=" + mapPDOKKaart.getZoom();

	// Only add a marker for the last active feature
	if (activeFeature && markers.features.length > 0 && $("#showmarker").is(':checked')) {
		apiParams+="&mloc="+activeFeature.geometry.x+","+activeFeature.geometry.y+"&mt=2"+"&titel="+encodeURIComponent(activeFeature.attributes.title)+"&tekst="+encodeURIComponent(activeFeature.attributes.description);
	}

	var codeHeadLayer = '';
	for (var lr in mapPDOKKaart.layers) {
		var l = mapPDOKKaart.layers[lr];
		if ($('#pdokLayerSelector').val() != "-") {
				apiParams+="&layer="+$('#pdokLayerSelector').val();
				codeHeadLayer = '	layer: \'' + $('#pdokLayerSelector').val() + '\',';
				break;
		} else {
			if (l.name!="Markers" && l.isBaseLayer == false && l.getVisibility()) { // add one overlay to the map, only if it is visible now
				if (l.CLASS_NAME == "OpenLayers.Layer.WMS" && $('#pdokLayerSelector').val() == "-") {
					apiParams+="&wmsurl=" + encodeURIComponent(l.url) + "&wmslayers=" + encodeURIComponent(l.params.LAYERS);
					codeHeadLayer = '	wmsurl: \'' + l.url + '\',';
					codeHeadLayer += '	wmslayers: \'' + l.params.LAYERS + '\',';
				}
				if (l.CLASS_NAME == "OpenLayers.Layer.TMS" && $('#pdokLayerSelector').val() == "-") {
					apiParams+="&tmsurl=" + encodeURIComponent(l.url) + "&tmslayer=" + encodeURIComponent(l.layername);
					codeHeadLayer = '	tmsurl: \'' + l.url + '\',';
					codeHeadLayer += '	tmslayer: \'' + l.layername + '\',';
				}
			}
		}
	}

	permalink = permalink.replace("#","?");
	permalink = permalink.split("?")[0];
	permalink += "?" +apiParams;
	// $("#emaillink").val(permalink);

	// size of the map
	var mapsize = $('input:radio[name=mapsizechoice]:checked').val();
	var mapW = '900';
	var mapH= '550';
	if (mapsize =="small") {
		mapW = '425';
		mapH= '350';
	} else if (mapsize =="medium") {
		mapW = '650';
		mapH= '450';	
	}
	// construct the URL, make sure the correct page is used
    var embedLink = permalink.replace("/?","/api/api.html?");
    embedLink = embedLink.replace("/index.html?","/api/api.html?");
	//var embedLink = permalink.("index.html")[0] + "api/api.html?" + apiParams;
	
	var embedHtmlIframe = "<iframe width='"+mapW+"' height='"+mapH+"' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='"+embedLink+"' title='PDOK Kaart'></iframe><br /><small>PDOK Kaart: <a href='"+permalink+"' style='color:#0000FF;text-align:left'>Grotere kaart weergeven</a></small>"

	$("#embedhtmliframe").val(embedHtmlIframe);
	
	// <object width="400" height="400" data="helloworld.swf"></object> 
	var embedHtmlObject = "<object width='"+mapW+"' height='"+mapH+"' codetype='text/html' data='"+embedLink+"' title='PDOK Kaart'></object><br /><small>PDOK Kaart: <a href='"+permalink+"' style='color:#0000FF;text-align:left'>Grotere kaart weergeven</a></small>"
	
	$("#embedhtmlobject").val(embedHtmlObject);
	
	$("#embedlink").val(embedLink);

	$("#sendemaillink").attr("href","mailto:?subject=Locatie&body=" + encodeURIComponent(embedLink));

	// basepath: for loading scripts from other location	
	var basepath = document.location.href.split("index.html")[0];

    var codeHead = '<script src="'+basepath+'js/jquery.js"></script>';
	// load scripts dynamically?
	// codeHead += '<script src="'+basepath+'js/loadjs.js"></script>';
	codeHead += '<script src="'+basepath+'api/OpenLayers.js"></script>';
    codeHead +='<script src="'+basepath+'api/javascripts/proj4js-compressed.js"></script>';
	// codeHead +='<script src="'+basepath+'api/lusc-api.js"></script>';
	codeHead +='<script src="http://luuks.github.com/API/lusc-api.js"></script>';
	codeHead +='<script src="'+basepath+'js/locationeditor.js"></script>';

    codeHead +='<link rel="stylesheet" href="'+basepath+'api/styles/default/style.css" type="text/css">';
    codeHead +='<link rel="stylesheet" href="'+basepath+'api/style.css" type="text/css">';
	codeHead +='<script>';

	codeHead +='function createPDOKKaart() {';
	codeHead +='  var api = new Lusc.Api({';
	codeHead +='    loc: ['+ mapPDOKKaart.getCenter().lon +','+ mapPDOKKaart.getCenter().lat +'],';
	// TODO: if a layer is added by WMS or by the PDOK list, include this
	// For the demo, now add a WMS layer
	if (activeFeature && markers.features.length > 0 && $("#showmarker").is(':checked')) {
		codeHead +='    mloc: ['+activeFeature.geometry.x+','+activeFeature.geometry.y+'],';
		codeHead +='    externalGraphic: \'http://nieuwsinkaart.nl/pdok/kaart/api/markertypes/information_blue.png\',';		
		codeHead +='    pointRadius: 20,';
		codeHead +='    titel: \'' + activeFeature.attributes.title + '\',';
		codeHead +='    tekst: \'' + activeFeature.attributes.description + '\',';
	}
	codeHead += codeHeadLayer;
	// end, zl always as last, to make sure the comma's are okay
	codeHead +='    zl: '+mapPDOKKaart.getZoom();
	codeHead +='});';
	codeHead +='return api';
	codeHead +='}';
	codeHead +='</script>';
	
	var codeBody ='<div id="map"></div>';
	codeBody +='<script>var pdokkaart = createPDOKKaart();';
	if ($("#enableEditor").is(':checked')) {
		codeBody += 'var options = {';
		if ($("#geometrie_element_id").val().length > 0) {
			codeBody += 'geom_id:"'+ $("#geometrie_element_id").val() + '",';			
		} else {
			codeBody += 'x_id:"'+ $("#x_coord_element_id").val() +'", y_id:"'+ $("#y_coord_element_id").val() +'",';
		}
		// var options = {x_id: "pdok_x_coordinaat", y_id:"pdok_y_coordinaat", geom_id: "pdok_geometrie", editorMinZoom: 10, editorMaxZoom: 14};
		codeBody += 'editorMinZoom:'+ $("#minZoomEditor").val() +', editorMaxZoom:'+ $("#maxZoomEditor").val();
		codeBody += '};';
		codeBody += 'addLocationEditor(pdokkaart, "'+$("#editorGeomType").val()+'", options);'
	}
	codeBody +='</script>';
	$("#scriptcodeHead").val(codeHead);
	$("#scriptcodeBody").val(codeBody);
	
	return true;
}

function onPopupClose(evt, feature) {
	if (!feature) feature = activeFeature;
	if (feature) {
		mapPDOKKaart.removePopup(feature.popup);
		feature.popup.destroy();
		feature.popup = null;
	    feature.renderIntent='default';
		feature.layer.drawFeature(feature);
		// mapPDOKKaart.panTo(previousCenter);
	}
}

function onFeatureSelect(feature, full, text) {
	removePopups(feature.layer);
	// var text = '';
	var popupSize;
	var className="";
	var popupCloseButton = false;
	var border = 2;
	var popupCloseButton = true;
	if (full) {
		popupSize = new OpenLayers.Size(200, 120);
        feature.popupFix = true;
		activeFeature = feature;
		// remove highlights
		$(".ft_id").each(
			function () {
				$(this).parent().parent().removeClass("selected");
			}
		);
		// highlight the selected feature in the list	
		$("#searchresult_"+feature.id.split('.')[2]).parent().parent().addClass("selected");
	
	} else {
		popupSize = new OpenLayers.Size(200, 60);
		border = 1;
	}
	
	popup = new OpenLayers.Popup(feature.attributes.title, 
		             feature.geometry.getBounds().getCenterLonLat(),
		             popupSize,
		             text,
		             popupCloseButton, onPopupClose);
	feature.popup = popup;
	feature.renderIntent='select';
	feature.layer.drawFeature(feature);
    popup.setBorder("1px solid #888888");
	popup.setOpacity(1.0);
	popup.autoSize = true;
	// popup.closeOnMove = true;
	if (full) {
	    popup.panMapIfOutOfView = true;
	} else {
	    popup.panMapIfOutOfView = false;
	}	    
	mapPDOKKaart.addPopup(popup);
}

function markersPopupText(feature, full) {
	var className = "popupTitleSummary";
	var text="";
	if (full) {
		className="popupTitleFull";
	}
	// Thijs: for the marker, add a title and description property that can be edited
	// these properties are added as marker parameters
    var ft = feature;
    if (ft.attributes.description==undefined && (ft.attributes.adres || ft.attributes.plaats || ft.attributes.gemeente || ft.attributes.provincie)) {
	    var description = "";
		description += "Adres:\n";
		description += ft.attributes.adres;
		description += "\n" + ft.attributes.postcode + " " + ft.attributes.plaats +"\n";
		description += "Gemeente: " + ft.attributes.gemeente + "\n";
		description += "Provincie: " + ft.attributes.provincie + "\n";
	    ft.attributes.description = description;
    }
    text += "<div id='popupcontent_"+ft.id+"'><h4 class='"+className+"'><input type='text' value='"+ft.attributes.title + "' id='markertitle' name='markertitle' size='30' onchange='updateMarkerTitle(this.value, \""+ ft.id + "\")'/></h4>";
    // if not full, then only hide the markertext?
	// TODO: remove separate functions for editing? Just do that by default?
    if(full){
	    text+="<div><textarea id='markertext' name='markertext' cols='40' rows='5' onchange='updateMarkerText(this.value, \""+ ft.id + "\")'>";
	    // text += ft.attributes.description + "</textarea><br/><button id='btnStartEdit' onclick='startFeatureEdit(\""+ ft.id +"\")'>Bewerken</button> - <button id='btnStopEdit' onclick='stopFeatureEdit(\""+ ft.id +"\")' disabled='disabled'>Klaar met bewerken</button></div>";
	    text += ft.attributes.description + "</textarea><br/>"
	    // add coordinates in form
	    text += "Coordinaten (RD): X: <input type='text' id='location_x' name='location_x' value='"+ft.geometry.x+"' size='8'/>, ";
	    text += "Y: <input type='text' id='location_y' name='location_y' value='"+ft.geometry.y+"' size='8'/><br/>";
	    // add buttons for editing marker
	    text +="<button id='btnStopEdit' onclick='stopFeatureEdit(\""+ ft.id +"\")'>Klaar</button> <button id='btnRemoveMarker' onclick='removeFeature(\""+ ft.id +"\")'>Verwijder locatie</button></div>";
    }
    text+="</div>";
	return text;
}

function startFeatureEdit(ft_id) {
	dragControl.activate();
	// TODO: change style of marker
	$("#markertitle").attr("readonly","");
	$("#markertext").attr("readonly","");
	// $("#btnStartEdit").attr("disabled","disabled");
	// $("#btnStopEdit").attr("disabled","");
}

function stopFeatureEdit(ft_id) {
	//linkToMapOpened();
	 removePopups(markers);
	// dragControl.deactivate();
	// change style
	// $("#markertitle").attr("readonly", "readonly");
	// $("#markertext").attr("readonly", "readonly");
	// $("#btnStartEdit").attr("disabled","");
	// $("#btnStopEdit").attr("disabled","disabled");

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

function removePopups(layer) {
	for (var i=0;i<layer.features.length;i++) {
		var ft = layer.features[i];
		if (ft.popup!=null) {
			// close the popup first
			mapPDOKKaart.removePopup(ft.popup);
			ft.renderIntent='default';
			ft.layer.drawFeature(ft);
			ft.popup.destroy();
			ft.popup = null;
		}
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

function addFormEnhancements(){
    // remove default values if focus is set
    /* jQuery("input[type|='text']").each(function(index, element) {
            var defaultValue = jQuery(this).val();
            // or use another default?
            if (jQuery(this).id=="atomFeedUrl") defaultValue="URL van een Atom feed";
            jQuery(this).focus(function(){
                if (this.value == defaultValue) {this.value = ''}
            });
            jQuery(this).blur(function(){
                if (this.value=='') {this.value = defaultValue}
            });
        }
    ); */
	// Add select to all text fields
	$("#createlink input[type=text]").focus(function(){
		// Select field contents
		this.select();
	});
	$("#createlink input[type=text]").click(function(){
		// Select field contents
		this.select();
	});
}


function updateMarkerTitle(markerTitle, ft_id) {
	var ft = markers.getFeatureById(ft_id);
	ft.attributes.title = markerTitle;
}


function updateMarkerText(markerText, ft_id) {
	var ft = markers.getFeatureById(ft_id);
	ft.attributes.description = markerText;
}


function getStyleMap() {

	var defaultStyle = new OpenLayers.Style({
	  'pointRadius': 14,
	  // graphicwidth/height fail in IE...
	  //'graphicWidth':'16',
	  //'graphicHeight':'19',
	  'externalGraphic': defaultmarkerpath,
  	  'graphicYOffset':-28,
	  'fillColor':'#ffffff',
	  'fillOpacity':'1.0',
	  'strokeColor':'#FF5C00',
	  'strokeWidth':'3'
	});

	var selectStyle = new OpenLayers.Style({
	  'pointRadius': 15,
      'externalGraphic': defaultmarkerpath,
	  'fillOpacity':'1.0',
	  // graphicwidth/height fail in IE...
	  //'graphicWidth':'20',
	  //'graphicHeight':'24',
  	  'graphicYOffset':-30
	});

	var styleMap = new OpenLayers.StyleMap({'default': defaultStyle,
			         'select': selectStyle, 'temporary': selectStyle});
	return styleMap;
}
