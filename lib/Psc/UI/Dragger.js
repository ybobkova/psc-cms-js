/**
 *
 * Draggt auf Absoluten koordinaten
 */
Joose.Class('Psc.UI.Dragger', {
  
  // use jquery.simulate
  use: ['Psc.Code'],
  
  has: {
    //attribute1: { is : 'rw', required: false, isPrivate: true }
  },

  methods: {
    // zieht das $element mit seiner Mitte auf die Mitte des $otherElement
    toElement: function ($element, $otherElement) {
      var otherPos = this.centerOf($otherElement);
      this.log('drag from to', $element, $otherElement);
      
      return this.toPosition($element, otherPos.x, otherPos.y);
    },
    
    // verschiebt das Element zur absoluten position x,y gemessen an absolute coordinate? (body?)
    // das Element wird mit der Mitte des Elementes auf der Koordinate platziert
    toPosition: function ($element, x, y, atPosition) {
      var elementPos;
      if (atPosition === 'top left') {
        elementPos = this.topLeftOf($element);
      } else {
        elementPos = this.centerOf($element);
      }
      this.log('dragToPosition: x:'+x+' y:'+y);
      
      // wir wollen von elementPos zu x auf der x Achse
      // je nachdem kann dies positiv oder negative distanz bedeuten
      var distX = x - elementPos.x; // wenn elementPos > x ist (aka: element ist rechts von ziel), dann müssen wir -diff draggen
      var distY = y - elementPos.y;
      
      return this.distance($element, distX, distY);
    },
    
    // verschiebt das element von seiner aktuellen Position dx auf der X-Achse und dy auf der Y-Achse
    distance: function ($element, distX, distY) {
      this.log('dragDistance: x:'+distX+' y:'+distY);
      $element.simulate("drag", { dx: distX, dy: distY });
    },
    
    // gibt den mittelpunkt des elements zurück
    // @return {x:int, y:int}
    centerOf: function ($element) {
      var o = $element.offset();
      
      return {
        x: o.left + $element.outerWidth() / 2,
        y: o.top + $element.outerHeight() / 2
      };
    },
    
    topLeftOf: function ($element) {
      var o = $element.offset();
      
      return {
        x: o.left,
        y: o.top
      };
    },
    
    log: function() {
      (Psc.Code.debug).apply(this, arguments);
    }
  }
});