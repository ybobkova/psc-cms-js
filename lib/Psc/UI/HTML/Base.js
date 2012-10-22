define(['Psc/Code'], function() {
  Joose.Role('Psc.UI.HTML.Base', {
    
    requires: ['refresh'],
    
    has: {
      html: { is : 'rw', required: false, isPrivate: true, init: '' }
    },
    
    methods: {
      tag: function (name, properties) {
        properties = properties || {};
        
         //Unsupported in IE:
         //
         // $('<input />', {
         //     type: 'text',
         //     name: 'test'
         // }).appendTo("body");
        
        
        if (properties['class'] && Psc.Code.isArray(properties['class'])) {
          if (properties['class'].length) {
            properties['class'] = properties['class'].join(' ');
          }
        }
        
        if (properties['class'] === '' || properties['class'] === false) {
          delete properties['class'];
        }
        
        return $('<'+name+' />', properties);
      },
      html: function () {
        this.refresh();
        return this.getHtml();
      }
    }
  });
});