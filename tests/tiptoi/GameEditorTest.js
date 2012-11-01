define(['psc-tests-assert','tiptoi/GameEditor'], function(t) {
  
  module("tiptoi.GameEditor");
  
  var setup = function () {
    var service = new (Class({
      has: {
        pulledCalled: {is: 'rw', required: false, isPrivate: false, init: false}
      },
      
      methods: {
        pullUploadFiles: function(requester) {
          this.pulledCalled = true;
          return [
            {
              "name":"emptyColumn.xlsx",
              "size":9126,
              "type":"application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "url":"/files/uploads/game/3/emptyColumn.xlsx",
              "delete_url":"/upload-manager/api/game/3/?file=emptyColumn.xlsx&_method=DELETE",
              "delete_type":"POST"
            }
          ];
        }
      }
    }))();
    
    var $widget = $('#visible-fixture').empty().html(
      '<div class="game-editor"><fieldset><div class="content game-files"></div></fieldset></div>'
    );
    
    var gameEditor = new tiptoi.GameEditor({
      service: service,
      apiUrl: '/upload-manager/api/game/102',
      widget: $widget
    });
    
    return {gameEditor: gameEditor, $grid: $widget.find('div.game-files'), '$fixture': $('#visible-fixture')};
  };

  test("acceptance", function() {
    setup(this);
    
    var grid = this.gameEditor.getFiles(), $table;
    
    this.assertEquals(1, ($table = this.$fixture.find('div.game-files table')).length, 'table is rendered in html');
    this.assertTrue(this.gameEditor.getService().pulledCalled, 'service was called for uploaded files');
    
    var row1 = grid.getRow(1);
    this.assertEquals(1, grid.getRows().length);
  });
});