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
 * Class: Geozet.Format.XLSAddress
 * Represent an XLS (OGC Open Location Service) Address.
 * Either a freeFormAddress, or a structured address with street, building,
 * place and postalCode.
 */
Geozet.Format.XLSAddress = OpenLayers.Class({
    
    addressee: null,

    /**
     * Property: countryCode
     * {String} two-letter ISO 3166 countrycode for the address.
     */
    countryCode: null,

    /**
     * Property: freeFormAddress
     * {String} address in free format.
     */
    freeFormAddress: null,

    /**
     * Property: street
     * {Array} List of street addresses. Each is either a simple string, or an
     * object with attributes: directionalPrefix, typePrefix,
     * officialName, typeSuffix, directionalSuffix, muniOctant.
     */
    street: null,

    /**
     * Building, if not null, an object with attributes: number,
     * subdivision, and buildingName.
     */
    building: null,

    place: null,

    postalCode: null,

    /**
     * Constructor: Geozet.Format.XLSAddress.
     *
     * Parameters:
     * countryCode - 2-letter ISO 3166 countrycode for this address.
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    initialize: function(countryCode, options) {
        this.street = [];
        this.place = {
            CountrySubdivision: null,
            CountrySecondarySubdivision: null,
            Municipality: null,
            MunicipalitySubdivision:null
        };
        OpenLayers.Util.extend(this, options);
	this.countryCode = countryCode;
    },

    /**
     * Get the address as a single string. This method could be overridden
     * in subclasses to provide application specific formatting.
     * The <Geozet.Format.XLSLUS> class accepts the option
     * "addressClass" with the application specific XLSAddress subclass
     * to be used when reading XLS XML documents.
     */
    format: function() {
        if (this.freeFormAddress) {
            return this.freeFormAddress;
        } else {
            return this.getStreetText() + ' ' + this.getBuildingText()
                   + ' ' + this.getPostalCodeText() + ' ' + this.getPlaceText();
        }
    },

    /**
     * Get the street(s) as a single string. Useful when using the
     * OpenLayers String.format with a template. The template should
     * use this function name, and pass the address object (since
     * the format function calls the function without a this).
     * @param address The address <Geozet.Format.XLSAddress>. If not
     *                specified, works on "this".
     */
    getStreetText: function(address) {
	if (!address) { address = this; }
        var text = '';
        for (var si = 0; si < address.street.length; si++) {
            if (text != '') { text += ' '; }
            text += address.formatObject(address.street[si], Geozet.Format.XLSAddress.formattedStreetProperties);
        }
        return text;
    },

    /**
     * Get the building as a single string. Useful when using the
     * OpenLayers String.format with a template. The template should
     * use this function name, and pass the address object (since
     * the format function calls the function without a this).
     * @param address The address <Geozet.Format.XLSAddress>. If not
     *                specified, works on "this".
     */
    getBuildingText: function(address) {
	if (!address) { address = this; }
        return address.formatObject(address.building, Geozet.Format.XLSAddress.formattedBuildingProperties);
    },

    /**
     * Get the postalCode as a string, an empty string if null. Useful when using the
     * OpenLayers String.format with a template. The template should
     * use this function name, and pass the address object (since
     * the format function calls the function without a this).
     * @param address The address <Geozet.Format.XLSAddress>. If not
     *                specified, works on "this".
     */
    getPostalCodeText: function(address) {
	if (!address) { address = this; }
        return !address.postalCode ? '' : address.postalCode;
    },

    /**
     * Get the place as a single string. Useful when using the
     * OpenLayers.String.format with a template. The template should
     * use this function name, and pass the address object (since
     * the format function calls the function without a this).
     * @param address The address <Geozet.Format.XLSAddress>. If not
     *                specified, works on "this".
     */
    getPlaceText: function(address) {
	if (!address) { address = this; }
        return address.formatObject(address.place, Geozet.Format.XLSAddress.formattedPlaceProperties);
    },

    /**
     * private function to format an object as a string.
     * @param obj the object to format.
     * @param props Array of property names from obj to put in the result.
     */
    formatObject: function(obj, props) {
        if (!obj) { return '' };
        var text = '';
        if (typeof obj == 'string') {
            text = obj;
        } else if (props instanceof Array) {
            for (var pi = 0; pi < props.length; pi++) {
                if (obj[props[pi]]) {
                    if (text != '') { text += ' '; }
                    text += obj[props[pi]];
                }
            }
        }
        return text;
    },

    CLASS_NAME: "Geozet.Format.XLSAddress" 
});

/**
 * Place properties to use for formatting an address as a string,
 * defining also the order of the place properties.
 */
Geozet.Format.XLSAddress.formattedPlaceProperties = [
    'Municipality', 'MunicipalitySubdivision',
    'CountrySecondarySubdivision', 'CountrySubdivision'];

/**
 * Street properties to use for formatting an address as a string,
 * defining also the order of the street properties.
 * This applies only to streets using the structured attributes from OpenLS.
 */
Geozet.Format.XLSAddress.formattedStreetProperties = [
    'directionalPrefix', 'typePrefix', 'officialName',
    'typeSuffix', 'directionalSuffix', 'muniOctant' ];

/**
 * Building properties to use for formatting an address as a string,
 * defining also the order of the building properties.
 */
Geozet.Format.XLSAddress.formattedBuildingProperties = [
    'number', 'subdivision', 'buildingName' ];
