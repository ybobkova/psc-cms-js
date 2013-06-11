define(['joose'], function(Joose) {
  Joose.Role('Psc.UI.Translating', {

    has: {
      translator: {  is: 'rw', required: true, isPrivate: true }
    },

    methods: {
      trans: function (key, params) {
        return this.$$translator(key);
      }
    }
  });
});