define(['jquery', 'joose', 'Psc/UI/LayoutManagerComponent'], function ($, Joose) {
  Joose.Class('Psc.UI.LayoutManager.Teaser', {
    isa: Psc.UI.LayoutManagerComponent,
    
    has: {
      //propertyName: { is: 'rw', required: true, isPrivate: true},
    },
    
    before: {
      initialize: function () {
        this.$$type = 'Teaser';
      }
    },
    
    methods: {
      createContent: function () {
        var $row = $('<div class="row-fluid">');
        
        $row.append(
          '<div class="span4">Überschrift des Teasers</div>'
        );

        $row.append( $('<div class="span8">').append(this.createTextfield("die Überschrift")) );
        
        this.$$content = $row;
      },
      toString: function () {
        return '[Psc.UI.LayoutManager.Teaser]';
      }
    }
  });
});