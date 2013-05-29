define(['jquery', 'joose', 'Psc/UI/WidgetWrapper', 'Psc/ContainerDepending'], function ($, Joose) {
  /**
   * A special WidgetWraper which has a template to display its contents
   */
  Joose.Class('Psc.UI.TemplateWidgetWrapper', {
    isa: Psc.UI.WidgetWrapper,

    does: [Psc.ContainerDepending],

    has: {
      templateName: { is: 'rw', required: true, isPrivate: true}
    },
    
    methods: {
      render: function (variables) {
        return this.$$container.getTemplatesRenderer().render(this.getTemplateName(), variables);
      },

      toString: function () {
        return '[Psc.UI.TemplateWidgetWrapper]';
      }
    }
  });
});