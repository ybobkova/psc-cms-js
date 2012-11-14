define(['psc-tests-assert','Psc/UI/FormReader','Psc/UI/FormBuilder'], function(t) {
  
  module("Psc.UI.FormReader");
  
  var setup = function(test) {
    var formReader = new Psc.UI.FormReader({ });
    var formBuilder = new Psc.UI.FormBuilder({ });
    
    return t.setup(test, {formReader: formReader, formBuilder: formBuilder});
  };

  test("read with [] in names (yagni: not yet implemented)", function() {
    setup(this);
    
    var fb = this.formBuilder;
    
    fb.open();
    fb.textField('title (de) ',['title','de'], 'german title');
    fb.textField('title (en) ',['title','en'], 'english title');
    
    
    var $form = fb.build();
    
    QUnit.raises(function () {
    
    this.assertEquals({
        title: {
          de: 'german title',
          en: 'english title'
        }
      },
      this.formReader.read($form),
      'read result is correct'
    );
    });
    
  });

  test("read with no [] in names", function() {
    setup(this);
    
    var fb = this.formBuilder;
    
    fb.open();
    fb.textField('title (de) ','title-de', 'german title');
    fb.textField('title (en) ','title-en', 'english title');
    
    
    var $form = fb.build();
    
    this.assertEquals({
        'title-de': 'german title',
        'title-en': 'english title'
      },
      this.formReader.read($form),
      'read result is correct'
    );
    
  });
});