# PDOKKaart

[PDOK Kaart](https://kaart.pdok.nl/) is een app waarmee gebruikers via een grafische interface eenvoudig interactieve kaarten kunnen maken op basis van webservices afkomstig van PDOK en eigen servers. De resulterende kaart is vervolgens makkelijk in een website te embedden.

PDOKKaart is ontstaan uit de wens om (voor de Nederlandse) overheid snel een
eenvoudige kaartje met informatie te kunnen maken voor het gebruik in website of
content management systeem (bijv. ter vervanging van Google Maps kaartjes).
Daarbij wordt zoveel mogelijk gebruik gemaakt van Nederlandse
gegevens/kaartmateriaal afkomstig van PDOK.

- [Broncode](https://git.dev.cloud.kadaster.nl/pdok/pdok-kaart) 
- Productie versie: https://kaart.pdok.nl
- Documentatie: [pdokkaart.readthedocs.org](http://pdokkaart.readthedocs.org/) - [broncode documentatie](https://github.com/Geonovum/pdokkaart/blob/docs/docs/index.rst)

> N.B. De status van het [oorspronkelijk upstream git repository](https://github.com/Geonovum/pdokkaart) van GeoNovum is op moment van schrijven onduidelijk (2022-09-06/Anton Bakker). Voor zover ik weet nemen we geen changes meer over van het upstream repo. De [documentatie](http://pdokkaart.readthedocs.org/) wordt wel op basis van dat repository uitgeserveerd middels het [readthedocs](https://readthedocs.org/) platform.  

> N.B. De status van het [oorspronkelijk upstream git
> repository](https://github.com/Geonovum/pdokkaart) van GeoNovum is op moment
> van schrijven onduidelijk (2022-09-06/Anton Bakker). Voor zover ik weet nemen
> we geen changes meer over van het upstream repo. De
> [documentatie](http://pdokkaart.readthedocs.org/) wordt wel op basis van dat
> repository uitgeserveerd middels het [readthedocs](https://readthedocs.org/)
> platform.  

## Wizard en JavaScript API

PDOK Kaart bestaat uit twee onderdelen: De PDOK Kaart Wizard en de PDOK Kaart API. De [Wizard](https://kaart.pdok.nl>) is een grafische interface waarmee gebruikers in een paar klikken een kaart kunnen samenstellen voor gebruik als embed in de eigen site of CMS. Zie de [Wizard documentatie](http://pdokkaart.readthedocs.org/nl/latest/wizard.html) voor meer informatie. 

De JavaScript API stelt gebruikers in staat om PDOK Kaart functionaliteit via
URL parameters en JavaScript aan te roepen. Zie de [API
documentatie](http://pdokkaart.readthedocs.org/nl/latest/api.html) voor meer
informatie.
