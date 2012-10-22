define(['psc-tests-assert','Psc/UI/HTML/Base'], function() {
  var htmlClass;
  
  module("Psc.UI.HTML.Base", {
    setup: function () {
      
      htmlClass = Class({
        does: ['Psc.UI.HTML.Base'],
        
        methods: {
          refresh: function () {
            
          }
        }
      });
    }
  });

  test("acceptance", function() {
    var htmlParent = new htmlClass();
    
    var $div = htmlParent.tag('div', {
      'class': ['ui-widget', 'ui-row'],
      'title': 'my title'
    });
    
    
    this.assertEquals('<div title="my title" class="ui-widget ui-row"></div>', $('#qunit-fixture').empty().append($div).html());
  
  });
});