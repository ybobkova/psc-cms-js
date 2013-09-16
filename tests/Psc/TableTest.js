define(['psc-tests-assert','Psc/TableModel'], function(t) {

  module("Psc.TableModel");
  
  var setup = function(test) {
    var table = new Psc.TableModel({
        columns: [
                  {name:"number", type: "String"},
                  {name:"sound", type: "String"},
                  {name:"correctOIDs", type: "Array"}
                 ],
        data: [
          // 20 stück
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
      
    var insertRow = ['2-TEST_0001', 'Die S-Bahn-Station', [11046]];

    return t.setup(test, { table: table, insertRow: insertRow });      
  };

  test("acceptance", function() {
    var that = setup(this), table = that.table;
    this.assertTrue(table.hasColumn('number'),'table has Column number');
    this.assertTrue(table.hasColumn('sound'), 'table has column sound');
    
    this.assertEquals('2-STA_0596', table.getCell(1, 'number'));
    this.assertEquals('Der Fernsehturm', table.getCell(20, 'sound'));
  });
  
  test("insertRow: -1 appends", function () {
    var that = setup(this), table = that.table, insertRow = this.insertRow;
    table.insertRow(insertRow, -1);
    
    this.assertSame(table.getRow(21), insertRow, 'row is added at the position 21');
  });

  test("insertRow: 1 prepends", function () {
    var that = setup(this), table = that.table, insertRow = this.insertRow;
    table.insertRow(insertRow, 1);
    
    this.assertSame(table.getRow(1), insertRow, 'row is added at the position 1');
  });  

  test("getCell gets the value of a cell in the table", function () {
    var that = setup(this), table = that.table, insertRow = this.insertRow;

    this.assertEquals("Das Parkhaus", table.getCell(4, "sound"));

  });

  test("setCell sets the value of a cell in the table", function () {
    var that = setup(this);

    that.table.setCell(4, "sound", "Das Schlafhaus");
    this.assertEquals("Das Schlafhaus", that.table.getCell(4, "sound"));
  });
});