

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
		name: 'Lusc API image',
		externalGraphic: "http://www.lusc.nl/pdokkaart/examples/img/lusc_pointer.png",
		graphicHeight: 37,
		graphicWidth: 32,
		graphicYOffset: -16
	}, 
	{ 
		id: 'mt2', 
		name: 'Rijk', 
		externalGraphic: "http://www.lusc.nl/pdokkaart/examples/img/rijk.png", 
		graphicHeight: 24, 
		graphicWidth: 16, 
		graphicYOffset: -8 
	}, 
	{ 
		id: 'mt3', 
		name: 'Ster', 
		externalGraphic: "http://www.lusc.nl/pdokkaart/examples/img/star-3.png", 
		graphicHeight: 37, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt4', 
		name: 'Mijter', 
		externalGraphic: "http://www.lusc.nl/pdokkaart/examples/img/Sinterklaas/mijter.gif", 
		graphicHeight: 33, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt5', 
		name: 'Gym Piet', 
		externalGraphic: "http://www.lusc.nl/pdokkaart/examples/img/Sinterklaas/gympiet10.gif", 
		graphicHeight: 33, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt6', 
		name: 'Kado Piet', 
		externalGraphic: "http://www.lusc.nl/pdokkaart/examples/img/Sinterklaas/kadopiet13.gif", 
		graphicHeight: 33, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt7', 
		name: 'Kado Piet', 
		externalGraphic: "http://www.lusc.nl/pdokkaart/examples/img/Sinterklaas/kadopiet15.gif", 
		graphicHeight: 33, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt8', 
		name: 'Kado Piet', 
		externalGraphic: "http://www.lusc.nl/pdokkaart/examples/img/Sinterklaas/kadopiet16.gif", 
		graphicHeight: 33, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt9', 
		name: 'Kado Piet', 
		externalGraphic: "http://www.lusc.nl/pdokkaart/examples/img/Sinterklaas/kadopiet21.gif", 
		graphicHeight: 33, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt10', 
		name: 'Kado Piet', 
		externalGraphic: "http://www.lusc.nl/pdokkaart/examples/img/Sinterklaas/kadopiet22.gif", 
		graphicHeight: 33, 
		graphicWidth: 32, 
		graphicYOffset: -16 
	}, 
	{ 
		id: 'mt11', 
		name: 'Pieten', 
		externalGraphic: "http://www.lusc.nl/pdokkaart/examples/img/Sinterklaas/pieten.gif", 
		graphicHeight: 33, 
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
