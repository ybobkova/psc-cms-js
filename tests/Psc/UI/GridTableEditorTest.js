define(['psc-tests-assert','jquery-simulate','Psc/UI/GridTableEditor','Psc/Table','Psc/UI/GridTable','Psc/CMS/Service'], function(t) {
  
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
      
      table = new Psc.Table({
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
    
    this.assertEquals(1, this.$fixture.find('button.psc-cms-ui-button.grid-download-data').length, 'download button ist vorhanden');
    this.assertEquals(1, this.$fixture.find('button.psc-cms-ui-button.grid-upload-data').length, 'upload button ist vorhanden');
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
    
    this.assertEquals(1, $dialog.length, 'Ein Dialog wurde geöffnet');
    
    this.editor.getDialog().close();
  });
});