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
 * @requires Geozet/Format/XLSLUS/v1.js
 */

/**
 * Class: Geozet.Format.XLSLUS.v1_1_0
 * Read/write XLS Location Utility Service version 1.1.0.
 * 
 * Inherits from:
 *  - <Geozet.Format.XLSLUS.v1>
 */
Geozet.Format.XLSLUS.v1_1_0 = OpenLayers.Class(
    Geozet.Format.XLSLUS.v1, {
    
    /**
     * Constant: VERSION
     * {String} 1.1.0
     */
    VERSION: "1.1.0",
    
    /**
     * Property: schemaLocation
     * {String} http://www.opengis.net/xls
     *   http://schemas.opengis.net/ols/1.1.0/LocationUtilityService.xsd
     */
    schemaLocation: "http://www.opengis.net/xls http://schemas.opengis.net/ols/1.1.0/LocationUtilityService.xsd",

    /**
     * Constructor: Geozet.Format.XLSLUS.v1_1_0
     * Instances of this class are not created directly.  Use the
     *     <Geozet.Format.XLSLUS> constructor instead.
     *
     * Parameters:
     * options - {Object} An optional object whose properties will be set on
     *     this instance.
     */
    initialize: function(options) {
        Geozet.Format.XLSLUS.v1.prototype.initialize.apply(
            this, [options]
        );
    },

    CLASS_NAME: "Geozet.Format.XLSLUS.v1_1_0" 

});
