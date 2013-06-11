define(['psc-tests-assert', 'Psc/Test/DoublesManager', 'Psc/Container', 'Psc/TPL/TemplatesRenderer'], function(t) {
  
  module("Psc.Container");

  var setup = function (test) {
    var dm = new Psc.Test.DoublesManager();
    var container = dm.getContainer();
    
    return t.setup(test, {container: container});
  };
  
  test("has a TemplateRenderer", function() {
    var that = setup(this);

    this.assertInstanceOf(Psc.TPL.TemplatesRenderer, that.container.getTemplatesRenderer());
  });

  test("has a NavigationService", function() {
    var that = setup(this);

    this.assertInstanceOf(Psc.CMS.NavigationService, that.container.getNavigationService());
  });

  test("has a Translator", function() {
    var that = setup(this), translator;

    this.assertNotUndefined(translator = that.container.getTranslator());

    that.container.setLocale('de');
    this.assertEquals('de', translator.trans('test.loaded-language'));

    that.container.setLocale('en');
    this.assertEquals('en', translator.trans('test.loaded-language'));

    that.container.setLocale('fr');
    this.assertEquals('fr', translator.trans('test.loaded-language'));
  });
});