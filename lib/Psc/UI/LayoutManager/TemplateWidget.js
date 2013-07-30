define([
  'jquery', 'joose', 'knockout', 
  'Psc/Code', 'Psc/ko/Bindings/LayoutManager', 'Psc/ContainerDepending', 'Psc/UI/UploadableImage', 'Psc/UI/LayoutManagerComponent'
  ], function ($, Joose, ko) {
  /**
   * 
   * this class is mainly testet through an acceptance test: Psc.UI.LayoutManager.TeaserTest
   */
  Joose.Class('Psc.UI.LayoutManager.TemplateWidget', {
    isa: Psc.UI.LayoutManagerComponent,

    does: [Psc.ContainerDepending],
    
    has: {
      uploadService: { is: 'rw', required: false, isPrivate: true},
      specification: { is: 'rw', required: true, isPrivate: true},
      currentVariables: { is: 'rw', required: false, isPrivate: true},
      values: { is: 'rw', required: false, isPrivate: true, init: Joose.I.Object}
    },

    before: {
      initialize: function (props) {
        this.initSpecification(props);

        var bindings = new Psc.ko.Bindings.LayoutManager({
          uploadService: this.$$uploadService,
          knockout: ko,
          container: this.$$container
        });

        bindings.activate();
      }
    },
    
    methods: {
      createContent: function () {
        return this.render(this.expandVariables());
      },
      initSpecification: function (props) {
        if (typeof(this.$$specification) === 'string') {
          this.$$specification = $.parseJSON(this.$$specification);
        }

        if (this.$$specification.fields) {
          for(var fieldName in this.$$specification.fields) {
            this.$$values[fieldName] = props[fieldName];
          }
        }

        this.$$type = this.$$specification.name;
      },
      render: function (variables) {
        this.$$currentVariables = variables;

        return this.$$content = this.$$container.getTemplatesRenderer().render(this.getTemplateName(), variables);
      },
      afterCreate: function () {
        ko.applyBindings(this.$$currentVariables, this.unwrap().get(0));
      },
      expandVariables: function() {
        var item, variables = {}, value;

        if (this.$$specification.fields) {
          for(var fieldName in this.$$specification.fields) {
            item = $.extend({
                label: "",
                defaultValue: ""
              }, 
              this.$$specification.fields[fieldName]
            );

            if (item.type === "text") {
              item.input = this.createKOTextarea(fieldName);
            } else if (item.type === "image") {
              item.input = this.createSingleImage(fieldName);
            } else if (item.type === "link") {
              item.input = this.createInternalLinkSelection(fieldName);
            } else {
              item.input = this.createKOTextfield(fieldName);
            }

            value = this.$$values[fieldName] || item.defaultValue;
            //Psc.Code.info('Field value: ', fieldName, value);
            item.value = ko.observable(value);

            variables[fieldName] = item;
          }
        }

        return variables;
      },

      serialize: function (s) {
        var item;
        for (var fieldName in this.$$currentVariables) {
          item = this.$$currentVariables[fieldName];

          s[fieldName] = ko.utils.unwrapObservable(item.value);
        }
      },

      initLabel: function (guessedLabel) {
        this.$$label = this.$$specification.label || this.$$specification.name;
      },

      getItem: function(name) {
        return this.$$currentVariables[name];
      },

      getTemplateName: function() {
        return 'SCE.Widgets.'+this.$$type;
      },
      toString: function () {
        return '[Psc.UI.LayoutManager.TemplateWidget]';
      }
    }
  });
});