define(['psc-tests-assert','text!fixtures/ko.grid.html','jquery-simulate','Psc/UI/jqx/GridTableEditor','Psc/TableModel','Psc/UI/GridTable','Psc/CMS/Service'], function(t, html) {
  
  module("Psc.UI.jqx.GridTableEditor");
  
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
                  {name:"sound", type: "String", label: 'Sound'},
                  {name:"correctOIDs", type: "Array", label: 'Correct OIDs', jqx: {editable: true}}
                 ],
        data: [
            ['2-STA_0596', 'Die Universität', "STA:11011"],
            ['2-STA_0597', 'Das Aquarium', "STA:11012"],
            ['2-STA_0598', 'Das Rathaus', "STA:11013"],
            ['2-STA_0599', 'Das Parkhaus', "STA:11015"],
            ['2-STA_0600', 'Das Krankenhaus', "STA:11016"],
            ['2-STA_0601', 'Der Flughafen', "STA:11017"],
            ['2-STA_0602', 'Die Polizeiwache', "STA:11018"],
            ['2-STA_0603', 'Das Museum', "STA:11019, STA:11031"],
            ['2-STA_0604', 'Die Oper', "STA:11020"],
            ['2-STA_0605', 'Das Hotel', "STA:11021"],
            ['2-STA_0606', 'Das Fußballstadion', "STA:11022"],
            ['2-STA_0607', 'Der Bahnhof', "STA:11023"],
            ['2-STA_0608', 'Die U-Bahn-Station', "STA:11024"],
            ['2-STA_0609', 'Die Feuerwehr', "STA:11029"],
            ['2-STA_0610', 'Das Dinosauriermuseum', "STA:11031"],
            ['2-STA_0612', 'Der Park', "STA:11038"],
            ['2-STA_0614', 'Die Bücherei', "STA:11040"],
            ['2-STA_0615', 'Die Fußgängerzone', "STA:11025, STA:11041, STA:11044, STA:11051"],
            ['2-STA_0616', 'Ein Altstadtgebäude', "STA:11013, STA:11040, STA:11042"],
            ['2-STA_0617', 'Der Fernsehturm', "STA:11045"]
          ]
      });
      

      editor = new Psc.UI.jqx.GridTableEditor({
        service: service,
        grid: grid = new Psc.UI.GridTable({
          name: 'main',
          table: table
        })
      });


      $fixture = $('#visible-fixture');
      $fixture.html($grid = grid.html());
      
      editor.attach($grid);
      
      return t.setup(test, {$fixture: $fixture, editor: editor, $grid: grid, grid: grid, table: table, service: service});
  };
  
  test("transform to jqx grid", function () {
    var that = setup(this);
    expect(0);
    
    this.editor.transformjqx();
    
    var $fix = $('#visible-fixture');
    
    require(['Psc/UI/Button'], function() {
      var $test, test = new Psc.UI.Button({
        label: 'test'
      });
      
      $fix.append($test = test.create());
      
      $test.click(function () {
        //console.log(that.editor.ko.rows());
      });
      
      var $add, add = new Psc.UI.Button({
        label: 'add'
      });
      
      $fix.append($add = add.create());
      
      $add.click(function () {
        that.editor.ko.add(
          {number: '2-TEST_0001', sound: 'Something Other', oids:'TEST:999901'}
        );
      });
    });
    
  });
});