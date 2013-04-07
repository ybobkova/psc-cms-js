define(['jquery', 'joose'], function ($, Joose) {
  Joose.Class('Psc.UI.LayoutManager.Control', {

    
    has: {
      type: { is: 'rw', required: true, isPrivate: true},
      label: { is: 'rw', required: true, isPrivate: true}, // later optional?
      params: { is: 'rw', required: false, isPrivate: true, init: Joose.I.Object},
      section: { is: 'rw', required: false, isPrivate: true, init: 'text-und-bilder'}
    },
    
    after: {
      initialize: function () {
        
      }
    },
    
    methods: {
      getComponentClass: function () {
        return 'Psc.UI.LayoutManager.'+this.$$type;
      },

      toString: function () {
        return '[Psc.UI.LayoutManager.Control]';
      }
    }
  });
});