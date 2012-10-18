Joose.Class('Psc.CMS.Item', {
  
  isa: 'Psc.UI.WidgetWrapper',
  
  use: ['Psc.Code'],
    
  has: {
  },
  
  after: {
    initialize: function () {
      //Psc.Code.debug('Item: link mit widget ',this.unwrap());
      this.checkWidget();
      this.linkWidget();
    }
  },

  methods: {
    
    toString: function() {
      return "[Psc.CMS.Item]";
    }
  }
});