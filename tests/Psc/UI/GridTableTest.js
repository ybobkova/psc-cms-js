define(['psc-tests-assert', 'jquery-simulate', 'Psc/UI/GridTable','Psc/TableModel','Psc/UI/WidgetWrapper'], function(t) {

  module("Psc.UI.GridTable");
  
  var setup = function (test) {
    var table = new Psc.TableModel({
        columns: [
                  {name:"number", type: "String", label: 'Sound No.'},
                  {name:"sound", type: "String", label: 'Sound'},
                  {name:"correctOIDs", type: "Array", label: 'Correct OIDs'}
                 ],
        data: [
            ['2-STA_0596', 'Die Universität', [11011]],
            ['2-STA_0597', 'Das Aquarium', [11012]],
            ['2-STA_0598', 'Das Rathaus', [11013]],
            ['2-STA_0599', 'Das Parkhaus', [11015]],
            ['2-STA_0600', 'Das Krankenhaus', [11016]],
            ['2-STA_0601', 'Der Flughafen', [11017]],
            ['2-STA_0602', 'Die Polizeiwache', [11018]],
            ['2-STA_0603', 'Das Museum', [11019,11031]],
            ['2-STA_0604', 'Die Oper', [11020]],
            ['2-STA_0605', 'Das Hotel', [11021]],
            ['2-STA_0606', 'Das Fußballstadion', [11022]],
            ['2-STA_0607', 'Der Bahnhof', [11023]],
            ['2-STA_0608', 'Die U-Bahn-Station', [11024]],
            ['2-STA_0609', 'Die Feuerwehr', [11029]],
            ['2-STA_0610', 'Das Dinosauriermuseum', [11031]],
            ['2-STA_0612', 'Der Park', [11038]],
            ['2-STA_0614', 'Die Bücherei', [11040]],
            ['2-STA_0615', 'Die Fußgängerzone', [11025,11041,11044,11051]],
            ['2-STA_0616', 'Ein Altstadtgebäude', [11013,11040,11042]],
            ['2-STA_0617', 'Der Fernsehturm', [11045]]
          ]
    });
    
    var grid = new Psc.UI.GridTable({
      table: table,
      name: 'agrid'
    });

    var $fixture = $('#visible-fixture');
    $fixture.html(grid.attach(grid.html()));

    return t.setup(test, { $fixture: $fixture, grid: grid, table: table} );
  };
  
  test("acceptance", function() {
    var that = setup(this), $fixture = this.$fixture;
    this.assertEquals(20+1, $fixture.find('table tr').length, '20+1 Zeilen der Tabelle erwartet');
    this.assertEquals('Das Hotel', $fixture.find('table tr:eq(10) td.sound').text(), 'Hotel ist in Zeile 10');
  });
  
  test("empty function empties the whole table with data", function () {
    var that = setup(this), grid = this.grid, $fixture = this.$fixture;
    /* geil wäre so was wie
      
      beginTransaction()
      addRow()... addRow() ... addRow()
      sogar addColumn() .. geht dazwischen
      
      dann flush()
      
      sodass wir den gui nicht ständig mit events nach hängen lassen etc
    */
    grid.empty();

    this.assertEquals(1, $fixture.find('table tr').length, '0+1 Zeilen der Tabelle erwartet');
    this.assertEquals(0, grid.getRows().length, 'data getRows() returns also 0');
  });

  test("appendRow adds a new Row to the end of the table", function () {
    var that = setup(this), grid = this.grid, $fixture = this.$fixture;
    grid.appendRow(['2-TEST_0001', 'Die S-Bahn-Station', [11046]]);
    
    this.assertEquals(20+1+1, $fixture.find('table tr').length);
    this.assertEquals(1, $fixture.find('table tr:eq(21) td:contains("2-TEST_0001")').length);
    this.assertEquals(20+1, grid.getRows().length, 'Data length was synchronized');
    this.assertEquals('2-TEST_0001', grid.getCell(21, 'number'), 'Data repräsentation was synchronized');
  });
  
  test("insertRow adds a new Row at rowNum i to the table and shifts the other rows down", function () {
    var that = setup(this), grid = this.grid, $fixture = this.$fixture;
    grid.insertRow(['2-TEST_0001', 'Die S-Bahn-Station', [11046]], 2);
    this.assertEquals(20+1+1, $fixture.find('table tr').length);
    // wir fügen in zeile 2 ein. diese hat auch den index 2 (wegen der headerzeile)
    this.assertEquals(1, $fixture.find('table tr:eq(2) td:contains("Die S-Bahn-Station")').length);
    
    this.assertEquals('Die S-Bahn-Station', grid.getCell(2, 'sound'), 'Data repräsentation was synchronized');
  });
  
  test("insertRow(0) adds a new Row to the beginning of the table and shifts the other rows down", function () {
    var that = setup(this), grid = this.grid, $fixture = this.$fixture;
    grid.insertRow(['2-TEST_0001', 'Die S-Bahn-Station', [11046]], 1);
    this.assertEquals(20+1+1, $fixture.find('table tr').length);
    
    // wir fügen in zeile 1 ein. diese hat auch den index 1 (wegen der headerzeile)
    this.assertEquals(1, $fixture.find('table tr:eq(1) td:contains("Die S-Bahn-Station")').length);
    this.assertEquals('Die S-Bahn-Station', grid.getCell(1, 'sound'),  'Data repräsentation was synchronized');
  });

  test("attached grid can be serialized", function () {
    var that = setup(this), grid = this.grid, $fixture = this.$fixture;
    var $grid = $fixture.find('table');
    this.assertTrue($grid.hasClass('psc-cms-ui-grid-table'));
    
    var joose = Psc.UI.WidgetWrapper.unwrapWidget($grid, Psc.UI.GridTable);
    var data = {};
    
    joose.serialize(data);
    
    this.assertEquals(grid.getExport(), data.agrid);
  });

  test("findCell returns a jqueryObject from one td in one specific row", function () {
    var that = setup(this), $grid = this.assertjQueryLength(1, this.$fixture.find('table'));

    var $tdRathaus = this.assertjQueryLength(1, this.grid.findCell(3, 1)); // 3 third-content-row, second column
    this.assertEquals('Das Rathaus', $tdRathaus.text());

    var $header = this.assertjQueryLength(1, this.grid.findCell(0, 0));
    this.assertEquals('Sound No.', $header.text());
  });

  test("findCell returns a jqueryObject from one td in one specific row by name", function () {
    var that = setup(this), $grid = this.assertjQueryLength(1, this.$fixture.find('table'));

    var $tdRathaus = this.assertjQueryLength(1, this.grid.findCell(3, "sound")); // 3 third-content-row, sound column
    this.assertEquals('Das Rathaus', $tdRathaus.text());

    var $header = this.assertjQueryLength(1, this.grid.findCell(0, "number"));
    this.assertEquals('Sound No.', $header.text());
  });

  test("refresh does refresh the data into the grid", function () {
    var that = setup(this), 
      $grid = this.assertjQueryLength(1, this.$fixture.find('table')),
      $td = this.assertjQueryLength(1, this.grid.findCell(3, 1)); // 3 third-content-row, second column

    // pre condition
    this.assertEquals('Das Rathaus', $td.text());

    that.grid.setCell(3, "sound", "Das geänderte Rathaus");
    that.grid.refresh();

    $td = this.assertjQueryLength(1, this.grid.findCell(3, "sound")); // 3 third-content-row, second column
    this.assertEquals('Das geänderte Rathaus', $td.text());
  });

  test("when onCellsDoubleClick() is called with a callback, the callback is executed when some cell is double clicked", function () {
    var that = setup(this);

    var isCalled = false;
    var $cell = this.grid.findCell(5, 1);

    var callback = function (event, $clickedCell, rowIndex, columnIndex) {
      // das hier soll ausgeführt werden, wenn auf eine cell in gridTable doppel-geklickt wird
      isCalled = true;

      that.assertEquals(5, rowIndex, 'rowIndex is correct');
      that.assertEquals(1, columnIndex, 'columnIndex is correct');
      that.assertEquals($cell[0], $clickedCell[0]);
    };

    that.grid.onCellsDoubleClick(callback);

    // tue so als hätte ich geklickt: zeile 6 spalte 3

    $cell.trigger('dblclick');

    this.assertTrue(isCalled, 'callback was called');
  });

  test("getCellIndexes returns the rowIndex and columnIndex from a jquery object $cell", function () {
    var that = setup(this);

    /*
    getCellIndexes
    getColumnIndex
    getRowIndex
    */

    // @TODO für yulia
    expect(0);


  });
/*



    $('tr:eq(5) td:eq(2)')
      .dblclick (function(event){
        that.grid.onCellsDoubleClick(callback);
      });

    var $OIDs = this.$fixture.find('table tr:eq(5) td:eq(2)');
    $OIDs.trigger('dblclick');

    this.assertEquals(1, that.grid.$$onCellsDoubleClickCallbacks.length, 'adds an object to the array');
    this.assertEquals(callback, that.grid.$$onCellsDoubleClickCallbacks[0], 'adds the callback-function to the array');
  });
*/

});