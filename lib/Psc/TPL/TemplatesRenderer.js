define(['jquery', 'joose', 'templates/compiled', 'hogan', 'Psc/Exception'], function ($, Joose, templates, Hogan) {
  Joose.Class('Psc.TPL.TemplatesRenderer', {

    
    has: {
      templates: { is: 'rw', required: false, isPrivate: true}
    },
    
    after: {
      initialize: function () {
        this.$$templates = templates || {};
      }
    },
    
    methods: {
      render: function (templateName, variables) {
        if (!templates[templateName]) {
          throw new Psc.Exception('The template with name '+templateName+' cannot be found.');
        }
        return templates[templateName](variables);
      },
      
      compile: function (templateName, templateCode) {
        var template = Hogan.compile(templateCode);
        
        this.$$templates[templateName] = function (variables) {
          return template.render(variables);
        };
      },

      extendWith: function(templates) {
        $.extend(this.$$templates, templates);
        return this;
      },
      
      toString: function () {
        return '[Psc.TPL.TemplatesRenderer]';
      }
    }
  });
});