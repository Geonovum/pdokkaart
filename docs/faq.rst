
Vaak gestelde vragen over PDOK kaart
====================================

Vraag 1
    Hoe kan ik eenvoudig een eigen plaatje toevoegen als marker in de kaart? Bijv. voor de komende kerstmarkt in mijn gemeente wil ik een plaatje van een kerstboom op de kaart plaatsen.

Antwoord
    Wanneer het om (maximaal) één eigen plaatje gaat, kan deze in de markerset van de Wizard worden opgenomen door een parameter toe te voegen aan de url van PDOK Kaart. De benodigde parameter is “mimg”. De standaard url van PDOK Kaart is http://kaart.PDOK.nl Hierachter kan de parameter “mimg” worden gezet met de url van het gewenste plaatje: http://kaart.PDOK.nl/?mimg=http://inspire-forum.jrc.ec.europa.eu/pg/groupicon/179/small/1350574732.jpg . Door nu stap 2 van de Wizard te openen (“voeg een marker toe”) komt het eigen plaatje als eerste marker beschikbaar. Wanneer dit niet gebeurt, is een refresh van de browser noodzakelijk (Windows: ctrl F5). De eigen marker kan nu op de kaart worden geplaatst. Wanneer het plaatje in de url groter is dan 32*32 pixels wordt het automatisch kleiner gemaakt tot 32*32 pixels.


Vraag 2
    Ik wil meerdere eigen plaatjes gebruiken als marker. Hoe kan ik dat realiseren?

Antwoord
    Wanneer meer dan één eigen marker gewenst is, kan een gebruiker een eigen markerset aanmaken die de markerset van PDOK Kaart (tijdelijk) overschrijft. Hiervoor zijn de volgende stappen noodzakelijk:

    Download de standaard markerset van PDOK Kaart: http://kaart.PDOK.nl/api/js/PDOK-markers.js
    Wijzig de inhoud van dit bestand in een teksteditor door desgewenst puntsymbolen (mt), lijnsymbolen(lt) of vlaksymbolen aan te passen of toe te voegen. Wijzig bijvoorbeeld ::

        id: 'mt1',
        name: 'Informatiebord blauw',
        externalGraphic: Pdok.ApiUrl + '/markertypes/emblem-notice.png',
        graphicHeight: 32,
        graphicWidth: 32,
        graphicYOffset: -16


    in::

        id: 'mt1',
        name: 'Eigen plaatje',
        externalGraphic: " http://inspire-forum.jrc.ec.europa.eu/pg/groupicon/179/small/1350574732.jpg",
        graphicHeight: 32,
        graphicWidth: 32,
        graphicYOffset: -16


    'mt' staat voor de puntsymbolen (Marker-Type), 'lt' voor de lijnsymbolen (LijnType) en 'pt' voor de vlaksymbolen(PolygonType).
    Sla het aangepaste bestand op met de extensie .js (bijv. mijn_eigen_markers.js).
    Zorg ervoor dat het gemaakte bestand publiekelijke toegankelijk is (bijvoorbeeld door het in het public-gedeelte van dropbox op te slaan of op een website te plaatsen).
    Deze markerset kan de standaard markerset van PDOK Kaart (tijdelijk) overschrijven door bij het opstarten van PDOK Kaart een extra parameter mee te geven voor de “markersdef”: http://kaart.PDOK.nl/?markersdef=http://dl.dropbox.com/u/58173721/mijn_eigen _markers.js

Bij het openen van stap 2 in de Wizard worden nu de eigen markers getoond. Voor meer informatie zie het document `Technische documentatie PDOK Kaart` paragraaf 3.2.

Vraag 3
    Welke webservices kan ik gebruiken als extra kaartlaag in PDOK Kaart en moet ik rekening houden met projecties?

Antwoord
    PDOK Kaart gebruikt het Rijksdriehoekstelsel (RD; epgs:28992) als projectie.
    De coördinaten in een KML zijn altijd in WGS84 (epsg:4326) en worden binnen de kaart zelf omgezet naar RD.
    Gebruikmakend van de Wizard van PDOK Kaart is het mogelijk om services of url's toe te voegen van: WMS, WMTS, KML en txt lagen. In de Api van PDOK Kaart zit bovendien de mogelijkheid om via de parameter 'tmsurl' een TMS service toe te voegen. Daarnaast worden in de 'voorbeelden' nog mogelijkheden getoond om bijvoorbeeld een WFS service als markerlaag op de PDOK-Kaart te leggen.

Vraag 4
    Wanneer ik een url van een KML opneem in PDOK Kaart (via stap 2) krijg ik de volgende foutmelding: “Fout bij ophalen van url”. In Google Maps werkt de url wel. Bijvoorbeeld bij: www.ideoma.nl/bouwnetwerk/dienstlandelijkgebiedutrecht.KML

Antwoord
    De url van de KML moet beginnen met http://. Als dat correct is, komt er mogelijk een melding over de proxy. Zie hiervoor VRAAG 10.
    Niet alle KML mogelijkheden worden in PDOK Kaart ondersteund. PDOK Kaart gebruikt KML als Vector data. De KML moet dus zogenaamde Punt, Lijn of Vlakken bevatten als 'Placemarks' bevatten.
    Intussen heeft Google de mogelijkheden van KML zeer sterk uitgebreid, o.a. door een KML een link te laten bevatten naar een zogenaamd KMZ bestand, of een KML een verwijzing te laten bevatten naar rasterdata zoals een luchtfoto bestand of service. Zulke mogelijkheden worden door OpenLayers, en daarmee door PDOK Kaart niet ondersteund.

Vraag 5
    Bij de optie “extra kaartlagen” voer ik een WMS in. Ik zie echter geen resultaat. Hoe kan dit?

Antwoord
    Dit kan verschillende oorzaken hebben:

    De WMS service is niet in de beschikbaar (niet in de lucht).
    het URL adres of de kaartnaam is fout gespeld.

    In de huidige versie van PDOK Kaart wordt er geen foutmelding gegeven wanneer één van bovenstaande oorzaken plaats vindt. Met behulp van ontwikkeltools in de browser is vaak wel te zien welke url PDOK-Kaart afvuurt en wat de response van de server is.

Vraag 6
    Hoe kan ik een KML maken om te gebruiken in PDOK Kaart?

Antwoord
    Dit kan op verschillende manieren bijvoorbeeld met Google maps (https://maps.google.nl/) en kies ‘Mijn Plaatsen’. U dient zich hiervoor aan te melden bij Google.
    Een andere mogelijkheid is bijvoorbeeld met het programma 2Travel2. Let er op om de juiste volgorde van de x en y coördinaten te kiezen (bijvoorbeeld 5.387258, 52.155423 en niet 52.155423 ,5.387258) in de selectiebox. U vindt dit programma hier:
    http://www.2travel2.nl/Kaarten/polylines-polygonen-coordinaten-en-KML-files-maken.html
    Ook met de Wizard kunt u KML genereren. Zie VRAAG 7.
    Let op: niet alle KML mogelijkheden die bij Google worden aangeboden worden ondersteund door PDOK Kaart, zie ook VRAAG 4.

Vraag 7
    Hoe kan ik een KML bestand maken met de PDOK Kaart Wizard.

Antwoord
    Plaats de markers, lijnen en vlakken met de Wizard en kies stap 3: Genereer code. Kopieer uit “Als broncode in de HTML Head-sectie plaatsen:” de KML code die tussen <KML> en </KML> staat (inclusief <KML> en </KML>). Plak deze code in een tekstbestand. Voeg als eerste regel::

    <?xml version="1.0" encoding="UTF-8"?>

    toe en sla het bestand op met de extensie .KML.
    U kunt dit bestand nu gebruiken voor PDOK Kaart. Dit kan handig zijn wanneer u gebruik wilt maken van de URL, iFrame of Object optie. Deze zijn namelijk niet beschikbaar wanneer de URL langer is dan 2100 tekens. Door gebruik te maken van een KML bestand kunt u toch gebruik maken van de URL mogelijkheid. Het KML bestand dient u wel te uploaden in het PDOK Kaart forum zie ook VRAAG 11.

Vraag 8
    Ik wil gebruik maken van de gegenereerde URL , iFrame of object optie, maar deze is niet beschikbaar omdat het aantal tekens te veel is. Hoe kan ik er toch voor zorgen dat ik gebruik kan maken van deze optie?

Antwoord
    Dit probleem kan meestal opgelost worden wanneer er gebruik wordt gemaakt van een KML-bestand. Heeft u geen KML bestand zie dan VRAAG 6 en 7.
    Bij het toevoegen van een markers in de Wizard kiest u voor de optie markers uit URL, bestand of tekst en daarna voor de optie ‘via URL’.

Vraag
    Hoe maak ik een txt-file om als input te gebruiken voor de markers in PDOK Kaart?

Antwoord 9
    Het eenvoudigst gaat dit met behulp van MS-excel. Maak een nieuw bestand aan met als kopregel (kolomnamen): point, title, description en styletype. Dus cell A1 is point, Cell B1 is description, etc. Selecteer de kolommen A t/m D en kies format(opmaak) en daarna Cell uit het menu. Kies als category/categorie Text/tekst.
    Vul in de kolom point de y en x coördinaten (in RD) in. De y en x zijn gescheiden door een komma. Voorbeeld 518000,117200. Let op eerst de y-coördinaat en daarna de x-coordinaat(!) Vul de titel en de omschrijving in. Optioneel kan het markertype worden meegegeven. De naam van het markertype is mt+volgnummer bijvoorbeeld mt1. Het volgnummer verwijst naar het markertype in de lijst met markers die getoond worden in de Wizard (zie ook http://geonovum.github.com/PDOKkaart/documentatie/). Er kunnen ook eigen markers worden gebruikt zie VRAAG 2.
    Sla het excel bestand op als een 'tab delimited text (TXT)' bestand. LET OP: het is esssentieel dat er dus een tab-karakter staat tussen de verschillende kolommen. Een uitlijning met spaties zal niet werken.
    Een voorbeeld van een ingevuld bestand::

        point   title   description styletype
        517000,117960   mijn title  een hele mooie omschrijving mt5
        518000,117200   nog een titel   en dit is dan de omschrijving   mt7


Vraag
    Ik krijg een melding over een proxy. Wat doe ik hiermee?

Antwoord 10
    Een van de lastige zaken bij webapplicaties met kaarten is het gebruik van externe vector/markerdata. Een van de veiligheidsmaatregelen die een browser treft is dat de browser het standaard onmogelijk maakt om gegevens (let op: images worden NIET gezien als gegevens) van een andere website te 'mengen' met een website. Hierdoor is het wel mogelijk om een externe WMS of WMTS als kaartlaag op te nemen (= images), maar zullen de gegevens van een externe(!) WFS (= xml-data ) door de browser worden tegengehouden. Zie ook http://trac.osgeo.org/openlayers/wiki/FrequentlyAskedQuestions#ProxyHost
Om dit toch mogelijk te maken worden aanroepen naar externe gegevens dan 'omgeleid' via dezelfde server als waar de website vandaan komt. Dus op de server waar kaart.PDOK.nl vandaan komt draait een zogenaamde 'proxy-server' die het mogelijk maakt om via die server gegevens van externe servers binnen te halen. Voor de browser zijn de gegevens dan opeens wel 'vertrouwd'. De proxy-server is vaak weer beveiligd om alleen maar data van 'vertrouwde domeinen/servers' toe te staan.
De PDOK proxy laat op dit moment alleen data toe welke afkomstig is van PDOK zelf. Andere bronnen van vector data zijn dus (zonder aanpassingen in de proxy van PDOK) niet te benaderen. KML en txt-bestanden kunnen op het PDOK-loket worden geplaatst (Forum) en zijn daardoor binnen de proxy beschikbaar.

Vraag
    Hoe kan ik een eigen marker, KML of txt bestand uploaden in het PDOK Kaart forum?

Antwoord 11
    Ga naar het http://www.pdok.nl/nl/forums/PDOK-kaart-onderwerpen en kies ‘nieuw onderwerp’ (om deze functie te kunnen gebruiken moet u ingelogd zijn, maak eventueel eerst een account aan). Maak een nieuw onderwerp aan en upload hierbij het betreffende bestand. (op dit moment is het niet mogelijk om een .js file te uploaden. U zou de file ook ergens op en webserver kunnen zetten).
De URL van het toegevoegde bestand kunt u gebruiken in PDOK Kaart. De URL vindt u door in het forum het betreffende onderwerp te openen, de bijlage (het toegevoegde bestand) selecteren en de URL link van het bestand te kopiëren.

Vraag
    Ik wil gebruik maken van de kaartprikker functionaliteit. Hoe moet ik dat doen?

Antwoord 12
    Om gebruik te kunnen maken van de kaartprikker functionaliteit kunt u het beste gebruik maken van de gegenereerde Head en Body code. Het gebruik van de iFrame en Object optie wordt afgeraden omdat het door allerlei beveiligingsbeperkingen lastig is om de ingeprikte locatie in een Form binnen te halen. Voor het gebruik van de Head en Body code in een HTML pagina kan onderstaand voorbeeld gebruikt worden. Dit voorbeeld gaat uit van een punt met een x- en y-coördinaat.::

        <html>
        <head>
        Paste hier de head code uit de Wizard
        </head>
        <body>
        <form>
        Klik in de kaart om een locatie op te slaan.<BR>
        X-coordinaat in RD: <input id="x" name="x" type="text" />
        Y-coordinaat in RD: <input id="y" name="y" type="text" />
        </form>
        Paste hier de body code uit de Wizard
        </body>
        </html>


Vraag 13
    Ik heb een KML via een URL opgenomen in de kaart. Daarna heb ik de markers in de Wizard aangepast. Na het generen van de code zie ik deze aanpassingen niet terug op de kaart. Hoe krijg ik deze aanpassingen in de KML?

Antwoord
    Wanneer er gebruik wordt gemaakt van een KML via een URL dan worden eventuele wijzigingen die in de Wizard worden aangebracht niet in het KML bestand opgenomen. De KML kan op de volgende manier worden aangepast: copy de inhoud van het KML bestand en paste dit bij Stap 2 Markers optie ‘Markers uit url, bestand of tekst’ in het tekstveld. Maak de benodigde aanpassingen en genereer de code. Zie ook VRAAG 6.

Vraag 14
    De gegenereerde URL wil ik meesturen in een e-mail, maar hij is heel lang. Kan deze niet kleiner gemaakt worden?

Antwoord
    Dat kan: Ga naar deze website (http://tinyurl.com/) en volg de instructies op.