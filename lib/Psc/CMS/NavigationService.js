define(['jquery', 'joose', 'Psc/UI/NavigationSelect'], function ($, Joose) {
  Joose.Class('Psc.CMS.NavigationService', {

    has: {
      flat: { is: 'rw', required: true, isPrivate: true}
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      /**
       * Returns a widget to select a node of the full navigation
       * 
       * params
       *  .displayLocale
       *  .widget
       *  [.selected]
       * 
       * @return promise
       */
      getNavigationSelect: function (params) {
        var d = $.Deferred();

        $.when(this.getFlat()).then(function (flat) {
          params.flat = flat;
          var navigationSelect = new Psc.UI.NavigationSelect(params);

          d.resolve(navigationSelect);
        });

        return d.promise();
      },
      
      /**
        * @return promise
        */
      getFlat: function () {
        var d = $.Deferred(), flat = this.$$flat;

        window.setTimeout(
          function () {
            d.resolve(flat);
          },
          10
        );

        return d.promise();
      },
      toString: function () {
        return '[Psc.CMS.NavigationService]';
      }
    }
  });
});