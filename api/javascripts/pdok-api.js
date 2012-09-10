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
 *    src="/api/api.html?mloc=136260,456394&loc=136260,456394&zl=8"
 *    style="border: 0">
 * OR
 *  <iframe width="400" height="300" frameborder="0" 
 *    scrolling="no" marginheight="0" marginwidth="0" 
 *    src="/api/api.html?mloc=136260,456394&mt=1&bbox=130000,450000,150000,470000"
 *    style="border: 0">
 */

OpenLayers.Feature.Vector.style.default.strokeColor = 'red';
OpenLayers.Feature.Vector.style.default.fillColor = 'red';
OpenLayers.Feature.Vector.style.default.pointRadius = 5;
OpenLayers.Feature.Vector.style.default.fillOpacity = 0.8;

OpenLayers.ImgPath = 'img/';

Proj4js.defs["EPSG:28992"] = "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.040,49.910,465.840,-0.40939,0.35971,-1.86849,4.0772";

Pdok = {};

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
    this.layers = null;

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
    this.tmstype = 'png';

    /**
     * Reference to layerswitch object
     */
    this.ls = false;

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

    /**
     * References to different drawing controls
     */
    this.drawFeaturePointControl = null;
    this.drawFeatureLineControl = null;
    this.drawFeaturePolygonControl = null;
    this.editFeatureControl = null;
	
    /**
     * References to select controls
     */
    this.selectControl = null;

    /**
     * Locationtool defaults
     */
    this.locationtool = false;
    this.locationtoolstyle = 'mt0';
    this.locationtoolxfield = 'x';
    this.locationtoolyfield = null;
    this.locationtoolwktfield = 'wkt';
    this.locationtoolzmin = '0';
    this.locationtoolzmax = '30';

    this.FEATERSLAYER_NAME = "Features";
    this.MAXNUMBEROFFEATURES = 5;
    /**
     * Reference to featuresLayer (= layer where you draw feature on)
     */
    this.featuresLayer = null;
    // this.features can come as KML string from config/params
    // after handling this, it contains an array of features
    this.features = [];


    /**
     * @private
     * The attribution added to the map
     */
    // TODO moet dit?
    this.attribution = '&copy; <a target="_parent" href="http://www.terrestris.de">terrestris GmbH & Co. KG</a>,</br>' +
        'Data by <a target="_parent" href="http://www.openstreetmap.org">OpenStreetMap</a> and contributors, <a target="_parent" href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

    // create this.styles, based on either this.defaultStyles object, OR via a this.customStyles object (TODO)
    this.createStyles();

    if (config) {
        OpenLayers.Util.extend( this, config );
    }
    this.createOlMap();


}


Pdok.Api.prototype.defaultStyles=[
        // all point marker styles will use mt0 as default
        // so you only have to define the props that are different from mt0
        // we will use OpenLayers.Util.applyDefault to use this one as default
        {
            id: 'mt0',
            name: 'Standaard marker',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/star-3.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt1',
            name: 'Informatie blauw',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/information_blue.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt2',
            name: 'Informatie groen',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/information_green.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt3',
            name: 'Informatie geel',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/information_yellow.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt4',
            name: 'Geonovum blauw',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/geonovum_blue.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt5',
            name: 'Geonovum groen',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/geonovum_green.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt6',
            name: 'Geonovum geel',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/geonovum_yellow.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt7',
            name: 'Rijks blauw',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/rijk_blue.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt8',
            name: 'Rijks groen',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/rijk_green.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt9',
            name: 'Rijks geel',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/rijk_yellow.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt10',
            name: 'Kadaster blauw',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/kadaster_blue.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt11',
            name: 'Kadaster groen',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/kadaster_green.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt12',
            name: 'Kadaster geel',
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/kadaster_yellow.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt13',
            name: 'Werkzaamheden',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictograms-road_signs-workman_ahead_roadsign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt14',
            name: 'Waarschuwing',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictogram-din-w000-general.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt15',
            name: 'Zeer licht ontvlambaar',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictogram-din-w001-flame.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt16',
            name: 'Explosief',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictogram-din-w002-rxplosion.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt17',
            name: 'Electriciteit',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictogram-din-w008-electricisty.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt18',
            name: 'Lage temperatuur',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictogram-din-w017-low_temerature.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt19',
            name: 'Wielrijders niet toegestaan',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictograms-road_signs-no_bicycles_roadsign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt20',
            name: 'Personenwagens niet toegestaan',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictograms-road_signs-no_cars_sign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt21',
            name: 'Verboden in te rijden',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictograms-road_signs-no_entry.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt22',
            name: 'Personen niet toegestaan',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictograms-road_signs-no_entry_sign_with_a_man.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt23',
            name: 'Opgelet',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictograms-road_signs-other_dangers_sign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt24',
            name: 'Verboden voor alle verkeer',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictograms-road_signs-simple_round_sign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt25',
            name: 'Stop',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictograms-road_signs-stop_sign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt26',
            name: 'Verkeerslichten',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictograms-road_signs-traffic_lights_ahead_sign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt27',
            name: 'Verplichte rijrichting',
            externalGraphic: 'http://www.duif.net/pdok/api/markertypes/pictographs-ahead_only.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32

        },
        {
            id: 'pt0', 
            fillColor: '#273397',
            fillOpacity: 0.3, 
            strokeColor: '#273397', 
            strokeWidth: 2, 
            name: 'default vlak'
        },
        {
            id:'pt1', 
            fillColor:'red', 
            strokeColor:'black', 
            strokeWidth:1, 
            name:'rood zwart'
        },
        {
            id:'pt2', 
            fillColor:'red', 
            strokeColor:'black', 
            strokeWidth:3, 
            name:'rood zwart 3 pxiel lijn'
        },
        {
            id:'pt3', 
            fillColor:'red', 
            fillOpacity:1, 
            strokeColor:'black', 
            strokeWidth:5, 
            strokeOpacity:0.5, 
            name:'rood, zwart, 5px transp. lijn'
        },
        {
            id:'pt4', 
            fillColor:'green', 
            strokeColor:'blue', 
            strokeWidth:1, 
            name:'groen blauw'
        },
        {
            id:'pt5', 
            fillColor:'green', 
            strokeColor:'blue', 
            strokeWidth:3, 
            fillOpacity:0.5, 
            name:'groen transparante vulling blauwe lijn'
        },
        {
            id:'pt6', 
            fillColor:'#ffff00', 
            strokeColor:'blue', 
            strokeWidth:5, 
            fillOpacity:1, 
            name:'geel blauw'
        },
        {
            id: 'lt0', 
            strokeColor: '#273397', 
            strokeWidth: 5,
            strokeOpacity: 0.5, 
            name: 'default lijn'
        },
        {
            id:'lt1', 
            strokeColor:'red', 
            strokeWidth:1, 
            name:'lijn 2'
        },
        {
            id:'lt2', 
            strokeColor:'red', 
            strokeWidth:3, 
            name:'lijn x'
        },
        {
            id:'lt3', 
            strokeColor:'red', 
            strokeWidth:5, 
            strokeOpacity:0.5, 
            name:'lijn 27' 
        },
        {
            id:'lt4', 
            strokeColor:'green', 
            strokeWidth:1, 
            name:'lijn6' 
        },
        {
            id:'lt5', 
            strokeColor:'green', 
            strokeWidth:3, 
            strokeOpacity:0.5, 
            name:'lijn 4' 
        },
        {
            id:'lt5', 
            strokeColor:'green', 
            strokeWidth:5, 
            strokeOpacity:0.5, 
            name:'lijn 4' 
        },
        {
            id:'lt7', 
            strokeColor:'#ffff00', 
            strokeWidth:5, 
            strokeOpacity:1, 
            strokeOpacity:0.5, 
            name:'lijn 3'
        }
    ]

Pdok.Api.prototype.defaultLayers = {
        BRT: {
            layertype: 'WMTS',
            name: 'BRT Achtergrondkaart (wmts)',
            url: 'http://geodata.nationaalgeoregister.nl/wmts/',
            layer: 'brtachtergrondkaart',
            style: null,
            matrixSet: 'EPSG:28992',
            visibility: true, 
            isBaseLayer: true
        },
        BRT2: {
            layertype: 'TMS',
            name: 'BRT Achtergrondkaart (tms)',
            url: 'http://geodata.nationaalgeoregister.nl/tms/',
            layername: 'brtachtergrondkaart',
            type:'png8',
            visibility: true,
            isBaseLayer:true
        },
        TOP10NL: {
            layertype: 'WMTS',
            name: 'Top10NL (wmts)',
            url: 'http://geodata.nationaalgeoregister.nl/wmts/',
            layer: 'top10nl',
            style: '_null',
            matrixSet: 'EPSG:28992',
            visibility: true, 
            isBaseLayer: false
        },
        TOP10NL2: {
            layertype: 'TMS',
            name: 'Top10NL (tms)',
            url: 'http://geodata.nationaalgeoregister.nl/tms/',
            layername: 'top10nl',
            type:'png8',
            visibility: true,
            isBaseLayer: false
        },
        AAN: {
            layertype: 'WMS',
            name: 'Agrarisch Areaal Nederland WMS',
            url: 'http://geodata.nationaalgeoregister.nl/aan/wms',
            layers: 'aan',
            transparent: 'true',
            format: 'image/png',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
        },
        ADRESSEN: {
            layertype: 'WMS',
            name: 'Inspire Adressen',
            url: 'http://geodata.nationaalgeoregister.nl/inspireadressen/wms',
            layers: 'inspireadressen',
            transparent: 'true',
            format: 'image/png',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
        },
        AHN25M: {
            layertype: 'WMS',
            name: 'AHN 25 meter',
            url: 'http://geodata.nationaalgeoregister.nl/ahn25m/wms',
            layers: 'ahn25m',
            transparent: 'true',
            format: 'image/png',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
        },
        BBG2008: {
            layertype: 'WMS',
            name: 'BBG 2008',
            url: 'http://geodata.nationaalgeoregister.nl/bestandbodemgebruik2008/wms',
            layers: 'bbg2008',
            transparent: 'true',
            format: 'image/png',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
        },
        BESCHERMDENATUURMONUMENTEN:{
            layertype: 'WMS',
            name: 'Beschermde Natuurmonumenten',
            url: 'http://geodata.nationaalgeoregister.nl/beschermdenatuurmonumenten/wms',
            layers: 'beschermdenatuurmonumenten',
            transparent: 'true',
            format: 'image/png',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
        },
        GEMEENTEGRENZEN: {
            layertype: 'WMS',
            name: 'Gemeentegrenzen',
            url: 'http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?sld=http://luuks.github.com/API/gemeentegrenzen_grijs_gestippeld.sld',
            layers: 'gemeenten_2012',
            transparent: 'true',
            format: 'image/png',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
        },
        GEMEENTEGRENZEN_LABEL: {
            layertype: 'WMS',
            name: 'Gemeentegrenzen met labes (sld)',
            url: 'http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?sld=http://luuks.github.com/API/gemeentegrenzen_label_grijs_gestippeld.sld',
            layers: 'gemeenten_2012',
            transparent: 'true',
            format: 'image/png',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
        },
        NATIONALE_PARKEN: {
            layertype: 'WMS',
            name: 'Nationale parken',
            url: 'http://geodata.nationaalgeoregister.nl/nationaleparken/wms',
            layers: 'nationaleparken',
            transparent: 'true',
            format: 'image/png',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
        },
        NATURA2000: {
            layertype: 'TMS',
            name: 'Natura2000 gebieden',
            url: 'http://geodata.nationaalgeoregister.nl/tms/',
            layername: 'natura2000',
            type:'png8',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
        },
        NOK2011: {
            layertype: 'WMS',
            name: 'NOK2011',
            url: 'http://geodata.nationaalgeoregister.nl/nok2011/wms',
            layers: 'begrenzing,planologischeehs,verwervinginrichting',
            transparent: 'true',
            format: 'image/png',
            visibility: true,
            isBaseLayer: false,
            singleTile: true
        },
        TEXEL_20120423_OUTLINE: {
            layertype: 'WMS',
            name: 'Gevectoriseerde Bonnebladen',
            url: 'http://mapserver.sara.nl/bonne_vect/cgi-bin/mapserv?map=bonne_vect_texel.map',
            layers: 'TEXEL_20120423_OUTLINE',
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
    var olMap = new OpenLayers.Map ({
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.Zoom(),
			new OpenLayers.Control.ScaleLine({bottomOutUnits:'',bottomInUnits:''})
        ],
        maxExtent: new OpenLayers.Bounds(-285401.92,22598.08,595401.9199999999,903401.9199999999),
        theme: null,
		resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76,
					26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42],
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
    if (this.layers != null) {
        // if there is just one layer (without comma's), OL returns a String:
        if (typeof this.layers == 'string') {
            this.layers=[this.layers];
        }
        // if the map does NOT have a baseLayer, always add BRT layer
        if (!olMap.baseLayer){
            //olMap.addLayer(this.createWMTSLayer( this.defaultLayers.BRT ));
            this.addLayers(['BRT']);
        }
        this.addLayers(this.layers, olMap);
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

    // apply TXTURL if applicable
	if (this.txturl != null) {
		var lyrTextLayer = new OpenLayers.Layer.Text( "Textlayer", {location: this.txturl} );
		olMap.addLayer(lyrTextLayer);
	}

    // apply BBOX or zoomlevel and location
    if (this.bbox != null) {
        olMap.zoomToExtent(OpenLayers.Bounds.fromArray(this.bbox).transform(olMap.displayProjection, olMap.getProjectionObject()));
	}
    else if (this.zoom != null && this.loc != null) {
		olMap.setCenter (new OpenLayers.LonLat(parseInt(this.loc[0]), parseInt(this.loc[1])), parseInt(this.zoom));
    } else {
        //olMap.zoomToMaxExtent();
        olMap.zoomToExtent([-15000,300000,300000,640000],true);
    }

    // featuresLayer is used for all features/markers
    this.featuresLayer = new OpenLayers.Layer.Vector(this.FEATURESLAYER_NAME);
    olMap.addLayer(this.featuresLayer);

    if (typeof this.features == 'object') {
        // meaning we received a features string (kml) from the outside
        // features string handled, this.features now used as feature array
        if (this.features.toString().length>0) {
            this.addFeaturesFromString(this.features.toString(), 'KML');
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
                hover:this.hoverPopup,
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

    for (var i = 1; i<=this.MAXNUMBEROFFEATURES; i++){
        if(this['fgeom'+i]) {
            var ft = this.createFeature(this['fgeom'+i], this['ftype'+i], this['fname'+i], this['fdesc'+i]);
            this.features.push(ft);
        }
        else{
            break;
        }
    }

    this.featuresLayer.addFeatures(this.features);

    // enable Locationtool IF this.locationtool is set via config
    if (this.locationtool){
        var yorwkt = this.locationtoolwktfield;
        if(this.locationtoolyfield){
            yorwkt = this.locationtoolyfield;
        }
        this.enableLocationTool( this.locationtoolstyle,
            this.locationtoolzmin,
            this.locationtoolzmax,
            this.locationtoolxfield,
            yorwkt
            );
    }
    return olMap;
}

Pdok.Api.prototype.disablePopups = function(){
        this.featuresLayer.events.un({
            'featureselected': this.onFeatureSelect,
            'featureunselected': this.onFeatureUnselect
        });
        return true;
}
Pdok.Api.prototype.enablePopups = function(){
        this.featuresLayer.events.on({
            'featureselected': this.onFeatureSelect,
            'featureunselected': this.onFeatureUnselect
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


// fgeom1  wkt
// fname1  name or title for popup
// fdesc1  description for popup
// ftype1  styletype as defined for point/markers, lines or polygons (like mt1, pt3 etc)
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
 
    // create a default Point style
    var pdokDefaultPoint = OpenLayers.Util.applyDefaults(
        {
            externalGraphic: "http://www.nieuwsinkaart.nl/pdok/kaart/markertypes/default.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        }, {});

    this.styles.mt0 = pdokDefaultPoint;

    // if the the user added their own styles, they should create a variable 'customStyles'
    // hereby overriding the inbuild defaultStyles
    // TODO ?? or only extending ?????
    if (this.customStyles) {
        this.defaultStyles = customStyles;
    }
    for (var i = 0; i<this.defaultStyles.length; i++){
        var style = this.defaultStyles[i];
        this.styles[style.id] = OpenLayers.Util.applyDefaults( style, pdokDefaultPoint);
    }
}

/**
 * If not available, creates a drawFeature control. and activates it.
 * 
 * Parameters:
 * styletype - {String} styletype (eg 'mt1' or 'lt1' or 'pt1')
 *       based on the first char of the styletype, the type of feature
 *       is set: m = marker/point, l = linestring, p = polygon
 */
Pdok.Api.prototype.enableDrawingTool = function(styletype, featureAddedCallback){
    this.disableDrawingTool();
    var apiStyles = this.styles;
    var apiFeaturesLayer = this.featuresLayer;
    var currentDrawControl;
    if (styletype[0]=='m'){
        if (this.drawFeaturePointControl==null){
            this.drawFeaturePointControl = new OpenLayers.Control.DrawFeature(this.featuresLayer, OpenLayers.Handler.Point);
            this.map.addControl(this.drawFeaturePointControl);
        }
        currentDrawControl = this.drawFeaturePointControl;
        currentDrawControl.handler.style = apiStyles[styletype];
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
    currentDrawControl.activate();
    currentDrawControl.featureAdded = function(feature){
            feature.style = apiStyles[styletype];
            // also set an attribute 'styletype' to be able to export features with styletype
            feature.attributes['styletype'] = styletype;
            apiFeaturesLayer.redraw();
            if (featureAddedCallback){
                featureAddedCallback(feature);
            }
    }
    return true;
}

Pdok.Api.prototype.disableDrawingTool = function(){
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

Pdok.Api.prototype.onFeatureSelect = function(evt) {
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

Pdok.Api.prototype.onFeatureUnselect = function(evt) {
    feature = evt.feature;
    if (feature.popup) {
        popup.feature = null;
        this.map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
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

Pdok.Api.prototype.addTMS = function(tmsurl,tmslayer,tmstype) {
    if (tmstype == null){
        tmstype="png";
    }
    var lyrTMS = this.createTMSLayer({
            url: tmsurl,
            layername: tmslayer,
            type: tmstype
        });
    this.map.addLayer(lyrTMS);
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
            isBaseLayer: false
    };

    layerConfigObj = OpenLayers.Util.applyDefaults(layerConfigObj, defaults);

    var layer = new OpenLayers.Layer.TMS(
        layerConfigObj.name,
        layerConfigObj.url,
        {   layername: layerConfigObj.layername, 
            type:layerConfigObj.type, 
            visibility: layerConfigObj.visibility, 
            isBaseLayer: layerConfigObj.isBaseLayer
        }
    );

    return layer;
}

Pdok.Api.prototype.addWMTS = function(wmtsurl, wmtslayer, wmtsmatrixset, wmtsstyle, wmtsmatrixids) {
    var lyrWMTS = this.createWMTSLayer({
            url: wmtsurl,
            layer: wmtslayer,
            matrixSet: wmtsmatrixset,
            matrixIds: wmtsmatrixids,
            style: wmtsstyle
        });
    this.map.addLayer(lyrWMTS);

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
            layername: 'wmts layer',
            url: '',
            layer: '',
            style: 'default',
            matrixSet: '',
            matrixIds: matrixIds,
            visibility: true,
            isBaseLayer: false,
            format: 'image/png8'
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
            name: layerConfigObj.layername,
            url:layerConfigObj.url,
            layer: layerConfigObj.layer,
            style: layerConfigObj.style,
            matrixSet: layerConfigObj.matrixSet,
            matrixIds: layerConfigObj.matrixIds,
            format: layerConfigObj.format,
            visibility: layerConfigObj.visibility,
            isBaseLayer: layerConfigObj.isBaseLayer
        }
    );
    return layer;
}

/**
 * Api Interface
 *
 */
Pdok.Api.prototype.addWMS = function(wmsurl,wmslayers) {
    var lyrWMS = this.createWMSLayer({
            url: wmsurl,
            layers: wmslayers,
            transparent: true
        });
    this.map.addLayer(lyrWMS);
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
            layername: 'wms layer',
            url: '',
            layers: '',
            styles: '',
            visibility: true,
            isBaseLayer: false,
            format: 'image/png',
            singleTile: true
    };

    layerConfigObj = OpenLayers.Util.applyDefaults(layerConfigObj, defaults);

    var layer = new OpenLayers.Layer.WMS(
            layerConfigObj.layername,
            layerConfigObj.url,
            {
                layers: layerConfigObj.layers, 
                transparent: layerConfigObj.transparent, 
                format: layerConfigObj.format
            },
            {
                visibility: layerConfigObj.visibility, 
                isBaseLayer: layerConfigObj.isBaseLayer, 
                singleTile: layerConfigObj.singleTile 
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
    return true;
}


Pdok.Api.prototype.disableLocationTool = function(){
    // this.lationtool is INTERNAL flag to know if we have abled/disabled the locationtool, needed for code generation
    this.locationtool = false;
    this.featuresLayer.removeAllFeatures();
    this.disableDrawingTool();
    this.disableEditingTool();
    return true;
}
Pdok.Api.prototype.enableLocationTool = function(styletype, zmin, zmax, xorwkt, y){

    // this.lationtool is INTERNAL flag to know if we have abled/disabled the locationtool, needed for code generation
    this.locationtool = true;
    this[xorwkt] = 0;

    if (styletype){
        this.locationtoolstyletype = styletype;
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
        // called without params, use api defaults
    }
    if(zmin){
        this.locationtoolzmin = zmin;
    }
    if(zmax){
        this.locationtoolzmax = zmax;
    }

    // TODO: remove this, or put features in different layer
    if (this.featuresLayer.features.length > 0){
        alert('Op dit moment mogen er geen andere features aanwezig zijn. Begin met een lege kaart.');
        return;
    }

    var wktFormat = new OpenLayers.Format.WKT();
    var apiObject = this;
    var alerted = false;
    var map = this.map;

    // selectControl and popups interfere with editing tools: disable all
    this.selectControl.deactivate();
    this.disablePopups();

    var finishLocationAction = function(feature){
        if(feature.feature){
            feature = feature.feature;
        }
        if (apiObject.locationtoolxfield && apiObject.locationtoolyfield) {
            apiObject[apiObject.locationtoolxfield] = feature.geometry.x;
            apiObject[apiObject.locationtoolyfield] = feature.geometry.y;
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
        startLocationAction();
    }

    var startLocationAction = function() {
        if (apiObject.featuresLayer.features.length > 0) {
            apiObject.enableEditingTool(finishLocationAction);
            apiObject.disableDrawingTool();
        }
        else if (map.getZoom() >= apiObject.locationtoolzmin && map.getZoom() <= apiObject.locationtoolzmax) {
            if(!styletype){
                styletype = apiObject.locationtoolstyle;
            }
            apiObject.enableDrawingTool(styletype, finishLocationAction);
        } else {
            var msg = "U kunt alleen tekenen tussen de zoomnivo's: "+apiObject.locationtoolzmin+" en "+apiObject.locationtoolzmax+". \nU zit nu op zoomnivo: "+map.getZoom();
            var zoom;
            if (map.getZoom() < apiObject.locationtoolzmin){
                //msg += "\nZoom minstens "+(zmin-map.getZoom())+" zoomnivo's in";
                msg += "\nKlik op OK om "+(apiObject.locationtoolzmin-map.getZoom())+" zoomnivo's in te zoomen \n(of Annuleren/Cancel om het zelf te doen)";
                zoom = apiObject.locationtoolzmin;
            }
            else{
                //msg += "\nZoom minstens "+(map.getZoom()-zmax)+" zoomnivo's uit";
                msg += "\nKlik op OK om "+(map.getZoom()-apiObject.locationtoolzmax)+" zoomnivo's uit te zoomen \n(of Annuleren/Cancel om het zelf te doen)";
                zoom = apiObject.locationtoolzmax;

            }
            if (!alerted){
                alerted = true;
                if(confirm(msg)){
                   map.zoomTo(zoom);
                }
            }
            apiObject.disableDrawingTool();
        }
    }
    this.map.events.register("moveend", map, startLocationAction);
    startLocationAction();
    return true;
}



Pdok.Api.prototype.handleGetResponse = function(response){
    if (response.status != 200){
        alert('Fout bij het ophalen van de url');
        return
    }
    var data = response.responseText;
    // we have data now: add to map
    this.addFeaturesFromString(data, this.dataType);
}

Pdok.Api.prototype.addFeaturesFromString = function(data, type){
    var format;
    var features;
    var options = {
        externalProjection: new OpenLayers.Projection("EPSG:4326"),
        internalProjection: this.map.baseLayer.projection
    };
    if (type.toUpperCase() == 'KML') {
        format = new OpenLayers.Format.KML(options);
        features = format.read(data);
    }
    else if(type.toUpperCase() == "TXT"){
        // TXT files will default to epsg:28992 / RD coordinates
        options = {
            externalProjection: new OpenLayers.Projection("EPSG:28992"),
            internalProjection: this.map.baseLayer.projection
        };
        format = new OpenLayers.Format.Text(options);
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
        if (feature.attributes['styletype']) {
            var styletype = feature.attributes['styletype'];
            // some formats (KML) return attr as objects instead of strings
            if (typeof styletype == 'object') {
                styletype = styletype.value;
            }
            feature.style = this.styles[styletype];
        }
        else {
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

    this.featuresLayer.addFeatures(features);
    return true;
}

Pdok.Api.prototype.addFeaturesFromUrl = function(url, type){

    var apiObject = this;
    apiObject.dataType = type;

    if (type.toUpperCase() == "KML"){
        // kml
    }
    else if(type.toUpperCase() == "TXT"){
        // tab separated txt file
        // format (including header!)
        //
        // point    title   description
        // 52.64,4.84  foo omschrijving foo
        //
        // OR
        //
        // lat  lon title   description
        // 52.64   4.84    foo omschrijving foo
    }
    else{
        alert('addFeaturesFromUrl aanroep met een niet ondersteund type: '+type);
        return;
    }

    OpenLayers.Request.GET({
            url: url,
            callback: apiObject.handleGetResponse,
            scope: apiObject
    });

    return true;
}

Pdok.Api.prototype.createIframeTags = function(){
    // map div size
    var mapSize = this.map.getSize();
    // <iframe width='650' height='450' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='http://nieuwsinkaart.nl/pdok/kaart/api/api.html?&loc=155000,463000&zl=2' title='PDOK Kaart'></iframe><br /><small>PDOK Kaart: <a href='http://nieuwsinkaart.nl/pdok/kaart/?&loc=155000,463000&zl=2' style='color:#0000FF;text-align:left'>Grotere kaart weergeven</a></small>
    /* 
        <iframe width='650' height='450' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='http://nieuwsinkaart.nl/pdok/kaart/api/api.html?&loc=155000,463000&zl=2' title='PDOK Kaart'></iframe>
        <br /><small>PDOK Kaart: <a href='http://nieuwsinkaart.nl/pdok/kaart/?&loc=155000,463000&zl=2' style='color:#0000FF;text-align:left'>Grotere kaart weergeven</a></small>
    */
    var iframeTags = '<iframe width="'+mapSize.w+'" height="'+mapSize.h+'" frameborder="0" scrolling=no marginheight="0" marginwidth="0" src="'+this.createMapLink()+'" title="PDOK Kaart"></iframe>';
        //'<br /><small>PDOK Kaart: <a href="'+this.createMapLink()+'" style="color:#0000FF;text-align:left">Grotere kaart weergeven</a></small>';
    return iframeTags;
}
Pdok.Api.prototype.createObjectTags = function(){
    // map div size
    var mapSize = this.map.getSize();
    // <object width='650' height='450' codetype='text/html' data='http://nieuwsinkaart.nl/pdok/kaart/api/api.html?&loc=155000,463000&zl=2' title='PDOK Kaart'></object><br /><small>PDOK Kaart: <a href='http://nieuwsinkaart.nl/pdok/kaart/?&loc=155000,463000&zl=2' style='color:#0000FF;text-align:left'>Grotere kaart weergeven</a></small>
    /* 
        <object width='650' height='450' codetype='text/html' data='http://nieuwsinkaart.nl/pdok/kaart/api/api.html?&loc=155000,463000&zl=2' title='PDOK Kaart'></object>
        <br /><small>PDOK Kaart: <a href='http://nieuwsinkaart.nl/pdok/kaart/?&loc=155000,463000&zl=2' style='color:#0000FF;text-align:left'>Grotere kaart weergeven</a></small>
    */
    var objectTags = '<object width="'+mapSize.w+'" height="'+mapSize.h+'" codetype="text/html" data="'+this.createMapLink()+'" title="PDOK Kaart"></object>';
        //'<br /><small>PDOK Kaart: <a href="'+this.createMapLink()+'" style="color:#0000FF;text-align:left">Grotere kaart weergeven</a></small>';
    return objectTags;
}
Pdok.Api.prototype.createMapLink = function(){
    return 'http://'+window.location.host+'/pdok/api/api.html?'+OpenLayers.Util.getParameterString(this.getConfig());
}
Pdok.Api.prototype.createHtmlBody = function(){
    var html = '<div id="map"></div>\n'+
               '<script>var  api = createPDOKKaart();\n'+
               '</script>';
    return html;
}
Pdok.Api.prototype.createHtmlHead = function(){
    var host = window.location.host; // TODO make this a baseuri config?

    var head = '\n<script src="http://'+host+'/pdok/js/jquery.js"></script>'+
    '\n<script src="http://'+host+'/pdok/api/javascripts/OpenLayers.js"></script>'+
    '\n<script src="http://'+host+'/pdok/api/javascripts/proj4js-compressed.js"></script>'+
    '\n<script src="http://'+host+'/pdok/api/javascripts/pdok-api.js"></script>'+
    '\n<link rel="stylesheet" href="http://'+host+'/pdok/api/styles/default/style.css" type="text/css">'+
    '\n<link rel="stylesheet" href="http://'+host+'/pdok/api/styles/style.css" type="text/css">'+
    '\n<script>var config = '+this.serialize(this.getConfig(), true)+';\nfunction createPDOKKaart() {  var api = new Pdok.Api(config);return api}\n</script>';
    return head;
}
Pdok.Api.prototype.getConfig = function() {
    var config = {};

    // zoom
    config.zoom = this.map.getZoom();
    // bbox
    // config.bbox = this.map.getExtent().toArray();
    // or better ? loc
    config.loc = this.map.getCenter().toShortString();
    // layers
    var layers = [];
    for (layer in this.map.layers){
        var pdokId = this.map.layers[layer].pdokId;
        // only layers with a pdokId, and NOT our this.featuresLayer
        if (pdokId && this.map.layers[layer].name != this.FEATERSLAYER_NAME){
            layers.push(pdokId);
        }
        else{
            // we have a layer from 'outside'
        }
    }
    if (layers.length>0) {
        config.layers = [layers.join()];
    }
    // locationtool
    if(this.locationtool) {
        config.locationtool = true;
        config.locationtoolstyle = this.locationtoolstyle;
        config.locationtoolxfield = this.locationtoolxfield;
        config.locationtoolyfield = this.locationtoolyfield;
        config.locationtoolwktfield = this.locationtoolwktfield;
        config.locationtoolzmin = this.locationtoolzmin;
        config.locationtoolzmax = this.locationtoolzmax;
    }
    // features
    if (this.featuresLayer.features.length>0) {
        var kmlformat = new OpenLayers.Format.KML({
            foldersDesc: null,
            foldersName: null,
            placemarksDesc: '-',
            internalProjection: this.map.baseLayer.projection,
            externalProjection: new OpenLayers.Projection("EPSG:4326")
        });
        config.features=kmlformat.write(this.featuresLayer.features);
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