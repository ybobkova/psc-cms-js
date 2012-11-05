define(['psc-tests-assert', 'text!fixtures/form.html', 'Psc/FormRequest'], function (t, html) {
  module("Psc.FormRequest");
  
  test("parsesURLAndMethodFromCMSForm", function() {
    var $form = $(html);
    var formRequest = new Psc.FormRequest({ form: $form});
      
    this.assertEquals('/js/fixtures/ajax/http.form.saved.php', formRequest.getUrl());
    this.assertEquals('PUT',formRequest.getMethod());
  });
});