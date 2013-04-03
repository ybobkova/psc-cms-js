define(['jquery', 'joose', 'Psc/TPL/TemplatesRenderer'], function ($, Joose) {
  Joose.Class('Psc.Container', {

    
    has: {
      templatesRenderer: { is: 'rw', required: false, isPrivate: true},
      navigationService: { is: 'rw', required: true, isPrivate: true}
    },
    
    after: {
      initialize: function (props) {
        if (!props.templatesRenderer) {
          this.$$templatesRenderer = new Psc.TPL.TemplatesRenderer();
        }
      }
    },
    
    methods: {
      toString: function () {
        return '[Psc.Container]';
      }
    }
  });
});