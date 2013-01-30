define(['psc-tests-assert', 'joose', 'Psc/UI/HTML/Base'], function(t, Joose) {
  
  module("Psc.UI.HTML.Base");
  
  var setup = function (test) {
    return t.setup(test, {
      htmlClass: Joose.Class({
        
        does: [Psc.UI.HTML.Base],
        
        methods: {
          refresh: function () {
            
          }
        }
      })
    });
  };

  test("acceptance", function() {
    setup(this);
    var htmlParent = new this.htmlClass();
    
    var $div = htmlParent.tag('div', {
      'class': ['ui-widget', 'ui-row'],
      'title': 'my title'
    });
    
    this.assertTrue($div.hasClass('ui-widget'));
    this.assertTrue($div.hasClass('ui-row'));
    this.assertEquals("my title", $div.attr('title'));
  });
});