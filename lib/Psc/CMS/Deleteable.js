define(['joose', 'Psc/CMS/Identifyable', 'Psc/Request'], function(Joose) {
  Joose.Role('Psc.CMS.Deleteable', {
  
    does: [Psc.CMS.Identifyable],
  
    has: {
      /**
       * delete.url
       * delete.method
       */
      'delete': { is : 'rw', required: true, isPrivate: true }
    },

    methods: {
      getDeleteRequest: function () {
        return new Psc.Request(this.$$delete);
      }
    }
  });
});