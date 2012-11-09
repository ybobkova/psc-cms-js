define(['psc-tests-assert','Psc/UI/HTML/TagBuilder','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.HTML.TagBuilder");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var tagBuilder = new Psc.UI.HTML.TagBuilder({
      name: "span"
    });
    
    t.setup(test, {tagBuilder: tagBuilder});
  };

  test("TODO: nothing to test here", function() {
    expect(0);
    setup(this);
  
  /*
    this.assertEquals(
      '<span class="title"></span>',
      
    );
    */
  });
});