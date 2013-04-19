define(['psc-tests-assert', 'test-files/navigation.comun.flat', 'Psc/UI/NavigationSelect', 'Psc/UI/NavigationNode'], function(t, comunFlat) {
  
  module("Psc.UI.NavigationSelect");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var navigationSelect = new Psc.UI.NavigationSelect({
      flat: comunFlat,
      widget: $('#visible-fixture').empty(),
      displayLocale: 'de',
      selected: { label: "can be rubbish", value: 15}
    });
    
    return t.setup(test, {navigationSelect: navigationSelect});
  };
  
  test("shows a dropdown with nice indented navigatio nodes", function() {
    var that = setup(this);

    var $widget = this.navigationSelect.unwrap();

    var $input = this.assertjQueryLength(1, $widget.find('input'));
    //this.assertjQueryHasWidget('', $input, message);
  });

  test("selected passed will select the current item / value, etc", function () {
    var that = setup(this);
    var $input = this.assertjQueryLength(1, this.navigationSelect.unwrap().find('input'));

    this.assertEquals('can be rubbish', $input.val());

    this.assertEquals({label: 'can be rubbish', value: 15}, this.navigationSelect.getSelected());
  });

  test("selectedNodeId passed will select the current item just with value", function () {
    var that = setup(this);

    var navigationSelect = new Psc.UI.NavigationSelect({
      flat: comunFlat,
      widget: $('#visible-fixture').empty(),
      displayLocale: 'de',
      selectedNodeId: 15
    });

    that.assertEquals({
       label: " / Wer ? / Unser Lernnetzwerk",
       value: 15
    }, navigationSelect.getSelected());
  });

  test("getSelectedNode will return Psc.UI.NvaigationNode", function () {
    var that = setup(this);

    this.navigationSelect.setDisplayLocale('fr');
    this.navigationSelect.setSelectedFromNodeId(24);

    var node = this.navigationSelect.getSelectedNode();

    this.assertInstanceOf(Psc.UI.NavigationNode, node);
    this.assertEquals(24, node.getId());
    this.assertEquals('fr', node.getLocale());
  });
});