/*globals confirm:true*/
define(['joose', 'Psc/Exception','Psc/UI/Tab','Psc/Code','Psc/EventDispatching'], function(Joose) {
  /**
   * Steuerungsklasse für ein GridPanel (oder EntityGridPanel)
   *
   * events:
   *   grid-panel-xxxx({gridPanel: }, [rows])
   *
   * rows ist ein array von zeilen-objekten. Die Properties sind die technischen Namen der Spalten. die werte sind die jquery $td Objekte
   */
  Joose.Class('Psc.UI.GridPanel', {
    
    does: Psc.EventDispatching,
    
    has: {
      // das widget
      grid: { is : 'rw', required: true, isPrivate: true },
      
      buttons: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
      
      // der table im widget
      table: { is : 'rw', required: false, isPrivate: true },
      
      // bool
      sortable: { is : 'rw', required: false, isPrivate: true, init: false },
      sortableName: { is : 'rw', required: false, isPrivate: true, init: 'sort' },
      
      // function
      tdConverter: { is : 'rw', required: false, isPrivate: true},
      
      /**
       * Ein Array von Spaltennamen in der richtigen Reihenfolge
       *
       * das spart uns das parsen vom Markup und ist expliziter
       * index => name
       */
      columns: { is: 'rw', required: true, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
        this.initButtons();
        this.initDefaultOpenHandler(); // KISS
        this.initSortable();
      }
    },
  
    methods: {
      initButtons: function () {
        var $table = this.getTable(), that = this;
        
        if (this.$$buttons.open) {
          this.$$buttons.open = $('<button></button>')
            .attr("title", "öffnen") /* da steht ja: "markiert:" vor*/
            .addClass('grid-open')
            .insertAfter($table)
            .button({
              icons: {
                primary: "ui-icon-newwin"
              },
              text: false
            })
            .click(function(e) {
              e.preventDefault();
              that.triggerRowsEvent('open');
            });
        }
  
        if (this.$$buttons.open ) { /* || ...*/
          $('<small class="hint with-selected">markierte:</small>').insertAfter($table);
        }
      },
      initDefaultOpenHandler: function (tdToTCIFunction) {
        tdToTCIFunction = tdToTCIFunction || this.getDefaultTCIHelper();
        var evm = this.getEventManager(), that = this;
        
        evm.on('grid-panel-open', function (e, rows) {
          var $td, key;
  
          // für jede Zeile:
          for(var i = 0; i < rows.length; i++) {
            // suche die erste Spalte mit der klasse "tci" und benutze die angegebene funktion um die td in ein Psc.UI.Tab umwzuwandeln
            for (key in rows[i]) {
              $td = rows[i][key];
              if ($td.hasClass('tci')) {
                evm.triggerEvent('tab-open', {source: 'gridPanel'}, [tdToTCIFunction($td), that.getGrid()]);
                return false;
              }
            }
          }
        });
      },
      initDefaultDeleteHandler: function (tciHelper) {
        this.$$tdConverter = tciHelper || this.getDefaultTCIHelper();
        
        var evm = this.getEventManager(), that = this, tdConverter = this.$$tdConverter;
        
        evm.on('grid-panel-delete', function (e, rows) {
          if (rows.length && confirm('Wollen Sie wirklich all diese Elemente löschen?') === true) { // @TODO decouple: InteractionManager?
            // für jede Zeile:
            var trg = function (cname, $td) {
                if ($td.hasClass('tci')) {
                  evm.triggerEvent('tab-open', {source: 'gridPanel'}, [tdConverter($td), that.getGrid()]);
                  return false;
                }
            };
            
            for(var i = 0; i < rows.length; i++) {
              $.each(rows[i], trg);
            }
          }
        });
      },
      
      setSortable: function(bool) {
        bool = !!bool;
        if (this.$$sortable !== bool) {
          this.$$sortable = bool;
          this.initSortable();
       }
      },
      
      initSortable: function () {
        
        if (this.$$sortable) {
          var that = this, $table = this.getTable();
          
          $table.sortable({
            items: '> tbody > tr:not(:eq(0))'
          });
          
          $table.find('td.ctrl').css('padding-left','1em').prepend(
            $('<span/>')
              //.css('margin-left','-1.3em')
              //.css('position', 'absolute')
              .addClass('ui-icon').addClass('ui-icon-arrowthick-2-n-s')
          ).each(function () {
            var $td = $(this), $cb = $td.find('input[name="egp-ctrl[]"]');
            
            if ($cb.length) {
              $td.append('<input type="hidden" name="'+that.getSortableName()+'[]" value="'+$cb.val()+'" />');
            } else {
              Psc.Code.debug('Exception spalte', $td);
              throw new Psc.Exception('Keine Control Checkbox in Spalte. Kann sortable nicht aktivieren');
            }
          });
        }
      },
      
      /**
       * Der Default TCI Helper sucht in der TD nach dem ersten button und erstellt mit diesem einen neuen Psc.UI.Tab
       * 
       */
      getDefaultTCIHelper: function () {
        return function ($td) {
          var $button = $td.find('button:first');
          var item = $td.find('button:first').data('joose');
          
          if (!item) {
            throw new Psc.Exception('joose ist in data() für den button:first in td nicht gesetzt.');
          }
          
          return item.getTab();
        };
      },
      triggerRowsEvent: function(type) {
        var rows = this.getSelectedRows(true);
        
        if (!rows.length) {
          return null; // nothing todo, because nothing is selected
        }
        
        return this.getEventManager().triggerEvent('grid-panel-'+type, {gridPanel: this}, [rows]);
      },
      getSelectedRows: function(toObject) {
        var $table = this.getTable(), that = this;
        var rows = [];
        $table.find('tr:not(.first)').each(function(i,tr) {
          var $tr = $(tr);
          var row;
          if ($tr.find('td.ctrl input.psc-cms-ui-identifier-checkbox:checked').length) {
            if (!toObject) {
              rows.push($tr);
            } else {
              row = {};
              $tr.find('td').each(function (columnIndex, td) {
                var $td = $(td);
                if (!$td.hasClass('ctrl')) { // dieser filter muss nach innen damit columnIndex korrekt ist
                  row[ that.getColumnName(columnIndex) ] = $td;
                }
              });
              rows.push(row);
            }
          }
        });
        
        return rows;
      },
      getTable: function () {
        if (!this.$$table) {
          this.$$table = this.$$grid.find('table.psc-cms-ui-grid');
        
          if (!this.$$table.length) {
            throw new Psc.Exception('in this.grid wurde kein table.psc-cms-ui-grid gefunden');
          }
        }
        
        return this.$$table;
      },
      getColumnName: function(index) {
        if (!this.$$columns[index]) {
          Psc.Code.debug(this.$$columns);
          throw new Psc.Exception('index '+index+' nicht in den Columns des GridPanels gefunden.');
        }
        var name = this.$$columns[index];
        
        // tci:xxx wegcutten
        if (name.indexOf(':') !== -1) {
          name = name.split(":")[1];
        }
        
        return name;
      },
      
      toString: function() {
        return "[Psc.UI.GridPanel]";
      }
    }
  });
});  