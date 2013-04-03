define(
  ['jquery', 'joose', 'knockout', 'Psc/ko/Bindings/LayoutManager', 'Psc/ContainerDepending', 'Psc/UI/UploadableImage', 'Psc/UI/LayoutManagerComponent'], 
  function ($, Joose, ko) 
{
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
      currentVariables: { is: 'rw', required: false, isPrivate: true}
    },

    before: {
      initialize: function() {
        this.initSpecification();
      }
    },
    
    after: {
      initialize: function (props) {
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
      initSpecification: function () {
        if (typeof(this.$$specification) === 'string') {
          this.$$specification = $.parseJSON(this.$$specification);
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
        var item, variables = {};

        if (this.$$specification.fields) {
          for(var fieldName in this.$$specification.fields) {
            item = $.extend({
                label: "",
                defaultValue: ""
              }, 
              this.$$specification.fields[fieldName]
            );

            if (item.type === "text") {
              item.input = this.createTextarea(item.defaultValue, "plain");
            } else if (item.type === "image") {
              item.input = this.createSingleImage(fieldName, item.defaultValue, "plain");
            } else if (item.type === "link") {
              item.input = this.createInternalLinkSelection(fieldName, item.defaultValue, "plain");
            } else {
              item.input = this.createTextfield(item.defaultValue, "plain");
            }

            variables[fieldName] = item;
          }
        }

        return variables;
      },

      getTemplateName: function() {
        return 'SCE.Widgets.'+this.$$type;
      },
      toString: function () {
        return '[Psc.UI.LayoutManager.Teaser]';
      }
    }
  });
});