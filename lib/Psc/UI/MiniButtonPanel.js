define(['jquery', 'joose', 'Psc/UI/HTML/Base','Psc/UI/Button'], function ($) {
  Joose.Class('Psc.UI.MiniButtonPanel', {
    
    does: Psc.UI.HTML.Base,

    has: {
      buttons: { is: 'rw', required: true, isPrivate: true}
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      refresh: function () {
        this.$$html = $('<div/>');
        
        var k, $button;
        for(k in this.$$buttons) {
          this.$$html.append(
            this.createButton(k, this.$$buttons[k])
          );
        }
        
        this.$$html.buttonset();
      },
      createButton: function(name, spec) {
        var button = new Psc.UI.Button(spec);
        var $button = button.create();
        
        $button.addClass(name);
        
        return $button;
      },
      toString: function () {
        return '[Psc.UI.MiniButtonPanel]';
      }
    }
  });
});