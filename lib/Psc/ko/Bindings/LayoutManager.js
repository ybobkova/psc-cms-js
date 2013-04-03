define(['jquery', 'joose', 'Psc/ContainerDepending','Psc/UI/UploadableImage', 'Psc/UI/NavigationSelect'], function ($, Joose) {
  Joose.Class('Psc.ko.Bindings.LayoutManager', {

    does: Psc.ContainerDepending,
    
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
        var that = this, ko = this.$$knockout, uploadService = this.$$uploadService, container = this.$$container;

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

        ko.bindingHandlers.navigationSelect = {
          init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            $.when(container.getNavigationService().getFlat()).then(function (flat) {
              var navigationSelect = new Psc.UI.NavigationSelect({
                flat: flat,
                widget: $(element),
                displayLocale: 'de',
                selectedNodeId: ko.utils.unwrapObservable(valueAccessor())
              });

              navigationSelect.onItemSelected(function(item) {
                var value = valueAccessor();

                value(item.value); // write value back to knockout
              });
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