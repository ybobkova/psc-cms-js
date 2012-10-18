use(['Psc.Table'], function() {
  var table, insertRow;
  
  module("Psc.Table", {
    setup: function () {
      
      table = new Psc.Table({
        columns: [
                  {name:"number", type: "String"},
                  {name:"sound", type: "String"},
                  {name:"correctOIDs", type: "Array"}
                 ],
        data: [
          // 20 stück
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
      
      insertRow = ['2-TEST_0001', 'Die S-Bahn-Station', [11046]]
    }
  });

  test("acceptance", function() {
    assertTrue(table.hasColumn('number'),'table has Column number');
    assertTrue(table.hasColumn('sound'), 'table has column sound');
    
    assertEquals('2-STA_0596', table.getCell(1, 'number'));
    assertEquals('Der Fernsehturm', table.getCell(20, 'sound'));
  });
  
  test("insertRow: -1 appends", function () {
    table.insertRow(insertRow, -1);
    
    console.log(table.getData());
    assertSame(table.getRow(21), insertRow, 'row wurde an stelle 21 eingefügt');
  });

  test("insertRow: 1 prepends", function () {
    table.insertRow(insertRow, 1);
    
    assertSame(table.getRow(1), insertRow, 'row wurde an stelle 1 eingefügt');
  });
  
  
});