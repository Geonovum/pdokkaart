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
};

function MeerMinderOpties() {

    //if (document.getElementById('opties').value == "Meer opties") {
    if ($("#opties").val() ===  "Meer opties") {
        $('#step3').toggle();
        $('#step4').toggle();
        $('#opties span').text('Minder opties');
        $("#opties").attr('value', 'Minder opties');

    } else {
        $('#step3').toggle();
        $('#step4').toggle();
        $('#opties span').text('Meer opties');
        $("#opties").attr('value', 'Meer opties');
    }
}

function SearchArray(arr, obj) {
    for(var i=0; i<arr.length; i++) {
        if (arr[i][0] === obj) return arr[i][1];
    }
}

// init is called after loading the settings page and initilizes the map and some GUI components, like the PDOK map layer selector and the "popin" windows

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
    $('#getpdokkaarturl').click( function() { reload_wizard_based_on_url();return false; } );
    $('#mapsize1').click( function() { pdok_api_map_resize('small'); } );
    $('#mapsize2').click( function() { pdok_api_map_resize('medium'); } );
    $('#mapsize3').click( function() { pdok_api_map_resize('big'); } );
    $('#maplayerswitcher').click( function() { setLayerSwitcherVisible($('#maplayerswitcher').is(':checked')); } );
    $('#mapzoom').click( function() { setZoomVisible($('#mapzoom').is(':checked')); } );
    $('#mapnavigation').click( function() { setNavigation($('#mapnavigation').is(':checked')); } );
    $('#mapscaleline').click( function() { setScaleLineVisible($('#mapscaleline').is(':checked')); } );
    $('#mapmouseposition').click( function() { setMousePositionVisible($('#mapmouseposition').is(':checked')); } );
    $('#mapsearch').click( function() { setMapsearchVisible($('#mapsearch').is(':checked')); } );
    $('#addpdoklayerbutton').click( function() { addPdokLayer();return false; } );
    $('#addwmslayerbutton').click( function() { addWmsLayer();return false; } );
    $('#addwmtslayerbutton').click( function() { addWmtsLayer();return false; } );
    $('#deletelayers').click( function() { api.deleteLayers();return false; } );
    $('#kmlservicelink').click( function() { api.kmlToService();return false; } );
}

// function to automatically creat a hint text based on a title attribute
function autoPopulateInputs() {
    if(!document.getElementById||!document.createTextNode){return;}
    var arrInputs=$('input.autopopulate, textarea.autopopulate');
    var iInputs=arrInputs.length;
    var oInput;
    for(var i=0;i<iInputs;i++){
        oInput=arrInputs[i];
        if((oInput.type === 'text' || oInput.type === 'textarea') === false){
            continue;
        }
        if(oInput.value === '' && oInput.title !== ''){
            oInput.value=oInput.title;$(oInput).addClass('default');
        }
        if(oInput.value === oInput.title) {
            $(oInput).addClass('default');
        }
        $('input.autopopulate, textarea.autopopulate').focus(
            function(){
                // we put &nbsp; as fake value, this is actually a ''
                if(this.value ===this.title || this.value === '&nbsp;'){
                    this.value='';
                    this.select();
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
                    if(this.value !== this.title){
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
        if (this.id === 'addfeatures') {
            if ($('#addviamap').is(':visible')) {
                $('#addviamap').hide();
                api.disableDrawingTool();
            } else {
                $('#addviamap').show();
                $('#editviamap').hide();
                $('#addviaurltxt').hide();
                enableStyleSelector();
            }
        } else if (this.id === 'editfeatures') {
            if ($('#editviamap').is(':visible')) {
                api.disableEditingTool();
                $('#editviamap').hide();
                $('#edit2a').hide();
            } else {
                disableEditTools();
                // disableEditTools() also unchecks the radio, check it here
                $('#addviamap').hide();
                $('#editviamap').show();
                $('#addviaurltxt').hide();
                startEditingPoint();
            }
        } else if (this.id === 'externalfeatures') {
            if ($('#addviaurltxt').is(':visible')) {
                $('#addviaurltxt').hide();
            }
            else {
                $('#addviamap').hide();
                $('#editviamap').hide();
                $('#addviaurltxt').show();
            }
        }
    });

    $('#getfeaturesfromurl').click(function(){
        var format = $('#addviaurltxt input[name=urltype]:checked').val();
        api.addFeaturesFromUrl($('#urltext').val(), format.toUpperCase(), true, api);
        return false;
    });

    $('#getfeaturesfromtxt').click(function(){
        var format = $('#addviaurltxt input[name=txttype]:checked').val();
        // always adding a newline (for TXT format)
        api.addFeaturesFromString($('#copypaste').val()+'\n', format.toUpperCase(), true);
        return false;
    });
}

function createLocationToolLogic() {
    // locationtool properties
    var locationToolPropertyChange = function() {
        // disable locationtool if 'none' is selected
        if (this.id === 'none'){
            api.removeLocationToolProps();
            // hide all field inputs
            $('#urlfield,#yfield,#xfield,#wktfield').hide();
            $('#locationtoolzooms').hide();
        } else {
            $('#locationtoolzooms').show();
            var xorwkt = $('#wktfield input').val();
            var y = $('#yfield input').val();
            var url = $('#urlfield input').val();
            var zmin = parseInt($('#zmin').val());
            var zmax = parseInt($('#zmax').val());
            var locationtype = $("input[name=locationtoolstyle]:checked").attr('id');
            var styletype = $("input[name=locationtoolstyle]:checked").val();
            // showing and hiding of different inputs
            if(locationtype === 'pointxy'){
                $('#yfield,#xfield').show();
                $('#wktfield').hide();
                xorwkt = $('#xfield input').val();
                if( xorwkt === ''){
                    xorwkt='x';
                } // no prefilling, but defaulting for prop setting
                y = $('#yfield input').val();
                if(y === ''){
                    y = 'y';
                } // no prefilling, but defaulting for prop setting
            } else if(locationtype ==='line' || locationtype ==='point' || locationtype ==='polygon'){
                $('#yfield,#xfield').hide();
                $('#wktfield').show();
                if(xorwkt === ''){
                    xorwkt='wkt';
                } // no prefilling, but defaulting for prop setting
                y = null;
            }
            $('#urlfield').show();
            // preview of zoom borders, and some checking that min<max and max>min
            if(this.id === 'zmin') {
                api.map.zoomTo(zmin); // preview
                if(zmin > zmax) {
                    zmax = zmin;
                    $('#zmax').val(zmax);
                }
            }
            else if(this.id === 'zmax') {
                api.map.zoomTo(zmax); // preview
                if(zmax < zmin) {
                    zmin = zmax;
                    $('#zmin').val(zmin);
                }
            }
            // setting props with current values
            api.setLocationToolProps(styletype, zmin, zmax, url, xorwkt, y);
        }
    };
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
    };
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
        if (styleId[0] === 'm'){
            var style = apiStyles[styleId];
            pointStylesHtml += '\n<li id="'+styleId+'" style="styleitem"><div><img src="'+style.externalGraphic+
                '"><div class="listyletext">'+style.name+'</div></div></li>';
        } else if (styleId[0] === 'l'){
            var style = apiStyles[styleId];
            lineStylesHtml += '\n<li id="'+styleId+'" style="styleitem"><div style="opacity:'+style.strokeOpacity+
            '; border-top: '+style.strokeWidth+'px '+style.strokeColor+' solid;border-left: '+style.strokeWidth+'px '+
            style.strokeColor+' solid;float:left;"><div>&nbsp;&nbsp;&nbsp;&nbsp;</div></div><div class="listyletext"> '+
            style.name+'</div></li>';
        } else if (styleId[0] === 'p') {
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
        };
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
        '<option value="-">-- Kies een kaartlaag --</option>';
    for (layernum in layernames){
        for (layer in api.defaultLayers){
            // Because the layer 'BRT' is always the defaultlayer it is not necessary to show this layer in the select-list
            if (api.defaultLayers[layer].name === layernames[layernum] && layer !== "BRT"){
                html = html + '<option value="'+ layer + '">' + api.defaultLayers[layer].name + '</option>';
            }
        }
    }
    html = html + '</select>';
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
    if (geometrie === 'mt1') {
        html = html + '<label>X-co&ouml;rdinaat  : <input id="xcoord" type="text" value=""  /></label></br>';
        html = html + '<label>Y-co&ouml;rdinaat : <input id="ycoord" type="text" value=""  /></label></br>';
    }
    else if (geometrie === 'lt1' || geometrie === 'pt1') {
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
    if ($('#attr_name').val() === nameDefault || $('#attr_name').val() === '') {
        $('#attr_name').val('&nbsp;');  // we default to &nbsp;
    }
    activeFeature.attributes.name = $('#attr_name').val();
    if ($('#description').val() === descDefault || $('#description').val() === '') {
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
    if (desc === '&nbsp;'){ desc = '';}
    if (name === '&nbsp;'){ name = '';}
    $('#attr_name').val(name);
    $('#description').val(desc);
    autoPopulateInputs();
    $('#edit2a').show();
}

function deleteFeature() {
    markers.destroyFeatures([activeFeature]);
    markers.refresh();
    // without this disabling and enabling we have a 
    // null pointer somewhere in the event handling of OL
    api.disableEditingTool();
    api.enableEditingTool(featureModifiedCallback);
    $('#edit2a').hide();
}

function startEditingPoint() {
    api.disableEditingTool();
    api.disableDrawingTool();
    api.enableEditingTool(featureModifiedCallback);
}


function showError(msg){
    alert(msg);
}

function addWmsLayer() {
    if ( ($("#wmsUrl").val().slice(0,4) === "bijv") || ($("#wmsLayer").val().slice(0,4) === "bijv") ){
        alert("U heeft geen URL naar, of een laagnaam van een WMS opgegeven");
    } else{
        // wizard is just able to handle ONE wmsurl (because of the use of query params)
        // if you need more: create a map via code
        if (undefined != api.wmsurl){
            var layer = api.findWMS(api.wmsurl, api.wmslayers);
            var msg = "Er is al een extra WMS laag gedefinieerd voor deze kaart\nEr kan in de wizard slechts 1 extra laag worden toegevoegd. \nWilt u de oude keuze overschrijven?"
            var overwrite = confirm(msg);
            if (overwrite) {
                if (layer != null) {
                    api.map.removeLayer(layer);
                }
            }
            else{
                return;
            }
        }
        api.addWMS($("#wmsUrl").val(), $("#wmsLayer").val(), $("#wmsInfoFormat").val());
    }
}

function addWmtsLayer() {
    if ( ($("#WmtsUrl").val().slice(0,4) === "bijv") || 
            ($("#WmtsLayer").val().slice(0,4) === "bijv") || 
            ($("#WmtsMatrix").val().slice(0,4) === "bijv") ) {
        
        alert("U heeft geen URL naar, een laagnaam of een projectie van een WMTS opgegeven");
    } else {
        // wizard is just able to handle ONE wmtsurl (because of the use of query params)
        // if you need more: create a map via code
        if (undefined != api.wmtsurl){
            var layer = api.findWMTS(api.wmsurl, api.wmslayers);
            var msg = "Er is al een extra WMTS laag gedefinieerd voor deze kaart\nEr kan in de wizard slechts 1 extra laag worden toegevoegd. \nWilt u de oude keuze overschrijven?"
            var overwrite = confirm(msg);
            if (overwrite) {
                if (layer != null) {
                    api.map.removeLayer(layer);
                }
            }
            else{
                return;
            }
        }
        api.addWMTS($("#WmtsUrl").val(), $("#WmtsLayer").val(), $("#WmtsMatrix").val());
    }
} 

function addPdokLayer() {
    api.addLayers([{id: $("#pdokLayerSelector").val(),visible: true}]);
}

function createApiLinksAndCode() {
    var strGeneratedUrlToLongMessage = "";
    var apiLink = api.createMapLink();
    var apiLinkMinimal = api.createMinimalMapLink();
    if (apiLink.length > 2100) {
        strGeneratedUrlToLongMessage = "De gemaakte URL is langer dan 2000 tekens!\nDe totale lengte is " + apiLink.length + " tekens.\nOmdat hierdoor sommige browsers een foutmelding geven, worden de URL's niet getoond.";
        if (Pdok.ApiKmlService && Pdok.ApiKmlService.length > 0) {
            strGeneratedUrlToLongMessage += "\nU kunt via de knop 'KML-opslagservice' eventueel de KML vervangen door een KML-url.";
            $("#kml_url_service").show();
        }
        $("#generated_url_to_long_message").val(strGeneratedUrlToLongMessage);
        $("#generated_url_to_long_message").show();
        $("#generated_url").hide();
    } else {
        $("#generated_url_to_long_message").val(strGeneratedUrlToLongMessage);
        $("#generated_url_to_long_message").hide();
        $("#generated_url").show();
        $("#kml_url_service").hide();
    }
    $("#apilink1").attr('href', apiLink);
    $("#apilink1_minimal").attr('href', apiLinkMinimal);
    $("#apilink2").val(apiLink);
    $("#apilink3").attr('href', api.createMailLink());
    $("#embedhtmliframe").val(api.createIframeTags());
    $("#embedhtmlobject").val(api.createObjectTags());
    $("#scriptcodeBody").val(api.createHtml() + "\n");
    $('#featuresKML').val(api.createKML() + "\n");
    // data:application/vnd.google-earth.kml+xml
    // data:text/csv
    if (navigator.appVersion.indexOf('MSIE 10')>=0 || navigator.userAgent.indexOf('Trident')>=0) {
        // IE >=10  cannot handle data-uri's
        $('#download_kml_span').hide();
    }
    else {
        $('#download_kml').attr('href', 'data:application/vnd.google-earth.kml+xml;charset=utf-8,' + api.createKML(true))
    }

}

function removeFeature (ft_id) {
    var ok = confirm ("Deze locatie verwijderen?");
    if (ok) {
        $('#listitem_'+ft_id.split('.')[2]).remove();
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
 

function pdok_api_map_resize(size) {
    if(api){
        api.setSizeByName(size);
    }
}

function setLayerSwitcherVisible(isVisible){
    if (isVisible){
        $('.olControlLayerSwitcher').show();
    } else {
        $('.olControlLayerSwitcher').hide();
    }
    api.setLayerSwitcherVisible(isVisible);
}
function setZoomVisible(isVisible){
    if (isVisible){
        $('.olControlZoom').show();
    } else {
        $('.olControlZoom').hide();
    }
    api.setZoomVisible(isVisible);
}
function setScaleLineVisible(isVisible){
    if (isVisible){
        $('.olControlScaleLine').show();
    } else {
        $('.olControlScaleLine').hide();
    }
    api.setScaleLineVisible(isVisible);
}
function setNavigation(isVisible){
    api.setNavigation(isVisible);
}
function setMousePositionVisible(isVisible){
    if (isVisible){
        $('.olControlMousePosition').show();
    } else {
        $('.olControlMousePosition').hide();
    }
    api.setMousePositionVisible(isVisible);
}
function setMapsearchVisible(isVisible){
    if (isVisible){
        api.activateGeocoder({div:'searchthingonthemap'});
        $('#searchthingonthemap').show();
    } else {
        $('#searchthingonthemap').hide();
    }
    api.setMapsearchVisible(isVisible);
}
function reload_wizard_based_on_url(){
    strUrl = $('#pdokkaartUrl').val();
    if (strUrl.substr(0,4).toUpperCase() === 'HTTP'){
        if (strUrl.indexOf('?') > -1){
            window.location.replace(Pdok.ApiUrl.split('api')[0] + '?' + strUrl.split('?')[1]);
        }
    } else {
        alert('Fout bij het ophalen van de url\n(Let op: een externe url moet met \'http://\' beginnen) ');
        return;
    }
}
function setCheckbox(id, value) {
    // unchecks if value is false or undefined, otherwise checks
    if (value) {
        $(id).prop("checked", true)
    } else {
        $(id).prop("checked", false)
    }
}
function setGuiToApiState(api) {
    var config = api.getConfig();
    setCheckbox('#maplayerswitcher', config.showlayerswitcher);
    setCheckbox('#mapzoom', config.showzoom);
    setCheckbox('#mapnavigation', config.navigation);
    setCheckbox('#mapscaleline', config.showscaleline);
    setCheckbox('#mapmouseposition', config.showmouseposition);
    setCheckbox('#mapsearch', config.geocoder);
}
