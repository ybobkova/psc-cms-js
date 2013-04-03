define(['psc-tests-assert', 'text!templates/src/SCE/Widgets/Teaser.json', 'test-files/navigation.comun.flat','Psc/Test/DoublesManager', 'Psc/UI/LayoutManager/Teaser'], function(t, teaserSpec, comunFlat) {
  
  module("Psc.UI.LayoutManager.Teaser");

  var setup = function (test) {
    var dm = new Psc.Test.DoublesManager();
    var container = dm.getContainer();

    container.getNavigationService().setFlat(comunFlat);

    var teaser = new Psc.UI.LayoutManager.TemplateWidget({
      specification: teaserSpec,
      container: container,
      uploadService: dm.getUploadService()
    });
    
    $('#visible-fixture').empty().append(teaser.create());
    
    return t.setup(test, {teaser: teaser});
  };

  test("parses the spec (sets type)", function () {
    setup(this);

    this.assertEquals("Teaser", this.teaser.getType());
  });
  
  test("render cms html", function() {
    var that = setup(this);

    var $html = this.teaser.create();

    this.assertjQueryLength(1, $html.find('input:text'));
    this.assertjQueryLength(1, $html.find('textarea'));
    this.assertjQueryLength(1, $html.find('div:contentEquals("Überschrift")'));
    this.assertjQueryLength(1, $html.find('div:contentEquals("Link-Ziel")'));
  });
});
