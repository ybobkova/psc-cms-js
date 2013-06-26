define(['joose', 'Psc/TableModel', 'Psc/Code', 'Psc/Exception', 'Psc/InvalidArgumentException','Psc/UI/WidgetWrapper', 'Psc/UI/HTML/Base'], function(Joose) {
  /**
   *
   * HTML erstellen (mit JS)
   *
   * var grid= new Psc.UI.GridTable({
   *  table: new Psc.TableModel({
   *    columns: [
   *              {name:'name', 'label':'Dateiname', type:'String'}
   *             ],
   *      data: [
   *        ['excelTabelle.xslx']
   *      ]
   *    }),
   *    name: 'gameFiles'
   * 
   * $myHTML.append(
   *  grid.attach(grid.html())
   * );
   * ansonsten kann das innere auch mit PHP ersteller Psc\UI\GridTable sein
   */
  Joose.Class('Psc.UI.GridTable', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.UI.HTML.Base],
    
    has: {
      table: { is : 'rw', required: true, isPrivate: true, handles: ['getColumn', 'hasColumn', 'getCell', 'setCell', 'getColumns', 'getRow'] },
      name: { is : 'rw', required: true, isPrivate: true },
      widget: { is : 'rw', required: false, isPrivate: false },
      serialize: { is : 'rw', required: false, isPrivate: true, init: true }, // serialize if asked?

      onCellsDoubleClickCallbacks: { is: 'r', required: false, isPrivate: true, init: Joose.I.Array}
    },
    
    after: {
      initialize: function (props) {
        Psc.Code.assertClass(props.table, Psc.TableModel, 'table', 'GridTable.initialize()');
      }
    },
    
    methods: {
      /**
       * Attached die HTMl Repräsentation zu diesem grid
       */
      attach: function ($grid) {
        if (!$grid.length || !$grid.jquery) {
          throw new Psc.Exception('uebergebenes html fuer attach($grid) ist kein jquery element');
        }
        
        this.widget = this.$$html = $grid;
        
        $grid.addClass('psc-cms-ui-grid-table');
        this.widget = $grid;
        this.linkWidget();
        this._attachHandlers();
        
        return this.widget;
      },
      
      
      refresh: function () { // wird jedes mal von base aufgerufen, wenn html() aufgerufen wird
        var columns = this.$$table.getColumns(), that = this,
            tableData = this.$$table.getData(), lastRow = tableData.length-1;
        
        var table = this.tag('table', {
          'class': ['psc-cms-ui-table', 'psc-cms-ui-grid', 'psc-cms-ui-grid-table', 'ui-widget', 'ui-widget-content']
        });
        
        var head = that.tag('tr', {'class': ['first', 'ui-widget-header']});
        $.each(columns, function(i, column) {
          head.append(that.tag('th', {'class': ['first', column.name], text: column.label}));
        });
        table.append(head);
        
        $.each(tableData, function (i, tableRow) {
          var classes = i === lastRow ? ['last'] : [];
          
          table.append(that._createRow(tableRow, classes));
        });
        
        this.$$html = table;

        if (this.widget) {
          this.widget.replaceWith(this.$$html);
          this.widget = this.$$html;

          this._attachHandlers();
        }
        return this;
      },

      _attachHandlers: function () {
        var that = this, $table = this.widget;
        $table.on('dblclick', 'tr td', function (event) {
          var $cell = $(event.currentTarget);

          var rowIndex = that.getRowIndex($cell);
          var columnIndex = that.getColumnIndex($cell);

          for (var i = 0; i < that.$$onCellsDoubleClickCallbacks.length; i++) {
            that.$$onCellsDoubleClickCallbacks[i](event, $cell, rowIndex, columnIndex);
          }
        });
      },
      
      _createRow: function (row, classes) {
        classes = classes || [];
        var tr = this.tag('tr', {'class': classes}), columns = this.$$table.getColumns(), lastColumn = columns.length-1, that = this;
          
        if (!Psc.Code.isArray(row) || row.length !== columns.length) {
          throw new Psc.InvalidArgumentException('row', 'Array der Länge '+columns.length, row, 'gridTable._createRow()');
        }
        
        $.each(columns, function (j, column) {
          var classes = [column.name];
  
          if (j === 0) {
            classes.push('first');
          }
          if (j === lastColumn) {
            classes.push('last');
          }
          
          tr.append(that.tag('td', {
            'class': classes,
            html: that.convertCellValue(row[j], column) // html statt text, damit auch jquery geht
          }));
        });
        
        return tr;
      },
      
      convertCellValue: function (value, column) {
        var cType = column.type.toLowerCase();
        
        try {
          if (cType === 'string') {
            return value;
          } else if (cType === 'array') {
            return JSON.stringify(value);
          } else if (cType === 'integer') {
            return value;
          } else if (cType === 'jquery') {
            return value;
          }
  
          throw new Error('cannot convert '+cType+' to string');
          
        } catch (e) {
          throw new Psc.InvalidArgumentException('value in row für '+column.name, cType, value, 'GridTable.createRow() -> convertCellValue()');
        }
      },
      
      appendRow: function(row) {
        return this.insertRow(row, -1);
      },
      
      insertRow: function (row, rowNum) {
        this.$$table.insertRow(row, rowNum);
        
        if (rowNum === -1) rowNum = this.$$table.getData().length;
        
        // header ist zeile 0 deshalb ist hier rowNum als index benutzbar
        var $pivot = this.$$html.find('tr:eq('+(rowNum-1)+')');
        var tr = this._createRow(row);
        
        tr.insertAfter($pivot);
        return this;
      },
      
      getHTMLRows: function () {
         return this.unwrap().find('tr:not(:eq(0))');
      },

      /**
       * @return rows[]
       */
      getRows: function () {
        return this.$$table.getData();
      },

      getColumns: function () {
        return this.$$table.getColumns();
      },

      getRowIndex: function ($cell) {
        var $table = this.widget;
        var $tr = $cell.parent();
        var $trs = $table.find('tr');
        var rowIndex = $trs.index($tr);
        return rowIndex;
      },

      getColumnIndex: function ($cell) {
        var $tr = $cell.parent();
        var $tds = $tr.find('td');
        var columnIndex = $tds.index($cell);
        return columnIndex;
      },

      getCellIndexes: function ($cell) {
        var rowNum = this.getRowIndex($cell);
        var columnNum = this.getColumnIndex($cell);
        return {row: rowNum, column: columnNum};
      },

      /**
       * Gibt eine einzelne Zelle (td oder th) der Tabelle zurück
       *
       * @return jQuery
       */ 
      findCell: function (rowIndex, column) {
        if (typeof(column) === "string") {
          column = this.$$table.getColumn(column).index;
        }

        return this.findRow(rowIndex).find('td:eq('+column+'), th:eq('+column+')');
      },


      /**
       * Gibt einen Streifen der Tabelle der vertikal verläuft zurück (eine Spalte)
       * 
       * @return jQuery
       */
      findColumn: function (column) {
        if (typeof(column) === "string") {
          column = this.$$table.getColumn(column).index;
        }

        return this.unwrap().find('tr td:nth-child('+column+'), tr th:nth-child('+column+')');
      },

      /**
       * Gibt einen Streifen der Tabelle der horizontal (eine Zeile) zurück
       *
       * index = 0 is the header of the table
       * @return jQuery
       */
      findRow: function (index) {
        return this.unwrap().find('tr:eq('+index+')');
      },
      
      empty: function () {
        this.$$html.find('tr:not(:eq(0))').remove();
        this.$$table.setData([]);
        return this;
      },
      
      serialize: function (data) {
        if (this.$$serialize) {
          data[this.$$name] = this.getExport();
        }
      },

      onCellsDoubleClick: function (callback) {
        this.$$onCellsDoubleClickCallbacks.push(callback);
        return this;
      },
      
      getExport: function () {
        return {
          columns: this.$$table.getColumns(),
          data: this.$$table.getData()
        };
      },
      
      toString: function() {
        return "[Psc.UI.GridTable]";
      }
    }
  });
});