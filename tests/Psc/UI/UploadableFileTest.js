define(['psc-tests-assert','jquery-simulate','Psc/UI/UploadableFile','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.UploadableFile");
  
  var setup = function(test) {
    var dm = new Psc.Test.DoublesManager();
    
    var $widget, $widgetEmpty;
    $('#visible-fixture')
      .empty()
      .append($widget = $('<div class="normal"/>'))
      .append($widgetEmpty = $('<div class="empty"/>'));
    
    var uploadService = dm.getUploadService();
    
    var file = new Psc.UI.UploadableFile({
      uploadService: uploadService,
      id: 2,
      url: '/ask/controller/with/monsterhash/for/businessplan.pdf',
      description: 'Businessplan für 2012',
      widget: $widget
    });

    var emptyFile = new Psc.UI.UploadableFile({
      uploadService: uploadService,
      url: null,
      id: null,
      description: null,
      widget: $widgetEmpty
    });
    
    return t.setup(test, {uploadService: uploadService, file: file, emptyFile: emptyFile});
  };

  test("placeholder has button, on click starts upload dialog", function () {
    var that = setup(this);
    
    var $button = this.emptyFile.unwrap().find('button');
    this.assertEquals(1, $button.length, 'button ist vorhanden für upload');
    
    // opens?
    $button.simulate('click');
    var dialog = this.uploadService.getSingleDialog();
    this.assertTrue(dialog.isOpen());
    
    var $descriptionInput = dialog.unwrap().find('input[type="text"]');
    
    dialog.close();
  });
});