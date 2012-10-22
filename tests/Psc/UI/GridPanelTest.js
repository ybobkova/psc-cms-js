(function($) {
  define(['psc-tests-assert','Psc/UI/GridPanel','Psc/UI/Tab','Psc/UI/Tabs','Psc/UI/Main'], function() {
  
  module("Psc.UI.GridPanel", {
    teardown: function () {
      $.psc.reset();
    }
  });
  
  var setup =  function () {
    var gridPanel, $html;
    var d = $.Deferred();
    
    var tabs = new Psc.UI.Tabs({ widget: fixtures.loadHTML('ui-tabs') });
    var main = new Psc.UI.Main({tabs: tabs});

    $.get('/js/fixtures/entitygridpanel.php', function (html) {
      $html = $('#qunit-fixture').html(html);
        
      $.psc.resolve(main);
      $.when( main.getLoader().finished() ).then(function () {
        var gridPanels = main.getRegistered('GridPanel');
        if (!gridPanels.length) {
          console.log(gridPanels);
          throw 'One GridPanel must be registered in main';
        }
        gridPanel = gridPanels[0];

        var selectRow = function (line) {
          $html.find('table tr:eq('+line+') td.ctrl input[type="checkbox"]')
          .attr('checked', true);
        };
          
        var unselectRow = function (line) {
          $html.find('table tr:eq('+line+') td.ctrl input[type="checkbox"]')
            .attr('checked', false);
        };
  
        d.resolve({main: main, tabs: tabs, 'gridPanel': gridPanel, '$html': $html,
                  selectRow: selectRow, unselectRow: unselectRow
                  });
      });
      
    },'html');
    
    return d.promise();
  };
  
  asyncTest("getSelectedRows calculates correctly", function () {
    $.when(setup()).then(function(setups) {
      start();
      $.extend(this, setups);
      var main = this.main, tabs = this.tabs, gridPanel = this.gridPanel, $html = this.$html;
        
      this.selectRow(1);
      this.selectRow(2);
      
      var $rows = gridPanel.getSelectedRows();
      
      this.assertEquals(2, $rows.length);
      
      $.each($rows, function (i, $row) {
        this.assertNotUndefined($row.jquery);
      });
      
      var rows = gridPanel.getSelectedRows(true);
      $.each(rows, function (i, row) {
        this.assertAttributeNotUndefined('email', row, 'email in row '+i+' is set');
        if (i === 0) {
          this.assertEquals('p.scheit@ps-webforge.com', row.email.find('button').text(), 'email attr has correct text 1 ');
        } else if(i === 1) {
          this.assertEquals('i.karbach@ps-webforge.com', row.email.find('button').text(), 'email attr has correct text 2');
        }
      });
  
      this.unselectRow(1);
      this.unselectRow(2);
      
      this.assertEquals(0, gridPanel.getSelectedRows(true).length);
      this.assertEquals(0, gridPanel.getSelectedRows().length);
    });
  });
  
  asyncTest("Panel new Button opens tab on click", function() {
    $.when(setup()).then(function(setups) {
      start();
      $.extend(this, setups);
      var main = this.main, tabs = this.tabs, gridPanel = this.gridPanel, $html = this.$html;

      var evm = main.getEventManager();
      var $newButton = $html.find('button.psc-cms-ui-button-new');
    
      this.assertTrue($newButton.hasClass('psc-cms-ui-tab-button-openable'));
    });
  });
  
  asyncTest("GridPanel can be sortable", function () {
    $.when(setup()).then(function(setups) {
      start();
      $.extend(this, setups);
      var main = this.main, tabs = this.tabs, gridPanel = this.gridPanel, $html = this.$html;
      var $table = gridPanel.getTable();

      this.gridPanel.setSortableName('mysort');
      this.gridPanel.setSortable(true);
      
      console.log($table);
      this.assertTrue($table.hasClass('ui-sortable'), 'sortable is on the table');
      this.assertEquals(1, $table.find('tr:eq(1) td.ctrl .ui-icon').length, 'ctrl column has an sortable icon');
      
      this.assertEquals(3, $table.find('tr:not(:eq(0)) td.ctrl input[type="hidden"][name="mysort[]"]').length);
      
    });
  });

  asyncTest("open Buttons is rendered and grid-panel-open is triggered, as well as tab open", function () {
    $.when(setup()).then(function(setups) {
      start();
      $.extend(this, setups);
      var main = this.main, tabs = this.tabs, gridPanel = this.gridPanel, $html = this.$html;
    
      expect(6);
    
      var $deleteButton = $html.find('button.grid-delete'), $openButton = $html.find('button.grid-open');
    
      //this.assertEquals(1, $deleteButton.length, 'delete button is there');
      this.assertEquals(1, $openButton.length, 'open button is there');
    
      gridPanel.getEventManager().on('grid-panel-open', function(e, rows) {
        this.assertEquals(1, rows.length);
        this.assertAttributeNotUndefined('email', rows[0], 'email in row is set');
        this.assertEquals('p.scheit@ps-webforge.com', rows[0].email.find('button').text(), 'td content equals mail');
      });
    
      gridPanel.getEventManager().on('tab-open', function (e, tab, $target) {
        this.assertInstanceOf(Psc.UI.Tab, tab, 'tab is a Tab-Instance');
        this.assertSame(gridPanel.getGrid(), $target, 'target is set to grid - html');
      });
    
      this.selectRow(1);
      $openButton.trigger('click');
    });
  });
});
})(jQuery);