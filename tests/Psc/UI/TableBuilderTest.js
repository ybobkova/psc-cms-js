define(['psc-tests-assert','Psc/UI/TableBuilder','Psc/Test/DoublesManager'], function() {
  
  module("Psc.UI.TableBuilder");
  
  var setup = function () {
    //var dm = new Psc.Test.DoublesManager();
    var tableBuilder = new Psc.UI.TableBuilder({ });
    
    return {tableBuilder: tableBuilder};
  };

  test("acceptance", function() {
    $.extend(this, setup());
    
    var table = this.tableBuilder
  
    table.start({classes: ['my-nice-table']});
    
    table.tr();
    table.td('eins');
    table.td('zwei');
    table.td('drei');
    table.tr();
    
    var $table = $(table.build());
    
    this.assertTrue($table.is('table'), 'rendered is not a table '+table.getHtml());
    this.assertEquals(1, $table.find('tr').length, 'one row is rendered '+table.getHtml());
    this.assertEquals(3, $table.find('tr td').length, 'row has 3 td '+table.getHtml());
  });
});