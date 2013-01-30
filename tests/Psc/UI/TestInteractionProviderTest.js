define(['psc-tests-assert', 'Psc/UI/TestInteractionProvider'], function(t) {
  
  module("Psc.UI.TestInteractionProvider");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var testInteractionProvider = new Psc.UI.TestInteractionProvider({
    });
    
    return t.setup(test, {provider: testInteractionProvider});
  };
  
  test("provider can confirm yes automatically", function() {
    var that = setup(this);
    
    this.provider.answerToConfirm(true);
    this.assertTrue(this.provider.confirm("is this working?"));
  });

  test("provider can confirm no automatically", function() {
    var that = setup(this);
    
    this.provider.answerToConfirm(false);
    this.assertFalse(this.provider.confirm("is this not working?"));
  });
  
  
  test("provider can prompt for something automatically", function() {
    var that = setup(this);
    
    this.provider.answerToPrompt("busy");
    this.assertEquals(
      "busy",
      this.provider.prompt("give me the working status", "someDefault")
    );
  });
  
  test("provider can prompt for two questions in sequention", function () {
    var that = setup(this);
    
    this.provider.answerToPrompt("first");
    this.provider.answerToPrompt("second");
    
    this.assertEquals(
      "first",
      this.provider.prompt("this is the first prompt"),
      "answers correct to first prompt"
    );

    this.assertEquals(
      "second",
      this.provider.prompt("this is the second prompt"),
      "answers correct for second prompt"
    );
  });
});