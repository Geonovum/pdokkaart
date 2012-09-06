<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" 
xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
xmlns="http://www.opengis.net/sld" 
xmlns:ogc="http://www.opengis.net/ogc" 
xmlns:xlink="http://www.w3.org/1999/xlink" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                
<NamedLayer>
<Name>bestuurlijkegrenzen:gemeenten_2012</Name>
<UserStyle>
<Title>Gemeentegrenzen</Title>
<Abstract>Gestippelde grijze lijn met gemeentenaam als label</Abstract>
<FeatureTypeStyle>
              
<Rule> 
<Name>bestuurlijkegrenzen:gemeenten_2012</Name>
<Title>bestuurlijkegrenzen:gemeenten_2012</Title>
<Abstract>bestuurlijkegrenzen:gemeenten_2012</Abstract>
<PolygonSymbolizer>
  <Stroke>
    <CssParameter name="stroke">#646464</CssParameter>
    <CssParameter name="stroke-width">1.0</CssParameter>
    <CssParameter name="stroke-opacity">1</CssParameter>
    <CssParameter name="stroke-dasharray">5 2</CssParameter>
  </Stroke>
</PolygonSymbolizer>
<TextSymbolizer>
         <Label>
           <ogc:PropertyName>gemeentenaam</ogc:PropertyName>
         </Label>
         <Halo>
           <Radius>1</Radius>
           <Fill>
             <CssParameter name="fill">#FFFFFF</CssParameter>
           </Fill>
         </Halo>
       </TextSymbolizer>
</Rule>      
</FeatureTypeStyle>
</UserStyle>
</NamedLayer>
</StyledLayerDescriptor>
