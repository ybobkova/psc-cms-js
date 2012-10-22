define(['Psc/UI/Dialog'], function() {
  var dialog, constructSubmitted = false;
  
  module("Psc.UI.Dialog", {
    setup: function () {
      dialog = new Psc.UI.Dialog({
        title: 'dialog title',
        guid: 'my-test-dialog',
        onSubmit: function (e, eventDialog, $eventDialog) {
          constructSubmitted = true;
        }
      });
    }, teardown: function () {
      dialog.close();
    }
  });

  test("creates content from event when created", function() {
    dialog.on('dialog-create-content', function (e, eventDialog) {
      assertSame(dialog, eventDialog);
      eventDialog.setContent('<span class="event">this comes from event</span>');
    });
    
    dialog.open();
    
    var $dialog = $('.psc-guid-my-test-dialog');
    assertEquals(1, $dialog.length);
    assertTrue($dialog.is(':visible'));
    
    assertEquals(1, $dialog.find('span.event').length, 'event span is in content set');
  });
  
  test("dialog is closed on default submit", function () {
    dialog.open();
    
    var $dialog = $('.psc-guid-my-test-dialog');
    assertTrue($dialog.is(':visible'));
    
    dialog.submit();
    
    assertFalse($dialog.is(':visible'));
  });
  
  test("on submit event is triggered and this can prevent closing", function() {
    dialog.open();
    
    var submitted = false;
    
    dialog.on('dialog-submit', function (e) {
      e.preventDefault();
      submitted = true;
    });
    
    dialog.submit();
    
    var $dialog = $('.psc-guid-my-test-dialog');
    assertTrue($dialog.is(':visible'), 'dialog is still open after submit');
    
    assertTrue(submitted, 'event was triggerd');
    assertTrue(constructSubmitted, 'event was triggerd');
  });
});