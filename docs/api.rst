PDOK Kaart API
==============

Aanroepen met URL parameters
----------------------------

.. todo:: Iets meer uitleg over de Wizard

.. todo:: Noem de doelgroep en de use case

.. todo:: link naar rest van de documentatie

De Kaart Wizard genereert een URL waarin alle informatie opgeslagen is. Deze URL kan ook zonder de Wizard gemaakt worden met behulp van query parameters

::

	api.html?
	mapdiv=map_vialink&
	zoom=3&
	showlayerswitcher=true&
	showzoom=true&
	shownavigation=true&
	showscaleline=true&
	showmouseposition=true&
	loc=170000%2C470000&
	markersdef=http%3A%2F%2Fdemo-geoservices.rijkswaterstaat.nl%2Fpdokkaart%2Fapi%2Fjs%2Fpdok-markers.js&
	layersdef=http%3A%2F%2Fdemo-geoservices.rijkswaterstaat.nl%2Fpdokkaart%2Fapi%2Fjs%2Fpdok-layers.js&
	pdoklayers=BRT

.. todo:: plaats link naar voorbeelden

De Wizard kent een aantal beperkingen:

- lengte url
- complexiteit wizard
- wizard is bedoelt voor eenvoudige kaartjes, niet voor grote
webapplicaties (de JavaScript API kan daarvoor wel als basis dienen).


JavaScript API
--------------

o-informatie diensten (WMS, WFS, WMTS, KML, GeoJSON.) van PDOK te tonen.

.. todo:: wat is de JavaScript API?

.. todo:: wat zit er zoal in de API?

Via de globale `PDOK.api` en OpenLayers `map` JavaScript objecten kan een ontwikkelaar
met wat regels de PDOKKaart als basis gebruiken voor een (veel) uitgebreidere kaart-pagina.

.. NOTE:: in principe is PDOKKaart een dunne wrapper om OpenLayers heen, een mooie basis maar voor echt uitgebreide kaart-applicaties is het misschien net zo eenvoudig om zelf iets vanaf scratch te bouwen?

.. todo: hoe kan ik de JavaScript API gebruiken?

Alle code (pdok-api.js) wordt in principe opgehaald van een centrale
website. Alleen configuratie staat lokaal of in de webpagina.

:: 

    {
        "mapdiv":"map_101",
        "zoom":3,
        "showlayerswitcher":true,
        "showzoom":true,
        "shownavigation":true,
        "showscaleline":true,
        "showmouseposition":true,
        "loc":"170000, 470000",
        "baselayers":[{"id":"BRT","visible":true}],
        "markersdef":"http://demo-geoservices.rijkswaterstaat.nl/pdokkaart/api/js/pdok-markers.js",
        "layersdef":"http://demo-geoservices.rijkswaterstaat.nl/pdokkaart/api/js/pdok-layers.js"
    };

.. NOTE:: de 'standaardlagen' en de 'markers en lijnen' zijn geconfigureerd in aparte JSON bestanden, en kunnen dus worden vervangen door ander beter voor uw situatie eeigende lagen en makers/symbolen.

Ontwikkelen: zorg dat bovenin de pdok-api.js de twee meest benodigde URL's goed zijn geconfigureerd: 

::

    Pdok.ApiUrl = "http://kaart.pdok.nl/pdokkaart/api";`
    OpenLayers.ProxyHost = “http://<UWDOMEIN>.nl/cgi-bin/proxy.py”
