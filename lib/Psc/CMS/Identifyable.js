define(['joose'], function (Joose) {
  Joose.Role('Psc.CMS.Identifyable', {
    
    has: {
      identifier: { is : 'rw', required: true, isPrivate: true },
      entityName: { is : 'rw', required: true, isPrivate: true }
    },
  
    methods: {
      getIdentifier: function() {
        return this.$$identifier;
      },
      getEntityName: function() {
        return this.$$entityName;
      }
    }
  });
});