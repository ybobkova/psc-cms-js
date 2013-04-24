define(['psc-tests-assert', 'jquery', 'Psc/CMS/NavigationService'], function(t, $) {
  
  module("Psc.CMS.NavigationService");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();

    var flat = ['fakeFlat', true];

    var navigationService = new Psc.CMS.NavigationService({
      flat: flat
    });
    
    return t.setup(test, {navigationService: navigationService, flat: flat});
  };
  
  asyncTest("returns a promise whith getFlat() which returns flat", function() {
    var that = setup(this);

    $.when(this.navigationService.getFlat()).then(function (flat) {
      start();
      
      that.assertEquals(that.flat, flat);
    });

  });
});