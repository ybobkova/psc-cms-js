use(['Psc.UI.GridTable','Psc.Table','Psc.UI.WidgetWrapper'], function() {
  var table, grid, $fixture;
  
  module("Psc.UI.GridTable", {
    setup: function () {
      table = new Psc.Table({
        columns: [
                  {name:"number", type: "String", label: 'Sound No.'},
                  {name:"sound", type: "String", label: 'Sound'},
                  {name:"correctOIDs", type: "Array", label: 'Correct OIDs'}
                 ],
        data: [
            ['2-STA_0596', 'Die Universität', [11011]]
            ,['2-STA_0597', 'Das Aquarium', [11012]]
            ,['2-STA_0598', 'Das Rathaus', [11013]]
            ,['2-STA_0599', 'Das Parkhaus', [11015]]
            ,['2-STA_0600', 'Das Krankenhaus', [11016]]
            ,['2-STA_0601', 'Der Flughafen', [11017]]
            ,['2-STA_0602', 'Die Polizeiwache', [11018]]
            ,['2-STA_0603', 'Das Museum', [11019,11031]]
            ,['2-STA_0604', 'Die Oper', [11020]]
            ,['2-STA_0605', 'Das Hotel', [11021]]
            ,['2-STA_0606', 'Das Fußballstadion', [11022]]
            ,['2-STA_0607', 'Der Bahnhof', [11023]]
            ,['2-STA_0608', 'Die U-Bahn-Station', [11024]]
            ,['2-STA_0609', 'Die Feuerwehr', [11029]]
            ,['2-STA_0610', 'Das Dinosauriermuseum', [11031]]
            ,['2-STA_0612', 'Der Park', [11038]]
            ,['2-STA_0614', 'Die Bücherei', [11040]]
            ,['2-STA_0615', 'Die Fußgängerzone', [11025,11041,11044,11051]]
            ,['2-STA_0616', 'Ein Altstadtgebäude', [11013,11040,11042]]
            ,['2-STA_0617', 'Der Fernsehturm', [11045]]
          ]
      });
      
      grid = new Psc.UI.GridTable({
        table: table,
        name: 'agrid'
      });

      $fixture = $('#visible-fixture');
      $fixture.html(grid.attach(grid.html()));
    }
  });

  test("acceptance", function() {
    assertEquals(20+1, $fixture.find('table tr').length, '20+1 Zeilen der Tabelle erwartet');
    assertEquals('Das Hotel', $fixture.find('table tr:eq(10) td.sound').text(), 'Hotel ist in Zeile 10');
  });
  
  test("empty function empties the whole table with data", function () {
    /* geil wäre so was wie
      
      beginTransaction()
      addRow()... addRow() ... addRow()
      sogar addColumn() .. geht dazwischen
      
      dann flush()
      
      sodass wir den gui nicht ständig mit events nach hängen lassen etc
    */
    grid.empty();

    assertEquals(1, $fixture.find('table tr').length, '0+1 Zeilen der Tabelle erwartet');
    assertEquals(0, grid.getRows().length, 'data getRows() returns also 0');
  });

  test("appendRow adds a new Row to the end of the table", function () {
    grid.appendRow(['2-TEST_0001', 'Die S-Bahn-Station', [11046]]);
    
    assertEquals(20+1+1, $fixture.find('table tr').length);
    assertEquals(1, $fixture.find('table tr:eq(21) td:contains("2-TEST_0001")').length);
    assertEquals(20+1, grid.getRows().length, 'Data length was synchronized');
    assertEquals('2-TEST_0001', grid.getCell(21, 'number'), 'Data repräsentation was synchronized');
  });
  
  test("insertRow adds a new Row at rowNum i to the table and shifts the other rows down", function () {
    grid.insertRow(['2-TEST_0001', 'Die S-Bahn-Station', [11046]], 2);
    assertEquals(20+1+1, $fixture.find('table tr').length);
    // wir fügen in zeile 2 ein. diese hat auch den index 2 (wegen der headerzeile)
    assertEquals(1, $fixture.find('table tr:eq(2) td:contains("Die S-Bahn-Station")').length);
    
    assertEquals('Die S-Bahn-Station', grid.getCell(2, 'sound'), 'Data repräsentation was synchronized');
  });
  
  test("insertRow(0) adds a new Row to the beginning of the table and shifts the other rows down", function () {
    grid.insertRow(['2-TEST_0001', 'Die S-Bahn-Station', [11046]], 1);
    assertEquals(20+1+1, $fixture.find('table tr').length);
    // wir fügen in zeile 1 ein. diese hat auch den index 1 (wegen der headerzeile)
    assertEquals(1, $fixture.find('table tr:eq(1) td:contains("Die S-Bahn-Station")').length);
    
    assertEquals('Die S-Bahn-Station', grid.getCell(1, 'sound'),  'Data repräsentation was synchronized');
  });


  test("attached grid can be serialized", function () {
    var $grid = $fixture.find('table');
    assertTrue($grid.hasClass('psc-cms-ui-grid-table'));
    
    var joose = Psc.UI.WidgetWrapper.unwrapWidget($grid, Psc.UI.GridTable);
    var data = {};
    
    joose.serialize(data);
    
    assertEquals(grid.getExport(), data['agrid']);
    
  });
});