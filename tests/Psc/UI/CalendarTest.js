define(['Psc/UI/Calendar','Psc/Test/DoublesManager','Psc/CalendarEvent'], function() {
  
  module("Psc.UI.Calendar");
  
  var setup = function (test) {
    var $widget = $('<div class="psc-cms-ui-calendar"/>');
    $('#visible-fixture').empty().append($widget).css('height', '1250px');
    
    //var dm = new Psc.Test.DoublesManager();
    var calendar = new Psc.UI.Calendar({
      widget: $widget,
      region: 'de'
    });
    
    $.extend(test,
             {
              calendar: calendar,
              $widget: $widget,
              findEvent: function (title, searchInDate, calendarInstance) {
                var cal = calendarInstance || calendar;
                var position = cal.getCellPosition(searchInDate);
                if (!position) return $();
                
                // wir selecten alle spalten an position.column in der zeile position.row
                var $table = cal.findGridTable(position.row);
                // wir haben also alle tds der verschiedenen zeilen des grid-table "untereinander"
                var $tds = $table.find('tr td:nth-child('+(position.column+1)+')');
                var $event = $tds.find('.event:contains("'+title+'")');
                
                return $event;
              }
            });
  };

  test("html structure acceptance", function() {
    setup(this);
    
    var $monthsContainer = this.$widget.find('div.month-rows-container'),
        $weekDaysTable = this.$widget.find('table.weekdays-table'),
        $monthRows = $monthsContainer.find('div.month-row'),
        $monthRowsBGs = $monthRows.find('table.bg-table'),
        $monthRowsGrids = $monthRows.find('table.grid-table');
  
    assertEquals(1, $monthsContainer.length);
    assertEquals(1, $weekDaysTable.length);
    assertEquals(5, $monthRows.length);
    assertEquals(5, $monthRowsBGs.length, 'monthbgs are rendered');
    assertEquals(5, $monthRowsGrids.length, 'month grids are rendered');
    
    // weekdays (header)
    var weekDayLabels = ['Mo','Di','Mi','Do','Fr','Sa','So'];
    $weekDaysTable.find('tr th.calendar-weekday-name').each(function (i, weekDay) {
      assertEquals(weekDayLabels[i], $(weekDay).text());
    });
    
    // numbers-table in month-row
    $monthRowsGrids.find('tr:first').each(function (rowIndex) {
      var $row = $(this);
      
      assertEquals(7, $row.find('td').length);
      $row.find('td').each(function (tdIndex) {
        assertTrue(parseInt($(this).text(), 10) > 0, 'td '+rowIndex+':'+tdIndex+' in first row of month grid has a number in it');
      });
    });
  });
  
  test("click on prev/next changes month accordingly", function() {
    setup(this);
    
    var now = Psc.Date.create({day: 5, year: 2012, month: 9});
    this.calendar.setDisplayDate(now).refresh();
    assertEquals('September', this.$widget.find('div.month-header .month-name').text());
    
    this.$widget.find('a.prev').simulate('click');
    assertEquals(8, this.calendar.getDisplayDate().getMonth());
    assertEquals('August', this.$widget.find('div.month-header .month-name').text());
    
    this.$widget.find('a.next').simulate('click');
    this.$widget.find('a.next').simulate('click');
    assertEquals(10, this.calendar.getDisplayDate().getMonth());
    assertEquals('Oktober', this.$widget.find('div.month-header .month-name').text());
    
    this.$widget.find('a.next').simulate('click'); // nov
    this.$widget.find('a.next').simulate('click'); // dec
    this.$widget.find('a.next').simulate('click'); // jan
    assertEquals('Januar', this.$widget.find('div.month-header .month-name').text());
    assertEquals('2013', this.$widget.find('div.month-header .year').text());
  });
  
  test("region is loaded to de", function() {
    setup(this);    
    
    assertEquals('Di', this.$widget.find('tr th:eq(1)').text());
    assertEquals('de', this.calendar.getRegion());
  });
  
  test("position of day in month is queryable", function() {
    setup(this);

    var now = Psc.Date.create({day: 5, year: 2012, month: 9});
    this.calendar.setDisplayDate(now).refresh();
    
    var position = this.calendar.getCellPosition(Psc.Date.create({year: 2012, month: 9, day: 18, hours: 10, minutes: 0}));
    
    assertEquals(3, position.row); // zeile 4 index 3
    assertEquals(1, position.column); // spalte 2 index 1
  });

  test("a single-day date gets added to the correct column", function() {
    setup(this);

    var now = Psc.Date.create({day: 5, year: 2012, month: 9});
    this.calendar.setDisplayDate(now).refresh();
    
    var myEvent;
    this.calendar.addEvent(myEvent = new Psc.CalendarEvent({
      title: 'Team-Meeting',
      start: Psc.Date.create({year: 2012, month: 9, day: 18, hours: 10, minutes: 0}),
      end: Psc.Date.create({year: 2012, month: 9, day: 18, hours: 14, minutes: 0})
    }));
    
    var $event = this.findEvent("Team-Meeting", myEvent.getStart());
    assertEquals(1, $event.length, 'event was found in '+myEvent.getStart());
  });

  test("an prevous (in month and time) added event in the will not be shown, but shown when the month is loaded", function () {
    setup(this);
    var myEvent;
    
    var now = Psc.Date.create({day: 5, month: 9, year: 2012});
    this.calendar.setDisplayDate(now).refresh();

    this.calendar.addEvent(myEvent = new Psc.CalendarEvent({
      title: 'Dienstreise',
      allDay: true,
      color: '#9a9cff',
      start: Psc.Date.create({year: 2012, month: 8, day: 1}),
      end: Psc.Date.create({year: 2012, month: 8, day: 1})
    }));
    
    // event is in august, so it isnt displayed in sep
    var $event = this.findEvent('Dienstreise', myEvent.getStart());
    assertEquals(0, $event.length, 'event is not displayed in sep');
    
    this.$widget.find('a.prev').simulate('click');
    $event = this.findEvent('Dienstreise', myEvent.getStart());
    assertEquals(1, $event.length, 'event is displayed in aug');
  });
  
  test("events can span over a few days", function () {
    setup(this);
    
    var now = Psc.Date.create({day: 5, month: 9, year: 2012});
    this.calendar.setDisplayDate(now).refresh();

    var mySpanEvent;
    this.calendar.addEvent(mySpanEvent = new Psc.CalendarEvent({
      title: 'Dienstreise',
      allDay: true,
      color: '#9a9cff',
      start: Psc.Date.create({year: 2012, month: 9, day: 1}),
      end: Psc.Date.create({year: 2012, month: 9, day: 3})
    }));
    
    var $event = this.findEvent('Dienstreise', mySpanEvent.getStart());
    assertEquals(1, $event.length, 'spanning event is rendered');
    var $td = $event.closest('td');
    
    // ja, eigentlich wollen wir ja die darstellung testen, das geht aber nicht, also bissl html testen passt schon
    // hier colspan 2 weilder nächste tag in der nächsten zeile steh
    assertEquals(2, parseInt($td.attr('colspan'), 10));
    var $endEvent = this.findEvent('Dienstreise', mySpanEvent.getEnd());
    assertEquals(1, $endEvent.length);

    this.calendar.addEvent(new Psc.CalendarEvent({
      title: 'Team-Workshop',
      allDay: true,
      color: '#ff0000',
      start: Psc.Date.create({year: 2012, month: 9, day: 10}),
      end: Psc.Date.create({year: 2012, month: 9, day: 16})
    }));

    var longRun;
    this.calendar.addEvent(longRun = new Psc.CalendarEvent({
      title: 'sehr lange Dienstreise',
      allDay: true,
      color: '#aaaaff',
      start: Psc.Date.create({year: 2012, month: 8, day: 31}),
      end: Psc.Date.create({year: 2012, month: 9, day: 18})
    }));

    this.calendar.addEvent(new Psc.CalendarEvent({
      title: 'ka',
      color: '#330000',
      start: Psc.Date.create({year: 2012, month: 9, day: 20, hours: 13}),
      end: Psc.Date.create({year: 2012, month: 10, day: 1, hours: 15})
    }));

    var inBetweenEvent;
    this.calendar.addEvent(inBetweenEvent = new Psc.CalendarEvent({
      title: 'ka2',
      color: '#aa0000',
      start: Psc.Date.create({year: 2012, month: 9, day: 6, hours: 13}),
      end: Psc.Date.create({year: 2012, month: 9, day: 7, hours: 15})
    }));

    $event = this.findEvent('ka2', inBetweenEvent.getStart());
    assertEquals(1, $event.length, 'inBetweenEvent is not rendered correctly');

    now = Psc.Date.create({day: 2, month: 8, year: 2012});
    this.calendar.setDisplayDate(now).refresh();
    
    $event = this.findEvent('sehr lange Dienstreise', longRun.getStart());
    assertEquals(1, $event.length, 'longRun is rendered at the end of month with correct colspan');
    assertEquals("3", $event.closest('td').attr('colspan'), 'colspan from sehr lange Dienstreise should be 3');
    
    var $spanEvent = this.findEvent('Dienstreise', mySpanEvent.getStart());
    assertEquals("2", $spanEvent.closest('td').attr('colspan'), 'colspan should be 2');
  });
});