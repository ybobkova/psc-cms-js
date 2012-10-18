use(['Psc.Loader','Psc.UI.Main','Psc.UI.Tabs'], function() {
  var main, tabs, loader;
  
  module("Psc.Loader", {
    setup: function () {
      stop();

      tabs = new Psc.UI.Tabs({ widget: fixtures.loadHTML('ui-tabs') });
      main = new Psc.UI.Main({
        tabs: tabs
      });
      
      $.get('/js/fixtures/loading.php', function (html) {
        $html = $('#qunit-fixture').html(html);
        
        $.psc.resolve(main);
        
        start();
      });
    }
  });

  asyncTest("script tags are loaded in serialised order", function() {
    expect(1);
    $.when( main.getLoader().finished() ).then( function () {
      assertEquals('block1block2block3block4', testResult);
      start();
    });
  });
});