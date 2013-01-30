define(['knockout','jquery', 'joose', 'jquery-fileupload','jqwidgets','Psc/UI/GridTable','Psc/UI/GridTableEditor','Psc/Code', 'Psc/Request', 'Psc/UI/Dialog','Psc/FormRequest'], function(ko, $, Joose) {
  Joose.Class('Psc.UI.jqx.GridTableEditor', {
    isa: Psc.UI.GridTableEditor,
    
    has: {
      ko: {is: 'rw', required: false, isPrivate: false }
    },
  
    after: {
      initialize: function () {
        //Psc.Code.debug(this);
      }
    },
    
    methods: {
      transformjqx: function () {
        var that = this;
        
        var TableModel = function (rows) {
          this.rows = ko.observableArray(rows);
          
          this.add = function (row) {
            this.rows.push(row);
          };
        };
        
        this.ko = new TableModel(
          that.transformData(that.getGrid().getRows(), that.getGrid().getColumns())
        );
        
        var dataAdapter = new $.jqx.dataAdapter({
          datatype: "observablearray",
          localdata: that.ko.rows
        });
        
        var $table = this.getGrid().unwrap();
        var $grid = $('<div style="margin-bottom: 2em" />');
        $table.after($grid);
        $table.remove();
        
        $grid.jqxGrid({
          source: dataAdapter,
          editable: true,
          theme: 'ui-smoothness',
          enablehover: false,
          autoheight: true,
          editmode: 'dblclick',
          selectionmode: 'singlerow',
          columns: this.transformColumns(this.getGrid().getColumns())
        });
        
        ko.applyBindings(this.ko);
      },
      
      transformColumns: function(columns) {
        var jqxColumns = [], column, jqxColumn;
        
        for (var j = 0; j < columns.length; j++) {
          column = columns[j];
          
          jqxColumns.push(
            $.extend({
                text: column.label,
                columntype: 'textbox',
                dataField: column.name,
                editable: false
              },
              column.jqx || {}
            )
          );
        }
        
        return jqxColumns;
      },
      transformData: function (rows, columns) {
        var data = [], row;
        
        var j, column;
        for (var i = 0; i < rows.length; i++) {
          row = {};
          for (j = 0; j < columns.length; j++) {
            column = columns[j];
            
            row[column.name] = rows[i][column.index];
          }
          
          data.push(row);
        }
        
        return data;
      }
    }
  });
});