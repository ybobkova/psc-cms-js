define(['psc-tests-assert','jquery','text!fixtures/entitygridpanel.html','js/main','Psc/UI/GridPanel','Psc/UI/Tab','Psc/UI/Tabs','Psc/UI/Main'], function(t, $, panelHTML) {
  
  module("Psc.UI.GridPanel");

  var setup =  function (test) {
    var d = $.Deferred();
    
    // we bootstrap our own main, because the inline scripts register the gridPanel to main
    var main = new Psc.UI.Main({
      tabs: new Psc.UI.Tabs({
        widget: $('<div />')
      })
    });
    main.attachHandlers();
  
    // we inject the requireLoad function to not use js/main, but to use our test-main here
    window.requireLoad = function(requirements, payload) {
      main.getLoader().onRequire(requirements, function () {
        payload.apply(this, [main].concat(Array.prototype.slice.call(arguments)));
      });
    };

    var $html = $('#qunit-fixture').empty().append(panelHTML);
    //var $html = $('#visible-fixture').empty().append(panelHTML);
    
    $.when( main.getLoader().finished() ).then(function () {
      
      var gridPanels = main.getRegistered('GridPanel');
      if (!gridPanels.length) {
        throw 'One GridPanel must be registered in main';
      }
      var gridPanel = gridPanels[0];

      var selectRow = function (line) {
        test.$html.find('table tr:eq('+line+') td.ctrl input[type="checkbox"]')
          .attr('checked', true);
      };
          
      var unselectRow = function (line) {
        test.$html.find('table tr:eq('+line+') td.ctrl input[type="checkbox"]')
          .attr('checked', false);
      };
  
      t.setup(test, {
        main: main,
        tabs: main.getTabs(),
        'gridPanel': gridPanel,
        '$html': $html,
        selectRow: selectRow,
        unselectRow: unselectRow
      });
    
      d.resolve(test);
    }, function (loader, errors) {
      throw errors[0];
    });
    
    return d.promise();
  };
  
  asyncTest("Panel new Button opens tab on click", function() {
    $.when(setup(this)).then(function(that) {
      var main = that.main, tabs = that.tabs, gridPanel = that.gridPanel, $html = that.$html;
  
      var evm = main.getEventManager();
      var $newButton = $html.find('button.psc-cms-ui-button-new');
    
      that.assertTrue($newButton.hasClass('psc-cms-ui-tab-button-openable'));
      start();
    });
  });
  
  asyncTest("GridPanel can be sortable", function () {
    $.when(setup(this)).then(function(that) {
      var main = that.main, tabs = that.tabs, gridPanel = that.gridPanel, $html = that.$html;
      var $table = gridPanel.getTable();
  
      that.gridPanel.setSortableName('mysort');
      that.gridPanel.setSortable(true);
      
      that.assertTrue($table.hasClass('ui-sortable'), 'sortable is on the table');
      that.assertEquals(1, $table.find('tr:eq(1) td.ctrl .ui-icon').length, 'ctrl column has an sortable icon');
      
      that.assertEquals(3, $table.find('tr:not(:eq(0)) td.ctrl input[type="hidden"][name="mysort[]"]').length);
      
      start();
    });
  });

    asyncTest("getSelectedRows calculates correctly", function () {
    $.when(setup(this)).then(function(that) {
      var main = that.main, tabs = that.tabs, gridPanel = that.gridPanel, $html = that.$html;
        
      that.selectRow(1);
      that.selectRow(2);
      
      var $rows = gridPanel.getSelectedRows();
      
      that.assertEquals(2, $rows.length);
      
      $.each($rows, function (i, $row) {
        that.assertNotUndefined($row.jquery);
      });
      
      var toObject = true;
      var rows = gridPanel.getSelectedRows(toObject);
      $.each(rows, function (i, row) {
        that.assertAttributeNotUndefined('email', row, 'email in row '+i+' is set');
        if (i === 0) {
          that.assertEquals('User: p.scheit@ps-webforge.com', row.email.find('button').text(), 'email attr has correct text 1 ');
        } else if(i === 1) {
          that.assertEquals('User: i.karbach@ps-webforge.com', row.email.find('button').text(), 'email attr has correct text 2');
        }
      });
  
      that.unselectRow(1);
      that.unselectRow(2);
      
      that.assertEquals(0, gridPanel.getSelectedRows(toObject).length);
      that.assertEquals(0, gridPanel.getSelectedRows().length);
      start();
    });
  });

  asyncTest("open Buttons is rendered and grid-panel-open is triggered, as well as tab open", function () {
    expect(7);
    
    $.when(setup(this)).then(function(that) {
      var main = that.main, tabs = that.tabs, gridPanel = that.gridPanel, $html = that.$html;
      tabs.open = function () {};

      that.selectRow(1);
      
      var $rows = gridPanel.getSelectedRows();
      that.assertEquals(1, $rows.length, 'only one row is selected');
      
      // mock tabs to not actually open a tab
      
    
      var $deleteButton = $html.find('button.grid-delete'),
          $openButton = $html.find('button.grid-open');
    
      //that.assertEquals(1, $deleteButton.length, 'delete button is there');
      that.assertEquals(1, $openButton.length, 'open button is there');
    
      stop();
      gridPanel.getEventManager().on('grid-panel-open', function(e, rows) {
        that.assertEquals(1, rows.length);
        that.assertAttributeNotUndefined('email', rows[0], 'email in row is set');
        that.assertEquals('User: p.scheit@ps-webforge.com', rows[0].email.find('button').text(), 'td content equals mail');
        start();
      });
    
      gridPanel.getEventManager().on('tab-open', function (e, tab, $target) {
        that.assertInstanceOf(Psc.UI.Tab, tab, 'tab is a Tab-Instance');
        that.assertEquals(1, $target.length, 'target is set to grid - html');
        start();
      });
    
      if ($rows.length === 1) {
        $openButton.trigger('click');
      } else {
        start(2);
      }
    });
  });
});