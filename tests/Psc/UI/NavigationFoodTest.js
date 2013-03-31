define(['psc-tests-assert','text!fixtures/navigation.food.json','Psc/UI/Navigation'], function(t, foodJSON) {
  
  module("Psc.UI.Navigation (FoodTest)");
  
  var setup = function (test) {
    var $html = $('#qunit-fixture').html('<div class="fpsc-cms-ui-navigation-container"><fieldset class="psc-cms-ui-navigation"><legend>Navigation</legend><div class="content"><ul class="ui-widget"></ul></div></fieldset></div>');
    
    var nodes;  
    var navigation = new Psc.UI.Navigation({
      uiController: {},
      widget: $html,
        /* the example is from the webforge-testdata-repository: FoodCategories
         *
         * the only language is en
         *
         *   Food
         *      Vegetables
         *      Fruits
         *        Citrons
         *        Oranges
         *      Milk
         *      Meat
         *        Beef
         *        Ham
         *
         */
        flat: nodes = JSON.parse(foodJSON)
    });
    
    $.expr[':'].contentEquals = function(el, idx, meta) {
      return $(el).text() === meta[3];
    };
    
    var assertNodeDepth = function (nodeTitle, expectedDepth) {
      var $widget = navigation.getNavigationWidget();
      
      var $li = test.assertjQueryLength(1, $widget.find('ul.ui-widget li:has(span.title:contentEquals("'+nodeTitle+'"))'));
      test.assertjQueryHasClass('depth-'+expectedDepth, $li);
    };
    
    return t.setup(test, {
      assertNodeDepth: assertNodeDepth,
      navigation: navigation,
      nodes: nodes, $html: $html
    });
  };

  test("navigation widget has only one ul.ui-widget", function () {
    var that = setup(this);
    
    this.assertjQueryLength(1, this.navigation.getNavigationWidget().find('ul.ui-widget'), 'there is only one ul.ui-widget in navigation-widget');
  });

  test("indentation in frontend", function() {
    var that = setup(this);
    
    this.assertNodeDepth('Food', 0);
    this.assertNodeDepth('Milk', 1);
    this.assertNodeDepth('Ham', 2);
  });
  
});