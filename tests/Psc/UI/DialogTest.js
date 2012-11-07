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
});