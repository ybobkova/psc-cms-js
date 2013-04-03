define(['jquery', 'joose'], function ($, Joose) {
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