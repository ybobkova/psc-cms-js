define(['Psc/UI/UploadableFile','Psc/Test/DoublesManager'], function() {
  
  module("Psc.UI.UploadableFile");
  
  var setup = function () {
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
    
    return {uploadService: uploadService, file: file, emptyFile: emptyFile};
  };

  test("placeholder has button, on click starts upload dialog", function () {
    $.extend(this, setup());
    
    var $button = this.emptyFile.unwrap().find('button');
    assertEquals(1, $button.length, 'button ist vorhanden für upload');
    
    // opens?
    $button.simulate('click');
    var dialog = this.uploadService.getSingleDialog();
    assertTrue(dialog.isOpen());
    
    var $descriptionInput = dialog.unwrap().find('input[type="text"]');
    
    dialog.close();
  });
    
  test("placeholder ", function () {
    $.extend(this, setup());
    
    var doTest = function ($html, uploadService, debug) {
      var $image = $html.find('.psc-cms-ui-uploadable-image');
      $image.simulate('dblclick');
      
      var dialog = uploadService.getSingleDialog();
      assertTrue(dialog.isOpen());
      
      dialog.close();
      
      //var request = uploadService.getAjaxService().getRequest();
      //assertNotUndefined(request,'ajax service request has been invoked '+debug);
    };
    
    doTest(this.image.unwrap(), this.uploadService, 'for image');
    doTest(this.emptyImage.unwrap(), this.uploadService, 'for placeholder');
    
  });
});