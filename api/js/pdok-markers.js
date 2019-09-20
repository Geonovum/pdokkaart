

/** 
 * TODO: create some docs here to show how to define: 
 * a point marker 
 * a line marker 
 * a polygon marker 
 */ 
 var Pdok = Pdok || {};
window.Pdok = Pdok;


Pdok.Api.prototype.defaultStyles=[ 
        // all point marker styles will use mt0 as default 
        // so you only have to define the props that are different from mt0 
        // mt0, pt0, lt0 are defined in pdok-api.js, so defining it here will override that one 
	{ 
		id: 'mt0', 
		name: 'Rijkslogo', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/rijk.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt1', 
		name: 'Informatiebord blauw', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/emblem-notice.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt2', 
		name: 'Ster', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/bookmark-4.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt3', 
		name: 'Stip groen', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/circle_green.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt4', 
		name: 'Stip rood', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/circle_red.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt5', 
		name: 'Stip paars', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/circle_purple.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt6', 
		name: 'Vlag groen', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/flag-2.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicXOffset: -7,
		graphicYOffset: -32 
	}, 
	{ 
		id: 'mt7', 
		name: 'Vlag blauw', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/flag-blue.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicXOffset: -7,
		graphicYOffset: -32 
	}, 
	{ 
		id: 'mt8', 
		name: 'Vlag rood', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/flag-red.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicXOffset: -7,
		graphicYOffset: -32 
	}, 
	{ 
		id: 'mt9', 
		name: 'Vlag geel', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/flag-yellow.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicXOffset: -7,
		graphicYOffset: -32 
	}, 
	{ 
		id: 'mt10', 
		name: 'Vlag zwart', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/flag-black.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicXOffset: -7,
		graphicYOffset: -32 
	}, 
	{ 
		id: 'mt11', 
		name: 'Smiley', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/amor-3.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt12', 
		name: 'Stoplicht', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/daemons.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt13', 
		name: 'Werkzaamheden pion', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/vlc.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt14', 
		name: 'Werkzaamheden bord', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/happydigger.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	},       
	
	{ 
		id: 'mt15', 
		name: 'Stop', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/pictograms-road_signs-stop_sign.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt16', 
		name: 'Verplichte rijrichting', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/pictographs-ahead_only.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	},	
	{ 
		id: 'mt17', 
		name: 'Horeca', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/kteatime-2.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt18', 
		name: 'Voetgangersgebied', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/pictograms-protections-10.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt19', 
		name: 'Electriciteit', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/preferences-web-browser-cache-2.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt20', 
		name: 'Rolstoel toegankelijk', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/preferences-desktop-accessibility-6.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt21', 
		name: 'Wifi beschikbaar', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/wifi-radar.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt22', 
		name: 'Telefoon', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/call-start.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt23', 
		name: 'Kruis rood', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/dialog-cancel.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt24', 
		name: 'Pion', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/im-user.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt25', 
		name: 'Vlag', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/flag-nl.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt26', 
		name: 'Verzamelplaats', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/pictogram-din-e011-meeting_point.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt27', 
		name: 'Afvalbak', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/pictographs-keep_tidy_inside.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt28', 
		name: 'Waarschuwing', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/emblem-important.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt29', 
		name: 'Voetstappen', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/goto.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	},
	{ 
		id: 'mt30', 
		name: 'Brandblusser', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/pictogram-din-f005extinguisher.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	}, 
	{ 
		id: 'mt31', 
		name: 'Bagagekluis', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/pictographs-baggage_lockers_inv.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	},
	{ 
		id: 'mt32', 
		name: 'Lampje', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/light_bulb.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	},
	{ 
		id: 'mt33', 
		name: 'Zon', 
		externalGraphic: Pdok.ApiUrl + '/markertypes/gadu.png', 
		graphicHeight: 32, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	
	},
    {
        id: 'mt34',
        name: 'Standaard marker',
        externalGraphic: Pdok.ApiUrl+"/markertypes/document-properties.png",
        graphicHeight: 32,
        graphicWidth: 32,
        graphicYOffset: -32
    },
    {
        id: 'mt35',
        name: 'Parkeren',
        externalGraphic: Pdok.ApiUrl+"/markertypes/parkeren.jpg",
        graphicHeight: 32,
        graphicWidth: 32,
        graphicYOffset: -32
    },
    {
        id: 'pt1', 
        fillColor: '#008000',
        fillOpacity: 0.3, 
        strokeColor: '#008000', 
        strokeWidth: 2, 
        name: 'Groen transparant'
    },
    {
        id: 'pt2', 
        fillColor: '#ff0000',
        fillOpacity: 0.3, 
        strokeColor: '#ff0000', 
        strokeWidth: 2, 
        name: 'Rood transparant'
    },
    {
        id: 'pt3', 
        fillColor: '#FF6600',
        fillOpacity: 0.3, 
        strokeColor: '#FF6600', 
        strokeWidth: 2, 
        name: 'Oranje transparant'
    },
    {
        id: 'pt4', 
        fillColor: '#ffff00',
        fillOpacity: 0.3, 
        strokeColor: '#ffff00', 
        strokeWidth: 2, 
        name: 'Geel transparant'
    },
    {
        id: 'pt5', 
        fillColor: '#273397',
        fillOpacity: 0.3, 
        strokeColor: '#000000', 
        strokeWidth: 2, 
        name: 'Blauw transparant'
    },
    {
        id: 'pt6', 
        fillColor: '#008000',
        fillOpacity: 0.3, 
        strokeColor: '#000000', 
        strokeWidth: 2, 
        name: 'Groen transparant'
    },
    {
        id: 'pt7', 
        fillColor: '#ff0000',
        fillOpacity: 0.3, 
        strokeColor: '#000000', 
        strokeWidth: 2, 
        name: 'Rood transparant'
    },
    {
        id: 'pt8', 
        fillColor: '#FF6600',
        fillOpacity: 0.3, 
        strokeColor: '#000000', 
        strokeWidth: 2, 
        name: 'Oranje transparant'
    },
    {
        id: 'pt9', 
        fillColor: '#ffff00',
        fillOpacity: 0.3, 
        strokeColor: '#000000', 
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
        fillColor: '#008000',
        strokeColor: '#008000', 
        strokeWidth: 2, 
        name: 'Groen'
    },
    {
        id: 'pt12', 
        fillColor: '#ff0000',
        strokeColor: '#ff0000', 
        strokeWidth: 2, 
        name: 'Rood'
    },
    {
        id: 'pt13', 
        fillColor: '#FF6600',
        strokeColor: '#FF6600', 
        strokeWidth: 2, 
        name: 'Oranje'
    },
    {
        id: 'pt14', 
        fillColor: '#ffff00',
        strokeColor: '#ffff00', 
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
        strokeColor: '#008000', 
        strokeWidth: 2, 
        name: 'Groen'
    },
    {
        id: 'pt17', 
        fillOpacity: 0.0, 
        strokeColor: '#ff0000', 
        strokeWidth: 2, 
        name: 'Rood'
    },
    {
        id: 'pt18', 
        fillOpacity: 0.0, 
        strokeColor: '#FF6600', 
        strokeWidth: 2, 
        name: 'Oranje'
    },
    {
        id: 'pt19', 
        fillOpacity: 0.0, 
        strokeColor: '#ffff00', 
        strokeWidth: 2, 
        name: 'Geel'
    },
	{ 
		id:'lt2',  
		strokeColor:'#273397',  
		strokeWidth:1,  
		name:'blauw 1px' 
	}, 
	{ 
		id:'lt3',  
		strokeColor:'#273397',  
		strokeWidth:5,  
		strokeOpacity:0.5,  
		name:'blauw 5px transparant'  
	}, 
	{ 
		id:'lt4',  
		strokeColor:'#ff0000',  
		strokeWidth:1,  
		name:'rood 1px' 
	}, 
	{ 
		id:'lt5',  
		strokeColor:'#ff0000',  
		strokeWidth:3,  
		strokeOpacity:0.5,  
		name:'rood 3px transparant' 
	}, 
	{ 
		id:'lt6',  
		strokeColor:'#ff0000',  
		strokeWidth:5,  
		strokeOpacity:0.5,  
		name:'rood 5px transparant'  
	}, 
	{ 
		id:'lt7',  
		strokeColor:'#008000',  
		strokeWidth:1,  
		name:'groen 1px'  
	}, 
	{ 
		id:'lt8',  
		strokeColor:'#008000',  
		strokeWidth:3,  
		strokeOpacity:0.5,  
		name:'groen 2px transparant'  
	}, 
	{ 
		id:'lt9',  
		strokeColor:'#008000',  
		strokeWidth:5,  
		strokeOpacity:0.5,  
		name:'groen 5px transparant'  
	}
]
