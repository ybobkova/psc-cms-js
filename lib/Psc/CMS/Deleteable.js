Joose.Role('Psc.CMS.Deleteable', {
  
  use: ['Psc.Request'],
  
  does: ['Psc.CMS.Identifyable'],
  
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