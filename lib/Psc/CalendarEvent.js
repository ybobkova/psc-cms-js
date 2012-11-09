define(['Psc/Date', 'Psc/UI/HTML/Builder', 'Psc/UI/HTML/TagBuilder'], function() {
  Joose.Class('Psc.CalendarEvent', {
    
    has: {
      i18nTitle: { is : 'rw', required: true, isPrivate: true },
      start: { is : 'rw', required: true, isPrivate: true },
      region: { is : 'rw', required: false, isPrivate: true, init: 'de' },
      
      color: { is : 'rw', required: false, isPrivate: true },
      end: { is : 'rw', required: false, isPrivate: true },
      allDay: { is : 'rw', required: false, isPrivate: true, init: false },
      
      style: { is : 'rw', required: false, isPrivate: true, init: 'with-ui'}
    },
    
    after: {
      initialize: function (props) {
        if (props.start) {
          this.$$start = Psc.Date.create(props.start);
        }
        
        if (props.end) {
          this.$$end = Psc.Date.create(props.end);
        } else {
          this.$$end = this.$$start;
        }
        
        if (!props.color) { // damit auch null überschrieben wird
          this.$$color = '#E4EFF8';
        }
      }
    },
    
    methods: {
      /**
       * @param string type complete|begin|continuation|end
       */
      createHTML: function (type) {
        var uiStyle = this.isjQueryUIStyle(), classes = 'event', style = '';
        
        if (uiStyle) {
          classes += ' ui-state-default';
          if (type === 'begin' || type === 'complete') {
            classes += ' ui-corner-left';
          }
          if (type === 'end' || type === 'complete') {
            classes += ' ui-corner-right';
          }
        } else if(this.$$color) {
          style += 'background-color: '+this.$$color+';';
        }
        
        var content = '<div style="'+style+'" class="'+classes+'"><span class="event-title">'+this.getTitle()+'</span>';
        
        if (this.isInnerDay() && !this.isAllDay()) {
          content += '<span class="event-time">'+this.getStart().format('$hh:ii')+'</span>';
        }
        
        content += '</div>';
        
        return content;
      },
      
      getTitle: function () {
        return this.$$i18nTitle[this.$$region];
      },
      
      /**
       * Wird vom Calendar aufgerufen, wenn auf das Event geklickt oder sonstiges wird
       *
       * string type
       * BrowserEvent e
       */
      on: function (type, e) {
      },
      
      /**
       * Ist der Termin inerhalb eines 24 Stunden tags? (aka: ist das Datum gleich?)
       */
      isInnerDay: function () {
        return this.$$start.equalsDate(this.$$end);
      },
      getDays: function () {
        var days = [], day = this.$$start, length = this.$$end.diffDays(this.$$start);
        for (var i = 0; i <= length; i++) { // <= da wir das enddatum mitwollen
          days.push(day);
          day = day.add({days: 1});
        }
        return days;
      },
      formatRange: function () {
        var f1, f2, range;
  
        if (this.getStart().getYear() !== this.getEnd().getYear()) {
          f1 = f2 = '$d.m.yy';
        } else if (this.getStart().getMonth() !== this.getEnd().getMonth()) {
          f1 = '$d.m.';
          f2 = '$d.m.yy';
        } else if (this.getStart().getDay() !== this.getEnd().getDay()) {
          f1 = '$d.';
          f2 = '$d.m.yy';
        } else if (this.$$allDay) { 
          f1 = '$d.m.yy';
          f2 = false;
        } else { // === this.isInnerDay() no whole day
          f1 = '$d.m.yy hh:ii';
          f2 = '$hh:ii';
        }
        
        range = this.getStart().format(f1);
        
        if (f2) {
          range += ' - '+this.getEnd().format(f2);
        }
        
        return range;
      },
  
      /**
       * ist dies ein All-Day event ohne spezifische Zeit?
       */
      isAllDay: function () {
        return this.$$allDay;
      },
      isjQueryUIStyle: function () {
        return this.$$style === 'with-ui';
      },
      toString: function() {
        return "[Psc.CalendarEvent]";
      }
    }
  });
});