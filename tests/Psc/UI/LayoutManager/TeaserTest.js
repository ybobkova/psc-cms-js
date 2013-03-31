define(['psc-tests-assert', 'text!templates/src/SCE/Components/Teaser.json', 'Psc/Test/DoublesManager', 'Psc/UI/LayoutManager/Teaser'], function(t, teaserSpec) {
  
  module("Psc.UI.LayoutManager.Teaser");

  var setup = function (test) {
    var dm = new Psc.Test.DoublesManager();

    var teaser = new Psc.UI.LayoutManager.TemplateWidget({
      specification: teaserSpec,
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

    this.assertjQueryLength(2, $html.find('input:text'));
    this.assertjQueryLength(1, $html.find('textarea'));
    this.assertjQueryLength(1, $html.find('div.span4:contains("Überschrift")'));
    this.assertjQueryLength(1, $html.find('div.span4:contains("Link-Ziel")'));
  });
});