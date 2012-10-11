/**
 * @class Pdok.Api
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
 *    src="api/api.html?mloc=136260,456394&loc=136260,456394&zl=8"
 *  >
 * OR
 *  <iframe width="400" height="300" frameborder="0" 
 *    scrolling="no" marginheight="0" marginwidth="0" 
 *    src="api/api.html?mloc=136260,456394&mt=1&bbox=130000,450000,150000,470000"
 *  >
 */


Pdok = {};
Pdok.API_VERSION_NUMBER = '1.0-rc1';

// CONFIG

// The api-url is the base-url for api.js, markersdefs, layerdefs etc
// The proxyhost is needed for the geocoder

// PDOK LOKET PRODUKTIE
Pdok.ApiUrl = 'http://pdokkaart.pdokloket.nl/api';
OpenLayers.ProxyHost = "http://"+window.location.host+"/proxy.php?url=";  // current pdokloket proxy

// TEST
//Pdok.ApiUrl = 'http://www.duif.net/pdok/api';
//OpenLayers.ProxyHost = "http://"+window.location.host+"/cgi-bin/proxy.cgi?url=";

// ONTWIKKEL
//Pdok.ApiUrl = 'http://localhost/pdokkaart/api';
//OpenLayers.ProxyHost = "http://"+window.location.host+"/cgi-bin/proxy.cgi?url=";


OpenLayers.ImgPath = './img/';


OpenLayers.Feature.Vector.style['default'].strokeColor = 'red';
OpenLayers.Feature.Vector.style['default'].fillColor = 'red';
OpenLayers.Feature.Vector.style['default'].pointRadius = 5;
OpenLayers.Feature.Vector.style['default'].fillOpacity = 0.8;
// small point otherwise we see circle
OpenLayers.Feature.Vector.style['temporary'].pointRadius = 0;
OpenLayers.Feature.Vector.style['temporary'].strokeColor = 'red';
OpenLayers.Feature.Vector.style['temporary'].fillColor = 'red';

OpenLayers.Lang["nl"] = OpenLayers.Util.applyDefaults({
    'unhandledRequest': "Het verzoek is niet afgehandeld met de volgende melding: ${statusText}",
    'Permalink': "Permanente verwijzing",
    'Overlays': "Kaartlagen",
    'Base Layer': "Ondergrond",
    'noFID': "Een optie die geen FID heeft kan niet bijgewerkt worden.",
    'browserNotSupported': "Uw browser ondersteunt het weergeven van vectoren niet.\nMomenteel ondersteunde weergavemogelijkheden:\n${renderers}",
    'minZoomLevelError': "De eigenschap minZoomLevel is alleen bedoeld voor gebruik lagen met die afstammen van FixedZoomLevels-lagen.\nDat deze WFS-laag minZoomLevel controleert, is een overblijfsel uit het verleden.\nWe kunnen deze controle echter niet verwijderen zonder op OL gebaseerde applicaties die hervan afhankelijk zijn stuk te maken.\nDaarom heeft deze functionaliteit de eigenschap \'deprecated\' gekregen - de minZoomLevel wordt verwijderd in versie 3.0.\nGebruik in plaats van deze functie de mogelijkheid om min/max voor resolutie in te stellen zoals op de volgende pagina wordt beschreven:\nhttp://trac.openlayers.org/wiki/SettingZoomLevels",
    'commitSuccess': "WFS-transactie: succesvol ${response}",
    'commitFailed': "WFS-transactie: mislukt ${response}",
    'googleWarning': "De Google-Layer kon niet correct geladen worden.\x3cbr /\x3e\x3cbr /\x3e\nOm deze melding niet meer te krijgen, moet u een andere achtergrondkaart kiezen in de laagwisselaar in de rechterbovenhoek.\x3cbr /\x3e\x3cbr /\x3e\nDit komt waarschijnlijk doordat de bibliotheek ${layerLib} niet correct ingevoegd is.\x3cbr /\x3e\x3cbr /\x3e\nOntwikkelaars: \x3ca href=\'http://trac.openlayers.org/wiki/${layerLib}\' target=\'_blank\'\x3eklik hier\x3c/a\x3e om dit werkend te krijgen.",
    'getLayerWarning': "De laag ${layerType} kon niet goed geladen worden.\x3cbr /\x3e\x3cbr /\x3e\nOm deze melding niet meer te krijgen, moet u een andere achtergrondkaart kiezen in de laagwisselaar in de rechterbovenhoek.\x3cbr /\x3e\x3cbr /\x3e\nDit komt waarschijnlijk doordat de bibliotheek ${layerLib} niet correct is ingevoegd.\x3cbr /\x3e\x3cbr /\x3e\nOntwikkelaars: \x3ca href=\'http://trac.openlayers.org/wiki/${layerLib}\' target=\'_blank\'\x3eklik hier\x3c/a\x3e om dit werkend te krijgen.",
    'Scale = 1 : ${scaleDenom}': "Schaal = 1 : ${scaleDenom}",
    'W': "W",
    'E': "O",
    'N': "N",
    'S': "Z",
    'reprojectDeprecated': "U gebruikt de optie \'reproject\' op de laag ${layerName}.\nDeze optie is vervallen: deze optie was ontwikkeld om gegevens over commerciële basiskaarten weer te geven, maar deze functionaliteit wordt nu bereikt door ondersteuning van Spherical Mercator.\nMeer informatie is beschikbaar op http://trac.openlayers.org/wiki/SphericalMercator.",
    'methodDeprecated': "Deze methode is verouderd en wordt verwijderd in versie 3.0.\nGebruik ${newMethod}."
});
OpenLayers.Lang.setCode('nl'); 


Proj4js.defs["EPSG:28992"] = "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.040,49.910,465.840,-0.40939,0.35971,-1.86849,4.0772";

Pdok.createBaseUri = function(){
    var pathname = window.location.pathname;
    var path = pathname;
    if (pathname.search(/\.html|\.php|.jsp/)>0){
        pathparts = pathname.substr(0,pathname.search(/\.html|\.php|.jsp/)).split('/');
        path = pathparts.slice(0, pathparts.length-1);
        path = path.join('/');
        path +='/';
    }
    base = window.location.protocol+'//'+window.location.host + path;
    return base;
}

// it is possible to override the markerdefinitions with a request paramater markersdef
if( OpenLayers.Util.getParameters()['markersdef'] != null){
    Pdok.markersdef = OpenLayers.Util.getParameters()['markersdef'];
}
else {
    // we use the markersdef from the api
    Pdok.markersdef = Pdok.ApiUrl+'/js/pdok-markers.js';
}
// inject a script include for the markersdef, being either an external or the api included one
document.write('<script type="text/javascript" src="'+Pdok.markersdef+'"></script>');

// it is possible to override the layerdefinitions with a request paramater layersdef
if( OpenLayers.Util.getParameters()['layersdef'] != null){
    Pdok.layersdef = OpenLayers.Util.getParameters()['layersdef'];
}
else {
    // we use the layersdef from the api
    Pdok.layersdef = Pdok.ApiUrl+'/js/pdok-layers.js';
}
// inject a script include for the layersdef, being either an external or the api included one
document.write('<script type="text/javascript" src="'+Pdok.layersdef+'"></script>');

Pdok.Api = function(config) {

    /**
     * Reference to the zoomlevel object
     */
    this.zoom = null;

	/**
     * Reference to the location object
     */
    this.loc = null;

    /**
     * Reference to the BBOX object
     */
    this.bbox = null;

    /**
     * Reference to layers
     */
    this.pdoklayers = null;

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
     * if a popup should be used or not
     */
    this.showPopup = true;

    /**
     * if a popup should be used or not
     */
    this.hoverPopup = false;

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
     * Reference to WMTS related properties
     */
    this.wmtsurl = null;
    this.wmtslayer = null;
    this.wmtsmatrixset = null;

    /**
     * Reference to WMS related properties
     */
    this.wmsurl = null;
    this.wmslayers = null;

    /**
     * Reference to TMS related properties
     */
    this.tmsurl = null;
    this.tmslayer = null;
    this.tmstype = 'png';

    /**
     * Reference to KML related property
     */
    this.kmlurl = null;
    this.kmlstyles = false; // default to NOT taking internal KML styling into account

    /**
     * Reference to layerswitch object
     */
    this.ls = false;
        
    /**
     * Reference to the OpenLayers LayerSwitcher object
     */
    this.showlayerswitcher = true;

    /**
     * Reference to the DIV-id the map should be rendered in.
     * Note that you have to set this one to have two maps in one page!
     */
    this.div = 'map';

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

    this.FEATURESLAYER_NAME = "Markers";
    // this.features can come as KML string from config/params
    // after handling this, it contains an array of features
    this.features = [];
    /**
     * Reference to featuresLayer (= layer where you draw feature on)
     */
    this.featuresLayer = null;
    /**
     * References to different drawing controls
     */
    this.drawFeaturePointControl = null;
    this.drawFeatureLineControl = null;
    this.drawFeaturePolygonControl = null;
    this.editFeatureControl = null;
	
    /**
     * References to select control for features in the featurelayer
     */
    this.selectControl = null;

    /**
     * Reference to locationLayer (= layer to be used by the locationtool)
     */
    this.locationLayer = null;
    /**
     * References to different drawing controls to be used by the locationtool
     */
    this.drawLocationPointControl = null;
    this.drawLocationLineControl = null;
    this.drawLocationPolygonControl = null;
    this.editLocationControl = null;
    /**
     * Locationtool defaults
     */
    this.locationtool = false;
    this.locationtoolstyle = 'mt0';
    this.locationtoolxfield = 'x';
    this.locationtoolyfield = 'y';
    this.locationtoolwktfield = 'wkt';
    this.locationtoolzmin = '0';
    this.locationtoolzmax = '30';

    this.markersdef = null;
    // an external markersdef is temporarily parked in Pdok.markersdef
    if (Pdok.markersdef) {
        this.markersdef = ''+Pdok.markersdef;
    }

    // an external layersdef is temporarily parked in Pdok.layersdef
    this.layersdef = null;
    if (Pdok.layersdef) {
        this.layersdef = ''+Pdok.layersdef;
    }

    this.defaultLayers = OpenLayers.Util.applyDefaults(
        this.defaultPdokLayers, this.defaultLayers);

    // create this.styles, based on either this.defaultStyles object, OR via a this.customStyles object (TODO)
    this.createStyles();

    if (config) {
        // hack to make x and y fields null
        // better fix would be to remove one of the three locationtool fields
        // so you have either ONE field (wkt) or TWO (x and y)
        if (config.locationtoolwktfield){
            config.locationtoolxfield = null;
            config.locationtoolyfield = null;
        }
        OpenLayers.Util.extend( this, config );
    }

    this.createOlMap();
}


Pdok.Api.prototype.defaultStyles=[];

Pdok.Api.prototype.defaultPdokLayers = {
        BRT: {
            layertype: 'WMTS',
            name: 'BRT Achtergrondkaart (WMTS)',
            url: 'http://geodata.nationaalgeoregister.nl/wmts/',
            layer: 'brtachtergrondkaart',
            style: null,
            matrixSet: 'EPSG:28992',
            visibility: true, 
            isBaseLayer: true,
            attribution: '(c) OSM & Kadaster'
        },
        CBS_GEMEENTEN: {
            layertype: 'WMS',
            name: 'CBS Gemeentegrenzen 2008 (WMS)',
            url: 'http://geodata.nationaalgeoregister.nl/bevolkingskernen2008/wms',
            layers: 'gemeentegrens_generalisatie_2008',
            transparent: 'true',
            format: 'image/png',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
        },
        CBS_PROVINCIES: {
            layertype: 'WMS',
            name: 'CBS Provinciegrenzen 2008 (WMS)',
            url: 'http://geodata.nationaalgeoregister.nl/bevolkingskernen2008/wms',
            layers: 'provgrens_generalisatie_2008',
            transparent: 'true',
            format: 'image/png',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
            }
    }

/**
 * @private
 *
 * Creates an OpenLayers Map object due to the given config.
 */
Pdok.Api.prototype.createOlMap = function() {
    var controls = []
    if (!this.showlayerswitcher){
    	controls = [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.Zoom(),
			new OpenLayers.Control.ScaleLine({bottomOutUnits:'',bottomInUnits:''})
        ]
    }
    else if (this.showlayerswitcher == true || this.showlayerswitcher.toLowerCase() == "true"){
    	controls = [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.Zoom(),
			new OpenLayers.Control.ScaleLine({bottomOutUnits:'',bottomInUnits:''}),
            new OpenLayers.Control.LayerSwitcher()
        ]
    }
    else
    {
    	controls = [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.Zoom(),
			new OpenLayers.Control.ScaleLine({bottomOutUnits:'',bottomInUnits:''})
        ]
    }
    var olMap = new OpenLayers.Map ({
        controls: controls,
        maxExtent: new OpenLayers.Bounds(-285401.92,22598.08,595401.9199999999,903401.9199999999),
        theme: null,
		resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76,
					26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21],
        units: 'm',
        projection: new OpenLayers.Projection("EPSG:28992"),
        div: this.div
    });
    this.map = olMap;
	
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

    // apply layer if a layer was given
    if (this.pdoklayers != null) {
        // if there is just one layer (without comma's), OL returns a String:
        if (typeof this.pdoklayers == 'string') {
            this.pdoklayers=this.pdoklayers.split(',');
        }
        this.addLayers(this.pdoklayers, olMap);
        // if the map does NOT have a baseLayer, always add BRT layer
        if (!olMap.baseLayer){
            //olMap.addLayer(this.createWMTSLayer( this.defaultLayers.BRT ));
            this.addLayers(['BRT']);
        }
    }
    else {
        // not layer param, at least load one default layer
        this.addLayers(['BRT'], olMap);
    }

    // apply WMSURL and WMSLAYERS if applicable
    if ((this.wmsurl != null) && (this.wmslayers != null)) {
        this.addWMS(this.wmsurl, this.wmslayers);
    }

    // apply WMTSURL and WMTSLAYER and WMTSMATRIXSET if applicable
    if ((this.wmtsurl != null) && (this.wmtslayer != null) && (this.wmtsmatrixset != null)) {
        this.addWMTS(this.wmtsurl, this.wmtslayer, this.wmtsmatrixset);
    }

    // apply TMSURL and TMSLAYERS if applicable
    if ((this.tmsurl != null) && (this.tmslayer != null)) {
        this.addTMS(this.tmsurl,this.tmslayer, this.tmstype);
    }

    // apply KMLURL if applicable
    if ((this.kmlurl != null)) {
        this.addKML(this.kmlurl, this.kmlstyles);
    }

    // apply TXTURL if applicable
    if (this.txturl != null) {
        this.addTxt(this.txturl);
    }

    // apply BBOX or zoomlevel and location
    if (this.bbox != null) {
        olMap.zoomToExtent(OpenLayers.Bounds.fromArray(this.bbox).transform(olMap.displayProjection, olMap.getProjectionObject()));
    }
    else if (this.zoom != null && this.loc != null) {
        if (typeof this.loc == 'string') {
            this.loc = this.loc.split(',');
        }
        olMap.setCenter (new OpenLayers.LonLat(parseInt(this.loc[0]), parseInt(this.loc[1])), parseInt(this.zoom));
    } else {
        //olMap.zoomToMaxExtent();
        olMap.zoomToExtent([-15000,300000,300000,640000],true);
    }

    // featuresLayer is used for all features/markers
    this.featuresLayer = new OpenLayers.Layer.Vector(this.FEATURESLAYER_NAME);
    olMap.addLayer(this.featuresLayer);

    // locationLayer holds features for 'kaarprikker/locationtool'
    this.locationLayer = new OpenLayers.Layer.Vector('locationtool', {
        name:'locations', displayInLayerSwitcher:false
    });
    olMap.addLayer(this.locationLayer);

    if (typeof this.features == 'object' || typeof this.features == 'string') {
        // meaning we received a features string (kml) from the outside
        // features string handled, this.features now used as feature array
        if (this.features.toString().length>0) {
            var kmlString = this.features.toString();
            this.features = [];
            this.addFeaturesFromString(kmlString, 'KML');
        }
    }

    // add marker and use markertype if given, otherwise the default marker
    // backward compatibility: mloc is alway point
    if (this.mloc != null) {
        var wkt = 'POINT('+this.mloc[0]+' '+this.mloc[1]+')';
        if (this.mt==null){
            this.mt='mt0'; // mt0 is default point symbol
        }
        this.features.push(this.createFeature(wkt, this.mt, this.titel, this.tekst));
    }


    // selectControl for popups
    this.selectControl = new OpenLayers.Control.SelectFeature(
            this.featuresLayer, 
            {
                hover:this.hoverPopup
                // implement some on magic to have a visible selection,
                // which we lost when we gave every feature a style
                /*
                onBeforeSelect:function(feature){
                    if(feature.style){
                        feature.style.strokeWidth+=2;
                        feature.style.graphicWidth+=5;
                        feature.style.graphicHeight+=5;
                    }
                },
                onUnselect:function(feature){
                    if(feature.style){
                        feature.style.strokeWidth-=2;
                        feature.style.graphicWidth-=5;
                        feature.style.graphicHeight-=5;
                    }
                }
                */
            });
    olMap.addControl(this.selectControl);
    if (this.showPopup){
        this.enablePopups();
        this.selectControl.activate();
    }

    this.featuresLayer.addFeatures(this.features);

    // enable Locationtool IF this.locationtool is set via config
    if (this.locationtool){
        var xorwkt = this.locationtoolwktfield;
        if(this.locationtoolyfield){
            yorwkt = this.locationtoolyfield;
        }
        this.enableLocationTool( this.locationtoolstyle,
            this.locationtoolzmin,
            this.locationtoolzmax,
            xorwkt,
            this.locationtoolyfield
            );
    }
    return olMap;
}

Pdok.Api.prototype.onPopupFeatureSelect = function(evt) {
    feature = evt.feature;
    var content = "";
    if (feature.attributes['name']!=null){
        content=feature.attributes['name'];
    }
    if (feature.attributes['description']!=null){
        content=content+"<br/>"+feature.attributes['description'];
    }
    if (!content || content.length==0)
    {
        content = '&nbsp;';
    }
    popup = new OpenLayers.Popup.FramedCloud("featurePopup",
                feature.geometry.getBounds().getCenterLonLat(),
                new OpenLayers.Size(100,100),
                content,
                null, true, function(evt) {
                    this.hide();
                    // deselect ALL features to be able to select this one again
                    popup.feature.layer.selectedFeatures=[];
                }
            );
    feature.popup = popup;
    popup.feature = feature;
    this.map.addPopup(popup, true);
}

Pdok.Api.prototype.onPopupFeatureUnselect = function(evt) {
    feature = evt.feature;
    if (feature.popup) {
        popup.feature = null;
        this.map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
}

Pdok.Api.prototype.disablePopups = function(){
        this.featuresLayer.events.un({
            'featureselected': this.onPopupFeatureSelect,
            'featureunselected': this.onPopupFeatureUnselect
        });
        return true;
}
Pdok.Api.prototype.enablePopups = function(){
        this.featuresLayer.events.on({
            'featureselected': this.onPopupFeatureSelect,
            'featureunselected': this.onPopupFeatureUnselect
        });
        return true;
}

/**
 * Returns the current map object of this instance.
 * @public
 */
Pdok.Api.prototype.getMapObject = function() {
	return this.map;
}


Pdok.Api.prototype.createFeature = function(wkt, typestyle, name, description){
    var wktFormat = new OpenLayers.Format.WKT();
    // OpenLayers.Util.getParameters() splits paramaters with comma's into an array
    // because a LINESTRING wkt contains comma we have to concat them back
    if (wkt instanceof Array) {
        wkt = wkt.join();
    }
    var feature = wktFormat.read(wkt);
    feature.attributes['name']=name;
    feature.attributes['description']=description;
    // only if we have this typestyle available
    if (this.styles[typestyle]){
        // TODO check if this style corresponds with the geometry type (eg for points only mt* etc)
        feature.style = this.styles[typestyle];
        feature.attributes['styletype']=typestyle;
    }
    else{
        if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.Point'){
            feature.style = this.styles['mt0'];
        }
        else if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.LineString'){
            feature.style = this.styles['lt0'];
        }
        else if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.Polygon'){
            feature.style = this.styles['pt0'];
        }
    }
    return feature;
}

Pdok.Api.prototype.createStyles = function(){

    var olDefault = OpenLayers.Feature.Vector.style['default'];

    this.styles = {};

    // create a default styles for point: mt0, line: lt0 and polygon pt0
    //.these HAVE to be here because there is code depending on the availability of those
    // you can off course override this
    var pdokDefaultPoint = OpenLayers.Util.applyDefaults(
        {
            id: 'mt0',
            name: 'Standaard marker',
            externalGraphic: Pdok.ApiUrl+"/markertypes/document-properties.png",
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        }, {});
    this.styles.mt0 = pdokDefaultPoint;
    var pdokDefaultLine = OpenLayers.Util.applyDefaults(
        {
            id: 'lt0', 
            strokeColor: '#273397', 
            strokeWidth: 5,
            strokeOpacity: 0.5, 
            name: 'Standaard lijn'
        }, {});
    this.styles.lt0 = pdokDefaultLine;
    var pdokDefaultPolygon = OpenLayers.Util.applyDefaults(
        {
            id: 'pt0', 
            fillColor: '#273397',
            fillOpacity: 0.3, 
            strokeColor: '#273397', 
            strokeWidth: 2, 
            name: 'Standaard vlak'
        }, {});
    this.styles.pt0 = pdokDefaultPolygon;

    var pdokDefaultStyle = OpenLayers.Util.applyDefaults(
    {
        externalGraphic: Pdok.ApiUrl+"/markertypes/default.png",
        graphicHeight: 37,
        graphicWidth: 32,
        graphicYOffset: -37,
        pointRadius: 1
    }, {});

    // if the the user added their own styles, they should create a variable 'defaultStyles'
    // hereby overriding the inbuild defaultStyles
    for (var i = 0; i<this.defaultStyles.length; i++){
        var style = this.defaultStyles[i];
        this.styles[style.id] = OpenLayers.Util.applyDefaults( style, pdokDefaultStyle);
    }
}

/**
 *
 * Parameters:
 * styletype - {String} styletype (eg 'mt1' or 'lt1' or 'pt1')
 *       based on the first char of the styletype, the type of feature
 *       is set: m = marker/point, l = linestring, p = polygon
 * featureAddedCallback - {Function{ handler function to be called after feature is added}
 */
Pdok.Api.prototype.enableDrawingTool = function(styletype, featureAddedCallback){
    //console.log('enableDrawingTool start');
    this.disableDrawingTool();  // to be sure we do not have two drawfeature controls active at once
    var apiStyles = this.styles;
    var apiFeaturesLayer = this.featuresLayer;
    var currentDrawControl;
    // default to mt0 if called without a styletype
    if (styletype == undefined) {
        styletype = 'mt0';
    }
    if (styletype[0]=='m'){
        if (this.drawFeaturePointControl==null){
            this.drawFeaturePointControl = new OpenLayers.Control.DrawFeature(this.featuresLayer, OpenLayers.Handler.Point);
            this.map.addControl(this.drawFeaturePointControl);
        }
        currentDrawControl = this.drawFeaturePointControl;
        //currentDrawControl.handler.style = apiStyles[styletype];
    }
    else if (styletype[0]=='l'){
        if (this.drawFeatureLineControl==null){
            this.drawFeatureLineControl = new OpenLayers.Control.DrawFeature(this.featuresLayer, OpenLayers.Handler.Path);
            this.map.addControl(this.drawFeatureLineControl);
        }
        currentDrawControl = this.drawFeatureLineControl;
        currentDrawControl.handler.style = apiStyles[styletype];
        currentDrawControl.handler.style.externalGraphic = null;
    }
    else if (styletype[0]=='p'){
        if (this.drawFeaturePolygonControl==null){
            this.drawFeaturePolygonControl = new OpenLayers.Control.DrawFeature(this.featuresLayer, OpenLayers.Handler.Polygon);
            this.map.addControl(this.drawFeaturePolygonControl);
        }
        currentDrawControl = this.drawFeaturePolygonControl;
        currentDrawControl.handler.style = apiStyles[styletype];
        currentDrawControl.handler.style.externalGraphic = null;
    }
    currentDrawControl.featureAdded = function(feature){
            feature.style = apiStyles[styletype];
            // also set an attribute 'styletype' to be able to export features with styletype
            feature.attributes['styletype'] = styletype;
            // we add a name attribute to be able to write to KML (the KML format uses that attribute as name)
            feature.attributes['name'] = '&nbsp;';  // we add &nbsp; here because null or '' will cause the KML writer to not see it as value
            apiFeaturesLayer.redraw();
            if (featureAddedCallback){
                featureAddedCallback(feature);
            }
    }
    currentDrawControl.activate();
    return true;
}

Pdok.Api.prototype.disableDrawingTool = function(){
    //console.log('disableDrawingTool');
    if (this.drawFeaturePointControl!=null){
        this.drawFeaturePointControl.deactivate();
    }
    if (this.drawFeatureLineControl!=null){
        this.drawFeatureLineControl.deactivate();
    }
    if (this.drawFeaturePolygonControl!=null){
        this.drawFeaturePolygonControl.deactivate();
    }
    return true;
}

Pdok.Api.prototype.disableEditingTool = function(){
    if (this.editFeatureControl) {
        this.editFeatureControl.deactivate();
    }
    return true;
}

Pdok.Api.prototype.enableEditingTool = function(featureModifiedFunction){
    if (this.editFeatureControl == null) {
        this.editFeatureControl = new OpenLayers.Control.ModifyFeature(this.featuresLayer);
        this.map.addControl(this.editFeatureControl);
        /*featureModifiedFunction = function(ft){
            console.log(ft)
        }
        featureBeforeModifiedFunction = function(ft){
            console.log(ft)
        }*/
        this.featuresLayer.events.on({
              //"beforefeaturemodified": featureBeforeModifiedFunction,
              "beforefeaturemodified": featureModifiedFunction,
              "featuremodified": featureModifiedFunction
        });
    }
    this.editFeatureControl.activate();
    return true;
}

Pdok.Api.prototype.setLocation = function(loc) {
    // if loc is a string like '150000,450000', split
    if( typeof(loc) == 'string'){
        loc = loc.split(',');
    }
    this.map.setCenter (new OpenLayers.LonLat(parseInt(loc[0]), parseInt(loc[1])));
    return true;
}

Pdok.Api.prototype.setZoomLevel = function(zl) {
    this.map.zoomTo (zl);
    return true;
}

Pdok.Api.prototype.reprojectWGS84toRD = function(lat,lon){
	pointRD = new OpenLayers.LonLat(lon,lat)
        .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from wgs84 
            new OpenLayers.Projection("EPSG:28992") // new RD
        );
	return(pointRD);
}

/**
 *  Generic api method to add an already constructed OpenLayers layer 
 *  to our map. 
 *  The use of this method guarantees you that locationLayer and featureLayer 
 *  are always on top
 * Can be used to add an external layer to the map.
 */
Pdok.Api.prototype.addOLLayer = function(openLayersLayer) {
    this.map.addLayer(openLayersLayer);
    this.moveVectorLayersToTop();
}

Pdok.Api.prototype.addTMS = function(tmsurl,tmslayer,tmstype) {
    if (tmstype == null){
        tmstype="png";
    }
    var lyrTMS = this.createTMSLayer({
            url: tmsurl,
            layername: tmslayer,
            type: tmstype
        });
    this.addOLLayer(lyrTMS);
    return true;
}

Pdok.Api.prototype.createTMSLayer = function(layerConfigObj) {

    // default TMS layer object to set defaults:
    // missing values in config object will be replaced by sensible defaults:
    var defaults = {
            name: 'tms layer',
            url: '',
            layertype: '',
            layername: '',
            type: 'png',
            visibility: true,
            isBaseLayer: false,
			attribution:''
    };

    layerConfigObj = OpenLayers.Util.applyDefaults(layerConfigObj, defaults);

    var layer = new OpenLayers.Layer.TMS(
        layerConfigObj.name,
        layerConfigObj.url,
        {   layername: layerConfigObj.layername, 
            type:layerConfigObj.type, 
            visibility: layerConfigObj.visibility, 
            isBaseLayer: layerConfigObj.isBaseLayer,
			attribution:layerConfigObj.attribution
        }
    );

    return layer;
}

Pdok.Api.prototype.addWMTS = function(wmtsurl, wmtslayer, wmtsmatrixset, wmtsstyle, wmtsmatrixids) {
    this.wmtsurl = wmtsurl;
    this.wmtslayer = wmtslayer;
    this.wmtsmatrixset = wmtsmatrixset;
    var lyrWMTS = this.createWMTSLayer({
            name: wmtslayer,
            url: wmtsurl,
            layer: wmtslayer,
            matrixSet: wmtsmatrixset,
            matrixIds: wmtsmatrixids,
            style: wmtsstyle
        });
    this.addOLLayer(lyrWMTS);
    return true;
}

Pdok.Api.prototype.createWMTSLayer = function(layerConfigObj) {
    // From WMTS openlayers example:
    // If tile matrix identifiers differ from zoom levels (0, 1, 2, ...)
    // then they must be explicitly provided.
    var matrixIds = new Array(26);
    for (var i=0; i<26; ++i) {
        matrixIds[i] = layerConfigObj.matrixSet+':' + i;
    }

    // default WMTS layer object to set defaults:
    // missing values in config object will be replaced by sensible defaults:
    var defaults = {
            name: 'wmts layer',
            url: '',
            layer: '',
            style: 'default',
            matrixSet: '',
            matrixIds: matrixIds,
            visibility: true,
            isBaseLayer: false,
            format: 'image/png8',
            attribution:''
    };

    layerConfigObj = OpenLayers.Util.applyDefaults(layerConfigObj, defaults);

     /* var wmts = new OpenLayers.Layer.WMTS({
     *     name: "My WMTS Layer",
     *     url: "http://example.com/wmts",·
     *     layer: "layer_id",
     *     style: "default",
     *     matrixSet: "matrix_id"
     * });
     */
    var layer = new OpenLayers.Layer.WMTS(
        {
            name: layerConfigObj.name,
            url:layerConfigObj.url,
            layer: layerConfigObj.layer,
            style: layerConfigObj.style,
            matrixSet: layerConfigObj.matrixSet,
            matrixIds: layerConfigObj.matrixIds,
            format: layerConfigObj.format,
            visibility: layerConfigObj.visibility,
            isBaseLayer: layerConfigObj.isBaseLayer,
            attribution: layerConfigObj.attribution
        }
    );
    return layer;
}

/**
 * Api Interface
 *
 */
Pdok.Api.prototype.addWMS = function(wmsurl,wmslayers) {
    this.wmsurl = wmsurl;
    this.wmslayers = wmslayers;
    var lyrWMS = this.createWMSLayer({
            url: wmsurl,
            layers: wmslayers,
            transparent: true
        });
    this.addOLLayer(lyrWMS);
    return true;
}

/**
 * Internal Interface
 *
 */
Pdok.Api.prototype.createWMSLayer = function(layerConfigObj) {

    // default WMS layer object to set defaults:
    // missing values in config object will be replaced by sensible defaults:
    var defaults = {
            name: 'WMS layer',
            url: '',
            layers: '',
            styles: '',
            visibility: true,
            isBaseLayer: false,
            format: 'image/png',
            singleTile: true,
			attribution:''
    };

    layerConfigObj = OpenLayers.Util.applyDefaults(layerConfigObj, defaults);

    var layer = new OpenLayers.Layer.WMS(
            layerConfigObj.name,
            layerConfigObj.url,
            {
                layers: layerConfigObj.layers, 
                transparent: layerConfigObj.transparent, 
                format: layerConfigObj.format
            },
            {
                visibility: layerConfigObj.visibility, 
                isBaseLayer: layerConfigObj.isBaseLayer, 
                singleTile: layerConfigObj.singleTile,
				attribution:layerConfigObj.attribution 
            }
    );

    return layer;
}

/**
 * Api Interface
 * 
 * addLayers to the map, based on their layerkey-names 
 * see Pdok.api.defaultLayers object
 */
Pdok.Api.prototype.addLayers = function(arrLayerNames, map){

    if (arrLayerNames==null){
        alert('null object as layernames');
        return;
    }
    else if (arrLayerNames == '-') {
        // this is the 'header' of the selectbox: "choose ..."
        return;
    }

    if (map == undefined){
        map = this.map;
    }
    for (l in arrLayerNames)
    {
        var layerId = arrLayerNames[l];
        if (this.defaultLayers[layerId]){
            var lyr;
            if (this.defaultLayers[layerId].layertype.toUpperCase()=='WMS'){
                lyr = this.createWMSLayer( this.defaultLayers[layerId]);
            }
            else if (this.defaultLayers[layerId].layertype.toUpperCase()=='WMTS'){
                lyr = this.createWMTSLayer( this.defaultLayers[layerId]);
            }
            else if (this.defaultLayers[layerId].layertype.toUpperCase()=='TMS'){
                lyr = this.createTMSLayer( this.defaultLayers[layerId]);
            }
            else {
                alert('layertype not available (wrong config?): ' + this.defaultLayers.l.layertype);
            }
            if (lyr){
                lyr.pdokId = layerId;
                map.addLayer(lyr);
            }
        }
        else{
            alert('layerid not available: ' + layerId);
        }
    }
    // to be sure featuresLayer and locationLayer are always on top
    this.moveVectorLayersToTop();
    return true;
}


Pdok.Api.prototype.moveVectorLayersToTop = function(){
    // TODO ??take all vector layers into account??
    if(this.featuresLayer) {
        this.map.setLayerIndex(this.featuresLayer, this.map.layers.length-1);
    }
    if(this.locationLayer) {
        this.map.setLayerIndex(this.locationLayer, this.map.layers.length);
    }
}


Pdok.Api.prototype.disableLocationTool = function(){

    if (this.drawLocationPointControl!=null){
        this.drawLocationPointControl.deactivate();
    }
    if (this.drawLocationLineControl!=null){
        this.drawLocationLineControl.deactivate();
    }
    if (this.drawLocationPolygonControl!=null){
        this.drawLocationPolygonControl.deactivate();
    }
    return true;
}

/**
 * Api method to set the api location properties, detached from starting of the
 * locationtool to be able to only configure the tool within a wizard
 *
 */

Pdok.Api.prototype.setLocationToolProps = function(styletype, zmin, zmax, xorwkt, y){

    //console.log('setting locationtoolprops: '+styletype+' '+zmin+' '+ zmax+' '+ xorwkt+' '+y);
    this.locationtool = true;
    if (styletype){
        this.locationtoolstyle = styletype;
    }
    // if y is defined, this function is called with an x and y field
    if(y) {
        this.locationtoolxfield = xorwkt;
        this.locationtoolyfield = y;
        this.locationtoolwktfield = null; // NO wkt
    }
    else if(xorwkt) {
        // apparently only a wkt field
        this.locationtoolxfield = null;
        this.locationtoolyfield = null;
        this.locationtoolwktfield = xorwkt;
    }
    else {
        // default to x y field from api defaults
        this.locationtoolwktfield = null; // NO wkt
    }
    // be carefull not to use if(zmin) or if(zmax), they can be 0 (which solves to false)
    if(zmin != undefined){
        this.locationtoolzmin = zmin;
    }
    if(zmax != undefined){
        this.locationtoolzmax = zmax;
    }
    return true;
}


/**
 * Api method to UNset the locationtool, and set the api location properties to default values
 * this is necceary to be able to create code and a map link with or without the locationtool-props
 *
 */
Pdok.Api.prototype.removeLocationToolProps = function(){
    //console.log('remove locationtoolprops');
    // back to defaults
    this.locationtool = false;
    this.locationtoolstyle = 'mt0';
    this.locationtoolxfield = 'x';
    this.locationtoolyfield = 'y';
    this.locationtoolwktfield = 'wkt';
    this.locationtoolzmin = '0';
    this.locationtoolzmax = '30';
    return true;
}

Pdok.Api.prototype.enableLocationTool = function(){
    var apiObject = this;

    var alerted = false;
    var locationToolCheck = function() {
        if (apiObject.locationLayer.features.length > 0) {
            // stop all locationtool controls
            if (confirm('Er is al een geldige lokatie. \nKlik OK om verder te gaan,\nof Annuleren/Cancel om opnieuw te klikken.')) {
                apiObject.map.events.unregister("moveend", apiObject.map, locationToolCheck);
                apiObject.map.events.unregister("click", apiObject.map, locationToolCheck);
                apiObject.disableLocationTool();
            }
            else {
                apiObject.locationLayer.removeAllFeatures();
                apiObject.startLocationTool();
            }
            return false;
        }
        else if (apiObject.map.getZoom() >= apiObject.locationtoolzmin && apiObject.map.getZoom() <= apiObject.locationtoolzmax) {
            if(!apiObject.locationtoolstyle){
                apiObject.locationtoolstyle = 'mt0';
            }
            apiObject.startLocationTool();
        } else {
            var msg = "U kunt alleen tekenen tussen de zoomnivo's: "+apiObject.locationtoolzmin+" en "+apiObject.locationtoolzmax+". \nU zit nu op zoomnivo: "+apiObject.map.getZoom();
            var zoom;
            if (apiObject.map.getZoom() < apiObject.locationtoolzmin){
                msg += "\nKlik op OK om "+(apiObject.locationtoolzmin-apiObject.map.getZoom())+" zoomnivo's in te zoomen \n(of Annuleren/Cancel om het zelf te doen)";
                zoom = apiObject.locationtoolzmin;
            }
            else{
                msg += "\nKlik op OK om "+(apiObject.map.getZoom()-apiObject.locationtoolzmax)+" zoomnivo's uit te zoomen \n(of Annuleren/Cancel om het zelf te doen)";
                zoom = apiObject.locationtoolzmax;

            }
            if (!alerted){
                //alerted = true;
                if(confirm(msg)){
                    apiObject.map.zoomTo(zoom);
                }
                else{
                    apiObject.disableLocationTool();
                }
            }
        }
    }
    // register above check function to listen to moveend en click events of the map
    this.map.events.register("moveend", this.map, locationToolCheck);
    this.map.events.register("click", this.map, locationToolCheck);
    // first check
    locationToolCheck();
    return true;
}


Pdok.Api.prototype.startLocationTool = function(){
    this.disableLocationTool();  // to be sure we do not have two drawfeature controls active at once

    // selectControl and popups interfere with editing tools: disable all
    this.selectControl.deactivate();
    this.disablePopups();

    // create controls
    var currentDrawControl;
    if (this.locationtoolstyle == undefined) {
        this.locationtoolstyle = 'mt0';
    }
    if (this.locationtoolstyle[0]=='m'){
        if (this.drawLocationPointControl==null){
            this.drawLocationPointControl = new OpenLayers.Control.DrawFeature(this.locationLayer, OpenLayers.Handler.Point);
            this.map.addControl(this.drawLocationPointControl);
        }
        currentDrawControl = this.drawLocationPointControl;
        //currentDrawControl.handler.style = this.styles[this.locationtoolstyle];
    }
    else if (this.locationtoolstyle[0]=='l'){
        if (this.drawLocationLineControl==null){
            this.drawLocationLineControl = new OpenLayers.Control.DrawFeature(this.locationLayer, OpenLayers.Handler.Path);
            this.map.addControl(this.drawLocationLineControl);
        }
        currentDrawControl = this.drawLocationLineControl;
        currentDrawControl.handler.style = this.styles[this.locationtoolstyle];
        currentDrawControl.handler.style.externalGraphic = null;
    }
    else if (this.locationtoolstyle[0]=='p'){
        if (this.drawLocationPolygonControl==null){
            this.drawLocationPolygonControl = new OpenLayers.Control.DrawFeature(this.locationLayer, OpenLayers.Handler.Polygon);
            this.map.addControl(this.drawLocationPolygonControl);
        }
        currentDrawControl = this.drawLocationPolygonControl;
        currentDrawControl.handler.style = this.styles[this.locationtoolstyle];
        currentDrawControl.handler.style.externalGraphic = null;
    }

    var apiObject = this;
    var locationtoolfeatureadded = function(feature) {
        // sometimes we receive an event object (with a feature)
        if(feature.feature){
            feature = feature.feature;
        }
        feature.style = apiObject.styles[apiObject.locationtoolstyle];
        feature.layer.redraw();
        // also set an attribute 'styletype' to be able to export features with styletype
        feature.attributes['styletype'] = apiObject.locationtoolstyle;

        var wktFormat = new OpenLayers.Format.WKT();

        if (apiObject.locationtoolxfield && apiObject.locationtoolyfield) {
            apiObject[apiObject.locationtoolxfield] = feature.geometry.x;
            apiObject[apiObject.locationtoolyfield] = feature.geometry.y;
            // only for points
            if (feature.geometry.x && feature.geometry.y){
                if (document.getElementById(apiObject.locationtoolxfield) && document.getElementById(apiObject.locationtoolyfield)) {
                    document.getElementById(apiObject.locationtoolxfield).value = feature.geometry.x
                    document.getElementById(apiObject.locationtoolyfield).value = feature.geometry.y
                }
            }
        }
        if (apiObject.locationtoolwktfield) {
            apiObject[apiObject.locationtoolwktfield] = wktFormat.write(feature);
            if (document.getElementById(apiObject.locationtoolwktfield)){
                document.getElementById(apiObject.locationtoolwktfield).value = wktFormat.write(feature);
            }
        }
        currentDrawControl.deactivate();
    }

    currentDrawControl.featureAdded = locationtoolfeatureadded;
    currentDrawControl.activate();

    return true;
}


Pdok.Api.prototype.handleGetFeaturesResponse = function(response){
    //  trying to catch proxy errors
    if (response.status == 502 || response.status == 403){
        alert('Fout bij het ophalen van de url.\nDit lijkt een proxy probleem.\nKomt de data van een ander domein dan de web applicatie?\nDan moet het data domein opgenomen worden in de proxy-instellingen.');
        return
    }
    else if (response.status != 200){
        alert('Fout bij het ophalen van de url');
        return
    }
    var data = response.responseText;
    // we have data now: add to map
    api.addFeaturesFromString(data, this.dataType, this.zoomToFeatures);
}

Pdok.Api.prototype.addFeaturesFromString = function(data, type, zoomToFeatures){
    var format;
    var features;
    var options = {
        externalProjection: new OpenLayers.Projection("EPSG:4326"),
        internalProjection: this.map.baseLayer.projection,
        extractStyles: this.kmlstyles
    };
    if (type.toUpperCase() == 'KML') {
        format = new OpenLayers.Format.KML(options);
        if (data.search(/\n/) > -1 && data.search(/\n/) < data.length){
        	//alert("Er zijn returns gevonden in de KML, deze zijn vervangen door een spatie.")
        	//features = format.read(data.replace(/\n/g," ").slice(0,data.replace(/\n/g," ").lastIndexOf(" ")) +"\n");
        	features = format.read(data.replace(/\n/g," ") +"\n");
        }
        else{
	        features = format.read(data);
	    }
    }
    else if(type.toUpperCase() == "TXT"){
        // TXT files will default to epsg:28992 / RD coordinates
        options = {
            externalProjection: new OpenLayers.Projection("EPSG:28992"),
            internalProjection: this.map.baseLayer.projection
        };
        format = new OpenLayers.Format.Text(options);
        format.defaultStyle.externalGraphic = null;
        features = format.read(data);
        // default OpenLayers.Text format uses 'title' as 'name' attribute
        // we add a 'name' attribute here
        for (f in features){
            var feature = features[f];
            feature.attributes['name'] = feature.attributes['title'];
        }
    }
    else{
        alert('addFeaturesFromUrl aanroep met een niet ondersteund type: '+type);
        return;
    }
    // add styling to features
    for (f in features){
        var feature = features[f];
        //console.log(feature);
        if (feature.attributes['styletype']) {
            var styletype = feature.attributes['styletype'];
            // some formats (KML) return attr as objects instead of strings
            if (typeof styletype == 'object') {
                styletype = styletype.value;
            }
            feature.style = this.styles[styletype];
        }
        else if (type=='KML' && this.kmlstyles){
            // ok a KML layer containing styles
        }
        else if (type=='TXT' && feature.style.externalGraphic != undefined) {
            //console.log('TXT feature WITH style:', feature.style);
            // this is a TXT feature with some style information
            // this is possible via the txturl paramater
            // in combination with OpenLayers.Format.Txt
        }
        else {
            //console.log("feature WITHOUT style, adding some");
            if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.Point'){
                feature.style = this.styles['mt0'];
            }
            else if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.LineString'){
                feature.style = this.styles['lt0'];
            }
            else if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.Polygon'){
                feature.style = this.styles['pt0'];
            }
        }
    }
    if (features.length==0) {
        // mmm, no featues
        alert('Geen features aangemaakt. Is het formaat wel ok?\nU had gekozen voor het formaat: "'+type+'".\nRaadpleeg eventueel de help pagina\'s voor de juiste formaten.');
        return true;
    }
    this.featuresLayer.addFeatures(features);
    if (zoomToFeatures && this.featuresLayer.features.length>0) {
        // zoom to dataextent
        var totalFeaturesExtent = this.featuresLayer.getDataExtent();
        this.featuresLayer.map.zoomToExtent(totalFeaturesExtent);
    }
    return true;
}

/**
 *  Deleting layers, visible baseLayer and both internal vector layers
 *  featureLayer and LocationsLayer will never be deleted
 */
Pdok.Api.prototype.deleteLayers = function(nonVectorLayers, vectorLayers) {
    // defaulting to always the nonVectorLayers and NOT the vectorLayer
    nonVectorLayers?nonVectorLayers:nonVectorLayers=true;
    vectorLayers?vectorLayers:vectorLayers=false;
    for (var i = this.map.layers.length-1; i>=0; i--) {
        var layer = this.map.layers[i];
        if (layer.isBaseLayer && layer.visibility == true) {
            // current visible baselayer: do NOT remove
        }
        else if (layer != this.featuresLayer && layer != this.locationLayer){
            if (layer.CLASS_NAME == 'OpenLayers.Layer.Vector' 
                    && vectorLayers) {
                this.map.removeLayer(layer);
            }
            else if(nonVectorLayers) {
                this.map.removeLayer(layer);
            }
        }
    }
}

Pdok.Api.prototype.addFeaturesFromUrl = function(url, type, zoomToFeatures){

    var apiObject = this;
    var context = {};
    // little dirty way to pass type and zoomToFeatures:
    context.dataType = type;
    context.zoomToFeatures = zoomToFeatures;

    if (type.toUpperCase() == "KML"){
        // kml
        this.kmlurl = url;
    }
    else if(type.toUpperCase() == "TXT"){
        // tab separated txt file (in EPSG:28992)
        // format (including header!)
        //
        // point    title   description
        // 150000,350000  foo omschrijving foo
        //
        // OR
        //
        // lat  lon title   description
        // 150000   350000    foo omschrijving foo
        this.txturl = url;
    }
    else{
        alert('addFeaturesFromUrl aanroep met een niet ondersteund type: '+type);
        return;
    }
    OpenLayers.Request.GET({
            url: url,
            callback: apiObject.handleGetFeaturesResponse,
            scope: context
    });

    return true;
}

Pdok.Api.prototype.addKML = function(url){
    this.addFeaturesFromUrl(url, 'KML', true);
}

//Wellicht moet dit een andere call worden omdat nu een combinatie van txturl en mloc niet goed gaat
Pdok.Api.prototype.addTxt = function(url){
    this.addFeaturesFromUrl(url, 'TXT', true);
}

Pdok.Api.prototype.createIframeTags = function(){
    // map div size
    var mapSize = this.map.getSize();
    var iframeTags = '<iframe width="'+mapSize.w+'" height="'+mapSize.h+'" frameborder="0" scrolling=no marginheight="0" marginwidth="0" src="'+this.createMapLink()+'" title="PDOK Kaart"></iframe>';
    return iframeTags;
}

Pdok.Api.prototype.createObjectTags = function(){
    // map div size
    var mapSize = this.map.getSize();
    var objectTags = '<object width="'+mapSize.w+'" height="'+mapSize.h+'" codetype="text/html" data="'+this.createMapLink()+'" title="PDOK Kaart"></object>';
    return objectTags;
}

Pdok.Api.prototype.createMapLink = function(){
	pathname = window.location.pathname;
    if (pathname.toLowerCase().search("index.html") > -1){
    	pathname = window.location.pathname.substr(0,window.location.pathname.toLowerCase().search("index.html"));
    }
    base = window.location.host + pathname;
    return 'http://'+base+'api/api.html?'+OpenLayers.Util.getParameterString(this.getConfig());
}

Pdok.Api.prototype.createMailLink = function(){
	pathname = window.location.pathname;
    if (pathname.toLowerCase().search("index.html") > -1){
    	pathname = window.location.pathname.substr(0,window.location.pathname.toLowerCase().search("index.html"));
    }
    base = window.location.host + pathname;
    return 'mailto:UwMailAdres@provider.nl?Subject=PDOKKaart%20URL&BODY=URL%3A%20' + encodeURIComponent('http://'+base+'api/api.html?'+OpenLayers.Util.getParameterString(this.getConfig()));
}

Pdok.Api.prototype.createHtmlBody = function(){
    var html = '<div id="map"></div>\n'+
               '<script>var  api = createPDOKKaart();\n'+
               '</script>';
    return html;
}

Pdok.Api.prototype.createHtmlHead = function(){
    var base = Pdok.createBaseUri();
    // styles and layers definitions
    var stylesAndLayers = '';
    if (this.markersdef) {
        stylesAndLayers += '\n<script src="'+this.markersdef+'"></script>';
    }
    if (this.layersdef) {
        stylesAndLayers += '\n<script src="'+this.layersdef+'"></script>';
    }
    var head = '<script src="'+base+'api/js/OpenLayers.js"></script>'+
    '\n<script src="'+base+'api/js/proj4js-compressed.js"></script>'+
    '\n<script src="'+base+'api/js/pdok-api.js"></script>'+
    stylesAndLayers +
    '\n<link rel="stylesheet" href="'+base+'api/styles/default/style.css" type="text/css">'+
    '\n<link rel="stylesheet" href="'+base+'api/styles/api.css" type="text/css">'+
    '\n<script>'+
    '\nOpenLayers.ImgPath="'+Pdok.ApiUrl+'/img/";'+
    '\nvar config = '+this.serialize(this.getConfig(), true)+';\n'+
    '\nfunction createPDOKKaart() {var api = new Pdok.Api(config);return api;}\n</script>';
    return head;
}

Pdok.Api.prototype.getConfig = function() {
    var config = {};

    // zoom
    config.zoom = this.map.getZoom();
    // only add the LayerSwitcher parameter if false (default value is true)
    if (!this.showlayerswitcher){
	    config.showlayerswitcher = this.showlayerswitcher;
	}
    // bbox
    // config.bbox = this.map.getExtent().toArray();
    // or better ? loc
    config.loc = this.map.getCenter().toShortString();
    // layers
    var layers = [];
    for (layer in this.map.layers){
        var pdokId = this.map.layers[layer].pdokId;
        // only layers with a pdokId, and NOT our this.featuresLayer
        if (pdokId && this.map.layers[layer].name != this.FEATURESLAYER_NAME){
            layers.push(pdokId);
        }
        else{
            // we have a layer from 'outside'
        }
    }
    if (layers.length>0) {
        config.pdoklayers = [layers.join()];
    }
    // wmsurl AND wmslayers
    if(this.wmsurl && this.wmsurl.length>0 && this.wmslayers && this.wmslayers.length>0) {
        config.wmsurl = this.wmsurl;
        config.wmslayers = this.wmslayers;
    }
    // wmts
    if (this.wmtsurl != null && this.wmtslayer != null && this.wmtsmatrixset != null && 
        this.wmtsurl.length>0 && this.wmtslayer.length>0 && this.wmtsmatrixset.length>0) {
        config.wmtsurl = this.wmtsurl;
        config.wmtslayer = this.wmtslayer;
        config.wmtsmatrixset = this.wmtsmatrixset;
    }
    // locationtool
    if(this.locationtool) {
        config.locationtool = true;
        config.locationtoolstyle = this.locationtoolstyle;
        if (this.locationtoolwktfield) {
            config.locationtoolwktfield = this.locationtoolwktfield;
        }
        else {
            config.locationtoolxfield = this.locationtoolxfield;
            config.locationtoolyfield = this.locationtoolyfield;
        }
        config.locationtoolzmin = this.locationtoolzmin;
        config.locationtoolzmax = this.locationtoolzmax;
    }
    // markersdef
    if(this.markersdef) {
        config.markersdef = this.markersdef;
    }
    // layersdef
    if(this.layersdef) {
        config.layersdef = this.layersdef;
    }
    // kmlurl OR txturl OR features
    // at this moment NOT a combination of these two
    // all features from KML or TXT are added to 'featureslayer'
    // so if the user added even more markers/features
    // we should try to make a diff, to know which features to add in the features-kmlstring-parameter
    // but if the user has made changes by hand in wizard, it is getting even more comples
    // so for now: there is either a kmlurl and/or a txturl OR only features as parameter
    if (this.featuresLayer.features.length>0) {
        var doFeatures = true;
        if (this.kmlurl) {
            config.kmlurl = this.kmlurl;
            doFeatures = false;
        }
        if (this.txturl) {
            config.txturl = this.txturl;
            doFeatures = false;
        }
        if (doFeatures) {
            var kmlformat = new OpenLayers.Format.KML({
                foldersDesc: null,
                foldersName: null,
                placemarksDesc: '&nbsp;',   // we add &nbsp; here because null or '' will cause the KML writer to not see it as value
                internalProjection: this.map.baseLayer.projection,
                externalProjection: new OpenLayers.Projection("EPSG:4326")
            });
            config.features=kmlformat.write(this.featuresLayer.features);
        }
    }
    return config;
}

Pdok.Api.prototype.serialize = function(obj, stringQuotes){
  var returnVal;
  if(stringQuotes){}else{stringQuotes = false;}
  if(obj != undefined){
  switch(obj.constructor)
  {
   case Array:
    //var vArr="[";
    var vArr="'";
    for(var i=0;i<obj.length;i++)
    {
     if(i>0) vArr += ",";
     vArr += this.serialize(obj[i]);
    }
    //vArr += "]"
    vArr += "'"
    return vArr;
   case String:
    returnVal = obj;
    if (stringQuotes){
        //returnVal = escape("'" + obj + "'");
        returnVal = "'" + obj + "'";
    }
    return returnVal;
   case Number:
    returnVal = isFinite(obj) ? obj.toString() : null;
    return returnVal;    
   case Date:
    returnVal = "#" + obj + "#";
    return returnVal;  
   default:
    if(typeof obj == "object"){
     var vobj=[];
     for(attr in obj)
     {
      if(typeof obj[attr] != "function")
      {
       vobj.push('\n"' + attr + '":' + this.serialize(obj[attr], stringQuotes));
      }
     }
      if(vobj.length >0)
       return "{" + vobj.join(",") + "\n}";
      else
       return "{}";
    }  
    else
    {
     return obj.toString();
    }
  }
  }
  return null;
}

//Function to toggle visibility of the OpenLayers.LayerSwitcher
Pdok.Api.prototype.setLayerSwitcherVisible = function(isVisible){
    if (isVisible){
        this.showlayerswitcher = true;
    }
    else{
        this.showlayerswitcher = false;
    }
}
