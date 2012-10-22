define(['Psc/Date', 'Psc/EventDispatching', 'Psc/UI/WidgetWrapper', 'Psc/CalendarCalculation',
        'Psc/UI/TableBuilder', 'Psc/UI/Table', 'jquery-ui', 'jquery-ui-i18n'], function () {

  Joose.Class('Psc.UI.Calendar', {
    isa: Psc.UI.WidgetWrapper,
    
    does: [Psc.EventDispatching],
  
    has: {
      /**
       * en-GB, de, fr
       * http://jqueryui.com/demos/datepicker/#localization
       */
      region: { is : 'rw', required: false, isPrivate: true, init: "de" },
      displayDate: { is : 'rw', required: false, isPrivate: true },
      
      /**
       * Das CalculationObject
       *
       * wird immer neu berechnet, wenn sich etwas ändert, d. h. zugreifen direkt auf die Properties ist okay
       */
      calc: { is : 'rw', required: false, isPrivate: false },
      
      /**
       * Liste der Events (durcheinander)
       * unbedingt ein array
       */
      events: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Array }
    },
    
    after: {
      initialize: function () {
        this.linkWidget();
        this.initUI();
        this.attachHandlers();
      }
    },
    
    methods: {
      initUI: function () {
        if (!this.$$displayDate) {
          this.setDisplayDate(new Psc.Date.create({year: 2012, month: 11, day: 1}));
        }
        
        this.refresh();
      },
      refresh: function () {
        var $widget = this.unwrap(), that = this;
        var html = '';
        html += this.drawHeader();
        html += '<div class="calendar-container">';
          html += this.drawWeekDays().build();
          html += '<div class="month-rows-container">';
          html += this.drawMonthRows();
          html += '</div>';
        html += '</div>';
        
        $widget.html(html);
        
        this._displayEvents();
      },
      
      attachHandlers: function () {
        var that = this, $widget = this.unwrap();
        
        $widget.on('click', 'div.month-header a.prev', function (e) {
          that.setDisplayDate(that.getDisplayDate().add({months: -1}));
          that.refresh();
        });
        
        $widget.on('click', 'td.event-cell', function (e) {
          var event = $(this).data('calendarevent');
          
          if (event && event.on('click', e) !== false) {
            that.$$eventManager.triggerEvent('calendar.open', {calendar: that}, [event]);
          }
        });
  
        $widget.on('click', 'div.month-header a.next', function (e) {
          that.setDisplayDate(that.getDisplayDate().add({months: +1}));
          that.refresh();
        });
      },
      
      drawWeekDays: function() {
        var table = new Psc.UI.TableBuilder();
        table.start({classes: ['weekdays-table']});
        
        table.tr();
        $.each(this.calc.weekDays, function (dow, weekDay) {
          table.th(weekDay.minName, {classes: ['calendar-weekday-name']});
        });
        table.tr();
        
        return table;
      },
      
      drawMonthRows: function(rowIndex) {
        var bgTableHTML = this.drawBackgroundTable().build();       
        var html = '', style, monthRow;
        for (var m = 0, l = this.calc.monthRows.length; m <l; m++) { /* x Blocks in which we will draw all days from the months (each row is a week) */
          monthRow = this.calc.monthRows[m];
          style = 'height: '+monthRow.height+';';
          style += monthRow.isLast ? 'bottom: '+monthRow.bottom : 'top: '+monthRow.top;
          
          html += '<div class="month-row" style="'+style+'">';
          html += bgTableHTML; // its always the same table for every row
          html += this.drawGridTable(m).build();
          html += '</div>';
        }
        
        return html;
      },
      
      /**
       * Diese Tabelle ist einfach eine Reihe von Zellen der richtigen Größe
       */
      drawBackgroundTable: function() {
        var table = new Psc.UI.TableBuilder();
        table.start({classes: ['bg-table']});
        
        table.tr();
        for (var d = 0, l = this.calc.weekDays.length; d < l; d++) {
          table.td(' ',{classes: ['']});
        }
        table.tr();
        
        return table;
      },
      
      /**
       * Der "eigentliche" Inhalt der Zellen (Tag-Nummer und Events)
       */
      drawGridTable: function (rowIndex) {
        var table = new Psc.UI.TableBuilder();
        table.start({classes: ['grid-table']});
        this.drawDaysNums(table, rowIndex);
        
        return table;
      },
      
      drawDaysNums: function (table, rowIndex) {
        var day, monthRow = this.calc.monthRows[rowIndex];
        
        table.tr();
        for (var d = 0, l = monthRow.days.length; d < l; d++) {
          day = monthRow.days[d];
          table.td('<span class="day-title">'+day.getDay()+'</span>',
                   {classes: (d === 0 ? ['first', 'day'] : ['day'])}
                  );
        }
        table.tr();
      },
      drawGridRow: function (table) {
        var classes;
        
        table.tr();
        for (var d = 0, l = this.calc.weekDays.length; d < l; d++) {
          classes = [];
          
          if (d === 0) {
            classes.push('first');
          }
          
          table.td('', {classes: classes});
        }
        table.tr();
        return table;
      },
      /**
       * @param Psc.UI.Table table
       */
      addGridRow: function(table) {
        var tableBuilder = new Psc.UI.TableBuilder();
        this.drawGridRow(tableBuilder);
        table.appendRow(tableBuilder.build());
      },
      drawHeader: function () {
        var html = '';
        html += '<div class="month-header ui-widget-header ui-helper-clearfix ui-corner-all">';
          html += '<a title="Prev" class="prev ui-corner-all"><span class="ui-icon ui-icon-circle-triangle-w">Prev</span></a>';
          html += '<a title="Next" class="next ui-corner-all"><span class="ui-icon ui-icon-circle-triangle-e">Next</span></a>';
          html += '<div class="month-title"><span class="month-name">'+this.calc.monthNames[this.$$displayDate.getMonth()-1]+'</span>&nbsp;<span class="year">'+this.$$displayDate.getYear()+'</span></div>';
        html += '</div>';
        return html;
      },
      
      addEvent: function (event) {
        // add event to our events (if not already?)
        this.$$events.push(event);
        
        // zeigt an oder nicht, nach selber dünken
        this._displayEvent(event);
      },
  
      _displayEvents: function() {
        var event;
        for (var i=0, l=this.$$events.length; i<l; i++) {
          event = this.$$events[i];
          
          this._displayEvent(event);
        }
      },
      
      /**
       * Zeigt das Event im Kalendar an (rendert das HTML + fügt hinzu)
       *
       * funktioniert nur für events in diesem Kalender-Monat (aktuell), sonst failed silent
       */
      _displayEvent: function(event) {
        if (this.canBeDisplayed(event.getStart())) {
          /* wir haben 3 1/2 typen von Events, die unterschiedlich gerendert werden:
           *  - events an einem Tag. Das können AllDay Events sein aber auch Events von 14-15 Uhr z.B.
           *  - events über mehrere Tage
           *  - events über mehrere Tage die in mehreren Monthrows sind
           *  - events über mehrere Tage die über mehrere Monate hinausgehen, d. h. auch aus vorigen Monaten "überlappen"
           *
           */
          // startPosition is defined, weil wir schon vorher den monat checken
          var startPosition = this.getCellPosition(event.getStart()); 
          var endPosition = this.canBeDisplayed(event.getEnd()) ? this.getCellPosition(event.getEnd()) : this.calc.getLastCellPosition();
          var rowSpan = endPosition.row - startPosition.row + 1;
          var weekWidth = this.calc.weekDays.length, eventLength = event.getDays().length;
            
          // drawEvent(event, startPosition, colspan, complete|begin|continuation|end);
          if (rowSpan === 1) {
            // event MAY be on the same day
            this.drawEvent(event, startPosition, endPosition.column-startPosition.column+1, 'complete');
            
          } else { // rowSpan is bigger than 1
            var drawPosition = $.extend({}, startPosition); // clone
            for (var r = 1; r <= rowSpan; r++) {
              if (r === 1) { // first row
                this.drawEvent(event, drawPosition, weekWidth-drawPosition.column, 'begin');
                drawPosition.row++;
                drawPosition.column = 0;
              } else if (r < rowSpan) {
                // drawPosition.column immer 0
                this.drawEvent(event, drawPosition, weekWidth, 'continuation');
                drawPosition.row++;
              } else {
                this.drawEvent(event, drawPosition, endPosition.column+1, 'end'); // column ist 0-based aber colSpan ist 1-based
              }
            }
          }
        }
      },
      
      /**
       * @return bool
       */
      canBeDisplayed: function(date) {
        return this.calc.canBeDisplayed(date);
      },
      /**
       * Zeichnet einen Event-Balken, der ein Teil eines Events ist
       *
       * der Event-Balken ist:
       *
       * (complete)     ein Anfangs + Endstück eines Events über einen oder mehrere Tage sein
       * (begin)        ein Anfangsstück eines Events über mehrer Tage sein (endet am Ende der Wochenzeile)
       * (continuation) ein FortsetzungsStück eines Events aus der vorigen Zeile sein (dann hat es die gesamte Breite der Woche)
       * (end)          das Endstück eines Events sein
       *
       * zusätzlich müssen wir uns beim Zeichnen noch um Kollisionen kümmern. Gibt es in dem Ziel grid-table bereits eine Zeile
       * und passt unser event in diese Zeile (weil sie leer ist), rendern wird das event darein
       * somit werden quasi events "nebeneinander" gerendert, wenn sie sich nicht überlappen.
       * Überlappen sich events oder ist noch keine event-zeile da, muss eine neue Zeile hinzugefügt werden
       *
       * @param Psc.CalendarEvent event
       * @param object startPosition .row .column
       * @param colspan 1-based
       * @param string type complete|begin|continuation|end
       */
      drawEvent: function (event, startPosition, colspan, type) {
        var that = this;
        var monthRow = this.calc.monthRows[startPosition.row];
        var table = new Psc.UI.Table({widget: this.findGridTable(startPosition.row)});
        
        var allCellsAreEmpty = function ($cells) {
          var empty = true;
          $cells.each(function (i) {
            if (!$(this).is(':empty')) {
              return empty = false;
            }
          });
          return empty;
        };
        
        // wir suchen zellen für unser event, oder erstellen welche
        var allocateCells = function () {
          var rowIndex = 1, $row, $cells; // 0 sind die days, da können wir nicht rein
          
          for (var x=0; x<=40; x++) { // will kein while nehmen, wegen endlos krams
            if (!table.hasRow(rowIndex)) { // wenn es die zeile nicht gibt, erzeugen wir sie neu, dann sind alle zellen leer
              that.addGridRow(table);
              
              return table.findRowCells(rowIndex, startPosition.column, colspan);
            } else {
              // wir haben eine Zeile in der Tabelle, aber wir müssen checken, ob diese für uns passend ist:
              $row = table.findRow(rowIndex);
              if (allCellsAreEmpty($cells = table.findRowCells($row, startPosition.column, colspan))) {
                return $cells;
              } else {
                rowIndex++;
              }
            }
          }
        };
        
        //  die erste zElle colspan, die anderen entfernen
        var $eventCell, $cells = allocateCells();
        $cells.each(function(i) {
          var $cell = $(this);
          if (i === 0) {
            $cell.attr('colspan', colspan)
                 .html(event.createHTML(type))
                 .data('calendarevent', event)
                 .addJoose.Class('event-cell');
            $eventCell = $cell;
          } else {
            $cell.remove();
          }
        });
      },
      findGridTable: function(rowIndex) {
        return this.unwrap().find('div.month-row:eq('+rowIndex+') table.grid-table');
      },
      setDisplayDate: function(date) {
        this.$$displayDate = date;
        this.calc = new Psc.CalendarCalculation({date: date, region: this.$$region});
        return this;
      },
      /**
       * @return jQuery
       */
      getCellPosition: function (date) {
        return this.calc.getCellPosition(date);
      },
      toString: function() {
        return "[Psc.UI.Calendar]";
      }
    }
  });
});