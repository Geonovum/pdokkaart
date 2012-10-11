// TODO (after PoC): improve object handling and classes, but works for now :)
// So make config object, with anonymous function, proper getters/setters etc

var mapPDOKKaart, markers, activeFeature, dragControl, drawControl, layerSwitcher;
var mouseover,mouseout,click,touchend;
var pdokachtergrondkaart;
var activeFeature;
var currentStep = 1;

// The proxyhost is needed for the geocoder
OpenLayers.ImgPath = 'api/img/';


function goTo(step) {

    disableEditTools();
    // if the step is allready open, close the step
    if ($('#step'+step).hasClass('active')){
        $('#step'+step).removeClass('active');
        return;
    }

    //set container for css styling i.e. make tabs active on selection	
    document.getElementById("step" + currentStep).className = "stepwrapper";
    currentStep = step;
    document.getElementById("step" + currentStep).className = "stepwrapper active";
    return false;
}

function disableEditTools(){
    // cleanup of edit controls
    // to always start with a clean sheet
    $('#addfeatures').attr('checked', false)
    $('#editfeatures').attr('checked', false)
    $('#externalfeatures').attr('checked', false)
    $('#addviamap').hide();
    $('#editviamap').hide();
    $('#addviaurltxt').hide();
    api.disableDrawingTool();
    api.disableEditingTool();
}

//select output code at Step 4
function selectCode() {
    document.getElementById("codeoutput").select();
    return false;
a}

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

// init is called after loading the settings page and initilizes the map and some GUI components, like the PDOK map layer selector and the "popin" windows
$(document).ready(function() {

    //setMapSize();
    //addFormEnhancements();
    //$(window).resize(setMapSize);
    //$('input:radio[name=editmarkers]')[0].checked = true;
    $('input:radio[name=mapsize]')[2].checked = true;

    // initiate the Pdok API object
    var o = OpenLayers.Util.getParameters();
    //var api = new Pdok.Api(o);
    api = new Pdok.Api(o);
    // popups and selectionControl of Api interfears with modifyFeatureControl
    // we disable them while we find out how to handle this
    // TODO handle this ...
    api.disablePopups();
    api.selectControl.deactivate();

    // for convenience reasons to reuse the OpenLayers Map object from the API, set it to a global object
    mapPDOKKaart = api.getMapObject();
    markers = api.featuresLayer;
    pdok_api_map_resize(550,440);
    api.map.zoomToExtent([-15000,300000,300000,640000], true);

    createOnClickEvents();
    createSearchLogic();
    createStyleSelector();
    createEditAttributes();
    createPdokLayers();
    createLocationToolLogic();
    createMarkersLogic();

    $('#step3 input:text').val('');
    createApiLinksAndCode();

   autoPopulateInputs();

    // not sure if we want this here
    api.map.events.register("moveend", this, createApiLinksAndCode );
});

function createOnClickEvents() {
    $('#opties').click( function(){MeerMinderOpties(); return false;} );
    $('#closedrawlocation').click( function(){$('#geocodeerresult').fadeOut('fast');} );
    $('#closedrawlocationhref').click( function(){return false;} );
    $('#searchlocationbutton').click( function(){searchLocationChanged();return false;} );
    $('#goto1').click( function() {return goTo(1); } );
    $('#goto2').click( function() {return goTo(2); } );
    $('#goto3').click( function() {return goTo(3); } );
    $('#goto4').click( function() {return goTo(4); } );
    $('#goto5').click( function() {createApiLinksAndCode();return goTo(5); } );
    $('#mapsize1').click( function() { pdok_api_map_resize(300,250) } );
    $('#mapsize2').click( function() { pdok_api_map_resize(400,350) } );
    $('#mapsize3').click( function() { pdok_api_map_resize(550,440) } );
    $('#maplayerswitcher').click( function() { setLayerSwitcherVisible(maplayerswitcher.checked); } );
    $('#addpdoklayerbutton').click( function() { addPdokLayer();return false; } );
    $('#addwmslayerbutton').click( function() { addWmsLayer();return false; } );
    $('#addwmtslayerbutton').click( function() { addWmtsLayer();return false; } );
    $('#deletelayers').click( function() { api.deleteLayers();return false; } );
}

// function to automatically creat a hint text based on a title attribute
function autoPopulateInputs() {
    if(!document.getElementById||!document.createTextNode){return;}
    var arrInputs=$('input.autopopulate, textarea.autopopulate');
    var iInputs=arrInputs.length;
    var oInput;
    for(var i=0;i<iInputs;i++){
        oInput=arrInputs[i];
        if((oInput.type=='text' || oInput.type=='textarea')==false){continue;}
        if((oInput.value=='')&&(oInput.title!='')){oInput.value=oInput.title;$(oInput).addClass('default');}
        if(oInput.value==oInput.title){$(oInput).addClass('default');}
        $('input.autopopulate, textarea.autopopulate').focus(
            function(){
                // we put &nbsp; as fake value, this is actually a ''
                if(this.value==this.title || this.value=='&nbsp;'){
                    this.value='';this.select();
                    $(this).val('').removeClass('default');
                }
        });
        $('input.autopopulate, textarea.autopopulate').blur(
            function(){
                if(!this.value.length){
                    this.value=this.title;
                    $(this).addClass('default');
                } 
                else {
                    if(this.value!=this.title){
                        $(this).removeClass('default');
                    }
                }
        });
    }
}

function createSearchLogic() {
    $('#geocodeerresult').delegate('li a','click', function (evt) {
        var x = $("span.x", this).text();
        var y = $("span.y", this).text();
        var z = $("span.z", this).text();
        var ft_id = $("span.ft_id", this).text();
        if(x && y){
            mapPDOKKaart.setCenter(new OpenLayers.LonLat(x, y), z);
            $('#geocodeerresult').hide();
        }
        else {
            alert("fout met coordinaten");
        }
        return false;
    });
}

function createMarkersLogic() {
    $('#editmarkers input[type=radio]').click(function(){
        if (this.id == 'addfeatures') {
            if ($('#addviamap').is(':visible')) {
                $('#addviamap').hide();
                $(this).attr('checked', false);
                api.disableDrawingTool();
            }
            else {
                $('#addviamap').show();
                $('#editviamap').hide();
                $('#addviaurltxt').hide();
                enableStyleSelector();
            }
        }
        else if (this.id == 'editfeatures') {
            if ($('#editviamap').is(':visible')) {
                api.disableEditingTool();
                $(this).attr('checked', false);
                $('#editviamap').hide();
                $('#edit2a').hide();
            }
            else {
                disableEditTools();
                // disableEditTools() also unchecks the radio, check it here
                $(this).attr('checked', true);
                $('#addviamap').hide();
                $('#editviamap').show();
                $('#addviaurltxt').hide();
                startEditingPoint();
            }
        }
        else if (this.id == 'externalfeatures') {
            if ($('#addviaurltxt').is(':visible')) {
                $('#addviaurltxt').hide();
                $(this).attr('checked', false);
            }
            else {
                $('#addviamap').hide();
                $('#editviamap').hide();
                $('#addviaurltxt').show();
            }
        }
    });
    /*
    $('#editmarkers input[type=radio]').click(function(){
        console.log(1, $(this).val());
        console.log(2, $("#editmarkers input:checked").val())
    });
    */
    $('#getfeaturesfromurl').click(function(){
        var format = $('#addviaurltxt input[name=urltype]:checked').val();
        api.addFeaturesFromUrl($('#urltext').val(), format.toUpperCase(), true);
        return false;
    });

    $('#getfeaturesfromtxt').click(function(){
        var format = $('#addviaurltxt input[name=txttype]:checked').val();
        // always adding a newline (for TXT format)
        api.addFeaturesFromString($('#copypaste').val()+'\n', format.toUpperCase(), true);
        return false;
    });
    // automatic selection of the inputs on select
    /*
    $('.row_right input:text').click(function(){ this.select(); });
    $('.row_right textarea').click(function(){ this.select(); });
    $("#urltext").click(function(){ this.select(); });
    $("#copypaste").click(function(){ this.select(); });
    */
}

function createLocationToolLogic() {
    // locationtool properties
    var locationToolPropertyChange = function() {
        // disable locationtool if 'none' is selected
        if (this.id=='none'){
            api.removeLocationToolProps();
            // hide all field inputs
            $('#yfield,#xfield,#wktfield').hide();
            $('#locationtoolzooms').hide();
        }
        else {
            $('#locationtoolzooms').show();
            var xorwkt = $('#wktfield input').val();
            var y = $('#yfield input').val();
            var zmin = parseInt($('#zmin').val());
            var zmax = parseInt($('#zmax').val());
            var locationtype = $("input[name=locationtoolstyle]:checked").attr('id');
            var styletype = $("input[name=locationtoolstyle]:checked").val();
            // showing and hiding of different inputs
            if(locationtype=='pointxy'){
                $('#yfield,#xfield').show();
                $('#wktfield').hide();
                xorwkt = $('#xfield input').val();
                if(xorwkt==''){xorwkt='x'} // no prefilling, but defaulting for prop setting
                y = $('#yfield input').val();
                if(y==''){y='y'} // no prefilling, but defaulting for prop setting
            }
            else if(locationtype=='line' || locationtype=='point' || locationtype=='polygon'){
                $('#yfield,#xfield').hide();
                $('#wktfield').show();
                if(xorwkt==''){xorwkt='wkt'} // no prefilling, but defaulting for prop setting
                y = null;
            }
            // preview of zoom borders, and some checking that min<max and max>min
            if(this.id=='zmin') {
                api.map.zoomTo(zmin); // preview
                if(zmin>zmax) {
                    zmax = zmin;
                    $('#zmax').val(zmax);
                }
            }
            else if(this.id=='zmax') {
                api.map.zoomTo(zmax); // preview
                if(zmax<zmin) {
                    zmin = zmax;
                    $('#zmin').val(zmin);
                }
            }
            // setting props with current values
            api.setLocationToolProps(styletype, zmin, zmax, xorwkt, y);
        }
    }
    // attaching above logic to diffent inputs of the locationtool form
    $('#locationtoolform input[type=radio], #locationtoolform select').change(locationToolPropertyChange);
    //$('#locationtoolfield input[type=text]').keyup(locationToolPropertyChange);  // IE7 problem
    $('#locationtoolfield input[type=text]').change(locationToolPropertyChange);

}

function enableStyleSelector(){
    api.disableEditingTool();
    api.disableDrawingTool();
    $('#styleselector').show();
    $('#edit2a').hide();
    //default style selected
    featureCreatedCallback = function(feature){
        // you get a handle here to the feature last modified
        //console.log(feature);
        activeFeature = feature;
        $('#edit2a').prependTo($('#addviamap2'));
        // clean up cruft
        $('#attr_name').val('');
        $('#description').val('');
        autoPopulateInputs();
        $('#edit2a').show();
    }
    // no popup during editing
    api.disablePopups();
    api.enableDrawingTool("mt0", featureCreatedCallback);

    $('#styleselector li').removeClass('styleselected');
    $('#mt0').addClass('styleselected');
}


function createStyleSelector(){

// dynamically creating the selectbox for the feature types

    $('#edit2').html('<div id="styleselector"><ul></ul></div>');
    var apiStyles = api.styles;
    pointStylesHtml = '';
    polygonStylesHtml = '';
    lineStylesHtml = '';

    for (styleId in apiStyles){
        // for now only point markers!
        if (styleId[0]=='m'){
            var style = apiStyles[styleId];
            pointStylesHtml += '\n<li id="'+styleId+'" style="styleitem"><div><img src="'+style.externalGraphic+
                '"><div class="listyletext">'+style.name+'</div></div></li>';
        }
        else if (styleId[0]=='l'){
            var style = apiStyles[styleId];
            lineStylesHtml += '\n<li id="'+styleId+'" style="styleitem"><div style="opacity:'+style.strokeOpacity+
            '; border-top: '+style.strokeWidth+'px '+style.strokeColor+' solid;border-left: '+style.strokeWidth+'px '+
            style.strokeColor+' solid;float:left;"><div>&nbsp;&nbsp;&nbsp;&nbsp;</div></div><div class="listyletext"> '+
            style.name+'</div></li>';
        }
        else if (styleId[0]=='p'){
            var style = apiStyles[styleId];
            polygonStylesHtml += '\n<li id="'+styleId+'" style="styleitem"><div style="opacity:'+style.strokeOpacity+
                ';border: '+style.strokeWidth+'px '+style.strokeColor+' solid;float:left;"><div style="width:16px; opacity:'+
                style.fillOpacity+';background-color:'+style.fillColor+';">&nbsp;&nbsp;&nbsp;&nbsp;</div></div><div class="listyletext"> '+
                style.name+'</div></li>';
        }
    }
    var pointSeparator = '<li><div class="stylehead">Puntsymbolen<div></li>';
    var lineSeparator = '<li><div class="stylehead">Lijnstijlen<div></li>';
    var polygonSeparator = '<li><div class="stylehead">Vlakstijlen<div></li>';
    $('#styleselector ul').append(
        pointSeparator+pointStylesHtml+
        lineSeparator+lineStylesHtml+
        polygonSeparator+polygonStylesHtml);
    $('#styleselector').delegate('li', 'click', function(){
        var styleId = $(this).attr('id');
        // only clickable styles have an id
        if(!styleId){
            // probably a title header
            return;
        }
        $('#styleselector li').removeClass('styleselected');
        $(this).addClass('styleselected');
        featureCreatedCallback = function(feature){
            // you get a handle here to the feature last modified
            // console.log(feature);
            activeFeature = feature;
            $('#edit2a').prependTo($('#addviamap2'));
            $('#attr_name').val('');
            $('#description').val('');
            autoPopulateInputs();
            $('#edit2a').show();
        }
        api.enableDrawingTool(styleId, featureCreatedCallback);
    });
}

function createPdokLayers(){

    //Sort layernames alphabetically
    layernames=[];
    i = 0;
    for (layer in api.defaultLayers){
    	layernames[i]= api.defaultLayers[layer].name;
    	i = i + 1;
    }
    layernames = layernames.sort();

    var html = '<select id="pdokLayerSelector" onselect="addPdokLayer(this.value)">' +
                '<option value="-">-- Kies een PDOK kaartlaag --</option>'
    for (layernum in layernames){
		for (layer in api.defaultLayers){
			// Because the layer 'BRT' is always the defaultlayer it is not necessary to show this layer in the select-list
			if (api.defaultLayers[layer].name == layernames[layernum] && layer != "BRT"){
				html = html + '<option value="'+ layer + '">' + api.defaultLayers[layer].name + '</option>'
			}
		}
	}
    html = html + '</select>'
    $('#divpdoklayerselector').html(html);
}

function createEditAttributes () {

    var html = '<input id="attr_name" type="text" name="searchLocation" class="autopopulate default" title="een titel voor in de popup" />';
    html += '<textarea id="description" class="autopopulate default" title="en optioneel een omschrijving"></textarea>';
    html += '<button class="filterbutton" onclick="saveAttributes();return false;">Opslaan tekst</button>';
    html += '<button class="filterbutton" onclick="deleteFeature();return false;">Verwijderen marker</button>';
    $('#edit2a').html(html);
    $("#attr_name").click(function(){
        // Select input field contents
        this.select();
    });
    $("#description").click(function(){
        // Select input field contents
        this.select();
    });
}


function createFieldnameInput(radiobutton) {
    var  geometrie = $(radiobutton).attr('value') ;
    var html = ''; 
    if (geometrie == 'mt1') {
        html = html + '<label>X-co&ouml;rdinaat  : <input id="xcoord" type="text" value=""  /></label></br>';
        html = html + '<label>Y-co&ouml;rdinaat : <input id="ycoord" type="text" value=""  /></label></br>';
    }
    else if (geometrie == 'lt1' || geometrie == 'pt1') {
        html = html + '<label>Veldnaam (wkt):<input id="veldnaam" type="text" value=""  /></label>';
    }
    else {
        html = '';
    };
    $('#divveldnaam').html(html);
};


function saveAttributes() {
    var nameDefault = $('#attr_name').attr('title');
    var descDefault = $('#description').attr('title');

    $('#edit2a').hide();
    if ($('#attr_name').val()==nameDefault || $('#attr_name').val()=='') {
        $('#attr_name').val('&nbsp;');  // we default to &nbsp;
    }
    activeFeature.attributes.name = $('#attr_name').val();
    if ($('#description').val()==descDefault || $('#description').val()=='') {
        $('#description').val('&nbsp;');  // we default to &nbsp;
    }
    activeFeature.attributes.description = $('#description').val().replace(/\n/g,"<br/>");

    for (var f in api.featuresLayer.selectedFeatures) {
        // attributes dialog will be closed now:
        // unselect all features to be able to click on the same feature again to edit it again
        api.editFeatureControl.unselectFeature(api.featuresLayer.selectedFeatures[f]);
        api.featuresLayer.selectedFeatures = [];
    }
}

function featureModifiedCallback(domevent){
    activeFeature = domevent.feature;
    $('#edit2a').appendTo($('#editviamap'));
    var desc = activeFeature.attributes.description;
    var name = activeFeature.attributes.name;
    if (desc == '&nbsp;'){ desc = '';}
    if (name == '&nbsp;'){ name = '';}
    $('#attr_name').val(name);
    $('#description').val(desc);
    autoPopulateInputs();
    $('#edit2a').show();
}

function deleteFeature() {
    var ok = confirm ("Deze marker verwijderen?")
    if (ok) {
        markers.removeFeatures([activeFeature]);
        markers.refresh();
        // without this disabling and enabling we have a 
        // null pointer somewhere in the event handling of OL
        api.disableEditingTool();
        api.enableEditingTool(featureModifiedCallback);
    } else {
		api.disableEditingTool();
        api.enableEditingTool(featureModifiedCallback);
	}
    $('#edit2a').hide();
}

function startEditingPoint() {
    api.disableEditingTool();
    api.disableDrawingTool();
    api.enableEditingTool(featureModifiedCallback);
}


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

function showError(msg){
	alert(msg);
}

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
    if (xlslus.length == 0){
    	hits = 0;
    }
    else{
	    var hits=xlslus[0].numberOfGeocodedAddresses;
	}
    if (hits==0){
        // zero responses
        this.showError("Geen locaties gevonden ...");
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
            $('#geocodeerresult').html('<span id="closedrawlocation" onclick="$(\'#geocodeerresult\').fadeOut(\'fast\')" class="closeWindow"><a onclick="return false;"><img src="api/styles/default/img/close.gif" alt="Sluiten" title="Sluiten"/></a></span>' +
                '<span class="searchedFor">Gezocht op: "'+jQuery("#searchLocation").val()+'"</span><h3>Zoekresultaten</h3><ul class="geozetSuggestions"></ul>');
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
            
            // one hit? zoom to it. Otherwize show resultlist
            if(hits>1){
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
                var gazHtml = '<li id="listitem_'+newId.split('.')[2]+'"><a href="#">' + suggestion +' <span class="x">'+x+'</span> <span class="y">'+y+'</span> <span class="z">'+z+'</span> <span class="ft_id" id="searchresult_'+newId.split('.')[2]+'">'+newId+'</span></a></li>';
                $("ul.geozetSuggestions").append(gazHtml);
                $('#geocodeerresult').show()
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
    }
    return false;
}


 function addWmsLayer() {
	api.addWMS($("#wmsUrl").val(), $("#wmsLayer").val());
}

function addWmtsLayer() {
	api.addWMTS($("#WmtsUrl").val(), $("#WmtsLayer").val(), $("#WmtsMatrix").val());
} 

function addPdokLayer() {
	api.addLayers([$("#pdokLayerSelector").val()]);
}

function createApiLinksAndCode() {
	var strGeneratedUrlToLongMessage = "";
    var apiLink = api.createMapLink();
    if (apiLink.length > 2100){
    	strGeneratedUrlToLongMessage = "De gemaakte URL is langer dan 2000 tekens!\nDe totale lengte is " + apiLink.length + " tekens.\nOmdat hierdoor sommige browsers een foutmelding geven, worden de URL's niet getoond.";
    	$("#generated_url_to_long_message").val(strGeneratedUrlToLongMessage);
		$("#generated_url_to_long_message").show();
		$("#generated_url").hide();
    }
    else{
		$("#generated_url_to_long_message").val(strGeneratedUrlToLongMessage);
		$("#generated_url_to_long_message").hide();
		$("#generated_url").show();
    }
    $("#apilink1").attr('href', apiLink);
    $("#apilink2").val(apiLink);
    $("#apilink3").attr('href', api.createMailLink());
    $("#embedhtmliframe").val(api.createIframeTags());
    $("#embedhtmlobject").val(api.createObjectTags());
    $("#scriptcodeHead").val(api.createHtmlHead());
    $("#scriptcodeBody").val(api.createHtmlBody());
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

function setLayerSwitcherVisible(isVisible){
	if (isVisible){
		$('.olControlLayerSwitcher').show();
	}
	else{
		$('.olControlLayerSwitcher').hide();
	}
	api.setLayerSwitcherVisible(isVisible);
}
