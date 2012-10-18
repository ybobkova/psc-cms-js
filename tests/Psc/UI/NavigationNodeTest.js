use(['Psc.UI.NavigationNode'], function() {
  
  module("Psc.UI.NavigationNode");
  
  var setup =  function () {
      var node = new Psc.UI.NavigationNode({
        id: 2,
        title: {en: 'home', de: 'Startseite'},
        parent: null,
        level: 0,
        locale: 'en',
        languages: ['de','en'],
        pageId: 17
      });
      
      return {node: node};
  };
  
  var setupWithHTML = function () {
    var $fs = $('<fieldset />').addClass('psc-cms-ui-navigation');
    $('#visible-fixture').empty().append($fs);
    
    var vars = $.extend(setup(), {
        container: $fs
      }
    );
    
    vars.$html = vars.node.html();
    $fs.append(vars.$html);
    
    vars.$edit = vars.$html.find('.edit');
    
    return vars;
  };

  test("acceptance", function() {
    var node = new Psc.UI.NavigationNode({
      id: 2,
      title: {en: 'BMW', de: 'Bayrische Motoren Werke'},
      parent: null,
      level: 0,
      locale: 'en',
      pageId: 17,
      languages: ['de','en']
    });
    
    assertTrue(node.html().is('li'), 'html() output is a <li>');
    assertEquals('editBMW 17', node.html().text());
    
    assertEquals('blubb', node.setParent('blubb').getParent(), 'blubb equals');
  });
  
  test("html has the poppy edit - button", function () {
    $.extend(this, setupWithHTML());
    
    var $html = this.node.html(), $edit = $html.find('button');
    this.container.append($html);
    
    assertEquals(1, $edit.length, 'edit button is in html');
    assertSame(this.$edit[0], $edit[0]);
  });

  test("edit opens a popup", function () {
    $.extend(this, setupWithHTML());
    
    this.$edit.simulate('click');
    
    var dialog = this.node.getDialog();
    assertTrue(dialog.isOpen(), 'dialog is there and open');
    dialog.close();
  });
  
  test("popup has input fields", function () {
    $.extend(this, setupWithHTML());
    
    this.node.openEditDialog();
    var dialog = this.node.getDialog(), $dialog = dialog.unwrap();
    
    var $textInputs = $dialog.find('input[type="text"]');
    
    assertEquals(this.node.getLanguages().length, $textInputs.length, 'inputs title de, inputs title fr are there');
    dialog.close();
  });
  
  test("popup submit updates node on close", function () {
    $.extend(this, setupWithHTML());
    
    this.node.openEditDialog();
    var dialog = this.node.getDialog(), $dialog = dialog.unwrap();
    
    var $titleDe = $dialog.find('input[name="title-de"]');
    var $titleEn = $dialog.find('input[name="title-en"]');
    
    $titleDe.val('neuer titel fuer de');
    $titleEn.val('a new title for en');

    dialog.submit();
    
    assertEquals('a new title for en', this.node.getTitle('en'));
    assertEquals('neuer titel fuer de', this.node.getTitle('de'));
  });
  
  
  test("refreshTitle updates li", function () {
    $.extend(this, setupWithHTML());
    
    assertEquals('home', this.$html.find('span.title').text());
    
    this.node.setTitle({
      en: 'refreshed home',
      de: 'neues zuhause'
    });
    
    this.node.refreshTitle();
    assertEquals('refreshed home', this.$html.find('span.title').text());
  });
});