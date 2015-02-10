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

/*
 * The code in this file is based on code taken from OpenLayers.
 *
 * Copyright (c) 2006-2007 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license.
 */

(function() {
    /**
     * Before creating the Geozet namespace, check to see if
     * Geozet.singleFile is true.  This occurs if the
     * Geozet/SingleFile.js script is included before this one - as is the
     * case with single file builds.
     */
    var singleFile = (typeof Geozet == "object" && Geozet.singleFile);
    
    /**
     * Cache for the script location returned from
     * Geozet._getScriptLocation
     */
    var scriptLocation;
    
    /**
     * Namespace: Geozet
     * The Geozet object provides a namespace for all things Geozet
     */
    window.Geozet = {
        
        /**
         * Property: _scriptName
         * {String} Relative path of this script.
         */
       /*  _scriptName: (!singleFile) ? "lib/Geozet.js" : "Geozet.js", */
		_scriptName: (!singleFile) ? "Geozet.js" : "Geozet.js",

        /**
         * Function: _getScriptLocation
         * Return the path to this script.
         *
         * Returns:
         * {String} Path to this script
         */
        _getScriptLocation: function () {
            if (scriptLocation != undefined) {
                return scriptLocation;
            }
            scriptLocation = "";            
            var isGEOZET = new RegExp("(^|(.*?\\/))(" + Geozet._scriptName + ")(\\?|$)");
         
            var scripts = document.getElementsByTagName('script');
            for (var i=0, len=scripts.length; i<len; i++) {
                var src = scripts[i].getAttribute('src');
                if (src) {
                    var match = src.match(isGEOZET);
                    if(match) {
                        scriptLocation = match[1];
                        break;
                    }
                }
            }
            return scriptLocation;
        }
    };
    /**
     * Geozet.singleFile is a flag indicating this file is being included
     * in a Single File Library build of the Geozet Library.
     * 
     * When we are *not* part of a SFL build we dynamically include the
     * Geozet library code.
     * 
     * When we *are* part of a SFL build we do not dynamically include the 
     * Geozet library code as it will be appended at the end of this file.
      */
    if(!singleFile) {
        var jsfiles = new Array(
           /* "Geozet/Viewer.js",
            "Geozet/plugins/ResizeMap.js",
            "Geozet/Format/XLSAddress",
            "Geozet/Format/XLSLUS.js",
            "Geozet/Format/XLSLUS/v1.js",
            "Geozet/Format/XLSLUS/v1_1_0.js",
            "Geozet/Strategy/ThemeVisibility.js",
            "Geozet/Strategy/Sort.js",
            "Geozet/Strategy/ServerSideCluster.js",
            "Geozet/Strategy/Cluster.js",
            "Geozet/Renderer/Anchor.js",
            "Geozet/widgets/PanZoomBar.js",
            "Geozet/widgets/Popup.js",
            "Geozet/widgets/Vlakgericht.js",
            "Geozet/widgets/Search.js",
            "Geozet/widgets/Legend.js",
            "Geozet/Control/Click.js",
            "Geozet/Control/ScaleBar.js" */
        ); // etc.

        var agent = navigator.userAgent;
        var docWrite = (agent.match("MSIE") || agent.match("Safari"));
        if(docWrite) {
            var allScriptTags = new Array(jsfiles.length);
        }
        var host = Geozet._getScriptLocation() + "lib/";    
        for (var i=0, len=jsfiles.length; i<len; i++) {
            if (docWrite) {
                allScriptTags[i] = "<script src='" + host + jsfiles[i] +
                                   "'></script>"; 
            } else {
                var s = document.createElement("script");
                s.src = host + jsfiles[i];
                var h = document.getElementsByTagName("head").length ? 
                           document.getElementsByTagName("head")[0] : 
                           document.body;
                h.appendChild(s);
            }
        }
        if (docWrite) {
            document.write(allScriptTags.join(""));
        }
    }
})();
