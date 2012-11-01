define(['Psc/UI/LayoutManagerComponent'], function () {
  Joose.Class('Psc.UI.LayoutManager.Websitewidget', {
    isa: Psc.UI.LayoutManagerComponent,
  
    has: {
      name: { is : 'rw', required: true, isPrivate: true }
    },
  
    before: {
      initialize: function () {
        this.$$type = 'websitewidget';
      }
    },
    
    methods: {
      createContent: function () {
        return this.$$content = "Dies ist ein spezielles Widget, welches nicht konfiguriert werden kann.";
      },
  
      toString: function() {
        return "[Psc.UI.LayoutManager.Websitewidget]";
      }
    }
  });
});