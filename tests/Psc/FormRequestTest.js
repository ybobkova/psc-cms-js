define(['psc-tests-assert', 'text!fixtures/form.html', 'Psc/FormRequest'], function (t, html) {
  module("Psc.FormRequest");
  
  test("parsesURLAndMethodFromCMSForm", function() {
    t.setup(this);
    
    var $form = $(html);
    var formRequest = new Psc.FormRequest({ form: $form});
      
    this.assertEquals('response.html', formRequest.getUrl());
    this.assertEquals('PUT',formRequest.getMethod());
  });
});