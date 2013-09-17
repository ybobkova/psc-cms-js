define(['psc-tests-assert', 'knockout', 'Psc/ko/Table'], function(t, ko) {
  
  module("Psc.ko.Table");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var table = new Psc.ko.Table({
      columns: [
        { name: "name", type: "string" },
        { name: "sales", type: "integer" },
        { name: "price", type: "price" }
      ],
      rows: [
        { name: "Well-Travelled Kitten", sales: 352, price: 75.95 },
        { name: "Speedy Coyote", sales: 89, price: 190.00 },
        { name: "Furious Lizard", sales: 152, price: 25.00 },
        { name: "Indifferent Monkey", sales: 1, price: 99.95 },
        { name: "Brooding Dragon", sales: 0, price: 6350 },
        { name: "Ingenious Tadpole", sales: 39450, price: 0.35 },
        { name: "Optimistic Snail", sales: 420, price: 1.50 }        
      ]
    });
    
    return t.setup(test, {table: table});
  };
  
  test("connect to grid acceptance", function() {
    var that = setup(this);
    
    var $grid = $('<div />');
    $('#visible-fixture').append($grid);
    
    $grid.jqxGrid({
        autoheight: true,
        theme: 'ui-smoothness',
        source: this.table.jqxDataAdapter(),
        editable: true,
        selectionmode: 'singlecell',
        columns: [
            { text: 'Name', dataField: 'name', width: 200 },
            { text: 'Sales', dataField: 'sales', width: 200, cellsalign: 'right' },
            { text: 'Price', dataField: 'price', width: 200, cellsformat: 'c2', cellsalign: 'right' }
        ]
    });
      
    ko.applyBindings(this.table);

    this.assertTrue(true, "the acceptance test is passed");
  });
});