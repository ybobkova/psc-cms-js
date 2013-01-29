define(['psc-tests-assert','jquery-simulate','Psc/UI/NavigationNode'], function(t) {
  
  module("Psc.UI.NavigationNode");
  
  var setup =  function (test) {
      var node = new Psc.UI.NavigationNode({
        id: 2,
        title: {en: 'home', de: 'Startseite'},
        parent: null,
        depth: 0,
        locale: 'en',
        languages: ['de','en'],
        pageId: 17
      });
      
      return t.setup(test, {node: node});
  };
  
  var setupWithHTML = function (test) {
    var $fs = $('<fieldset />').addClass('psc-cms-ui-navigation');
    $('#qunit-fixture').empty().append($fs);
    
    setup(test);

    test.container = $fs;
    
    test.$html = test.node.html();
    $fs.append(test.$html);
    
    return test;
  };

  test("acceptance", function() {
    var that = setup(this);
    var node = new Psc.UI.NavigationNode({
      id: 2,
      title: {en: 'BMW', de: 'Bayrische Motoren Werke'},
      parent: null,
      depth: 0,
      locale: 'en',
      pageId: 17,
      languages: ['de','en']
    });
    
    this.assertTrue(node.html().is('li'), 'html() output is a <li>');
    this.assertEquals('BMW', node.html().find('span.title').text());
    
    this.assertEquals('blubb', node.setParent('blubb').getParent(), 'blubb equals');
  });
  
  test("html has the poppy edit - button", function () {
    var that = setupWithHTML(this);
    
    var $html = this.node.html(), $buttons = $html.find('button');
    this.container.append($html);
    
    this.assertEquals(3, $buttons.length, '3 buttons are in html');
  });
  
  test("edit opens a popup", function () {
    var that = setupWithHTML(this);
    
    this.$html.find('button.edit').simulate('click');
    
    var dialog = this.node.getDialog();
    this.assertTrue(dialog.isOpen(), 'dialog is there and open');
    dialog.close();
  });
  
  test("popup has input fields", function () {
    var that = setupWithHTML(this);
    
    this.node.openEditDialog();
    var dialog = this.node.getDialog(), $dialog = dialog.unwrap();
    
    var $textInputs = $dialog.find('input[type="text"]');
    
    this.assertEquals(this.node.getLanguages().length+1, $textInputs.length, 'inputs title de, inputs title fr are there, img is there');
    dialog.close();
  });
  
  test("popup submit updates node on close", function () {
    var that = setupWithHTML(this);
    
    this.node.openEditDialog();
    var dialog = this.node.getDialog(), $dialog = dialog.unwrap();
    
    var $titleDe = $dialog.find('input[name="title-de"]');
    var $titleEn = $dialog.find('input[name="title-en"]');
    
    $titleDe.val('neuer titel fuer de');
    $titleEn.val('a new title for en');
  
    dialog.submit();
    
    this.assertEquals('a new title for en', this.node.getTitle('en'));
    this.assertEquals('neuer titel fuer de', this.node.getTitle('de'));
  });
  
  
  test("refreshTitle updates li", function () {
    var that = setupWithHTML(this);
    
    this.assertEquals('home', this.$html.find('span.title').text());
    
    this.node.setTitle({
      en: 'refreshed home',
      de: 'neues zuhause'
    });
    
    this.node.refreshTitle();
    this.assertEquals('refreshed home', this.$html.find('span.title').text());
  });
});