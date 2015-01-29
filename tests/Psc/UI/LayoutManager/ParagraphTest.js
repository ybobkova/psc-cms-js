define(['psc-tests-assert','require','Psc/TextEditor', 'Psc/UI/LayoutManager/Paragraph', 'Psc/Test/DoublesManager', 'Psc/UI/NavigationSelect', 'jquerypp/dom/selection'], function(t, require) {
  
  module("Psc.UI.LayoutManager.Paragraph");
  
  var setup = function(test) {
    var dm = new Psc.Test.DoublesManager();
    
    var $container = $('<div/>');
    $('#visible-fixture').empty().append($container);
    
    var p = new Psc.UI.LayoutManager.Paragraph({
      label: 'Paragraph',
      content: 'Lorem ipsum dolor sit amet...',
      navigationService: dm.getNavigationService()
    });
    
    var interactionProvider = dm.injectInteractionProvider(p);
    
    test = t.setup(test, {paragraph: p, $container: $container, interactionProvider: interactionProvider});
    
    var editor;
    test.editor = function () {
      if (!editor) {
        editor = new Psc.TextEditor({ widget: $container.find('textarea:first')});
      }
      
      return editor;
    };

    test.setupHTML = function () {
      var $widget = test.paragraph.create();
      test.$container.append($widget);

      return $widget;
    };
    
    test.setupButton = function (button) {
      var $widget = test.paragraph.create();
      test.$container.append($widget);
      
      return $widget.find('button.'+button);
    };
    
    test.setupLinkButton = function() {
      return test.setupButton('add-link');
    };

    test.setupInternalLinkButton = function() {
      return test.setupButton('add-internal-link');
    };

    test.setupEmailLinkButton = function() {
      return test.setupButton('add-email-link');
    };
    
    return test;
  };

  test("paragraph shows a button to add a link", function() {
    setup(this);
    var $button = this.setupLinkButton();
    
    this.assertjQueryLength(1, $button);
    this.assertjQueryHasClass('psc-cms-ui-button', $button);
  });
  
  test("paragraph inserts a link with prompting for both informations, when caret is somewhere in the text", function () {
    var that = setup(this);
    var $button = this.setupLinkButton();
    
    this.interactionProvider.answerToPrompt("http://www.ps-webforge.com/");
    this.interactionProvider.answerToPrompt("ps-webforge");
    
    this.editor().move(12);
    
    $button.trigger('click');
    
    this.assertEquals(
      "Lorem ipsum [[http://www.ps-webforge.com/|ps-webforge]] dolor sit amet...",
      this.editor().getText(),
      "text template is inserted into textarea on position 4"
    );
  });
  
  test("paragraph inserts a link with prompting for both informations, when caret is at the really beginning of the text", function () {
    var that = setup(this);
    var $button = this.setupLinkButton();

    this.interactionProvider.answerToPrompt("http://www.ps-webforge.com/");
    this.interactionProvider.answerToPrompt("ps-webforge");

    this.editor().move(0);
    
    $button.trigger('click');

    this.assertEquals(
      "[[http://www.ps-webforge.com/|ps-webforge]] Lorem ipsum dolor sit amet...",
      this.editor().getText(),
      "link template is inserted into textarea on position 0"
    );
  });
  
  test("when link button is cancelled, no link is inputted", function () {
    var that = setup(this);
    var $button = this.setupLinkButton();
    
    this.editor().setSelection(0,73); // all
    
    // cancel url prompt
    this.interactionProvider.cancelNextPrompt();
    // to "fake" the browser behaviour the second is given
    this.interactionProvider.answerToPrompt('link-description');
    
    $button.click();
    
    this.assertEquals(
      "Lorem ipsum dolor sit amet...",
      this.editor().getText(),
      "text template should be non modified, because button cancelled"
    );
  });
  
  test("paragraph replaces marked word with bold tag", function () {
    var that = setup(this);    
    var $button = this.setupButton('bold');
    
    this.editor().unwrap().selection(0,5);
    $button.trigger('click');
    
    this.assertEquals(
      "**Lorem** ipsum dolor sit amet...",
      this.editor().getText(),
      "lorem is replaced with bold lorem"
    );
  });


  test("paragraph replaces marked word with // tag", function () {
    var that = setup(this);    
    var $button = this.setupButton('italic');
    
    this.editor().unwrap().selection(0,5);
    $button.trigger('click');
    
    this.assertEquals(
      "//Lorem// ipsum dolor sit amet...",
      this.editor().getText(),
      "lorem is replaced with italic lorem"
    );
  });
  
  test("paragraph replaces marked word with underline tag", function () {
    var that = setup(this);    
    var $button = this.setupButton('underlined');
    
    this.editor().unwrap().selection(6,11);
    $button.trigger('click');
    
    this.assertEquals(
      "Lorem __ipsum__ dolor sit amet...",
      this.editor().getText(),
      "lorem is replaced with underline ipsum"
    );
  });  

  test("isEmpty reflects if ta has text", function () {
    var that = setup(this);
    this.setupHTML();

    this.assertFalse(this.paragraph.isEmpty());
    this.editor().setText('');

    this.assertTrue(this.paragraph.isEmpty());
  });

  test("serializes the content from ta", function () {
    var that = setup(this), s = {type: 'paragraph', 'label':'none'};
    this.setupHTML();

    this.editor().setText('its serialized');

    this.paragraph.serialize(s);

    this.assertEquals('its serialized', s.content);
  });

  test("paragraph shows a button to add a internal link", function() {
    setup(this);
    var $button = this.setupInternalLinkButton();
    
    this.assertjQueryLength(1, $button);
    this.assertjQueryHasClass('psc-cms-ui-button', $button);
  });

  test("paragraph shows a button to add a email link", function() {
    setup(this);
    var $button = this.setupEmailLinkButton();
    
    this.assertjQueryLength(1, $button);
    this.assertjQueryHasClass('psc-cms-ui-button', $button);
  });
  
  asyncTest("paragraph inserts an internal link with prompting for label and selecting with navigation select, when caret is somewhere in the text", function () {
    start();
    var that = setup(this);
    var $button = this.setupInternalLinkButton();
    
    this.interactionProvider.answerToPrompt("Datenschutz");
    
    this.editor().move(12);
    
    $button.trigger('click');

    stop();
    $('body').on('psc-cms-ui-dialog-open', function (e, dialog, $dialog) {
      start();

      var $navSelect = that.assertjQueryLength(1, $dialog.find('.psc-cms-ui-navigation-select'));
      var navSelect = that.assertHasJooseWidget(Psc.UI.NavigationSelect, $navSelect);

      navSelect.setSelectedFromNodeId(24);
      that.assertNotUndefined(navSelect.getSelected(), 'self-test: can select item in navigationselect with nodeId');

      var $okButton = that.assertjQueryLength(1, $dialog.parent().find('.ui-dialog-buttonset button:eq(0)'));
      $okButton.trigger('click');

      stop();

      window.setTimeout(function () {
        start();
        
        that.assertEquals(
          "Lorem ipsum [[#24|Datenschutz]] dolor sit amet...",
          that.editor().getText(),
          "text internal-link template is inserted into textarea on position 4"
        );
      }, 15);
    });
  });
});