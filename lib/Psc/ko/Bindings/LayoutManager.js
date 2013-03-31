define(['jquery', 'joose'], function ($, Joose) {
  Joose.Class('Psc.ko.Bindings.LayoutManager', {

    
    has: {
      knockout: { is: 'rw', required: true, isPrivate: true},

      uploadService: { is: 'rw', required: true, isPrivate: true}
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      activate: function () {
        var that = this, ko = this.$$knockout, uploadService = this.$$uploadService;

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
        };
      },


      toString: function () {
        return '[Psc.ko.Bindings.LayoutManager]';
      }
    }
  });
});