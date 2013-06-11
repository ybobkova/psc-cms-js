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

    var setupHTML = function (component) {
      var $widget;
      $('#visible-fixture').append(
        $widget = component.create()
      );
      return $widget;
    };
    
    return t.setup(test, {h1: h1, h2: h2, h4: h4, setupHTML: setupHTML});
  };
  
  test("headline h1/h2 uses the headline-label for level 1/2", function() {
    var that = setup(this);
    
    this.assertEquals(undefined, this.h1.getLabel());
    this.assertEquals(undefined, this.h2.getLabel());
    
    this.assertEquals(undefined, this.h4.getLabel());
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

  test("isempty reflects if headline has content", function () {
    var that = setup(this);

    this.setupHTML(this.h1);
    this.setupHTML(this.h2);
    this.setupHTML(this.h4);

    this.assertTrue(this.h4.isEmpty());
    this.assertFalse(this.h1.isEmpty());
    this.assertFalse(this.h2.isEmpty());
  });


  test("serialize puts level and content into s", function () {
    var that = setup(this), s = {type: 'headline', 'label':'none'};
    this.setupHTML(this.h1);
    this.setupHTML(this.h2);

    this.h1.serialize(s);

    this.assertEquals('lorem ipsum dolor', s.content);
    this.assertEquals(1, s.level);

    this.h2.serialize(s);
    this.assertEquals(2, s.level);
  });
});