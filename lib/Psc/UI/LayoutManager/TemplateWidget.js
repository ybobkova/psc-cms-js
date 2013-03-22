define(['jquery', 'joose', 'knockout', 'Psc/TPL/TemplatesRenderer', 'Psc/UI/UploadableImage', 'Psc/UI/LayoutManagerComponent'], function ($, Joose, ko) {
  Joose.Class('Psc.UI.LayoutManager.TemplateWidget', {
    isa: Psc.UI.LayoutManagerComponent,
    
    has: {
      renderer: { is: 'rw', required: false, isPrivate: true},
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
      initialize: function () {
        this.$$renderer = new Psc.TPL.TemplatesRenderer();


        var uploadService = this.$$uploadService;

        ko.bindingHandlers.singleImage = {
          init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // This will be called when the binding is first applied to an element
            // Set up any initial state, event handlers, etc. here
            var data = valueAccessor();

            var image = new Psc.UI.UploadableImage({
              url: data.url,
              id: data.image,
              uploadService: uploadService,
              widget: $(element)
            });

          }
          /*,
          update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // This will be called once when the binding is first applied to an element,
            // and again whenever the associated observable changes value.
            // Update the DOM element based on the supplied values here.
          }
          */
        };
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

        return this.$$content = this.$$renderer.render(this.getTemplateName(), variables);
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
              item.input = this.createSingleImage(item.defaultValue, "plain");
            } else {
              item.input = this.createTextfield(item.defaultValue, "plain");
            }

            variables[fieldName] = item;
          }
        }

        return variables;
      },

      getTemplateName: function() {
        return 'SCE.Components.'+this.$$type;
      },
      toString: function () {
        return '[Psc.UI.LayoutManager.Teaser]';
      }
    }
  });
});