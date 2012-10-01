/**
 * Copyright (c) 2010 PDOK
 *
 * Published under the Open Source GPL 3.0 license.
 * http://www.gnu.org/licenses/gpl.html
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 */

/**
 * @requires Geozet/Format/XLSLUS.js
 */

/**
 * Class: Geozet.Format.XLSLUS.v1
 * Superclass for XLSLUS version 1 parsers.
 *
 * Inherits from:
 *  - <OpenLayers.Format.GML>
 */
Geozet.Format.XLSLUS.v1 = OpenLayers.Class(OpenLayers.Format.GML, {
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        xls: "http://www.opengis.net/xls",
        gml: "http://www.opengis.net/gml",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
    },
    
    /**
     * Property: defaultPrefix
     */
    defaultPrefix: "xls",

    /**
     * Property: schemaLocation
     * {String} Schema location for a particular minor version.
     */
    schemaLocation: null,

    /**
     * Property: addressClass
     * {Class} Subclass of <Geozet.Format.XLSAddress>, allowing
     *         client to have e.g. specialized address formatting.
     */
    addressClass: Geozet.Format.XLSAddress,

    /**
     * Property: srsName
     * {String} used for reverse geocode requests to set the srs for a
     *          coordinate.
     */
    srsName: 'EPSG:28992',

    /**
     * Constructor: Geozet.Format.XLSLUS.v1
     * Instances of this class are not created directly.  Use the
     *     <Geozet.Format.XLSLUS> constructor instead.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    initialize: function(options) {
        OpenLayers.Format.GML.prototype.initialize.apply(this, [options]);
    },
    
    /**
     * Method: read
     *
     * Parameters:
     * data - {DOMElement} An XLSLUS document element.
     *
     * Returns:
     * {Object} An object representing the XLSLUS.
     *          For GeocodeResponse, an array (representing the
     *          geocodeResponseList) with objects with a property
     *          features being an array of <OpenLayers.Feature.Vector>.
     *          For ReverseGeocodeResponse, an array of <OpenLayers.Feature.Vector>
     *          (representing the reverseGeocodedLocation).
     */
    read: function(data) {        
        var xlslus = [];
        this.readChildNodes(data, xlslus);
        return xlslus;
    },
    
    /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
        "xls": {
            "GeocodeResponse": function(node, xlslus) {
		// top node for Geocode response
                this.readChildNodes(node, xlslus);
            },
            "GeocodeResponseList": function(node, xlslus) {
		var responseList = {};
                responseList.features = [];
		responseList.numberOfGeocodedAddresses = node.getAttribute("numberOfGeocodedAddresses");
                this.readChildNodes(node, responseList);
		xlslus.push(responseList);
	    },
            "GeocodedAddress": function(node, responseList) {
                var feature = new OpenLayers.Feature.Vector();
                this.readChildNodes(node, feature);
                responseList.features.push(feature);
            },
            "GeocodeMatchCode": function(node, feature) {
		var matchCode = {};
		matchCode.accuracy = node.getAttribute("accuracy");
		matchCode.matchType = node.getAttribute("matchType");
		feature.attributes.geocodeMatchCode = matchCode;
	    },
            "ReverseGeocodeResponse": function(node, xlslus) {
		// top node for reverse Geocode response
                this.readChildNodes(node, xlslus);
            },
            "ReverseGeocodedLocation": function(node, xlslus) {
		var feature = new OpenLayers.Feature.Vector();
                this.readChildNodes(node, feature);
		xlslus.push(feature);
	    },
            "SearchCentreDistance": function(node, feature) {
		var distance = {};
		distance.value = node.getAttribute("value");
		distance.accuracy = node.getAttribute("accuracy");
		distance.uom = node.getAttribute("uom");
		if (!distance.uom) {
		    distance.uom = "M";
		}
		feature.attributes.searchCentreDistance = distance;
	    },
            "Address": function(node, feature) {
                var countryCode = node.getAttribute("countryCode");
		var address = new this.addressClass(countryCode);
                address.addressee = node.getAttribute("addressee");
                this.readChildNodes(node, address);
		feature.attributes.address = address;
            },
            "freeFormAddress": function(node, address) {
		address.freeFormAddress = this.getChildValue(node);
            },
            "StreetAddress": function(node, address) {
                this.readChildNodes(node, address);
            },
            "Building": function(node, address) {
                //optional
                var building = {};
		building.number = node.getAttribute("number");
		building.subdivision = node.getAttribute("subdivision");
		building.buildingName = node.getAttribute("buildingName");
                address.building = building;
            },
            "Street": function(node, address) {
		var street = {};
		street.name = this.getChildValue(node);
		street.directionalPrefix = node.getAttribute("directionalPrefix");
		street.typePrefix = node.getAttribute("typePrefix");
		street.officialName = node.getAttribute("officialName");
		street.typeSuffix = node.getAttribute("typeSuffix");
		street.directionalSuffix = node.getAttribute("directionalSuffix");
		street.muniOctant = node.getAttribute("muniOctant");
                if (!street.directionalPrefix && !street.typePrefix &&
                        !street.officialName && !street.typeSuffix &&
                        !street.directionalSuffix && !street.muniOctant) {
                    // Get the simple name as string.
                    street = street.name;
                }
		address.street.push(street);
            },
            "Place": function(node, address) {
                // multiple, optional 0. Assume only one place per type.
		// type one of CountrySubdivision, CountrySecondarySubdivision,
		// Municipality, or MunicipalitySubdivision
		var type = node.getAttribute("type");
		address.place[type] = this.getChildValue(node);
            },
            "PostalCode": function(node, address) {
                //optional
		address.postalCode = this.getChildValue(node);
            }
	},
	"gml": {
	    "Point": function(node, feature) {
                var parser = this.parseGeometry["point"];
                var geometry = parser.apply(this, [node]);
                if (this.internalProjection && this.externalProjection) {
                    geometry.transform(this.externalProjection,
                                       this.internalProjection);
                }
		feature.geometry = geometry;
	    }
        }
    },
    
    /**
     * Method: writeGeocodeRequest
     *
     * Parameters:
     * address - {XLSAddress} An object representing the address(es).
     *
     * Returns:
     * {DOMElement} The root of a GeocodeRequest document.
     */
    writeGeocodeRequest: function(address) {
        return this.writers.xls.GeocodeRequest.apply(this, [address]);
    },

    /**
     * Method: writeReverseGeocodeRequest
     *
     * Parameters:
     * position - An object representing the position.
     *
     * Returns:
     * {DOMElement} The root of a ReverseGeocodeRequest document.
     */
    writeReverseGeocodeRequest: function(position) {
        return this.writers.xls.ReverseGeocodeRequest.apply(this, [position]);
    },

    /**
     * Property: writers
     * This structure contains public
     *     writing functions grouped by namespace alias and named like the
     *     node names they produce.
     * The writers are intended to create XML requests (E.g. GeocodeRequest).
     */
    writers: {
        "xls": {
            "GeocodeRequest": function(address) {
                var root = this.createElementNSPlus(
                    "GeocodeRequest",
                    {attributes: {
                        "xsi:schemaLocation": this.schemaLocation
                    }}
                );
		if (!(address instanceof Array)) {
		    address = [address];
		}
		for (var i = 0; i < address.length; i++) {
                    this.writeNode(root, "Address", address[i]);
		}
                return root;
	    },
            "ReverseGeocodeRequest": function(position) {
                var root = this.createElementNSPlus(
                    "ReverseGeocodeRequest",
                    {attributes: {
                        "xsi:schemaLocation": this.schemaLocation
                    }}
                );
                this.writeNode(root, "Position", position);
                return root;
	    },
            "Address": function(address) {
		var node = this.createElementNSPlus("Address",
		    {attributes: {
			"countryCode": address.countryCode,
			"addressee": address.addressee
		    }}
		);
		if (address.freeFormAddress) {
                    this.writeNode(node, "freeFormAddess", address.freeFormAddress);
		} else {
                    this.writeNode(node, "StreetAddress", address);
		    if (address.place) {
			var classification = Geozet.Format.XLSLUS.v1.NamedPlaceClassification;
		        for (var i = 0; i < classification.length; i++) {
			    if (address.place[classification[i]]) {
				var placeNode = this.writeNode(node, "Place", address.place[classification[i]]);
				this.setAttributes(placeNode, { "type": classification[i] });
			    }
			}
		    }
		    if (address.postalCode) {
                        this.writeNode(node, "PostalCode", address.postalCode);
		    }
		}
		return node;
	    },
	    "freeFormAddress": function(freeFormAddress) {
		return this.createElementNSPlus("freeFormAddress", {value: freeFormAddress});
	    },
	    "StreetAddress": function(address) {
		var node = this.createElementNSPlus("StreetAddress", {});
		if (address.building) {
                    this.writeNode(node, "Building", address.building);
		}
		var street = address.street;
		if (!(street instanceof Array)) {
		    street = [street];
		}
		for (var i = 0; i < street.length; i++) {
		    this.writeNode(node, "Street", street[i]);
		}
		return node;
	    },
	    "Building": function(building) {
		return this.createElementNSPlus("Building", {attributes: {
			"number": building.number,
			"subdivision": building.subdivision,
			"buildingName": building.buildingName
		       }});
	    },
	    "Street": function(street) {
		if (typeof street == 'string') {
		    return this.createElementNSPlus("Street", {value: street});
		} else if (street && street.name) {
		    return this.createElementNSPlus("Street", {value: street.name});
		} else {
		    return this.createElementNSPlus("Street", {attributes: {
			"directionalPrefix": street.directionalPrefix,
			"typePrefix": street.typePrefix,
			"officialName": street.officialName,
			"typeSuffix": street.typeSuffix,
			"directionalSuffix": street.directionalSuffix,
			"muniOctant": street.muniOctant
		    }});
		}
	    },
	    "Place": function(place) {
		return this.createElementNSPlus("Place", {value: place});
	    },
	    "PostalCode": function(postalCode) {
		return this.createElementNSPlus("PostalCode", {value: postalCode});
	    },
            "Position": function(position) {
		var node = this.createElementNSPlus("Position", {attributes: {
			"levelOfConf": position.levelOfConf
		}});
		if (position.CLASS_NAME && position.CLASS_NAME == "OpenLayers.Geometry.Point") {
		    position = { point: position };
		}
		this.writeNode(node, "gml:Point", position.point);
		if (position.shape) {
		    if (position.shape.CLASS_NAME && position.shape.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
			this.writeNode(node, "gml:Polygon", position.shape);
		    } else if (position.shape.CLASS_NAME && position.shape.CLASS_NAME == "OpenLayers.Geometry.MultiPolygon") {
			this.writeNode(node, "gml:MultiPolygon", position.shape);
		    }
		}
		if (position.qop) {
		}
		if (position.time) {
		}
		if (position.speed) {
		}
		if (position.direction) {
		}
		return node;
	    }
        },
        "gml": {
	    "Point": function(point) {
		// Cannot use  this.buildGeometryNode(point), because it
                // generates gml:coordinates, while OpenLS only knows gml:pos.
		var node = this.createElementNSPlus("gml:Point", {attributes: {
                        srsName: this.srsName}});
                this.writeNode(node, "gml:pos", point);
                return node;
	    },
	    "pos": function(point) {
		return this.createElementNSPlus("gml:pos", {value: point.x + ' ' + point.y});
	    },
	    "CircleByCenterPoint": function(geometry) {
	    },
	    "Polygon": function(geometry) {
		return this.buildGeometryNode(geometry);
	    },
	    "MultiPolygon": function(geometry) {
		return this.buildGeometryNode(geometry);
	    }
        }
    },
    

    /**
     * Methods below this point are of general use for versioned XML parsers.
     * These are candidates for an abstract class.
     */
    
    /**
     * Method: getNamespacePrefix
     * Get the namespace prefix for a given uri from the <namespaces> object.
     *
     * Returns:
     * {String} A namespace prefix or null if none found.
     */
    getNamespacePrefix: function(uri) {
        var prefix = null;
        if(uri == null) {
            prefix = this.namespaces[this.defaultPrefix];
        } else {
            var gotPrefix = false;
            for(prefix in this.namespaces) {
                if(this.namespaces[prefix] == uri) {
                    gotPrefix = true;
                    break;
                }
            }
            if(!gotPrefix) {
                prefix = null;
            }
        }
        return prefix;
    },


    /**
     * Method: readChildNodes
     */
    readChildNodes: function(node, obj) {
        var children = node.childNodes;
        var child, group, reader, prefix, local;
        for(var i=0; i<children.length; ++i) {
            child = children[i];
            if(child.nodeType == 1) {
                prefix = this.getNamespacePrefix(child.namespaceURI);
                local = child.nodeName.split(":").pop();
                group = this.readers[prefix];
                if(group) {
                    reader = group[local];
                    if(reader) {
                        reader.apply(this, [child, obj]);
                    }
                }
            }
        }
    },

    /**
     * Method: writeNode
     * Shorthand for applying one of the named writers and appending the
     *     results to a node.  If a qualified name is not provided for the
     *     second argument (and a local name is used instead), the namespace
     *     of the parent node will be assumed.
     *
     * Parameters:
     * parent - {DOMElement} Result will be appended to this node.
     * name - {String} The name of a node to generate.  If a qualified name
     *     (e.g. "pre:Name") is used, the namespace prefix is assumed to be
     *     in the <writers> group.  If a local name is used (e.g. "Name") then
     *     the namespace of the parent is assumed.
     * obj - {Object} Structure containing data for the writer.
     *
     * Returns:
     * {DOMElement} The child node.
     */
    writeNode: function(parent, name, obj) {
        var prefix, local;
        var split = name.indexOf(":");
        if(split > 0) {
            prefix = name.substring(0, split);
            local = name.substring(split + 1);
        } else {
            prefix = this.getNamespacePrefix(parent.namespaceURI);
            local = name;
        }
        var child = this.writers[prefix][local].apply(this, [obj]);
        parent.appendChild(child);
        return child;
    },
    
    /**
     * Method: createElementNSPlus
     * Shorthand for creating namespaced elements with optional attributes and
     *     child text nodes.
     *
     * Parameters:
     * name - {String} The qualified node name.
     * options - {Object} Optional object for node configuration.
     *
     * Returns:
     * {Element} An element node.
     */
    createElementNSPlus: function(name, options) {
        options = options || {};
        var loc = name.indexOf(":");
        // order of prefix preference
        // 1. in the uri option
        // 2. in the prefix option
        // 3. in the qualified name
        // 4. from the defaultPrefix
        var uri = options.uri || this.namespaces[options.prefix];
        if(!uri) {
            loc = name.indexOf(":");
            uri = this.namespaces[name.substring(0, loc)];
        }
        if(!uri) {
            uri = this.namespaces[this.defaultPrefix];
        }
        var node = this.createElementNS(uri, name);
        if(options.attributes) {
            this.setAttributes(node, options.attributes);
        }
        if(options.value) {
            node.appendChild(this.createTextNode(options.value));
        }
        return node;
    },
    
    /**
     * Method: setAttributes
     * Set multiple attributes given key value pairs from an object.
     *
     * Parameters:
     * node - {Element} An element node.
     * obj - {Object || Array} An object whose properties represent attribute
     *     names and values represent attribute values.  If an attribute name
     *     is a qualified name ("prefix:local"), the prefix will be looked up
     *     in the parsers {namespaces} object.  If the prefix is found,
     *     setAttributeNS will be used instead of setAttribute.
     */
    setAttributes: function(node, obj) {
        var value, loc, alias, uri;
        for(var name in obj) {
	    if (obj[name]) {
                value = obj[name].toString();
                // check for qualified attribute name ("prefix:local")
                uri = this.namespaces[name.substring(0, name.indexOf(":"))] || null;
                this.setAttributeNS(node, uri, name, value);
	    }
        }
    },

    CLASS_NAME: "Geozet.Format.XLSLUS.v1" 

});

Geozet.Format.XLSLUS.v1.NamedPlaceClassification = [
    "CountrySubdivision",
    "CountrySecondarySubdivision",
    "Municipality",
    "MunicipalitySubdivision"
];
