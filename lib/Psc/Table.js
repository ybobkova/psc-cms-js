/**
 * Ein Tabellen-Modell
 *
 * anders als Psc.UI.Table ist dies hier kein WidgetWrapper
 */
Joose.Class('Psc.Table', {
  
  use: ['Psc.Code', 'Psc.Exception'],
  
  has: {
    // ein Array von Objekten mit:
    // string .name,
    // string .type, (so im Format wie der PHP Psc Type, ucfirst)
    // string .label 
    columns: { is : 'rw', required: true, isPrivate: true },
    
    columnsIndex: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
    data: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Array }
  },
  
  after: {
    initialize: function () {
      
      this.initColumns();
    }
  },
  
  methods: {
    initColumns: function () {
      var column;
      for (var i=0, l=this.$$columns.length; i < l; i++) {
        column = this.$$columns[i];
        column.index = i;
        this.$$columnsIndex[column.name] = column;
      }
    },
    
    /**
     * @param int rowNum 1-basierend
     * @param string columnName
     * @return mixed|undefined
     */
    getCell: function (rowNum, columnName) {
      rowNum = Math.max(1, rowNum);
      if (rowNum <= this.$$data.length && this.hasColumn(columnName)) {
        return this.$$data[rowNum-1][ this.getColumn(columnName).index ];
      }
      
      return undefined;
    },
    
    /**
     * @param int rowNum 1-basierend. wenn -1 wird appended
     */
    insertRow: function (row, rowNum) {
      var length = this.$$data.length, left, right;
      var offset = rowNum === -1 ? length : (Math.max(1,rowNum)-1);
      
      if (offset < 0 || offset > length) {
        throw new Psc.Exception('offset: '+offset+' ist out of bounds');
      }

      left = (offset > 0) ? this.$$data.slice(0, offset) : [];
      right = (offset < length) ? this.$$data.slice(offset) : [];

      this.$$data = left;
      this.$$data.push(row); // push ist nicht chainable, der kleine showstopper
      this.$$data = this.$$data.concat(right);
      
      return this;
    },
    
    getColumn: function (columnName) {
      return this.$$columnsIndex[columnName];
    },
    
    getRow: function (rowNum) {
      rowNum = Math.max(1, rowNum);
      return this.$$data[rowNum-1];
    },
    
    hasColumn: function (columnName) {
      return this.$$columnsIndex[columnName] ? true : false;
    },
    
    toString: function() {
      return "[Psc.Table]";
    }
  }
});