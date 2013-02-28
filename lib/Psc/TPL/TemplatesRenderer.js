define(['jquery', 'joose', 'templates/compiled', 'hogan'], function ($, Joose, templates, Hogan) {
  Joose.Class('Psc.TPL.TemplatesRenderer', {

    
    has: {
      templates: { is: 'rw', required: false, isPrivate: true},
    },
    
    after: {
      initialize: function () {
        this.$$templates = templates || {};
      }
    },
    
    methods: {
      render: function (templateName, variables) {
        return templates[templateName](variables);
      },
      
      compile: function (templateName, templateCode) {
        var template = Hogan.compile(templateCode);
        
        this.$$templates[templateName] = function (variables) {
          return template.render(variables);
        };
      },
      
      toString: function () {
        return '[Psc.TPL.TemplatesRenderer]';
      }
    }
  });
});