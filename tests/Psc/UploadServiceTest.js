use(['Psc.UploadService','Psc.Request','Psc.Test.DoublesManager'], function() {
  
  module("Psc.UploadService");
  
  var setup = function (dataCallback) {
    var dbm = new Psc.Test.DoublesManager();
    
    var exceptionProcessor = dbm.getExceptionProcessor();
    var ajaxService = dbm.getAjaxService();
    
    var uploadService = new Psc.UploadService({
      exceptionProcessor: exceptionProcessor,
      ajaxService: ajaxService,
      apiUrl: '/my/test/api/url',
      uiUrl: '/my/test/ui/url',
      dataCallback: dataCallback
    });
    
    var request =  new Psc.Request({
        method: 'POST',
        url: "/my/test/url"
    });
    
    return {uploadService: uploadService, exceptionProcessor: exceptionProcessor, ajaxService: ajaxService, request: request};
  };

  test("openSingleDialog opens a single dialog with a form and a file input in it", function() {
    $.extend(this, setup());
    
    this.uploadService.openSingleDialog(this.request);
    
    var dialog = this.uploadService.getSingleDialog();
    assertTrue(dialog.isOpen(), 'dialog wurde geöffnet');
    
    var $dialog = dialog.unwrap(), $file;
    assertEquals(1, $dialog.find('form').length, 'form ist vorhanden');
    assertEquals(1, ($file = $dialog.find('form input[type="file"]')).length, 'file input ist vorhanden');
    assertEquals('uploadFile', $file.attr('name'), 'file hat den namen uploadFile als namen');
    
    dialog.close();
  });

  test("openSingleDialog renders other fields with the upload field", function() {
    $.extend(this, setup());
    
    var options = {
      form: {
        fields: new Psc.UI.FormFields({
          fields: {
            'download-description': 'string'
          }
        })
      }
    };
    
    this.uploadService.openSingleDialog(this.request, options);
    
    var dialog = this.uploadService.getSingleDialog();
    var $dialog = dialog.unwrap(),
        $form = $dialog.find('form'),
        $file = $form.find('input[type="file"]'),
        $desc = $form.find('input[type="text"][name="download-description"]');
    
    assertEquals(1, $form.length, 'form ist vorhanden');
    assertEquals(1, $file.length, 'file input ist vorhanden');
    assertEquals('uploadFile', $file.attr('name'), 'file hat den namen uploadFile als namen');
    assertEquals(1, $desc.length, 'description is added to our form');
    
    dialog.close();
  });

  asyncTest("openSingleDialog submits the upload file and closes the dialog on error", function() {
    $.extend(this, setup());
    
    this.uploadService.openSingleDialog(this.request);
  
    var that = this;
    var param = {files: [{name: 'test', fileSize: 123}]};
    var dialog = this.uploadService.getSingleDialog();
    var $file = dialog.unwrap().find('form input[type="file"]');

    $file.fileupload({
        always: function (e, data) {
          start();
          assertFalse(dialog.isOpen(), 'dialog is closed on error');
          assertNotUndefined(that.exceptionProcessor.getException(), 'exception was raised');
        }
    });
    
    $file.fileupload('send', param);
  });
});