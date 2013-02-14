/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.Attribution
 * The attribution control adds attribution from layers to the map display. 
 * It uses 'attribution' property of each layer.
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
     * options - {Object} Options for control.
     */
    initialize: function(options) {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        // we create the div ourselves, to be able to put it outside the map-div
        // if we let OpenLayers create it, and let it be part of the map-div
        // then OpenLayers steals the cursor from our input
        if (this.div == undefined){
            this.div = document.createElement("div");
            this.div.className = "pdokGeocoderDiv";
            this.div.id = this.div.className+'_'+this.id;
        }
        this.allowSelection = true;

        // deferred event delegation:
        // http://davidwalsh.name/event-delegate
        var me = this;
        this.div.addEventListener("click",function(e) {
            if(e.target && e.target.className == "closeWindow") {
                me.hideResults();
            }
            else if(e.target && e.target.nodeName == "A") {
                var x = document.getElementById(e.target.id).attributes['x'].value;
                var y = document.getElementById(e.target.id).attributes['y'].value;
                var z = document.getElementById(e.target.id).attributes['z'].value;
                if(x && y){
                    me.map.setCenter(new OpenLayers.LonLat(x, y), z);
                    me.hideResults();
                }
                else {
                    alert("fout met coordinaten");
                }
                return false;
                    }
                });

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
        this.map.div.parentNode.insertBefore(this.div, this.map.div);
        OpenLayers.Control.prototype.draw.apply(this, arguments);

        this.div.innerHTML =
            '<form action="#" id="pdoksearchform" name="pdoksearchform" onsubmit="return false;">'+
                //'Zoek een locatie:'+
                /*'<input id="searchLocation" type="text" value="" name="searchLocation" class="autopopulate default" title="adres, postcode of plaatsnaam" />'+
                '<button type="submit" id="searchlocbutton" class="filterbutton"> Zoek</button>'+*/
                '<input id="pdoksearchinput" type="text" value="" name="pdoksearchinput" class="autopopulate default" title="adres, postcode of plaatsnaam" />'+
                '<button type="submit" id="pdoksearchbutton" class="filterbutton"> Zoek Locatie</button>'+
                '<div id="pdoksearchresults">&nbsp;</div>'
            '</form>';
            var me = this;
            document.getElementById('pdoksearchbutton').onclick = function(){
                    me.search();
                    if (document.getElementById('pdoksearchresults').style.display=='none'){
                        me.showResults();
                    }
                    else{
                        me.hideResults();
                    }
                }
        return this.div;
    },

    handleGeocodeResponse: function(req){

        var responseText = req.responseText;
        if (responseText && (responseText.indexOf('FAILED') != -1 ||
            responseText.indexOf('Exception') != -1 )) {
            // fail silently
            return false;
        }
        var xlslusFormat = new Geozet.Format.XLSLUS();
        var xlslus = xlslusFormat.read(req.responseXML || req.responseText);
        if (xlslus.length == 0){
            hits = 0;
        }
        else{
            var hits=xlslus[0].numberOfGeocodedAddresses;
        }
        if (hits==0){
            // zero responses
            alert("Geen locaties gevonden ...");
        }
        else{
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
            if(hits>0){
//                $('#geocodeerresult').html('<span id="closedrawlocation" onclick="$(\'#geocodeerresult\').fadeOut(\'fast\')" class="closeWindow"><a onclick="return false;"><img src="api/styles/default/img/close.gif" alt="Sluiten" title="Sluiten"/></a></span>' +
//                    '<span class="searchedFor">Gezocht op: "'+jQuery("#searchLocation").val()+'"</span><h3>Zoekresultaten</h3><ul class="geozetSuggestions"></ul>');
                var searchString = document.getElementById('pdoksearchinput').value;
                document.getElementById('pdoksearchresults').innerHTML = 
                    '<span class="closeWindow"><a onclick="return false;"><img class="closeWindow" src="styles/default/img/close.gif" alt="Sluiten" title="Sluiten"/></a></span>' +
                    '<span class="searchedFor">Gezocht op: "'+searchString+'"</span><h3>Zoekresultaten</h3><ul id="geozetSuggestions" class="geozetSuggestions"></ul>';
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
                            toevoeging = '-'+address.building.subdivision
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

                // one hit? zoom to it. Otherwize show resultlist
                if(hits>1){
                    // hack to be able to handle results without geom
                    var x = geom?geom.x:150000;
                    var y = geom?geom.y:450000;
                    var z = geom?this.zoomScale[zoom]:this.zoomScale['provincie'];
                    var newId = -1;
                    if (geom) {
                        minx = Math.min(minx, x);
                        miny = Math.min(miny, y);
                        maxx = Math.max(maxx, x);
                        maxy = Math.max(maxy, y);
                        minzoom = Math.min(minzoom, this.zoomScale[zoom]);
                        var newFt = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(x, y), {"title": suggestion, "postcode": postcode, "adres": adres, "plaats": plaats, "gemeente": gemeente, "provincie": prov}
                        // ,{externalGraphic: 'js/img/marker.png', graphicHeight: 26, graphicWidth: 20}
                        );
                        newId = newFt.id;
                        features.push(newFt);
                    }
                    var gazHtml = '<li><a href="#" id="result_'+newId.split('.')[2]+'" x="'+x+'" y="'+y+'" z="'+z+'">' + suggestion +'</a></li>';
                    document.getElementById('geozetSuggestions').innerHTML += gazHtml;
                    this.showResults();
                }
                else{
                    // hack to be able to handle results without geom
                    var x = geom?geom.x:150000;
                    var y = geom?geom.y:450000;
                    var z = geom?this.zoomScale[zoom]:this.zoomScale['provincie'];
                    this.map.setCenter(new OpenLayers.LonLat(x, y), z);
                }
            }
        }
        return false;
    },

    search: function() {
        var searchString = document.getElementById('pdoksearchinput').value;
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
        document.getElementById('pdoksearchresults').style.display='none';
    },
    showResults: function() {
        //document.getElementById('pdoksearchresults').innerHTML = '';
        document.getElementById('pdoksearchresults').style.display='block';
    },

    CLASS_NAME: "OpenLayers.Control.GeocoderControl"
});
