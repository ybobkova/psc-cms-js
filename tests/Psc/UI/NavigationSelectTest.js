define(['psc-tests-assert', 'test-files/navigation.comun.flat', 'Psc/UI/NavigationSelect'], function(t, comunFlat) {
  
  module("Psc.UI.NavigationSelect");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var navigationSelect = new Psc.UI.NavigationSelect({
      flat: comunFlat,
      widget: $('#visible-fixture').empty(),
      displayLocale: 'de'
    });
    
    return t.setup(test, {navigationSelect: navigationSelect});
  };
  
  test("shows a dropdown with nice indented navigatio nodes", function() {
    var that = setup(this);

    var $widget = this.navigationSelect.unwrap();

    var $input = this.assertjQueryLength(1, $widget.find('input'));
    //this.assertjQueryHasWidget('', $input, message);

  });
});