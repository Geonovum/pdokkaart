/**
 * TODO: create some docs here to show how to define:
 * a point marker
 * a line marker
 * a polygon marker
 */

Pdok.Api.prototype.defaultStyles=[
        // all point marker styles will use mt0 as default
        // so you only have to define the props that are different from mt0
        // we will use OpenLayers.Util.applyDefault to use this one as default
        {
            id: 'mt0',
            name: 'Standaard marker',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/star-3.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt1',
            name: 'Informatie blauw',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/information_blue.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt2',
            name: 'Informatie groen',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/information_green.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt3',
            name: 'Informatie geel',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/information_yellow.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt4',
            name: 'Geonovum blauw',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/geonovum_blue.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt5',
            name: 'Geonovum groen',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/geonovum_green.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt6',
            name: 'Geonovum geel',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/geonovum_yellow.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt7',
            name: 'Rijks blauw',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/rijk_blue.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt8',
            name: 'Rijks groen',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/rijk_green.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt9',
            name: 'Rijks geel',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/rijk_yellow.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt10',
            name: 'Kadaster blauw',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/kadaster_blue.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt11',
            name: 'Kadaster groen',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/kadaster_green.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt12',
            name: 'Kadaster geel',
            externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/kadaster_yellow.png",
            graphicHeight: 37,
            graphicWidth: 32,
            graphicYOffset: -37
        },
        {
            id: 'mt13',
            name: 'Werkzaamheden',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictograms-road_signs-workman_ahead_roadsign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt14',
            name: 'Waarschuwing',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictogram-din-w000-general.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt15',
            name: 'Zeer licht ontvlambaar',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictogram-din-w001-flame.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt16',
            name: 'Explosief',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictogram-din-w002-rxplosion.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt17',
            name: 'Electriciteit',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictogram-din-w008-electricisty.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt18',
            name: 'Lage temperatuur',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictogram-din-w017-low_temerature.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt19',
            name: 'Wielrijders niet toegestaan',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictograms-road_signs-no_bicycles_roadsign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt20',
            name: 'Personenwagens niet toegestaan',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictograms-road_signs-no_cars_sign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt21',
            name: 'Verboden in te rijden',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictograms-road_signs-no_entry.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt22',
            name: 'Personen niet toegestaan',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictograms-road_signs-no_entry_sign_with_a_man.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt23',
            name: 'Opgelet',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictograms-road_signs-other_dangers_sign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt24',
            name: 'Verboden voor alle verkeer',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictograms-road_signs-simple_round_sign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt25',
            name: 'Stop',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictograms-road_signs-stop_sign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt26',
            name: 'Verkeerslichten',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictograms-road_signs-traffic_lights_ahead_sign.png',
            graphicHeight: 32,
            graphicWidth: 32,
            graphicYOffset: -32
        },
        {
            id: 'mt27',
            name: 'Verplichte rijrichting',
            externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictographs-ahead_only.png',
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
