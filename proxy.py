#!/usr/bin/env python


"""This is a blind proxy that we use to get around browser
restrictions that prevent the Javascript from loading pages not on the
same server as the Javascript.  This has several problems: it's less
efficient, it might break some sites, and it's a security risk because
people can use this proxy to browse the web and possibly do bad stuff
with it.  It only loads pages via http and https, but it can load any
content type. It supports GET and POST requests."""

import urllib
import urllib2
import cgi
import sys, os
import string

# Designed to prevent Open Proxy type stuff.

allowedHosts = ['geodata.nationaalgeoregister.nl']

allowed_content_types = (
    "application/xml", "text/xml",
    "text/html",                            # text/html is used by Cyclomedia
    "text/plain",                           # text/plain is used by some ArcIMS versions on GetFeatureInfo
    "application/vnd.ogc.se_xml",           # OGC Service Exception
    "application/vnd.ogc.se+xml",           # OGC Service Exception
    "application/vnd.ogc.success+xml",      # OGC Success (SLD Put)
    "application/vnd.ogc.wms_xml",          # WMS Capabilities
    "application/vnd.ogc.context+xml",      # WMC
    "application/vnd.ogc.gml",              # GML
    "application/vnd.ogc.sld+xml",          # SLD
    "application/vnd.google-earth.kml+xml", # KML
    "application/json"
    )

method = os.environ["REQUEST_METHOD"]

if method == "POST":
    qs = os.environ["QUERY_STRING"]
    d = cgi.parse_qs(qs)
    if d.has_key("url"):
        url = d["url"][0]
    else:
        url = "http://www.openlayers.org"
else:
    fs = cgi.FieldStorage()
    url = fs.getvalue('url', "http://www.openlayers.org")

try:
    host = url.split("/")[2]
    if allowedHosts and not host in allowedHosts:
        print "Status: 502 Bad Gateway"
        print "Content-Type: text/plain"
        print
        print "This proxy does not allow you to access that location."
        print
        print os.environ
    elif url.startswith("http://") or url.startswith("https://"):
        if method == "POST":
            length = int(os.environ["CONTENT_LENGTH"])
            headers = {"Content-type": os.environ["CONTENT_TYPE"]}
            body = sys.stdin.read(length)
            r = urllib2.Request(url, body, headers)
        else:
            r = urllib2.Request(url)

        # add Agent/Referer/X-Forwarded-For headers to enhance logging on server
        r.add_header('User-Agent', 'Python-urllib/%s.%s GeoservicesFW/%s' \
           % (sys.version_info[0], sys.version_info[1], '2.4'))

        # doesn't contain anything useful in our network setup:
        #if os.environ.has_key('HTTP_X_FORWARDED_FOR'):
        #    r.add_header('Referer', os.environ['HTTP_X_FORWARDED_FOR'])
        # find out how we ourselves were called, to supply referer
        if os.environ.get('HTTPS', 'off') in ('on', '1'):
            referer = 'https://'
        else:
            referer = 'http://'
        if os.environ.get('HTTP_HOST'):
            referer += os.environ['HTTP_HOST']
        else:
            referer += os.environ['SERVER_NAME']
        referer += ':' + os.environ['SERVER_PORT']
        referer += urllib.quote(os.environ.get('SCRIPT_NAME', ''))
        referer += urllib.quote(os.environ.get('PATH_INFO', ''))
        r.add_header('Referer', referer)

        #if os.environ.has_key('HTTP_REFERER') and os.environ['HTTP_REFERER'] != '':
        #    r.add_header('X-Forwarded-For', os.environ['HTTP_REFERER'])

        y = urllib2.urlopen(r)

        # print content type header
        i = y.info()
        if i.has_key("Content-Type"):
            ctlist = string.split(i["Content-Type"], ";", 1)

            if not ctlist[0] in allowed_content_types:
                raise Exception('Status: 415', 'Unsupported media type')

            ct = ""
            charset = ";charset=ISO-8859-1"
            if (len(ctlist) >= 1) : ct = ctlist[0]
            if (len(ctlist) >= 2) : charset = ";" + ctlist[1]
            if ct == "application/vnd.ogc.gml" or ct == "text/plain" or ct == "text/html" or ct == "application/vnd.ogc.se_xml" or ct == "application/vnd.ogc.sld+xml" or ct == "application/vnd.ogc.wms_xml":
              print "Content-Type: text/xml%s" % charset
            else:
              print "Content-Type: %s" % ct
        else:
            print "Content-Type: text/plain"
        print
        print y.read()

        y.close()
    else:
        print "Content-Type: text/plain"
        print
        print "Illegal request."

except Exception, E:
    print "Status: 500 Unexpected Error"
    print "Content-Type: text/plain"
    print
    print "Some unexpected error occurred. Error text was:", E


