define(['psc-tests-assert','tiptoi/Main','Psc/UI/Main'], function() {
  var tiptoiMain, main;
  
  module("tiptoi.Main", {
    setup: function () {
      main = fixtures.getMain();
      
      main.getEventManager().setLogging(true);

      tiptoiMain = new tiptoi.Main({
        widget: $('#qunit-fixture'),
        productName: 'test',
        main: main
      });
      
      $.psc.resolve(main);
    }
  });

  asyncTest("createAction", function() {
    var data = {
          'type': 'action',
          'oid': 9999001,
          'modeId': 1,
          'transitionId': '',
          'pageId': 1,
          'tipNum': 1,
          'actionNum': 2,
          'times': 1
    };
    
    $.when(tiptoiMain.createAction(data))
      .progress(function(ajaxRequest) {
        start();
        this.assertNotUndefined(ajaxRequest, 'progress is called');
        $('#qunit-fixture').html(ajaxRequest.getBody());
        stop();
      })
      .then(function (response) {
        start();
        var $html = $('#qunit-fixture'), $action, $dropBox, dropBox;
      
        this.assertEquals(1, ($action = $html.find('div.action')).length, 'div.action is found in html');
        this.assertEquals(1, ($dropBox = $html.find('div.psc-cms-ui-drop-box')).length, 'div.psc-cms-ui-drop-box');
        
        dropBox = $dropBox.data('joose');
        
        this.assertTrue(dropBox.isMultiple(), 'drop box is multiple');
        this.assertEquals('#oid-9999001 div.action div.psc-cms-ui-drop-box', dropBox.isConnectedWith(), 'drop box is ConnectedWith Others');
      
        this.assertNotUndefined(dropBox = $dropBox.data('joose'), 'dropBox is linked to joose');
      }, function (response) {
        start();
        fail('createAction was rejected');
      });
    
    
  });
  
  asyncTest("createTransition", function() {
    var data = {
          'oid': 9999003,
          'modeId': 2,
          'pageId': 1,
          'tipNum': 2
    };
    
    $.when(tiptoiMain.createTransition(data))
      .progress(function(ajaxRequest) {
        start();
        this.assertNotUndefined(ajaxRequest, 'progress is called');
        $('#qunit-fixture').html(ajaxRequest.getBody());
        stop();
      })
      .then(function (response) {
        start();
        var $html = $('#qunit-fixture'), $transition;
      
        this.assertEquals(1, ($transition = $html.find('div.transition')).length, 'div.transition is found in html');
        this.assertEquals(1, ($transition = $html.find('div.action')).length, 'div.transition has one action in html');

      }, function (response) {
        start();
        fail('createTransition was rejected');
      });
  });
  
  asyncTest("Export Matrix Tab opens window with correct parameters", function() {
    fail('todo');
  });

  asyncTest("Export TSList-Tab opens window with correct parameters", function() {
    fail('todo');
  });
});