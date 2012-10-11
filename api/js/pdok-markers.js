

/** 
 * TODO: create some docs here to show how to define: 
 * a point marker 
 * a line marker 
 * a polygon marker 
 */ 
 
Pdok.Api.prototype.defaultStyles=[ 
        // all point marker styles will use mt0 as default 
        // so you only have to define the props that are different from mt0 
        // mt0, pt0, lt0 are defined in pdok-api.js, so defining it here will override that one 
	{ 
		id: 'mt1', 
		name: 'Informatiebord blauw', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/emblem-notice.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt2', 
		name: 'Ster', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/bookmark-4.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt3', 
		name: 'Stip groen', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/circle_green.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt4', 
		name: 'Stip rood', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/circle_red.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt5', 
		name: 'Stip paars', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/circle_purple.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt6', 
		name: 'Vlag groen', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/flag-2.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicXOffset: -7,
		graphicYOffset: -32 
	}, 
	{ 
		id: 'mt7', 
		name: 'Vlag blauw', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/flag-blue.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicXOffset: -7,
		graphicYOffset: -32 
	}, 
	{ 
		id: 'mt8', 
		name: 'Vlag rood', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/flag-red.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicXOffset: -7,
		graphicYOffset: -32 
	}, 
	{ 
		id: 'mt9', 
		name: 'Vlag geel', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/flag-yellow.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicXOffset: -7,
		graphicYOffset: -32 
	}, 
	{ 
		id: 'mt10', 
		name: 'Vlag zwart', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/flag-black.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicXOffset: -7,
		graphicYOffset: -32 
	}, 
	{ 
		id: 'mt11', 
		name: 'Smiley', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/amor-3.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt12', 
		name: 'Stoplicht', 
		externalGraphic: "http://pdokkaart.pdokloket.nl/api/markertypes/daemons.png", 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt13', 
		name: 'Werkzaamheden pion', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/vlc.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt14', 
		name: 'Werkzaamheden bord', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/happydigger.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	},       
	
	{ 
		id: 'mt15', 
		name: 'Stop', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictograms-road_signs-stop_sign.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt16', 
		name: 'Verplichte rijrichting', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictographs-ahead_only.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	},	
	{ 
		id: 'mt17', 
		name: 'Horeca', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/kteatime-2.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt18', 
		name: 'Voetgangersgebied', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictograms-protections-10.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt19', 
		name: 'Electriciteit', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/preferences-web-browser-cache-2.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt20', 
		name: 'Rolstoel toegankelijk', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/preferences-desktop-accessibility-6.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt21', 
		name: 'Wifi beschikbaar', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/wifi-radar.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt22', 
		name: 'Telefoon', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/call-start.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt23', 
		name: 'Kruis rood', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/dialog-cancel.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt24', 
		name: 'Pion', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/im-user.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt25', 
		name: 'Vlag', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/flag-nl.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt26', 
		name: 'Verzamelplaats', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictogram-din-e011-meeting_point.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt27', 
		name: 'Afvalbak', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictographs-keep_tidy_inside.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt28', 
		name: 'Waarschuwing', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/emblem-important.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt29', 
		name: 'Voetstappen', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/goto.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	},
	{ 
		id: 'mt30', 
		name: 'Brandblusser', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictogram-din-f005extinguisher.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	}, 
	{ 
		id: 'mt31', 
		name: 'Bagagekluis', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictographs-baggage_lockers_inv.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	},
	{ 
		id: 'mt32', 
		name: 'Lampje', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/light_bulb.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	},
	{ 
		id: 'mt33', 
		name: 'Zon', 
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/gadu.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	},	
    {
        id: 'pt1', 
        fillColor: 'green',
        fillOpacity: 0.3, 
        strokeColor: 'green', 
        strokeWidth: 2, 
        name: 'Groen transparant'
    },
    {
        id: 'pt2', 
        fillColor: 'red',
        fillOpacity: 0.3, 
        strokeColor: 'red', 
        strokeWidth: 2, 
        name: 'Rood transparant'
    },
    {
        id: 'pt3', 
        fillColor: 'orange',
        fillOpacity: 0.3, 
        strokeColor: 'orange', 
        strokeWidth: 2, 
        name: 'Oranje transparant'
    },
    {
        id: 'pt4', 
        fillColor: 'yellow',
        fillOpacity: 0.3, 
        strokeColor: 'yellow', 
        strokeWidth: 2, 
        name: 'Geel transparant'
    },
    {
        id: 'pt5', 
        fillColor: '#273397',
        fillOpacity: 0.3, 
        strokeColor: 'black', 
        strokeWidth: 2, 
        name: 'Blauw transparant'
    },
    {
        id: 'pt6', 
        fillColor: 'green',
        fillOpacity: 0.3, 
        strokeColor: 'black', 
        strokeWidth: 2, 
        name: 'Groen transparant'
    },
    {
        id: 'pt7', 
        fillColor: 'red',
        fillOpacity: 0.3, 
        strokeColor: 'black', 
        strokeWidth: 2, 
        name: 'Rood transparant'
    },
    {
        id: 'pt8', 
        fillColor: 'orange',
        fillOpacity: 0.3, 
        strokeColor: 'black', 
        strokeWidth: 2, 
        name: 'Oranje transparant'
    },
    {
        id: 'pt9', 
        fillColor: 'yellow',
        fillOpacity: 0.3, 
        strokeColor: 'black', 
        strokeWidth: 2, 
        name: 'Geel transparant'
    },
    {
        id: 'pt10', 
        fillColor: '#273397',
        strokeColor: '#273397', 
        strokeWidth: 2, 
        name: 'Blauw'
    },
    {
        id: 'pt11', 
        fillColor: 'green',
        strokeColor: 'green', 
        strokeWidth: 2, 
        name: 'Groen'
    },
    {
        id: 'pt12', 
        fillColor: 'red',
        strokeColor: 'red', 
        strokeWidth: 2, 
        name: 'Rood'
    },
    {
        id: 'pt13', 
        fillColor: 'orange',
        strokeColor: 'orange', 
        strokeWidth: 2, 
        name: 'Oranje'
    },
    {
        id: 'pt14', 
        fillColor: 'yellow',
        strokeColor: 'yellow', 
        strokeWidth: 2, 
        name: 'Geel'
    },
    {
        id: 'pt15', 
        fillOpacity: 0.0, 
        strokeColor: '#273397', 
        strokeWidth: 2, 
        name: 'Blauw'
    },
    {
        id: 'pt16', 
        fillOpacity: 0.0, 
        strokeColor: 'green', 
        strokeWidth: 2, 
        name: 'Groen'
    },
    {
        id: 'pt17', 
        fillOpacity: 0.0, 
        strokeColor: 'red', 
        strokeWidth: 2, 
        name: 'Rood'
    },
    {
        id: 'pt18', 
        fillOpacity: 0.0, 
        strokeColor: 'orange', 
        strokeWidth: 2, 
        name: 'Oranje'
    },
    {
        id: 'pt19', 
        fillOpacity: 0.0, 
        strokeColor: 'yellow', 
        strokeWidth: 2, 
        name: 'Geel'
    },
	{ 
		id:'lt2',  
		strokeColor:'blue',  
		strokeWidth:1,  
		name:'blauw 1px' 
	}, 
	{ 
		id:'lt3',  
		strokeColor:'blue',  
		strokeWidth:5,  
		strokeOpacity:0.5,  
		name:'blauw 5px transparant'  
	}, 
	{ 
		id:'lt4',  
		strokeColor:'red',  
		strokeWidth:1,  
		name:'rood 1px' 
	}, 
	{ 
		id:'lt5',  
		strokeColor:'red',  
		strokeWidth:3,  
		strokeOpacity:0.5,  
		name:'rood 3px transparant' 
	}, 
	{ 
		id:'lt6',  
		strokeColor:'red',  
		strokeWidth:5,  
		strokeOpacity:0.5,  
		name:'rood 5px transparant'  
	}, 
	{ 
		id:'lt7',  
		strokeColor:'green',  
		strokeWidth:1,  
		name:'groen 1px'  
	}, 
	{ 
		id:'lt8',  
		strokeColor:'green',  
		strokeWidth:3,  
		strokeOpacity:0.5,  
		name:'groen 2px transparant'  
	}, 
	{ 
		id:'lt9',  
		strokeColor:'green',  
		strokeWidth:5,  
		strokeOpacity:0.5,  
		name:'groen 5px transparant'  
	}
]
