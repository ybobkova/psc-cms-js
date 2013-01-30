define(['jquery', 'joose'], function ($, Joose) {
  Joose.Class('Psc.UI.ErrorPane', {
    
    has: {
      container: { is : 'rw', required: true, isPrivate: true },
      label: { is : 'rw', required: false, isPrivate: true, init: 'Es ist ein Fehler aufgetreten' },
      errorMessage: { is : 'rw', required: true, isPrivate: true }
    },
  
    methods: {
      display: function () {
        var $errorPane = this.$$container.find('div.psc-cms-ui-error-pane');
        if (!$errorPane.length) {
          $errorPane = $('<div class="psc-cms-ui-error-pane"></div>');
          this.$$container.prepend($errorPane);
        }
        
        var msg = this.$$errorMessage ? this.$$errorMessage.replace(/\n/g, "<br />") : 'Keine Fehlermeldung vorhanden';
          
        $errorPane.html('<p style="margin-bottom: 10px"><strong>'+this.$$label+'</strong></p>'+
          '<fieldset class="ui-corner-all ui-widget-content psc-cms-ui-group"><legend class="collapsible">Debug</legend>'+
            '<div class="content">'+
            msg+
            '</div>'+
          '</fieldset>'
        );
      },
      hide: function () {
        var $errorPane = this.$$container.find('div.psc-cms-ui-error-pane');
        if ($errorPane.length) {
          $errorPane.remove();
        }
      },
      toString: function() {
        return "[Psc.UI.ErrorPane]";
      }
    }
  });
});