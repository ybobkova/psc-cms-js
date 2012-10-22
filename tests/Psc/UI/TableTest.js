define(['Psc/UI/Table','Psc/UI/TableBuilder', 'Psc/Test/DoublesManager'], function() {
  
  module("Psc.UI.Table");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var builder = new Psc.UI.TableBuilder({});
    builder.start();
    builder.tr();
      builder.td('1:1 ');
      builder.td('1:2 ');
      builder.td('1:3 ');
      builder.td('1:4 ');
    builder.tr();

    builder.tr();
      builder.td('2:1 ');
      builder.td('2:2 ');
      builder.td('2:3 ');
      builder.td('2:4 ');
    builder.tr();
    
    var $table = $(builder.build());
    var table = new Psc.UI.Table({widget: $table });
    
    builder.start();
    builder.tr();
      builder.td('1:1 ', {colspan:1});
      builder.td('1:2&&1:3 ', {colspan: 2});
      builder.td('1:4 ');
    builder.tr();

    builder.tr();
      builder.td('2:1&&2:2&&2:3 ', {colspan : 3});
      builder.td('2:4 ');
    builder.tr();

    builder.tr();
      builder.td('3:1 ', {colspan:1});
      builder.td('3:2 ');
      builder.td('3:3 ');
      builder.td('3:4 ');
    builder.tr();
    
    var $colspanTable = $(builder.build()), colspanTable = new Psc.UI.Table({widget: $colspanTable });
    
    $.extend(test, {table: table, $table: $table, colspanTable: colspanTable, $colspanTable: $colspanTable});
  };

  test("findRow returns the row as jquery", function() {
    setup(this);
  
    assertEquals('1:1 1:2 1:3 1:4 ', this.table.findRow(0).text());
    assertEquals('2:1 2:2 2:3 2:4 ', this.table.findRow(1).text());
  });
  
  test("findRowCells returns some cells of row", function() {
    setup(this);
  
    var $cells = this.table.findRowCells(0, 0, 2);
    assertEquals('1:1 1:2 ', $cells.text());

    $cells = this.table.findRowCells(0, 2, 2)
    assertEquals(2, $cells.length, '0,2,2 two cells from index 2 are returned');
    assertEquals('1:3 1:4 ', $cells.text());
  });
  
  test("findRowCells deals with colspan ", function() {
    setup(this);
  
    var $cells = this.colspanTable.findRowCells(0, 1, 2);
    assertEquals(1, $cells.length, 'should return the colspanned td');
    assertEquals('1:2&&1:3 ', $cells.text());
    
    var $cells = this.colspanTable.findRowCells(2, 2, 2);
    assertEquals('3:3 3:4 ', $cells.text());
    
  });
});