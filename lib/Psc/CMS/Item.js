define(['Psc/Code', 'Psc/UI/WidgetWrapper'], function() {
  Joose.Class('Psc.CMS.Item', {
    
    isa: Psc.UI.WidgetWrapper,
      
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
});