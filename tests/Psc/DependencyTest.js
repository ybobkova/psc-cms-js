define(['Psc/Exception','Psc/Code'], function () {
  module("dependency");

  test("loading with script tags in use", function () {
    define(['Psc/Table'], function () {
      assertTrue(Psc.Code.isFunction(Psc.Table), 'Psc.Table is loaded');
    });
  });

  test("loading with script tags", function () {
    assertTrue(Psc.Code.isFunction(Psc.Table), 'Psc.Table is loaded');
  });

});