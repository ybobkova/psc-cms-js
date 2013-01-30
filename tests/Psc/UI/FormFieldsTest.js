define(['psc-tests-assert','joose', 'Psc/UI/FormFields', 'Psc/UI/FormReader', 'Psc/UI/FormBuilder', 'Psc/Test/DoublesManager'], function(t, Joose) {
  
  module("Psc.UI.FormFields");
  
  var setup = function(test) {
    //var dm = new Psc.Test.DoublesManager();
    
    var formReader = new (Joose.Class({
      isa: Psc.UI.FormReader,
      
      override: {
        read: function ($form) {
          return {
            'field1': 'value1',
            'field2': 'value2',
            'field3': 'links'
          };
        }
      }
    }))({});
    
    var formFields = new Psc.UI.FormFields({
      formReader: formReader,
      fields: {
        'field1': 'string',
        'field2': 'string',
        'field3': {type: 'choice', values: ['links','rechts'], value: 'links'}
      }
    });
    
    return t.setup(test, {formFields: formFields});
  };

  test("formFields values can be read from a form with help of a formReader", function() {
    setup(this);
    
    var $form = $('</form>'); // ist egal weil wir oben den Reader gemockt haben
  
    this.assertEquals({
        'field1': 'value1',
        'field2': 'value2',
        'field3': 'links'
      },
      this.formFields.readFrom($form),
      'formFields read correctly the fields from the formreader'
    );
  });
  
  test("formFields creates a form with help from formbuilder", function() {
    setup(this);
    
    var $form = this.formFields.createForm();
    var $field1 = $form.find('input[type="text"][name="field1"]');
    var $field2 = $form.find('input[type="text"][name="field2"]');
    var $field3 = $form.find('input[type="radio"][name="field3"]');
    
    this.assertEquals(1, $field1.length, 'field1 is there');
    this.assertEquals(1, $field2.length, 'field2 is there');
    this.assertEquals(2, $field3.length, 'field3 is there');
  });
});