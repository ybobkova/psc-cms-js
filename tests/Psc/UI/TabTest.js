define(['psc-tests-assert','Psc/UI/Tab'], function(t) {
  
  module("Psc.UI.Tab");
  
  var setup = function(test) {
    return t.setup(test);
  };

  test("construct", function() {
    setup(this);
    var tab = new Psc.UI.Tab({
      id: 'entity-persons-17',
      label: 'Philipp S',
      url: '/entities/persons/17/form'
    });
    
    this.assertEquals('entity-persons-17', tab.getId());
    this.assertEquals(null, tab.getContent());
    this.assertEquals('Philipp S', tab.getLabel());
    this.assertEquals('/entities/persons/17/form', tab.getUrl());
  });
});