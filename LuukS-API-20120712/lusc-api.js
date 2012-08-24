/**
 * @class Lusc.Api
 * 
 * Class implements an API for an easy to use embedding of
 * our pre-defined mapservices in any website with an OpenLayers slippy map.
 * This class is based upon the Terrestris WMS-API
 * The markerstyles are based upon the Mapicons from Nicolas Mollet (http://mapicons.nicolasmollet.com)
 * 
 * @examples
 * 
 *  <iframe width="400" height="300" frameborder="0" 
 *    scrolling="no" marginheight="0" marginwidth="0" 
 *    src="/api/api.html?mloc=136260,456394&loc=136260,456394&zl=8"
 *    style="border: 0">
 * OR
 *  <iframe width="400" height="300" frameborder="0" 
 *    scrolling="no" marginheight="0" marginwidth="0" 
 *    src="/api/api.html?mloc=136260,456394&mt=1&bbox=130000,450000,150000,470000"
 *    style="border: 0">
 */
Lusc = {};
Lusc.Api = function(config) {
    
    /**
     * Reference to the zoomlevel object
     */
    this.zl = null;

	/**
     * Reference to the location object
     */
    this.loc = null;

    /**
     * Reference to the BBOX object
     */
    this.bbox = null;
    
    /**
     * Reference to the layer
     */
    this.layer = null;
    
    /**
     * Reference to map object
     */
    this.map = null;

    /**
     * Reference to markerlocation object
     */
    this.mloc = null;

    /**
     * Reference to markertype object
     */
    this.mt = null;

    /**
     * Reference to popup titel object
     */
    this.titel = null;
    
    /**
     * Reference to markertype object
     */
    this.tekst = null;

    /**
     * Reference to Textfile URL object
     */
    this.txturl = null;
    
    /**
     * Reference to WMS-URL object
     */
    this.wmsurl = null;

    /**
     * Reference to WMS layer(s) object
     */
    this.wmslayers = null;

    /**
     * Reference to TMS-URL object
     */
    this.tmsurl = null;

    /**
     * Reference to TMS layer object
     */
    this.tmslayer = null;

    /**
     * Reference to TMS layer object
     */
    this.tmstype = null;

    /**
     * Reference to layerswitch object
     */
    this.ls = null;

    /**
     * Reference to the DIV-id the map should be rendered in
     */
    this.div = null;
    
    /**
     * Reference to the graphic URL for the marker
     */
    this.externalGraphic = null;

    /**
     * Reference to the graphic radius for the marker
     */
    this.pointRadius = null;
    
	/**
     * Reference to the styles object with all marker, lines and polygon rules
     */
    this.styles = null;

    /**
     * References to different drawing controls
     */
     this.drawFeaturePoint = null;
     this.drawFeatureLine = null;
     this.drawFeaturePolygon = null;
	
    /**
     * Reference to featuresLayer (= layer where you draw feature on)
     */
    this.featuresLayer = null;

    /**
     * @private
     * Look up array, having the supported layers.
     */
    this.supportedLayers = [
    	"AAN",
    	"ADRESSEN",
    	"AHN25M",
    	"BBG2008",
    	"BESCHERMDENATUURMONUMENTEN",
    	"GEMEENTEGRENZEN",
    	"GEMEENTEGRENZEN_LABEL",
    	"NATIONALE_PARKEN",
    	"NOK2011",
    	"TEXEL_20120423_OUTLINE",
    	"TOP10NL"
    ];

    /**
     * @private
     * Look up array, having the supported markertypes.
     */
    this.markers = [
	    ["mt1","markertypes/information_blue.png"],
	    ["mt2","markertypes/information_green.png"],
	    ["mt3","markertypes/information_yellow.png"],
	    ["mt4","markertypes/geonovum_blue.png"],
	    ["mt5","markertypes/geonovum_green.png"],
	    ["mt6","markertypes/geonovum_yellow.png"],
	    ["mt7","markertypes/kadaster_blue.png"],
	    ["mt8","markertypes/kadaster_green.png"],
	    ["mt9","markertypes/kadaster_yellow.png"],
	    ["mt10","markertypes/rijk_blue.png"],
	    ["mt11","markertypes/rijk_green.png"],
	    ["mt12","markertypes/rijk_yellow.png"],
		["mt13","markertypes/empty_blue.png"],
	    ["mt14","markertypes/empty_green.png"],
	    ["mt15","markertypes/empty_yellow.png"],
	    ["mt16","markertypes/default.png"],
		["mt17","markertypes/star-3.png"]		
    ];
    
    /**
     * @private
     * The style object for the marker.
     * Generated with http://www.webmapcenter.de/olstyle/generator.php
     */
    this.styleObj = {
          strokeColor : '#ee0028',
          strokeWidth : 1,
          strokeOpacity : 1,
          fillColor : '#ee000d',
          fillOpacity : 1,
          pointRadius : 12,
          externalGraphic: './markertypes/default.png'
    };

    
    /**
     * @private
     * The attribution added to the map
     */
    this.attribution = '&copy; <a target="_parent" href="http://www.terrestris.de">terrestris GmbH & Co. KG</a>,</br>' +
        'Data by <a target="_parent" href="http://www.openstreetmap.org">OpenStreetMap</a> and contributors, <a target="_parent" href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
   
	
    if (config) {
        
        // read out and validate the given values
        this.validateConfig(config);
        
		// create the styles object
        //this.styles = this.createStylesObject();
		
        // create the OpenLayers Map instance
        this.map = this.createOlMap();
        
    } else {
        // exception
    }
}

/**
 * @private
 * 
 * Reads out and validates the given config options.
 * The values are restored in member vars. On error a default is set.
 */
Lusc.Api.prototype.validateConfig = function(config) {
	if (config.layer && !OpenLayers.Util.isArray(config.layer)) {
		config.layer = [config.layer];
	}
	if (config.layer && OpenLayers.Util.indexOf(this.supportedLayers, config.layer) && OpenLayers.Util.isArray(config.layer)) {
        this.layer = config.layer;
	}
    
    if (config.zl) {
        this.zl = config.zl;
    }

    if (config.loc && OpenLayers.Util.isArray(config.loc) && config.loc.length == 2) {
        this.loc = config.loc;
    }

    if (config.bbox && OpenLayers.Util.isArray(config.bbox) && config.bbox.length == 4) {
        this.bbox = config.bbox;
    }
    
    if (config.mloc && OpenLayers.Util.isArray(config.mloc) && config.mloc.length == 2) {
        this.mloc = config.mloc;
    }
    
    if (config.mt) {
        this.mt = config.mt;
    }

    if (config.titel) {
        this.titel = config.titel;
    }

    if (config.tekst) {
        this.tekst = config.tekst;
    }
    
    if (config.txturl) {
        this.txturl = config.txturl;
    }
    
    if (config.wmsurl) {
        this.wmsurl = config.wmsurl;
    }

    if (config.wmslayers) {
        this.wmslayers = config.wmslayers;
    }

    if (config.tmsurl) {
        this.tmsurl = config.tmsurl;
    }

    if (config.tmslayer) {
        this.tmslayer = config.tmslayer;
    }

    if (config.tmstype) {
        this.tmstype = config.tmstype;
    }
    else{
    	this.tmstype = "png";
    }

    if (config.ls != null) {
        this.ls = config.ls;
        if (config.ls == "true"){
        	this.ls=true;
        }
    }
    else{
    	this.ls = false;
    }

    if (config.externalGraphic) {
        this.externalGraphic = config.externalGraphic;
    }

    if (config.pointRadius) {
        this.pointRadius = config.pointRadius;
    }
    
    if (config.div) {
    	this.div = config.div;
    }
}

/**
 * @private
 * 
 * Creates an OpenLayers Map object due to the given config.
 */
Lusc.Api.prototype.createOlMap = function() {
    markerPath = "./markertypes/";
    var olMap = new OpenLayers.Map ({
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.ZoomPanel(),
			new OpenLayers.Control.ScaleLine()
        ],
        maxExtent: new OpenLayers.Bounds(-285401.92,22598.08,595401.9199999999,903401.9199999999),
        theme: null,
		resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76,
					26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42],
        units: 'm',
        projection: new OpenLayers.Projection("EPSG:28992"),
        div: (this.div != null) ? this.div : 'map'
    });
	
	function showBRT(){
		var layers = olMap.getLayersByName("BRT Achtergrondkaart");
		for(var layerIndex = 0; layerIndex < layers.length; layerIndex++)
			{
				olMap.setBaseLayer(layers[layerIndex]);
			}
	}
	function showTOP10(){
		var layers = olMap.getLayersByName("TOP10NL");
		for(var layerIndex = 0; layerIndex < layers.length; layerIndex++)
			{
				olMap.setBaseLayer(layers[layerIndex]);
			}
	}
	if (this.ls == true){
		function showLufo(){
			alert("Helaas, er zijn nog geen\nluchtfoto's beschikbaar binnen PDOK'");
		}
	    var panel = new OpenLayers.Control.Panel();
		var openBRT = new OpenLayers.Control({
			title:"Toon de BRT Achtergrondkaart als ondergrond",
			type: OpenLayers.Control.TYPE_BUTTON,
			trigger: showBRT,
			displayClass: "openBRT"
		});
		var openTOP10 = new OpenLayers.Control({
			title:"Toon de TOP10NL als ondergrond",
			type: OpenLayers.Control.TYPE_BUTTON,
			trigger: showTOP10,
			displayClass: "openTOP10"
		});
		var openLufo = new OpenLayers.Control({
			title:"Toon de luchtfoto's als ondergrond",
			type: OpenLayers.Control.TYPE_BUTTON,
			trigger: showLufo,
			displayClass: "openLufo"
		});
	
		panel.addControls([openLufo,openTOP10,openBRT]);
		olMap.addControl(panel);
	}    
    
    // create TMS-lagen voor de achtergrond
	lyrBRTAchtergrondkaart = new OpenLayers.Layer.TMS(
		"BRT Achtergrondkaart",
		"http://geodata.nationaalgeoregister.nl/tms/",
		{layername: "brtachtergrondkaart", type:"png8", visibility: true, isBaseLayer:true}
	);
	lyrTOP10NL = new OpenLayers.Layer.TMS(
		"TOP10NL",
		"http://geodata.nationaalgeoregister.nl/tms/",
		{layername: "top10nl", type:"png8", visibility: false, isBaseLayer:true}
	);
    //olMap.addLayers([lyrBRTAchtergrondkaart,lyrTOP10NL]);
	 olMap.addLayers([lyrBRTAchtergrondkaart]);
	
    // apply layer if a layer was given
	if (this.layer != null) {
		var layer = null;
		var l;
		for (l in this.layer)
		{
			switch (this.layer[l].toUpperCase()){
				case "AAN":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"AAN",
							"http://geodata.nationaalgeoregister.nl/aan/wms",
							{layers: 'aan',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "ADRESSEN":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"ADRESSEN",
							"http://geodata.nationaalgeoregister.nl/inspireadressen/wms",
							{layers: 'inspireadressen',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "AHN25M":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"AHN25M",
							"http://geodata.nationaalgeoregister.nl/ahn25m/wms",
							{layers: 'ahn25m',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "BBG2008":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"BBG2008",
							"http://geodata.nationaalgeoregister.nl/bestandbodemgebruik2008/wms",
							{layers: 'bbg2008',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "BESCHERMDENATUURMONUMENTEN":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"beschermdenatuurmonumenten",
							"http://geodata.nationaalgeoregister.nl/beschermdenatuurmonumenten/wms",
							{layers: 'beschermdenatuurmonumenten',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "GEMEENTEGRENZEN":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"Gemeentegrenzen",
							"http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?sld=http://luuks.github.com/API/gemeentegrenzen_grijs_gestippeld.sld",
							{layers: 'gemeenten_2012',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "GEMEENTEGRENZEN_LABEL":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"Gemeentegrenzen",
							"http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?sld=http://luuks.github.com/API/gemeentegrenzen_label_grijs_gestippeld.sld",
							{layers: 'gemeenten_2012',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "NATIONALE_PARKEN":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"Nationale parken",
							"http://geodata.nationaalgeoregister.nl/nationaleparken/wms",
							{layers: 'nationaleparken',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "NATURA2000":
					var layer = new OpenLayers.Layer.TMS(
						"NATURA2000",
						"http://geodata.nationaalgeoregister.nl/tms/",
						{layername: "natura2000", type:"png8", visibility: true, isBaseLayer:false, opacity:0.8}
					);
					olMap.addLayer(layer);
					break;
				case "NOK2011":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"NOK2011",
							"http://geodata.nationaalgeoregister.nl/nok2011/wms",
							{layers: 'begrenzing,planologischeehs,verwervinginrichting',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "TEXEL_20120423_OUTLINE":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"Gevectoriseerde Bonnebladen",
							"http://mapserver.sara.nl/bonne_vect/cgi-bin/mapserv?map=bonne_vect_texel.map", 
							{layers: 'TEXEL_20120423_OUTLINE',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true},
							{
								attribution: this.attribution
							} 
					);
					olMap.addLayer(layer);
					break;
				default:
					//do nothing
					var layer;
					break;
			}
		}
	}
	
    // apply WMSURL and WMSLAYERS if applicable
	if ((this.wmsurl != null) && (this.wmslayers != null)) {
		var lyrWMS = new OpenLayers.Layer.WMS.Untiled(
				this.wmslayers,
				this.wmsurl, 
				{layers: this.wmslayers,transparent: 'true',format: "image/png"},
				{visibility: true,isBaseLayer:false},
				{singleTile: true}
		);
        olMap.addLayer(lyrWMS);
	}

    // apply TMSURL and TMSLAYERS if applicable
	if ((this.tmsurl != null) && (this.tmslayer != null)) {
		var layer = new OpenLayers.Layer.TMS(
			this.tmslayer,
			this.tmsurl,
			{layername: this.tmslayer, type:this.tmstype, visibility: true, isBaseLayer:false, opacity:0.8}
		);
		olMap.addLayer(layer);
	}

    // apply TXTURL if applicable
	if (this.txturl != null) {
		var lyrTextLayer = new OpenLayers.Layer.Text( "Textlayer", {location: this.txturl} );
		olMap.addLayer(lyrTextLayer);
	}

    // apply BBOX or zoomlevel and location
    if (this.bbox != null) {
        olMap.zoomToExtent(OpenLayers.Bounds.fromArray(this.bbox).transform(olMap.displayProjection, olMap.getProjectionObject()));
	}
    else if (this.zl != null && this.loc != null) {
		olMap.setCenter (new OpenLayers.LonLat(parseInt(this.loc[0]), parseInt(this.loc[1])), parseInt(this.zl));
    } else {
        olMap.zoomToMaxExtent();
    }
    
    // add marker and use markertype if given, otherwise the default marker
    if (this.mloc != null) {
       var markerGeom = new OpenLayers.Geometry.Point(this.mloc[0], this.mloc[1]);
       var markerFeat = new OpenLayers.Feature.Vector(markerGeom);
       if (this.mt != null){
	        if ((this.mt >= 0) && (this.mt < this.markers.length)){
		        this.styleObj.externalGraphic = markerPath + this.markers[parseInt(this.mt)];
		    }
		    else{
		        this.styleObj.externalGraphic = markerPath + this.markers[0];
		    }
        }
        else if (this.externalGraphic != null){
        	this.styleObj.externalGraphic = this.externalGraphic;
        }
        if ((this.pointRadius !=null) && (this.pointRadius > 0)){
        	this.styleObj.pointRadius = this.pointRadius;
        }
        /* var markerLayer = new OpenLayers.Layer.Vector('Marker', {
            styleMap: new OpenLayers.StyleMap(this.styleObj)
        }); */
		
		var markerLayer = new OpenLayers.Layer.Vector('Marker', {
            styleMap: this.styles
        });

	    // add popup if the parameters titel or tekst are used
	    if (this.titel != null || this.tekst != null) {
	    	strOms = "";
	    	if (this.titel != null){
		    	strOms = "<h2>" + this.titel + "</h2>";
	    	}
	    	if (this.tekst != null){
		    	strOms = strOms + this.tekst;
	    	}
	    	markerFeat.attributes.oms = strOms;
	    	// Interaction; not needed for initial display.
            selectControl = new OpenLayers.Control.SelectFeature(markerLayer);
            olMap.addControl(selectControl);
            selectControl.activate();
            markerLayer.events.on({
                'featureselected': onFeatureSelect,
                'featureunselected': onFeatureUnselect
            });
		}

        olMap.addLayer(markerLayer);
        markerLayer.addFeatures([markerFeat]);
    }

    return olMap;
}

/**
 * Returns the current map object of this instance.
 * @public
 */
Lusc.Api.prototype.getMapObject = function() {
	return this.map;
}

Lusc.Api.prototype.addGeometries = function(featurecollection){
	var geojson_format = new OpenLayers.Format.GeoJSON();
	var vector_layer = new OpenLayers.Layer.Vector(); 
	this.map.addLayer(vector_layer);
	vector_layer.addFeatures(geojson_format.read(featurecollection));
}

/**
 * If not available, creates a drawFeature control. and activates it.
 * 
 * Parameters:
 * styletype - {String} styletype (eg 'mt1' or 'lt1' or 'pt1')
 *       based on the first char of the styletype, the type of feature
 *       is set: m = marker/point, l = linestring, p = polygon
 */
Lusc.Api.prototype.enableDrawingTool = function(styletype){
    if (this.featuresLayer==null){
        this.featuresLayer = new OpenLayers.Layer.Vector("Features");
        this.map.addLayer(this.featuresLayer);
    }
    if (styletype[0]=='m'){
        if (this.drawFeaturePoint==null){
            this.drawFeaturePoint = new OpenLayers.Control.DrawFeature(this.featuresLayer, OpenLayers.Handler.Point);
            this.map.addControl(this.drawFeaturePoint);
        }
        this.drawFeaturePoint.activate();
    }
    else if (styletype[0]=='l'){
        if (this.drawFeatureLine==null){
            this.drawFeatureLine = new OpenLayers.Control.DrawFeature(this.featuresLayer, OpenLayers.Handler.Path);
            this.map.addControl(this.drawFeatureLine);
        }
        this.drawFeatureLine.activate();
    }
    else if (styletype[0]=='p'){
        if (this.drawFeaturePolygon==null){
            this.drawFeaturePolygon = new OpenLayers.Control.DrawFeature(this.featuresLayer, OpenLayers.Handler.Polygon);
            this.map.addControl(this.drawFeaturePolygon);
        }
        this.drawFeaturePolygon.activate();
    }
}

/**
 * Interaction functionality for clicking on the marker
 */
function onPopupClose(evt) {
    // 'this' is the popup.
    var feature = this.feature;
    if (feature.layer) { // The feature is not destroyed
        selectControl.unselect(feature);
    } else { // After "moveend" or "refresh" events on POIs layer all 
             //     features have been destroyed by the Strategy.BBOX
        this.destroy();
    }
}

function onFeatureSelect(evt) {
    feature = evt.feature;
    popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                             feature.geometry.getBounds().getCenterLonLat(),
                             new OpenLayers.Size(100,100),
                             feature.attributes.oms,
                             null, true, onPopupClose);
    feature.popup = popup;
    popup.feature = feature;
    this.map.addPopup(popup, true);
}

function onFeatureUnselect(evt) {
    feature = evt.feature;
    if (feature.popup) {
        popup.feature = null;
        this.map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
}

Lusc.Api.prototype.getLayers = function(){
	return this.supportedLayers;
}    

Lusc.Api.prototype.getMarkers = function(){
	return this.markers;
}
Lusc.Api.prototype.getMarkerPath = function(){
	return markerPath;
}

Lusc.Api.prototype.setLocation = function(loc) {
	this.map.setCenter (new OpenLayers.LonLat(parseInt(loc[0]), parseInt(loc[1])));
}

Lusc.Api.prototype.setZoomLevel = function(zl) {
	this.map.zoomTo (zl);
}

Lusc.Api.prototype.reprojectWGS84toRD = function(lat,lon){
	Proj4js.defs["EPSG:28992"] = "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.040,49.910,465.840,-0.40939,0.35971,-1.86849,4.0772";
	//Proj4js.defs["EPSG:28992"] = "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs <>";
	pointRD = new OpenLayers.LonLat(lon,lat)
        .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from wgs84 
            new OpenLayers.Projection("EPSG:28992") // new RD
        );
	return(pointRD);
}

Lusc.Api.prototype.addMarker = function(mloc,mt,titel,tekst,externalGraphic,pointRadius) {
    if (mloc != null) {
	   // Bij een bestaande markerlayer moet de markerfeature een andere icon krijgen
	   var pntMarkerGeom = new OpenLayers.Geometry.Point(mloc[0],mloc[1]);
	   var vctMarkerFeat = new OpenLayers.Feature.Vector(pntMarkerGeom);
       var styObjStyle = {
			strokeColor : '#ee0028',
			strokeWidth : 1,
			strokeOpacity : 1,
			fillColor : '#ee000d',
			fillOpacity : 1,
			pointRadius : 12,
			externalGraphic: './markertypes/default.png'
       };
       var markerStyle = {
			strokeColor : '#ee0028',
			strokeWidth : 1,
			strokeOpacity : 1,
			fillColor : '#ee000d',
			fillOpacity : 1,
			pointRadius : 12
       };
       if (mt != null){
	        if ((mt >= 0) && (mt < this.markers.length)){
		        styObjStyle.externalGraphic = markerPath + this.markers[parseInt(mt)];
		        markerStyle.externalGraphic = markerPath + this.markers[parseInt(mt)];
		    }
		    else{
		        styObjStyle.externalGraphic = markerPath + this.markers[0];
		        markerStyle.externalGraphic = markerPath + this.markers[0];
		    }
        }
        else if (externalGraphic != null){
        	styObjStyle.externalGraphic = externalGraphic;
        	markerStyle.externalGraphic = externalGraphic;
        }
        if ((pointRadius !=null) && (pointRadius > 0)){
        	styObjStyle.pointRadius = pointRadius;
        	markerStyle.pointRadius = pointRadius;
        }
        else{
        	styObjStyle.pointRadius = 12;
        	markerStyle.pointRadius = 12;
        }
        if (this.map.getLayersByClass("OpenLayers.Layer.Vector").length > 0){
        	var markerLayer = this.map.getLayersByClass("OpenLayers.Layer.Vector")[0];
        }
        else{
	        var markerLayer = new OpenLayers.Layer.Vector('Marker', {
	            styleMap: new OpenLayers.StyleMap(markerStyle)
    	    });
	        this.map.addLayer(markerLayer);
            selectControl = new OpenLayers.Control.SelectFeature(markerLayer);
            this.map.addControl(selectControl);
            selectControl.activate();
        }
        
	    // add popup if the parameters titel or tekst are used
	    if (titel != null || tekst != null) {
	    	strOms = "";
	    	if (titel != null){
		    	strOms = "<h2>" + titel + "</h2>";
	    	}
	    	if (tekst != null){
		    	strOms = strOms + tekst;
	    	}
	    	vctMarkerFeat.attributes.oms = strOms;
            markerLayer.events.on({
                'featureselected': onFeatureSelect,
                'featureunselected': onFeatureUnselect
            });
		}
        //markerLayer.addFeatures([vctMarkerFeat]);
        //var markerStyle = {externalGraphic: "./markertypes/default.png", graphicWidth: 16, graphicHeight: 16, graphicYOffset: -16, graphicOpacity: 0.7};
        markerLayer.addFeatures([new OpenLayers.Feature.Vector(pntMarkerGeom, {oms: strOms}, markerStyle)]);
    }
}

Lusc.Api.prototype.addWMS = function(wmsurl,wmslayers) {
	if ((wmsurl != null) && (wmslayers != null)) {
		var lyrWMS = new OpenLayers.Layer.WMS.Untiled(
				wmslayers,
				wmsurl, 
				{layers: wmslayers,transparent: 'true',format: "image/png"},
				{visibility: true,isBaseLayer:false},
				{singleTile: true}
		);
        this.map.addLayer(lyrWMS);
	}
}

Lusc.Api.prototype.addTMS = function(tmsurl,tmslayer,tmstype) {
	if ((tmsurl != null) && (tmslayer != null)) {
		if (tmstype == null){
			tmstype="png";
		}
		var lyrTMS = new OpenLayers.Layer.TMS(
			tmslayer,
			tmsurl,
			{layername: tmslayer, type:tmstype, visibility: true, isBaseLayer:false, opacity:0.8}
		);
        this.map.addLayer(lyrTMS);
	}
}

Lusc.Api.prototype.addLayers = function(arrLayerNames){
	if (arrLayerNames != null) {
		var layer = null;
		var l;
		for (l in arrLayerNames)
		{
			switch (arrLayerNames[l].toUpperCase()){
				case "AAN":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"AAN",
							"http://geodata.nationaalgeoregister.nl/aan/wms",
							{layers: 'aan',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					this.map.addLayer(layer);
					break;
				case "ADRESSEN":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"ADRESSEN",
							"http://geodata.nationaalgeoregister.nl/inspireadressen/wms",
							{layers: 'inspireadressen',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "AHN25M":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"AHN25M",
							"http://geodata.nationaalgeoregister.nl/ahn25m/wms",
							{layers: 'ahn25m',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					this.map.addLayer(layer);
					break;
				case "BBG2008":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"BBG2008",
							"http://geodata.nationaalgeoregister.nl/bestandbodemgebruik2008/wms",
							{layers: 'bbg2008',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "BESCHERMDENATUURMONUMENTEN":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"beschermdenatuurmonumenten",
							"http://geodata.nationaalgeoregister.nl/beschermdenatuurmonumenten/wms",
							{layers: 'beschermdenatuurmonumenten',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					olMap.addLayer(layer);
					break;
				case "GEMEENTEGRENZEN":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"Gemeentegrenzen",
							"http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?sld=http://luuks.github.com/API/gemeentegrenzen_grijs_gestippeld.sld",
							{layers: 'gemeenten_2012',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					this.map.addLayer(layer);
					break;
				case "GEMEENTEGRENZEN_LABEL":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"Gemeentegrenzen",
							"http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?sld=http://luuks.github.com/API/gemeentegrenzen_label_grijs_gestippeld.sld",
							{layers: 'gemeenten_2012',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					this.map.addLayer(layer);
					break;
				case "NATIONALE_PARKEN":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"Nationale parken",
							"http://geodata.nationaalgeoregister.nl/nationaleparken/wms",
							{layers: 'nationaleparken',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					this.map.addLayer(layer);
					break;
				case "NATURA2000":
					var layer = new OpenLayers.Layer.TMS(
						"NATURA2000",
						"http://geodata.nationaalgeoregister.nl/tms/",
						{layername: "natura2000", type:"png8", visibility: true, isBaseLayer:false, opacity:0.8}
					);
					this.map.addLayer(layer);
					break;
				case "NOK2011":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"NOK2011",
							"http://geodata.nationaalgeoregister.nl/nok2011/wms",
							{layers: 'begrenzing,planologischeehs,verwervinginrichting',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true}
					);
					this.map.addLayer(layer);
					break;
				case "TEXEL_20120423_OUTLINE":
					var layer = new OpenLayers.Layer.WMS.Untiled(
							"Gevectoriseerde Bonnebladen",
							"http://mapserver.sara.nl/bonne_vect/cgi-bin/mapserv?map=bonne_vect_texel.map", 
							{layers: 'TEXEL_20120423_OUTLINE',transparent: 'true',format: "image/png"},
							{visibility: true,isBaseLayer:false},
							{singleTile: true},
							{
								attribution: this.attribution
							} 
					);
					this.map.addLayer(layer);
					break;
				default:
					//do nothing
					var layer;
					break;
			}
		}
	}
}

/**
 * @private
 * 
 * Creates a style object with all markerstyles, linestyles and polygonstyles 
 */
//Lusc.Api.prototype.createStylesObject = function() {
//
//var rule_mt1 = this.createRuleObject("mt1",null,null,null,null,"markertypes/information_blue.png");
//var rule_mt2 = this.createRuleObject("mt2",null,null,null,null,"markertypes/information_green.png");
//var rule_mt3 = this.createRuleObject("mt3",null,null,null,null,"markertypes/information_yellow.png");
//var rule_lt1 = this.createRuleObject("lt1",null,"#ff9933",null, 2,null);
//var rule_pt1 = this.createRuleObject("pt1","#ffcc66","#ffcc66",1,2,null);
//
//var styles = new OpenLayers.Style(
//        // the first argument is a base symbolizer
//        // all other symbolizers in rules will extend this one
//        {
//            graphicWidth: 21,
//            graphicHeight: 25,
//            graphicYOffset: -28, // shift graphic up 28 pixels
//            label: "${foo}" // label will be foo attribute value
//        },
//        // the second argument will include all rules
//        {
//            rules: [
//                rule_mt1,
//				rule_mt2,
//				rule_mt3,
//				rule_lt1,
//				rule_pt1
//		]})
//	
//
//return styles;
//
//}
//
///**
// * @private
// * 
// * Creates a StyleMap object  
// */
//Lusc.Api.prototype.createRuleObject = function(styletype,fillcolor, linecolor, fillopacity, linewidth, externalgraphic) {
//
//
//var stylemap = {
//                default:{
//                    pointRadius: 14,
//                    fillColor: fillcolor,
//                    strokeColor: linecolor,
//                    strokeWidth: linewidth,
//                    graphicZIndex: 1,
//					externalGraphic: externalgraphic,
//					fillOpacity: fillopacity,
//					graphicYOffset: -28
//                },
//                select:{
//                    fillColor: "0000FF",
//                    strokeColor: "0000FF",
//                    graphicZIndex: 2
//                }
//            };
//
//			
//var rule = new OpenLayers.Rule({
//                    // a rule contains an optional filter
//                    filter: new OpenLayers.Filter.Comparison({
//                        type: OpenLayers.Filter.Comparison.EQUALS,
//                        property: "style", // the "style" feature attribute
//                        value: styletype
//                    }),
//                    // if a feature matches the above filter, use this symbolizer
//                    symbolizer: {
//                       stylemap
//                    }
//                });			
//						
//return rule;
//}
 
