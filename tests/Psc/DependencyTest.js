define(['psc-tests-assert','Psc/Exception','Psc/Code'], function () {
  module("dependency");

  test("loading with script tags in use", function () {
    define(['psc-tests-assert','Psc/Table'], function () {
      this.assertTrue(Psc.Code.isFunction(Psc.Table), 'Psc.Table is loaded');
    });
  });

  test("loading with script tags", function () {
    this.assertTrue(Psc.Code.isFunction(Psc.Table), 'Psc.Table is loaded');
  });

});