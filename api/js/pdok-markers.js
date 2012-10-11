

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
		externalGraphic: 'http://pdokkaart.pdokloket.nl/api/markertypes/pictographs-keep_tidy_inside_01.png', 
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
