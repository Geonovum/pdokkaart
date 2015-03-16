/*
    This script contains extra Openlayers classes to be used in the
    PdokKaart-api. Currently, these are:
    
    OpenLayers.Format.KMLv2_2
      Symbology support for the OpenLayers class for reading/writing KML 2.2
    
    OpenLayers.Control.LegendControl
      The LegendControl control adds a legend for WMS layers.
    
    OpenLayers.Control.GeocoderControl
      The GeocoderControl control adds pdok search functionality.
    
*/

OpenLayers.Format.KMLv2_2 = OpenLayers.Class(OpenLayers.Format.KML, {
    /**
     * APIProperty: kmlns
     * {String} KML Namespace to use. Defaults to 2.0 namespace.
     */
    kmlns: "http://earth.google.com/kml/2.2",
    
    /**
     * 
     * @param {type} features
     * @returns {string} the KML document
     */
    write: function(features) {
        this.styles = {};

        if(!(features instanceof Array)) {
            features = [features];
        }
        var kml = this.createElementNS(this.kmlns, "kml");
        var document = this.createDocumentXML();
        var folder = this.createFolderXML();
        for(var i=0, len=features.length; i<len; ++i) {
            var styleId = this.extractStyles ? 
                this.createStyleNode(document, this.computedStyle(features[i])) :
                false;
            folder.appendChild(this.createPlacemarkXML(features[i], styleId));
        }
        kml.appendChild(folder);
        document.appendChild(folder);
        kml.appendChild(document);
        return OpenLayers.Format.XML.prototype.write.apply(this, [kml]);
    },
        /**
     * Method: createDocumentXML
     * Creates and returns a KML document node
     *
     * Returns:
     * {DOMElement}
     */
    createDocumentXML: function() {
        // Document name
        var documentName = this.createElementNS(this.kmlns, "name");
        var documentNameText = this.createTextNode(this.foldersName);
        documentName.appendChild(documentNameText);

        // Document description
        var documentDesc = this.createElementNS(this.kmlns, "description");
        var documentDescText = this.createTextNode(this.foldersDesc);
        documentDesc.appendChild(documentDescText);

        var document = this.createElementNS(this.kmlns, "Document");
        document.appendChild(documentName);
        document.appendChild(documentDesc);

        return document;
    },
        createPlacemarkXML: function(feature, styleId) {
        // Placemark name
        var placemarkName = this.createElementNS(this.kmlns, "name");
        var name = feature.style && feature.style.label ? feature.style.label :
                   feature.attributes.name || feature.id;
        placemarkName.appendChild(this.createTextNode(name));

        // Placemark description
        var placemarkDesc = this.createElementNS(this.kmlns, "description");
        var desc = feature.attributes.description || this.placemarksDesc;
        placemarkDesc.appendChild(this.createTextNode(desc));
        
        // Placemark
        var placemarkNode = this.createElementNS(this.kmlns, "Placemark");
        if(feature.fid) {
            placemarkNode.setAttribute("id", feature.fid);
        }
        placemarkNode.appendChild(placemarkName);
        placemarkNode.appendChild(placemarkDesc);

        if (styleId) {
            var styleNode = this.createElementNS(this.kmlns, "styleUrl");
            styleNode.appendChild(this.createTextNode(styleId));
            placemarkNode.appendChild(styleNode);
        }

        // Geometry node (Point, LineString, etc. nodes)
        var geometryNode = this.buildGeometryNode(feature.geometry);
        placemarkNode.appendChild(geometryNode);        
        
        // output attributes as extendedData
        if (feature.attributes) {
            var edNode = this.buildExtendedData(feature.attributes);
            if (edNode) {
                placemarkNode.appendChild(edNode);
            }
        }
        
        return placemarkNode;
    },
    computedStyle: function(feature) {
        if (feature.style) {
            return feature.style;
        } else if (feature.layer) {
            if (feature.layer.style) {
                return feature.layer.style;
            } else {
                return feature.layer.styleMap.createSymbolizer(feature);
            }
        }
    },
    createKmlColorNode: function(color, opacity) {
        var alpha = "ff";
        if (opacity) {
            alpha = Math.round(parseFloat(opacity) * 255).toString(16);
        }
        // TBD: handle '#ccc', 'red'
        // only match '#rrggbb'
        var r = color.slice(1, 3);
        var g = color.slice(3, 5);
        var b = color.slice(5, 7);
        var colorNode = this.createElementNS(this.kmlns, "color");
        colorNode.appendChild(this.createTextNode(alpha + b + g + r));
        return colorNode;
    },

    createStyleNode: function(document, style) {
        if (!style){
            return false;
        } else {
            var styleNode = this.createElementNS(this.kmlns, "Style");
            var id = OpenLayers.Util.createUniqueID("style_");
            styleNode.setAttribute("id", id);

            // LineStyle
            if (style.strokeColor) {
                var lineNode = this.createElementNS(this.kmlns, "LineStyle");
                var colorNode = this.createKmlColorNode(style.strokeColor, style.strokeOpacity);
                lineNode.appendChild(colorNode);

                if (style.strokeWidth) {
                    var width = this.createElementNS(this.kmlns, "width");
                    width.appendChild(this.createTextNode(style.strokeWidth));
                    lineNode.appendChild(width);
                }
                styleNode.appendChild(lineNode);
            }

            // PolyStyle
            if (style.fillColor) {
                var polyNode = this.createElementNS(this.kmlns, "PolyStyle");
                var colorNode = this.createKmlColorNode(style.fillColor, style.fillOpacity);
                polyNode.appendChild(colorNode);
                styleNode.appendChild(polyNode);
            } else /*if (style.fillColor == "none")*/ {
                var polyNode = this.createElementNS(this.kmlns, "PolyStyle");
                var fill = this.createElementNS(this.kmlns, "fill");
                fill.appendChild(this.createTextNode("1"));
                var colorNode = this.createKmlColorNode("#ffffff", "0.01");
                polyNode.appendChild(colorNode);
                polyNode.appendChild(fill);
                styleNode.appendChild(polyNode);
            }
            if (polyNode && style.strokeWidth === "0") {
                var outline = this.createElementNS(this.kmlns, "outline");
                outline.appendChild(this.createTextNode("1"));
                polyNode.appendChild(outline);
                styleNode.appendChild(polyNode);
            }

            // IconStyle
            if (style.externalGraphic) {
                var iconstyleNode = this.createElementNS(this.kmlns, "IconStyle");
                var iconNode = this.createElementNS(this.kmlns, "Icon");

                var href = this.createElementNS(this.kmlns, "href");
                var urlObj = OpenLayers.Util.createUrlObject(
                    style.externalGraphic,
                    {ignorePort80: true}
                );
                if(urlObj.port && urlObj.port !== "80"){
                    url = [urlObj.protocol, '//', urlObj.host, ':', urlObj.port, urlObj.pathname].join('');
                } else {
                    url = [urlObj.protocol, '//', urlObj.host, urlObj.pathname].join('');
                }
                href.appendChild(this.createTextNode(url));
                iconNode.appendChild(href);
                iconstyleNode.appendChild(iconNode);
                var scaleNode = this.createElementNS(this.kmlns, "scale");

                // in KML 2.2, w and h <Icon> attributes are deprecated
                // this means that we can't modify the width/height ratio of the image
                var scale = style.graphicWidth || style.graphicHeight || style.pointRadius * 2;
                scaleNode.appendChild(this.createTextNode(scale/32));
                iconstyleNode.appendChild(scaleNode);
                styleNode.appendChild(iconstyleNode);
            }

            // LabelStyle
            if (style.fontColor) {
                var colorNode = this.createKmlColorNode(style.fontColor, style.fontOpacity);
                var labelStyle = this.createElementNS(this.kmlns, "LabelStyle");
                labelStyle.appendChild(colorNode);
                styleNode.appendChild(labelStyle);
            }
            document.appendChild(styleNode);
            return "#" + id;
        }
    }
});



/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.LegendControl
 * The LegendControl control adds a legend for WMS layers. 
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.LegendControl = 
  OpenLayers.Class(OpenLayers.Control, {
    dynamic: true,
    /**
     * Constructor:
     * 
     * Parameters:
     * @param options - {Object} Options for control.
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        // we create the div ourselves, to be able to put it outside the map-div
        // if we let OpenLayers create it, and let it be part of the map-div
        // then OpenLayers steals the cursor from our input
        if (!this.div){
            this.div = document.createElement("div");
            this.div.className = OpenLayers.Util.createUniqueID("lg_");
            this.div.id = this.div.className+'_'+this.id;
        }
        
        // deferred event delegation:
        // http://davidwalsh.name/event-delegate
        var me = this;
        var clickFunc = function(e) {
            var target;
            e.target?target=e.target:target=e.srcElement;
            if(target && target.className === "hideWindow") {
                me.hideLegend();
            } else if (target && target.className === "hideWindow"){
                me.showLegend();
            }
        };
        if (this.div.addEventListener) {
            this.div.addEventListener("click", clickFunc);
        } else{
            // IE8
            this.div.attachEvent("onclick", clickFunc);
        }
        //me.draw();
    },

    /** 
     * Method: destroy
     * Destroy control.
     */
    destroy: function() {    
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    
    activate: function() {
        OpenLayers.Control.prototype.activate.apply(this, arguments);
        this.map.events.register('addlayer', this, this.draw);
        this.map.events.register('removelayer', this, this.draw);
        this.map.events.register('changelayer', this, this.draw);
    },
    
    deactivate: function() {
        OpenLayers.Control.prototype.deactivate.apply(this, arguments);
        this.map.events.unregister('addlayer', this, this.draw);
        this.map.events.unregister('removelayer', this, this.draw);
        this.map.events.unregister('changelayer', this, this.draw); 
    },
    
    /**
     * Method: draw
     * Initialize control.
     * 
     * Returns: 
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        if(this.dynamic==false){
            return;
        }
        var html = '<h2>Legenda</h2>';
        // for every WMS add a P + IMG tag to legendgraphic image
        for (var i = 0;i< this.map.layers.length;i++){
            var layer = this.map.layers[i];
            if (layer.CLASS_NAME == "OpenLayers.Layer.WMS" && layer.visibility) {
                var legend = layer.url + 
                    "?TRANSPARENT=true&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2F" +
                    "vnd.ogc.se_xml&FORMAT=image%2Fpng&LAYER=" + layer.params["LAYERS"];
                html += '<h4>' + layer.name + '</h4><p><img src=' + legend + ' alt="' + layer.name + '" title="' + layer.name + '" /></p>';
            }           
        }
        this.div.innerHTML = html;    
        return this.div;
    },
    hideResults: function() {
        document.getElementById(this.div.id).style.display = 'none';
    },
    showResults: function() {
        document.getElementById(this.div.id).style.display = 'block';
    },
    CLASS_NAME: "OpenLayers.Control.LegendControl"
});
/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.GeocoderControl
 * The GeocoderControl control adds pdok search functionality. 
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.GeocoderControl = 
  OpenLayers.Class(OpenLayers.Control, {

    // PDOK
    geocoderUrl: 'http://geodata.nationaalgeoregister.nl/geocoder/Geocoder?',
    geocoderParameter: 'zoekterm',

    zoomScale : {
        adres: 13,
        postcode: 11,
        plaats: 8,
        gemeente: 8,
        provincie: 5,
        standaard: 9
    },

    /**
     * Constructor:
     * 
     * Parameters:
     * @param options - {Object} Options for control.
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        // we create the div ourselves, to be able to put it outside the map-div
        // if we let OpenLayers create it, and let it be part of the map-div
        // then OpenLayers steals the cursor from our input
        if (!this.div){
            this.div = document.createElement("div");
            this.div.className = OpenLayers.Util.createUniqueID("gc_");
            this.div.id = this.div.className+'_'+this.id;
        }
        this.resultdiv_id = OpenLayers.Util.createUniqueID("gcr_");
        this.formdiv_id = this.resultdiv_id + '_form';
        this.button_id = this.resultdiv_id + '_button';
        this.input_id = this.resultdiv_id + '_input';
        this.geozet_id = this.resultdiv_id + '_geozet';
        this.allowSelection = true;

        // deferred event delegation:
        // http://davidwalsh.name/event-delegate
        var me = this;
        var clickFunc = function(e) {
            var target;
            e.target ? target = e.target : target = e.srcElement;
            if(target && target.className === "closeWindow") {
                me.hideResults();
            } else if(target && target.nodeName === "A") {
                var x = document.getElementById(target.id).attributes['x'].value;
                var y = document.getElementById(target.id).attributes['y'].value;
                var z = document.getElementById(target.id).attributes['z'].value;
                if(x && y) {
                    me.map.setCenter(new OpenLayers.LonLat(x, y), z);
                } else {
                    document.getElementById(this.resultdiv_id).innerHTML = "Fout met coordinaten";
                }
                return false;
            }
        };
        if (this.div.addEventListener) {
            this.div.addEventListener("click", clickFunc);
        } else{
            // IE8
            this.div.attachEvent("onclick", clickFunc);
        }
    },

    /** 
     * Method: destroy
     * Destroy control.
     */
    destroy: function() {
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * Method: draw
     * Initialize control.
     * 
     * Returns: 
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */    
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        this.div.innerHTML =
            '<div>' + 
                '<form action="#" id="' + this.formdiv_id + '" name="' + this.formdiv_id + '" onsubmit="return false;">' +
                    '<fieldset>' + 
                        '<input class="autovalue default" type="text" title="adres, postcode of plaatsnaam" id="' + this.input_id +'" name="'+ this.input_id + '" />' +
                        '<input type="submit" id="' + this.button_id +'" class="filterbutton" value="Zoek" />' + 
                    '</fieldset>' +
                '</form>' + 
            '</div>' + 
            '<div id="'+ this.resultdiv_id +'" style="display:none;"></div>';
        var me = this;
        document.getElementById(this.button_id).onclick = function(){
            me.search();
            if (document.getElementById(me.resultdiv_id).style.display === 'none'){
                me.showResults();
            }
        };
        return this.div;
    },

    handleGeocodeResponse: function(req){

        var responseText = req.responseText;
        if (responseText && (responseText.indexOf('FAILED') !== -1 ||
            responseText.indexOf('Exception') !== -1 )) {
            // fail silently
            return false;
        }
        if(req.status === 404){
            document.getElementById(this.resultdiv_id).innerHTML = "De zoekfunctie is niet actief, neem contact op met systeembeheer (status: 404)";
            return false;
        }
        var xlslusFormat = new Geozet.Format.XLSLUS();
        var xlslus = xlslusFormat.read(req.responseXML || req.responseText);
        if (xlslus.length === 0) {
            hits = 0;
        } else {
            var hits=xlslus[0].numberOfGeocodedAddresses;
        }
        if (hits === 0) {
            // zero responses
            document.getElementById(this.resultdiv_id).innerHTML = "Geen locaties gevonden ...";
        } else {
            var maxEx = this.restrictedExtent;
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
            if(hits > 0){
                var searchString = document.getElementById(this.input_id).value;
                document.getElementById(this.resultdiv_id).innerHTML = 
                    '<span class="closeWindow"><a onclick="return false;"><img class="closeWindow" src="' + Pdok.ApiUrl + 
                    '/styles/default/img/close.gif" alt="Sluiten" title="Sluiten"/></a></span>' +
                    '<span class="searchedFor">Gezocht op: "' + searchString + 
                    '"</span><h3>Zoekresultaten</h3><ul id="' + this.geozet_id + '" class="geozetSuggestions"></ul>';
            }
            for (i = 0; i < hits; i++) {
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
                if (address.street && address.street.length>0) {
                    adres = address.street + ' - ' ;
                    if (address.building) {
                        var toevoeging = '';
                        if (address.building.subdivision) {
                            toevoeging = '-'+address.building.subdivision;
                        }
                        adres += address.building.number+toevoeging+' - ';
                    }
                    if(!zoom){
                        zoom='adres';
                    }
                }
                if (address.postalCode) {
                    adres += address.postalCode+' - ';
                    if(!zoom){
                        zoom='postcode';
                    }
                }
                if (plaats) {
                    suggestion=adres+plaats+' (plaats)';
                    if(!zoom){
                        zoom='plaats';
                    }
                } else if(gemeente) {
                    suggestion=adres+gemeente+' (gemeente)';
                    if(!zoom){
                        zoom='gemeente';
                    }
                } else if(prov){
                    suggestion=prov+' (provincie)';
                    if(!zoom){
                        zoom='provincie';
                    }
                }
                if(!zoom){
                    zoom='standaard';
                }

                // hack to be able to handle results without geom
                var x = geom ? geom.x : 150000;
                var y = geom ? geom.y : 450000;
                var z = geom ? this.zoomScale[zoom] : this.zoomScale['provincie'];
                var newId = -1;
                if (geom) {
                    minx = Math.min(minx, x);
                    miny = Math.min(miny, y);
                    maxx = Math.max(maxx, x);
                    maxy = Math.max(maxy, y);
                    minzoom = Math.min(minzoom, this.zoomScale[zoom]);
                    var newFt = new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.Point(x, y), {
                            "title": suggestion, 
                            "postcode": postcode, 
                            "adres": adres, 
                            "plaats": plaats, 
                            "gemeente": gemeente, 
                            "provincie": prov
                        }
                    );
                    newId = newFt.id;
                    features.push(newFt);
                }
                var gazHtml = '<li><a href="#" id="result_'+ newId.replace('.','_') +
                    '" x="' + x +
                    '" y="' + y +
                    '" z="' + z + '">' +
                    suggestion +'</a></li>';
                document.getElementById(this.geozet_id).innerHTML += gazHtml;
            } 
            if(hits === 1) {
                var geom = xlslus[0].features[0].geometry;
                // hack to be able to handle results without geom
                var x = geom ? geom.x : 150000;
                var y = geom ? geom.y : 450000;
                var z = geom ? this.zoomScale[zoom] : this.zoomScale['provincie'];
                this.map.setCenter(new OpenLayers.LonLat(x, y), z);
            }
        }
        this.showResults();
        return false;
    },

    search: function() {
        document.getElementById(this.resultdiv_id).innerHTML = 'Bezig met zoeken...';
        var searchString = document.getElementById(this.input_id).value;
        var params = {}; //{request: 'geocode'};
        params[this.geocoderParameter] = searchString;
        if (searchString && searchString.length>0){
            OpenLayers.Request.GET({
                url: this.geocoderUrl,
                params: params,
                scope: this,
                callback: this.handleGeocodeResponse
                // failure: this.handleError
            });
        }
        return false;
    },
    hideResults: function() {
        document.getElementById(this.resultdiv_id).style.display = 'none';
    },
    showResults: function() {
        document.getElementById(this.resultdiv_id).style.display = 'block';
    },
    CLASS_NAME: "OpenLayers.Control.GeocoderControl"
});

/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 *
 * Class: OpenLayers.Control.LoadingPanel
 * In some applications, it makes sense to alert the user that something is
 * happening while tiles are loading. This control displays a div across the
 * map when this is going on.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.LoadingPanel = OpenLayers.Class(OpenLayers.Control, {

    /**
     * Property: counter
     * {Integer} A counter for the number of layers loading
     */
    counter: 0,

    /**
     * Property: maximized
     * {Boolean} A boolean indicating whether or not the control is maximized
    */
    maximized: false,

    /**
     * Property: visible
     * {Boolean} A boolean indicating whether or not the control is visible
    */
    visible: true,

    /**
     * Constructor: OpenLayers.Control.LoadingPanel
     * Display a panel across the map that says 'loading'.
     *
     * Parameters:
     * options - {Object} additional options.
     */
    initialize: function(options) {
         OpenLayers.Control.prototype.initialize.apply(this, [options]);
    },

    /**
     * Function: setVisible
     * Set the visibility of this control
     *
     * Parameters:
     * visible - {Boolean} should the control be visible or not?
    */
    setVisible: function(visible) {
        this.visible = visible;
        if (visible) {
            OpenLayers.Element.show(this.div);
        } else {
            OpenLayers.Element.hide(this.div);
        }
    },

    /**
     * Function: getVisible
     * Get the visibility of this control
     *
     * Returns:
     * {Boolean} the current visibility of this control
    */
    getVisible: function() {
        return this.visible;
    },

    /**
     * APIMethod: hide
     * Hide the loading panel control
    */
    hide: function() {
        this.setVisible(false);
    },

    /**
     * APIMethod: show
     * Show the loading panel control
    */
    show: function() {
        this.setVisible(true);
    },

    /**
     * APIMethod: toggle
     * Toggle the visibility of the loading panel control
    */
    toggle: function() {
        this.setVisible(!this.getVisible());
    },

    /**
     * Method: addLayer
     * Attach event handlers when new layer gets added to the map
     *
     * Parameters:
     * evt - {Event}
    */
    addLayer: function(evt) {
        if (evt.layer) {
            evt.layer.events.register('loadstart', this, this.increaseCounter);
            evt.layer.events.register('loadend', this, this.decreaseCounter);
        }
    },

    /**
     * Method: setMap
     * Set the map property for the control and all handlers.
     *
     * Parameters:
     * map - {<OpenLayers.Map>} The control's map.
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
        this.map.events.register('preaddlayer', this, this.addLayer);
        for (var i = 0; i < this.map.layers.length; i++) {
            var layer = this.map.layers[i];
            layer.events.register('loadstart', this, this.increaseCounter);
            layer.events.register('loadend', this, this.decreaseCounter);
        }
    },

    /**
     * Method: increaseCounter
     * Increase the counter and show control
    */
    increaseCounter: function() {
        this.counter++;
        if (this.counter > 0) {
            if (!this.maximized && this.visible) {
                this.maximizeControl();
            }
        }
    },

    /**
     * Method: decreaseCounter
     * Decrease the counter and hide the control if finished
    */
    decreaseCounter: function() {
        if (this.counter > 0) {
            this.counter--;
        }
        if (this.counter == 0) {
            if (this.maximized && this.visible) {
                this.minimizeControl();
            }
        }
    },

    /**
     * Method: draw
     * Create and return the element to be splashed over the map.
     */
    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        return this.div;
    },

    /**
     * Method: minimizeControl
     * Set the display properties of the control to make it disappear.
     *
     * Parameters:
     * evt - {Event}
     */
    minimizeControl: function(evt) {
        this.div.style.display = "none";
        this.maximized = false;

        if (evt != null) {
            OpenLayers.Event.stop(evt);
        }
    },

    /**
     * Method: maximizeControl
     * Make the control visible.
     *
     * Parameters:
     * evt - {Event}
     */
    maximizeControl: function(evt) {
        this.div.style.display = "block";
        this.maximized = true;

        if (evt != null) {
            OpenLayers.Event.stop(evt);
        }
    },

    /**
     * Method: destroy
     * Destroy control.
     */
    destroy: function() {
        if (this.map) {
            this.map.events.unregister('preaddlayer', this, this.addLayer);
            if (this.map.layers) {
                for (var i = 0; i < this.map.layers.length; i++) {
                    var layer = this.map.layers[i];
                    layer.events.unregister('loadstart', this,
                        this.increaseCounter);
                    layer.events.unregister('loadend', this,
                        this.decreaseCounter);
                }
            }
        }
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    CLASS_NAME: "OpenLayers.Control.LoadingPanel"

});