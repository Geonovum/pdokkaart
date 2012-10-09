/**
 * This is a configuration javascript file to create a layers list for pdok api
 *
 * At this moment it can contain 3 layertypes: WMTS (preferred), WMS and TMS
 *
 * A layer Object is an Object with properties with OpenLayers-Layer property names
 * Only 'layertype' and 'name' are unique for the api
 * 
 * NOTE: because we use OpenLayers properties, the property names are type aware:
 * eg: for a WMTS the layernames is defined in a 'layer' property
 * while for a WMS it is called 'layers' (mind the s on the end)
 */


Pdok.Api.prototype.defaultLayers = {

    AAN: {
        layertype: 'WMTS',
        name: 'AAN - Agrarisch Areaal Nederland (WMTS)',
        url: 'http://geodata.nationaalgeoregister.nl/wmts/',
        layer: 'aan',
        style: null,
        matrixSet: 'EPSG:28992',
        visibility: true, 
        isBaseLayer: false
    },
    ADRESSEN: {
        layertype: 'WMS',
        name: 'Adressen (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/inspireadressen/wms',
        layers: 'inspireadressen',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    AHN25M: {
        layertype: 'WMS',
        name: 'AHN1 - Actueel Hoogtebestand NL 25 meter (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/ahn25m/wms',
        layers: 'ahn25m',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    BBG2008: {
        layertype: 'WMS',
        name: 'BBG - Bestand Bodemgebruik 2008 (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/bestandbodemgebruik2008/wms',
        layers: 'bbg2008',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    BESCHERMDENATUURMONUMENTEN:{
        layertype: 'WMS',
        name: 'Beschermde Natuurmonumenten (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/beschermdenatuurmonumenten/wms',
        layers: 'beschermdenatuurmonumenten',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    BRT: {
        layertype: 'WMTS',
        name: 'BRT Achtergrondkaart (WMTS)',
        url: 'http://geodata.nationaalgeoregister.nl/wmts/',
        layer: 'brtachtergrondkaart',
        style: null,
        matrixSet: 'EPSG:28992',
        visibility: true, 
        isBaseLayer: true,
        attribution: '(c) OSM & Kadaster'
    },
    CBS_KERNEN_NAMEN: {
        layertype: 'WMS',
        name: 'CBS Bevolkingskern namen 2008 (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/bevolkingskernen2008/wms',
        layers: 'naamgeving_kernen_40k_plus,naamgeving_kernen_alles',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    CBS_KERNEN: {
        layertype: 'WMS',
        name: 'CBS Bevolkingskernen 2008 (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/bevolkingskernen2008/wms',
        layers: 'cbsbevolkingskernen2008',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    CBS_GEMEENTEN: {
        layertype: 'WMS',
        name: 'CBS Gemeentegrenzen 2008 (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/bevolkingskernen2008/wms',
        layers: 'gemeentegrens_generalisatie_2008',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    CBS_PROVINCIES: {
        layertype: 'WMS',
        name: 'CBS Provinciegrenzen 2008 (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/bevolkingskernen2008/wms',
        layers: 'provgrens_generalisatie_2008',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    GEMEENTEGRENZEN: {
        layertype: 'WMS',
        name: 'Gemeentegrenzen 2012 (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms',
        layers: 'gemeenten_2012',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    GEMEENTEGRENZEN_LABEL: {
        layertype: 'WMS',
        name: 'Gemeentegrenzen met labels 2012 (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?sld=http://luuks.github.com/API/gemeentegrenzen_label_grijs_gestippeld.sld',
        layers: 'gemeenten_2012',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    NATURA2000: {
        layertype: 'WMTS',
        name: 'Natura 2000 (WMTS)',
        url: 'http://geodata.nationaalgeoregister.nl/wmts/',
        layer: 'natura2000',
        style: null,
        matrixSet: 'EPSG:28992',
        visibility: true, 
        isBaseLayer: false
    },
    NATIONALE_PARKEN: {
        layertype: 'WMS',
        name: 'Nationale parken (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/nationaleparken/wms',
        layers: 'nationaleparken',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    NOK2011: {
        layertype: 'WMTS',
        name: 'NOK2011 - Natuurmeting Op Kaart (WMTS)',
        url: 'http://geodata.nationaalgeoregister.nl/wmts/',
        layer: 'nok2011',
        style: null,
        matrixSet: 'EPSG:28992',
        visibility: true, 
        isBaseLayer: false
    },
    NWB_SPOORWEGEN: {
        layertype: 'WMS',
        name: 'NWB Vaarwegen (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/nwbspoorwegen/wms',
        layers: 'hectopunten,overgangen,oversteken,spoorvakken,treinstations',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    NWB_VAARWEGEN: {
        layertype: 'WMS',
        name: 'NWB Vaarwegen (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/nwbvaarwegen/wms',
        layers: 'vaarwegvakken,kmmarkeringen',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    NWB_WEGEN: {
        layertype: 'WMS',
        name: 'NWB Wegen (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/nwbwegen/wms',
        layers: 'wegvakken,hectopunten',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    TOP10NL: {
        layertype: 'TMS',
        name: 'TOP10 NL (TMS)',
        url: 'http://geodata.nationaalgeoregister.nl/tms/',
        layername: 'top10nl',
        type:'png8',
        visibility: true,
        isBaseLayer: false,
        attribution:'(c) Kadaster'
    },
    TOP10NL2: {
        layertype: 'WMTS',
        name: 'TOP10 NL Baselayer (WMTS)',
        url: 'http://geodata.nationaalgeoregister.nl/wmts/',
        layer: 'top10nl',
        style: null,
        matrixSet: 'EPSG:28992',
        visibility: true, 
        isBaseLayer: true,
        attribution:'(c) Kadaster'
    },
    TOP250RASTER: {
        layertype: 'WMTS',
        name: 'TOP250 Raster (WMTS)',
        url: 'http://geodata.nationaalgeoregister.nl/wmts/',
        layer: 'top250raster',
        style: null,
        matrixSet: 'EPSG:28992',
        visibility: true, 
        isBaseLayer: false,
        attribution:'(c) Kadaster'
    },
    TOP50RASTER: {
        layertype: 'WMTS',
        name: 'TOP50 Raster (WMTS)',
        url: 'http://geodata.nationaalgeoregister.nl/wmts/',
        layer: 'top50raster',
        style: null,
        matrixSet: 'EPSG:28992',
        visibility: true, 
        isBaseLayer: false,
        attribution:'(c) Kadaster'
    },
    TOP50VECTOR: {
        layertype: 'WMTS',
        name: 'TOP50 Vector (WMTS)',
        url: 'http://geodata.nationaalgeoregister.nl/wmts/',
        layer: 'top50vector',
        style: null,
        matrixSet: 'EPSG:28992',
        visibility: true, 
        isBaseLayer: false,
        attribution:'(c) Kadaster'
    },
    WEGGEGEVENS_RIJBANEN: {
        layertype: 'WMS',
        name: 'Weggegevens - aantal rijbanen (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/weggeg/wms',
        layers: 'weggegaantalrijbanen',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    },
    WEGGEGEVENS_MAXSNELHEID: {
        layertype: 'WMS',
        name: 'Weggegevens - maximum snelheid (WMS)',
        url: 'http://geodata.nationaalgeoregister.nl/weggeg/wms',
        layers: 'weggegmaximumsnelheden',
        transparent: 'true',
        format: 'image/png',
        visibility: true,
        isBaseLayer: false,
        singleTile: true
    }
}
