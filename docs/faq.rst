
Vaak gestelde vragen over PDOK kaart
====================================

Vraag
  Hoe kan ik eenvoudig een eigen plaatje toevoegen als marker in de kaart? Bijv. voor de komende kerstmarkt in mijn gemeente wil ik een plaatje van een kerstboom op de kaart plaatsen.

Antwoord
  Wanneer het om (maximaal) één eigen plaatje gaat, kan deze in de markerset van de Wizard worden opgenomen door een parameter toe te voegen aan de url van PDOK Kaart. De benodigde parameter is “mimg”. De standaard url van PDOK Kaart is http://kaart.PDOK.nl Hierachter kan de parameter “mimg” worden gezet met de url van het gewenste plaatje: http://kaart.PDOK.nl/?mimg=http://inspire-forum.jrc.ec.europa.eu/pg/groupicon/179/small/1350574732.jpg . Door nu stap 2 van de Wizard te openen (“voeg een marker toe”) komt het eigen plaatje als eerste marker beschikbaar. Wanneer dit niet gebeurt, is een refresh van de browser noodzakelijk (Windows: ctrl F5). De eigen marker kan nu op de kaart worden geplaatst. Wanneer het plaatje in de url groter is dan 32*32 pixels wordt het automatisch kleiner gemaakt tot 32*32 pixels.


Vraag
  Ik wil meerdere eigen plaatjes gebruiken als marker. Hoe kan ik dat realiseren?

Antwoord
  Wanneer meer dan één eigen marker gewenst is, kan een gebruiker een eigen markerset aanmaken die de markerset van PDOK Kaart (tijdelijk) overschrijft. Hiervoor zijn de volgende stappen noodzakelijk:

    Download de standaard markerset van PDOK Kaart: http://kaart.PDOK.nl/api/js/PDOK-markers.js
    Wijzig de inhoud van dit bestand in een teksteditor door desgewenst puntsymbolen (mt), lijnsymbolen(lt) of vlaksymbolen aan te passen of toe te voegen. Wijzig bijvoorbeeld:

                    id: 'mt1',
                    name: 'Informatiebord blauw',
                    externalGraphic: Pdok.ApiUrl + '/markertypes/emblem-notice.png',
                    graphicHeight: 32,
                    graphicWidth: 32,
                    graphicYOffset: -16


    in

                    id: 'mt1',
                    name: 'Eigen plaatje',
                    externalGraphic: " http://inspire-forum.jrc.ec.europa.eu/pg/groupicon/179/small/1350574732.jpg",
                    graphicHeight: 32,
                    graphicWidth: 32,
                    graphicYOffset: -16


    'mt' staat voor de puntsymbolen, 'lt' voor de lijnsymbolen en 'pt' voor de vlaksymbolen.
    Sla het aangepaste bestand op met de extensie .js (bijv. mijn_eigen_markers.js).
    Zorg ervoor dat het gemaakte bestand publiekelijke toegankelijk is (bijvoorbeeld door het in het public-gedeelte van dropbox op te slaan of op een website te plaatsen).
    Deze markerset kan de standaard markerset van PDOK Kaart (tijdelijk) overschrijven door bij het opstarten van PDOK Kaart een extra parameter mee te geven voor de “markersdef”: http://kaart.PDOK.nl/?markersdef=http://dl.dropbox.com/u/58173721/mijn_eigen _markers.js

Bij het openen van stap 2 in de Wizard worden nu de eigen markers getoond. Voor meer informatie zie het document `Technische documentatie PDOK Kaart` paragraaf 3.2.



A: Om gebruik te kunnen maken van de kaartprikker functionaliteit kunt u het beste gebruik maken van de gegenereerde Head en Body code. Het gebruik van de iFrame en Object optie wordt afgeraden omdat het door allerlei beveiligingsbeperkingen lastig is om de ingeprikte locatie in een Form binnen te halen. Voor het gebruik van de Head en Body code in een HTML pagina kan onderstaand voorbeeld gebruikt worden. Dit voorbeeld gaat uit van een punt met een x- en y-coördinaat.

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


13. Q: Ik heb een KML via een URL opgenomen in de kaart. Daarna heb ik de markers in de Wizard aangepast. Na het generen van de code zie ik deze aanpassingen niet terug op de kaart. Hoe krijg ik deze aanpassingen in de KML?

A: Wanneer er gebruik wordt gemaakt van een KML via een URL dan worden eventuele wijzigingen die in de Wizard worden aangebracht niet in het KML bestand opgenomen. De KML kan op de volgende manier worden aangepast: copy de inhoud van het KML bestand en paste dit bij Stap 2 Markers optie ‘Markers uit url, bestand of tekst’ in het tekstveld. Maak de benodigde aanpassingen en genereer de code. Zie ook VRAAG 6.

14. Q: De gegenereerde URL wil ik meesturen in een e-mail, maar hij is heel lang. Kan deze niet kleiner gemaakt worden?

A: Dat kan: Ga naar deze website (http://tinyurl.com/) en volg de instructies op.