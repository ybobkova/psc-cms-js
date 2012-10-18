Joose.Role('Psc.CMS.DropBoxButtonable', {
  
  does: ['Psc.CMS.TabOpenable','Psc.CMS.Buttonable','Psc.CMS.Identifyable', 'Psc.UI.DropBoxButton'],
  
  has: {
    //attribute1: { is : 'rw', required: false, isPrivate: true }
  },

  methods: {
    getHash: function () {
      return this.getEntityName()+'-'+this.getIdentifier(); // kommt aus identifyable
    },
    serialize: function() {
      return this.getIdentifier();
    },
    getHTMLCopy: function () {
      return this.createButton(); // aus buttonable
    },
    getDropBoxButton: function () {
      return this;
    }
  }
});