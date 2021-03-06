define(['joose', 'jquery', 'lodash'], function (Joose, $, _) {
  Joose.Class('Psc.UI.Component', {
  
    has: {
      name: { is : 'rw', required: true, isPrivate: true },
      label: { is : 'rw', required: false, isPrivate: true },
      widget: { is : 'rw', required: true, isPrivate: true },
      value: { is : 'rw', required: true, isPrivate: true }
    },
    
    methods: {
      html: function () {
        var $html = $('<div class="component-wrapper input-set-wrapper"/>');

        var dashedName;
        if (_.isArray(this.$$name)) {
          dashedName = this.$$name.join('-');
        } else {
          dashedName = this.$$name;
        }

        $html.addClass('component-'+dashedName);
        
        if (this.$$label) {
          $html.append('<label class="psc-cms-ui-label">'+this.$$label+'</label>');
        }
        
        $html.append(this.$$widget);
        
        return $html;
      },
      
      toString: function() {
        return "[Psc.UI.Component]";
      }
    }
  });
});