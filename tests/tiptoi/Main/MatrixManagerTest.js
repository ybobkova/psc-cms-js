define(['psc-tests-assert','Psc/UI/Main','Psc/UI/Dragger','Psc/UI/Tabs','Psc/UI/DropBox','Psc/UI/DropBoxButton','Psc/CMS/Item', 'Psc/CMS/TabOpenable', 'Psc/CMS/Buttonable', 'Psc/CMS/Identifyable','Psc/CMS/DropBoxButtonable','Psc/Request', 'tiptoi/Main'], function() {
  
  var main, tiptoiMain, $fixture = $('#qunit-fixture').empty();

  module("tiptoi AcceptanceTest", {
    setup: function () {
      
      if (!$fixture.children().length) {
        main = fixtures.getMain();
        main.getEventManager().setLogging(true);
        main.attachHandlers();
        
        tiptoiMain = new tiptoi.Main({
          productName: 'test',
          main: main,
          widget: $fixture
        });
        
        $.psc.resolve(main);
        
        var tab = new Psc.UI.Tab({
          url: window.cms.baseUrl+'api/product/test/oid/4/transitions',
          id: 'api-product-test-oid-4-transitions',
          label: 'Blaubär 9999003'
        });
        
        main.getEventManager().on('remote-tab-loaded', function () {
          start();
        });
        
        stop();
        main.getTabs().open(tab).select(tab);
      }
    }, teardown: function  () {
    }
  });
  
  asyncTest("fixture test: transitions form is loaded from js", function () {
    var $dropBoxes = $fixture.find('div.psc-cms-ui-drop-box');
    
    this.assertEquals(6, $dropBoxes.length, 'dropboxes count in fixture'); // 4 in jedem mode in einem 2 und die meta im accordion
    
    this.assertTrue($.psc.getPresence('MatrixManager'),'MatrixManager is present');
    start();
  });
  
  asyncTest("add action button adds a new action", function () {
    var $mode1 = $fixture.find('div.mode:eq(0)'),
        $transition1 = $mode1.find('div.transition:eq(0)'),
        //$action1 = $transition1.find('div.action:eq(0)'),
        $actionButton = $transition1.find('button.add-action');
        
    this.assertEquals(1, $actionButton.length, 'action button is found');
    
    this.assertEquals(1,$transition1.find('div.action').length, 'in transition1 is 1 action');
    
    $actionButton.simulate('click');
    
    stop();
    // set timeout ist nicht so schön, aber ich hab gar keine andere idee grad (ich muss hier auf den ajaxRequest warten)
    setTimeout(function () {
      this.assertEquals(2, $transition1.find('div.action').length, 'one action is added to transition');
      
      start();
    }, 1500);
    
    start();
  });
  
  asyncTest("dragging changemode between drop-boxes duplicates the changemode", function () {
    fail('TODO low prio');
  });
  
  asyncTest("oid form save posts correctly", function () {
    var eventManager = main.getEventManager();
    var $tab = $fixture.find('div.oid-form');
    
    eventManager.on('form-saved', function(e, $form, ajaxResponse) {
      start();
      
      var post = ajaxResponse.getRequest().getBody();
      this.assertNotUndefined(post, 'post is passed to event');
      
      this.assertType('array', post.transitions);
      this.assertType('array', post.deleteTransitions);
      this.assertNotUndefined('', post.oid);
      
      // usw
    });
    
    $tab.find('form button.psc-cms-ui-button-save').simulate('click');
  });
});