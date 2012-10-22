define(['Psc/UI/Spinner'], function() {
  module("Psc.UI.Spinner");

  test("construct", function() {
    var $container = $('<div class="spinner-container"></div>');
    $('body').append($container);
    
    var spinner = new Psc.UI.Spinner({ });
    assertEquals(0, $container.find('img').length, 'ein bild wurde dem container noch nicht hinzugefügt');
    
    spinner.show();
    stop();
    setTimeout(function () {
      start();
      assertTrue($container.find('img').is(':visible'), 'spinner is visible after show()');


      spinner.remove();
      stop();
      setTimeout(function () {
        start();
        assertTrue($container.find('img').is(':not(:visible)'),'spinner is not visible after remove');
      }, 200); // wegen effect

    },200);
  });
});