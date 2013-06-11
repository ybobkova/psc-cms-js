define(['jquery', 'joose', 'translator', 'Psc/TPL/TemplatesRenderer'], function ($, Joose, translator) {
  Joose.Class('Psc.Container', {

    has: {
      templatesRenderer: { is: 'rw', required: false, isPrivate: true},

      navigationService: { is: 'rw', required: true, isPrivate: true},
      translator: { is: 'rw', required: false, isPrivate: true}
    },
    
    after: {
      initialize: function (props) {
        if (!props.templatesRenderer) {
          this.$$templatesRenderer = new Psc.TPL.TemplatesRenderer();
        }

        this.$$translator = translator; // jquery Global in translator kann nicht injected werden?
      }
    },
    
    methods: {
      setLocale: function (locale) {
        this.$$translator.setLocale(locale);
      },
      toString: function () {
        return '[Psc.Container]';
      }
    }
  });
});