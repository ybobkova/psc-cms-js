define(['joose', 'Psc/CMS/Identifyable'], function (Joose) {
  Joose.Role('Psc.CMS.AutoCompletable', {
    
    does: [Psc.CMS.Identifyable],
    
    has: {
      /**
       * ac.label
       */
      ac: { is : 'rw', required: true, isPrivate: true }
    },
  
    methods: {
      getAutoCompleteLabel: function () {
        return this.$$ac.label;
      }
    }
  });
});