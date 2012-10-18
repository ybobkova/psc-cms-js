Joose.Class('Psc.UI.Table', {
  isa: 'Psc.UI.WidgetWrapper',

  has: {
    //attribute1: { is : 'rw', required: false, isPrivate: true }
  },
  
  after: {
    initialize: function () {
      this.checkWidget();
    }
  },
  
  methods: {
    /**
     * Gibt eine einzelne Zelle (td oder th) der Tabelle zurück
     */
    findCell: function (rowIndex, columnIndex) {
      return this.findRow(rowIndex).find('td:eq('+columnIndex+'), th:eq('+columnIndex+')');
    },
    /**
     * Gibt einen Streifen der Tabelle der vertikal verläuft zurück (eine Spalte)
     */
    findColumn: function (columnIndex) {
      return this.unwrap().find('tr td:nth-child('+columnIndex+'), tr th:nth-child('+columnIndex+')');
    },
    /* Gibt einen Streifen der Tabell der horizontal (eine Zeile) zurück
     */
    findRow: function (index) {
      return this.unwrap().find('tr:eq('+index+')');
    },
    /**
     * @return bool
     */
    hasRow: function (index) {
      return this.findRow(index).length > 0;
    },
    /**
     * @param int|jQuery rowIndex wenn jQuery wird dies als $row genommen
     */
    findRowCells: function(rowIndex, start, length) {
      var $row = rowIndex.jquery ? rowIndex : this.findRow(rowIndex);
      var tds = [];
      var i = 0;
      $row.find('td,th').each(function () {
        if (length <= 0) return false;
        
        var $td = $(this);
        var colspan = $td.attr('colspan') ? parseInt($td.attr('colspan'), 10) : 1;
        
        // zähle alle mit ihrem colspan zu length. also colspan 2 zieht von length auch 2 ab
        if (i >= start) {
          tds.push(this);
          length -= colspan;
        }
        i += colspan;
      });
      
      return $(tds);
    },
    appendRow: function($row) {
      return this.unwrap().append($row);
    },
    toString: function() {
      return "[Psc.UI.Table]";
    }
  }
});