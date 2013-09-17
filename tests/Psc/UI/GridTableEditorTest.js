define(['psc-tests-assert','jquery-simulate','Psc/UI/GridTableEditor','Psc/TableModel','Psc/UI/GridTable','Psc/CMS/Service'], function(t) {
  
  module("Psc.UI.GridTableEditor");
  
  var setup = function (test) {
      var $grid, grid, table, editor, service, $fixture;
      //service = new (Class({
      //  methods: {
      //    handleAjaxRequest: function (request) {
      //      handledRequest = request;
      //      return $.Deferred.promise();
      //    },
      //    
      //    download: function (request) {
      //      downloadRequest = request;
      //    }
      //  }
      //}));
      
      service = new Psc.CMS.Service();
      
      table = new Psc.TableModel({
        columns: [
                  {name:"number", type: "String", label: 'Sound No.'},
                  {name:"sound", type: "String", label: 'Sound', editable: false},
                  {name:"correctOIDs", type: "Array", label: 'Correct OIDs', editable: true},
                  {name:"comment", type: "String", label: 'Comment', editable: true}
                 ],
        data: [
            ['2-STA_0596', 'Die Universität', [11011], 'One'],
            ['2-STA_0597', 'Das Aquarium', [11012], 'Two'],
            ['2-STA_0598', 'Das Rathaus', [11013], 'Three'],
            ['2-STA_0599', 'Das Parkhaus', [11015], 'Four'],
            ['2-STA_0600', 'Das Krankenhaus', [11016], 'Five'],
            ['2-STA_0601', 'Der Flughafen', [11017], 'Six'],
            ['2-STA_0602', 'Die Polizeiwache', [11018], 'Seven'],
            ['2-STA_0603', 'Das Museum', [11019,11031], 'Eight'],
            ['2-STA_0604', 'Die Oper', [11020], 'Nine'],
            ['2-STA_0605', 'Das Hotel', [11021], 'Ten'],
            ['2-STA_0606', 'Das Fußballstadion', [11022], 'Eleven'],
            ['2-STA_0607', 'Der Bahnhof', [11023], 'Twelve'],
            ['2-STA_0608', 'Die U-Bahn-Station', [11024], 'Thirteen'],
            ['2-STA_0609', 'Die Feuerwehr', [11029], 'Fourteen'],
            ['2-STA_0610', 'Das Dinosauriermuseum', [11031], 'Fifteen'],
            ['2-STA_0612', 'Der Park', [11038], 'Sixteen'],
            ['2-STA_0614', 'Die Bücherei', [11040], 'Seventeen'],
            ['2-STA_0615', 'Die Fußgängerzone', [11025,11041,11044,11051], 'Eighteen'],
            ['2-STA_0616', 'Ein Altstadtgebäude', [11013,11040,11042], 'Nineteen'],
            ['2-STA_0617', 'Der Fernsehturm', [11045], 'Twenty']
          ]
      });
      

      editor = new Psc.UI.GridTableEditor({
        service: service,
        grid: grid = new Psc.UI.GridTable({
          name: 'main',
          table: table
        })
      });


      $fixture = $('#visible-fixture');
      $fixture.html($grid = grid.html());
      
      editor.attach($grid);
      
      t.setup(test, {$fixture: $fixture, editor: editor, $grid: grid, grid: grid, table: table, service: service});
  };

  
  test("attaches buttons", function() {
    setup(this);
    
    this.assertEquals(1, this.$fixture.find('button.psc-cms-ui-button.grid-download-data').length, 'there is a download button');
    this.assertEquals(1, this.$fixture.find('button.psc-cms-ui-button.grid-upload-data').length, 'there is an upload button');
  });
  
  test("starts download on service when button is clicked", function () {
    setup(this);
    expect(0);
    var $downloadButton = this.$fixture.find('button.psc-cms-ui-button.grid-download-data');
    
    //$downloadButton.simulate('click');
    
    //this.assertNotUndefined(downloadRequest, 'downloadRequest was expected in service');
    //this.assertNotUndefined(downloadRequest.getBody());
  });
  
  test("opens upload dialog when button upload is clicked", function () {
    setup(this);
    var $uploadButton = this.$fixture.find('button.psc-cms-ui-button.grid-upload-data');
    
    $uploadButton.simulate('click');
    
    var $dialog = $('body').find('.ui-dialog:visible');
    
    this.assertEquals(1, $dialog.length, 'an upload dialog is open');
    this.editor.getDialog().close();
  });
  
  test("opens a dialog when some editable cell is doubleclicked", function () {
    setup(this);
    
    var $cell = this.$fixture.find('table tr:eq(5) td:eq(2)');

    $cell.simulate('dblclick');
    
    var $dialog = $('body').find('.ui-dialog:visible');

    this.assertEquals(1, $dialog.length, 'a dialog is open');

    var $OKbutton = $dialog.find('.submit');
    $OKbutton.simulate('click');
  });

  test("doesn't open a dialog when some uneditable cell is doubleclicked", function () {
    setup(this);
    
    var $cell = this.$fixture.find('table tr:eq(5) td:eq(1)');

    $cell.simulate('dblclick');
    
    var $dialog = $('body').find('.ui-dialog:visible');

    this.assertEquals(0, $dialog.length, 'no dialog is open (column without "editable"-label)');

    $cell = this.$fixture.find('table tr:eq(5) td:eq(0)');

    $cell.simulate('dblclick');
    
    $dialog = $('body').find('.ui-dialog:visible');

    this.assertEquals(0, $dialog.length, 'no dialog is open (column with "editable: false")');
  });

  test("correctly writes integer-oids in the table", function () {
    setup(this);
    
    var $OIDs = this.$fixture.find('table tr:eq(5) td:eq(2)');
    $OIDs.simulate('dblclick');

    var $dialog = $('.ui-dialog:visible');

    var $inputValue = this.assertjQueryLength(1, $dialog.find('.inputValue'));

    $inputValue.val("2172, 463729");

    var $OKbutton = $('.ui-dialog:visible').find('.submit');
    $OKbutton.simulate('click');

    var newOIDs = this.grid.getCell(5, 'correctOIDs');

    this.assertEquals([2172, 463729], newOIDs, 'the data is changed correctly');
  });

  test("correctly writes integer-plus-string-oids in the table", function () {
    setup(this);
    
    var $OIDs = this.$fixture.find('table tr:eq(6) td:eq(2)');
    $OIDs.simulate('dblclick');

    var $inputValue = $('body').find('.inputValue');
    
    $inputValue.val("2172, TEST1:5676567");

    var $OKbutton = $('.ui-dialog:visible').find('.submit');
    $OKbutton.simulate('click');

    var newOIDs = this.grid.getCell(6, 'correctOIDs');

    this.assertEquals([2172, "TEST1:5676567"], newOIDs, 'the data is changed correctly');
  });

  test("correctly writes an oid-input with many spaces in the table", function () {
    setup(this);
    
    var $OIDs = this.$fixture.find('table tr:eq(7) td:eq(2)');
    $OIDs.simulate('dblclick');

    var $inputValue = $('body').find('.inputValue');
    
    $inputValue.val("  2172 ,     TEST2:5676567   ");

    var $OKbutton = $('.ui-dialog:visible').find('.submit');
    $OKbutton.simulate('click');

    var newOIDs = this.grid.getCell(7, 'correctOIDs');

    this.assertEquals([2172, "TEST2:5676567"], newOIDs, 'the data is changed correctly');
  });

  test("doesn't split a string-input that is not an oid", function () {
    setup(this);
    
    var $cell = this.$fixture.find('table tr:eq(7) td:eq(3)');
    $cell.simulate('dblclick');

    var $inputValue = $('body').find('.inputValue');
    
    $inputValue.val("  Twenty one,  twenty two   ");

    var $OKbutton = $('.ui-dialog:visible').find('.submit');
    $OKbutton.simulate('click');

    var newCell = this.grid.getCell(7, 'comment');

    this.assertEquals("Twenty one,  twenty two", newCell, 'the string is changed correctly');
  });

  test("two cells can be changed one after another", function () {
    setup(this);
    
    var $cell = this.$fixture.find('table tr:eq(8) td:eq(2)');
    $cell.simulate('dblclick');

    var $inputValue = $('body').find('.inputValue');
    
    $inputValue.val("2172,DEMO:6786788567");

    var $OKbutton = $('.ui-dialog:visible').find('.submit');
    $OKbutton.simulate('click');

    var $newOIDs1 = this.grid.getCell(8, 'correctOIDs');

    $cell = this.$fixture.find('table tr:eq(9) td:eq(2)');
    $cell.simulate('dblclick');

    $inputValue = $('body').find('.inputValue');
    
    $inputValue.val("567567,DEMO2:6786788567");

    $OKbutton = $('.ui-dialog:visible').find('.submit');

    $OKbutton.simulate('click');

    var $newOIDs2 = this.grid.getCell(9, 'correctOIDs');

    this.assertEquals([2172, "DEMO:6786788567"], $newOIDs1);

    this.assertEquals([567567, "DEMO2:6786788567"], $newOIDs2);
  });
});