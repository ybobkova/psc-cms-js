define(['psc-tests-assert','Psc/UI/Dialog'], function(t) {
  
  module("Psc.UI.Dialog");
  
  var setup = function (test) {
    var constructSubmitted = false;
    var dialog = new Psc.UI.Dialog({
        title: 'dialog title',
        guid: 'my-test-dialog',
        onSubmit: function (e, eventDialog, $eventDialog) {
          test.constructSubmitted = true;
        }
      });
    
    return t.setup(test, {
      constructSubmitted: constructSubmitted,
      dialog: dialog
    });
  };

  test("creates content from event when created", function() {
    var that = setup(this), dialog = this.dialog;
    dialog.on('dialog-create-content', function (e, eventDialog) {
      that.assertSame(dialog, eventDialog);
      eventDialog.setContent('<span class="event">this comes from event</span>');
    });
    
    dialog.open();
    
    var $dialog = $('.psc-guid-my-test-dialog');
    this.assertEquals(1, $dialog.length);
    this.assertTrue($dialog.is(':visible'));
    
    this.assertEquals(1, $dialog.find('span.event').length, 'event span is in content set');
    dialog.close();
  });
  
  test("dialog is closed on default submit", function () {
    var that = setup(this), dialog = this.dialog;
    dialog.open();
    
    var $dialog = $('.psc-guid-my-test-dialog');
    this.assertTrue($dialog.is(':visible'));
    
    dialog.submit();
    
    this.assertFalse($dialog.is(':visible'));
    dialog.close();
  });
  
  test("on submit event is triggered and this can prevent closing", function() {
    var that = setup(this), dialog = this.dialog;
    dialog.open();
    
    var submitted = false;
    
    dialog.on('dialog-submit', function (e) {
      e.preventDefault();
      submitted = true;
    });
    
    dialog.submit();
    
    var $dialog = $('.psc-guid-my-test-dialog');
    this.assertTrue($dialog.is(':visible'), 'dialog is still open after submit');
    
    this.assertTrue(submitted, 'event was triggerd');
    this.assertTrue(this.constructSubmitted, 'event was triggerd');
    dialog.close();
  });
  
  test("buttons are labeled when open with default buttons", function() {
    // this was regression for ui 1.8.22
    var that = setup(this);
    this.dialog.open();
    
    var $dialog = this.dialog.unwrap().parent('.ui-dialog');
    
    this.assertEquals(1, $dialog.length, 'parent .ui-dialog is found');
    var $buttons = $dialog.find('.ui-dialog-buttonset button');
    
    this.assertEquals(2, $buttons.length, 'two buttons are in the set');

    var $ok = $buttons.eq(0), $close = $buttons.eq(1);

    this.assertEquals('Ok', $ok.text());
    this.assertjQueryHasClass('submit', $ok);
    this.assertEquals('abbrechen', $close.text());
    this.assertjQueryHasClass('close', $close);
    
    this.dialog.close();
  });
});