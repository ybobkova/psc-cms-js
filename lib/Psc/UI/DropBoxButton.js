/**
 * DropBoxButton Role
 *
 * Ein DropBoxButton (you guessed it) kann in einer DropBox angezeigt werden. jay.
 *
 * getHash() - gibt einen skalar zurück, der den Button eindeutig identifiziert (damit wir so constriants wie multiple in der dropbox testen können)
 * YAGNI (nicht implementiert): remove() - entfernt das html widget des buttons aus dem dom (bzw aus der dropBox ist wichtig ;))
 * getHTML() - gibt das HTML zur Darstellung des Buttons zurück
 * serialize() - wird aufgerufen wenn die dropbox serializiert wird und kann formulardaten als javascript object / array zurückgeben
 */
Joose.Role('Psc.UI.DropBoxButton', {
  requires : [ 'getHash',
              //'remove',
              'serialize',
              'getHTMLCopy' ]
  
});