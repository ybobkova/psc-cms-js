define(['psc-tests-assert', 'Psc/UI/LayoutManager/Headline'], function(t) {
  
  module("Psc.UI.LayoutManager.Headline");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var h1 = new Psc.UI.LayoutManager.Headline({
      level: 1,
      content: "lorem ipsum dolor"
    });

    var h2 = new Psc.UI.LayoutManager.Headline({
      level: 2,
      content: "is et abanit"
    });

    var h4 = new Psc.UI.LayoutManager.Headline({
      level: 4,
      content: ""
    });
    
    return t.setup(test, {h1: h1, h2: h2, h4: h4});
  };
  
  test("headline h1/h2 uses the headline-label for level 1/2", function() {
    var that = setup(this);
    
    this.assertEquals("Überschrift", this.h1.getLabel());
    this.assertEquals("Zwischenüberschrift", this.h2.getLabel());
    
    this.assertEquals("Zwischenüberschrift 4", this.h4.getLabel());
  });
  
  test("headline label can be injected", function () {
    var that = setup(this);
    
    var h3 = new Psc.UI.LayoutManager.Headline({
      label: 'h3',
      content: "",
      level: 3
    });
    
    this.assertEquals("h3", h3.getLabel());
  });
});