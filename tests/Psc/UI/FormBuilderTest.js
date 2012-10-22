define(['psc-tests-assert','Psc/UI/FormBuilder'], function() {
  
  module("Psc.UI.FormBuilder");
  
  var setup = function () {
    var formBuilder = new Psc.UI.FormBuilder({ });
    
    return {formBuilder: formBuilder};
  };

  test("acceptance", function() {
    $.extend(this, setup());
    
    var fb = this.formBuilder;
    
    fb.open();
    
    fb.textField("Title", ['title','lang'], "the title");
    fb.textField("name", "bla", "the foo");
        
    var $form = fb.build(), $textFields = $form.find('input[type="text"]');
    
    this.assertNotUndefined($form.jquery);
    this.assertEquals(1, $form.length, 'form ist vorhanden');
    this.assertEquals(2, $textFields.length, 'textfields sind vorhanden');
  });
  
  test("_genereate Name Unit", function () {
    $.extend(this,setup());
    
    this.assertEquals("part1[part2]", this.formBuilder._generateName(['part1','part2']));
    this.assertEquals("part", this.formBuilder._generateName(['part']));
    this.assertEquals("part", this.formBuilder._generateName('part'));
  });
  
  test("radios", function () {
    $.extend(this, setup());
    var fb = this.formBuilder;
    
    fb.open(),
    fb.radios("Position", 'align', 'right', {'right':'rechts', 'left':'links'});
    
    var $form = fb.build(), $wrapper = $form.find('.component-wrapper'), $radios = $form.find('input[type="radio"]'), $labels = $form.find('label');
    var $radioLeft = $wrapper.find('input[type="radio"][value="left"]'),
        $labelLeft = $wrapper.find('label[for="'+$radioLeft.attr('id')+'"]'),
        $radioRight = $wrapper.find('input[type="radio"][value="right"]'),
        $labelRight = $wrapper.find('label[for="'+$radioRight.attr('id')+'"]');
    
    
    //$('#visible-fixture').empty().append($form);
    this.assertEquals('Position', $wrapper.find('> label.psc-cms-ui-label').text());
    this.assertEquals(2, $radios.length, '2 radios are build '+$radios.selector);
    
    this.assertEquals(1, $radioLeft.length, $radioLeft.selector);
    this.assertEquals('align', $radioLeft.attr('name'));
    this.assertEquals(1, $labelLeft.length, $labelLeft.selector);
    this.assertEquals('links',$labelLeft.text());
    
    this.assertEquals(1, $radioRight.length, $radioRight.selector);
    this.assertEquals('align', $radioRight.attr('name'));
    this.assertEquals(1, $labelRight.length, $labelRight.selector);
    this.assertEquals('rechts',$labelRight.text());
    
    this.assertTrue($radioRight.is(':checked'), '$radioRight is:checked');
    this.assertFalse($radioLeft.is(':checked'), '$radioLeft isnot:checked');
    
  });
});