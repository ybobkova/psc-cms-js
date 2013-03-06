define(['psc-tests-assert','jquery-simulate','Psc/UI/Dialog','Psc/UI/WidgetWrapper','Psc/UI/LayoutManager/DownloadsList','Psc/Test/DoublesManager'], function(t) {
  
  module("Psc.UI.LayoutManager.DownloadsList");
  
  var setup = function(test) {
    var dm = new Psc.Test.DoublesManager();
    var uploadService = dm.getUploadService();
    
    var $container = $('<div/>');
    $('#visible-fixture').empty().append($container);
    
    uploadService.pullUploadFiles = function () {
      var d = $.Deferred();
      
      setTimeout(function () {
        d.resolve(
          [
           {
            "originalName":"jobs.xlsx",
            "size":9126,
            id: 26,
            description: 'a list of current jobs',
            "type":"application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "url":"/api/files/jobs.xlsx"
            },
           {
            "originalName":"businessreport.pdf",
            "size":3459,
            id: 27,
            description: null,
            "type":"application/pdf",
            "url":"/api/files/businessreport.pdf"
            }
          ]
        );
        
      }, 200);
      
      return d.promise();
    };
    
    var list = new Psc.UI.LayoutManager.DownloadsList({
      label: 'Download-Liste',
      headline: null,
      uploadService: uploadService,
      downloads: []
    });
    
    var createWidget = function (list) {
      var $widget = list.create();
      
      $container.append($widget);
      
      return $widget;
    };
    
    return t.setup(test, {list: list, $container: $container, uploadService: uploadService, createWidget: createWidget});
  };

  test("html is build with button to select other downloads", function() {
    setup(this);
    
    var $widget = this.createWidget(this.list);
    var $splitPane, $left, $right, $selectButton, $ul;
    
    this.assertEquals(1, ($splitPane = $widget.find('div.psc-cms-ui-splitpane:first')).length, 'splitpane');
    this.assertEquals(1, ($right = $splitPane.find('> div.right')).length, 'right');
    this.assertEquals(1, ($left = $splitPane.find('> div.left')).length, 'left');
    
    this.assertjQueryLength(1, $ul = $right.find('ul.lm-downloadslist'));
    this.assertjQueryLength(1, $selectButton = $right.find('ul.lm-downloadslist ~ .psc-cms-ui-button'));
  });
  
  test("when click on select button the select dialog is opened", function () {
    setup(this);
    
    var $widget = this.createWidget(this.list), dialog;
    var $selectButton = this.assertjQueryLength(1, $widget.find('div.right ul.lm-downloadslist ~ .psc-cms-ui-button'));
    
    $selectButton.simulate('click');
    
    this.assertInstanceOf(Psc.UI.Dialog, dialog = this.list.getSelectDialog());
    this.assertTrue(dialog.isOpen(), "dialog ist geöffnet worden");
    
    dialog.close();
  });
  
  asyncTest("table in select dialog shows file from pullUploadFiles", function () {
    var that = setup(this), evm = this.list.getEventManager();
    var $widget = this.createWidget(this.list);
    
    evm.on('select-files-loaded', function (e, dialog, grid) {
      var $dialog = dialog.unwrap();
    
      var $table = that.assertjQueryLength(1, $dialog.find('.psc-cms-ui-grid-table'));
      var widgetGrid = Psc.UI.WidgetWrapper.unwrapWidget($table, Psc.UI.GridTable);
      
      that.assertSame(grid, widgetGrid);
      var rows = that.assertLength(2, grid.getRows());
      // assert more contents of the rows here?
      
      var row, button;
      for (var i = 0; i < 2; i++) {
        row = rows[i];
        button = row[2];
        
        that.assertjQueryIs('button.select', button);
      }
    
      start();
      dialog.close();
    });
    
    this.list.openSelectDialog();
  });

  asyncTest("click on button in table in select dialog triggers select file event and closes the dialog", function () {
    var that = setup(this), evm = this.list.getEventManager();
    var $widget = this.createWidget(this.list);
    
    
    evm.on('select-files-loaded', function (e, dialog, grid) {
      var rows = that.assertLength(2, grid.getRows());
      var button1 = rows[0][2];
      
      evm.on('select-file', function (e, file) {
        that.assertAttributeEquals('jobs.xlsx', 'originalName', file);
        that.assertAttributeEquals('/api/files/jobs.xlsx', 'url', file);
        
        setTimeout(function () {
          that.assertFalse(dialog.isOpen(), 'dialog is closed after select-file, because not default prevented');
        }, 5);
        
        start();
      });
      
      stop();
      button1.simulate('click');
      
      start();
    });
    
    this.list.openSelectDialog();
  });
  
  test("on select-file event the file is pushed to the list in right", function () {
    var that = setup(this), evm = this.list.getEventManager();
    
    var $widget = this.createWidget(this.list);
    var $ul = this.assertjQueryLength(1, $widget.find('div.psc-cms-ui-splitpane:first > div.right ul.lm-downloadslist'));
    
    this.assertjQueryLength(1, $ul.find('li'));
    
    var file = {
      name: 'aFile.txt',
      size: 200,
      url: '/path/to/the/aFile.txt',
      id: 9,
      hash: '9348dsoip98dfkdf900k',
      description: ''
    };
    
    evm.triggerEvent('select-file', {}, [file]);
    
    this.assertjQueryLength(2, $ul.find('li'));
  });
});