define(['psc-tests-assert','Psc/FormRequest'], function () {
  module("Psc.FormRequest");
  
  asyncTest("parsesURLAndMethodFromCMSForm", function() {
    $.get('/js/fixtures/form.html', function (html) {
      var $form = $(html);
      var formRequest = new Psc.FormRequest({ form: $form});
      
      this.assertEquals('/js/fixtures/ajax/http.form.saved.php',formRequest.getUrl());
      this.assertEquals('PUT',formRequest.getMethod());
    
      start();
    });
  });
});