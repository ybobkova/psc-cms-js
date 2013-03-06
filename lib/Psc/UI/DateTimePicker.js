define(['joose', 'Psc/UI/jqx/WidgetWrapper','Psc/Code','Psc/Date','jqwidgets', 'jquery-global-de-DE'], function(Joose) {
  Joose.Class('Psc.UI.DateTimePicker', {
    isa: Psc.UI.jqx.WidgetWrapper,

    has: {
      timeFormat: { is : 'rw', required: true, isPrivate: true },
      dateFormat: { is : 'rw', required: true, isPrivate: true },
      
      timeWidget: { is : 'rw', required: false, isPrivate: true },
      dateWidget: { is : 'rw', required: false, isPrivate: true },
      
      // will be converted to Psc.Date (with create()) on initialize
      value: { is : 'rw', required: true, isPrivate: true }
    },
  
    after: {
      initialize: function () {
        if (!Psc.Code.isInstanceOf(this.$$value, Psc.Date)) {
          if (!this.$$value) {
            this.$$value = new Psc.Date(); // init current
          } else {
            this.$$value = Psc.Date.create(this.$$value);
          }
        }
        
        this.checkWidget();
        this.linkWidget();
      
        this.init();
      }
    },
  
    methods: {
      init: function () {
        this.$$timeWidget = $('<div />');
        this.$$dateWidget = $('<div />');
            
        var $timeInput = this.findTime().hide().after(this.$$timeWidget);
        var $dateInput = this.findDate().hide().after(this.$$dateWidget);
        
        this.jqx(
          this.$$dateWidget,
          'DateTimeInput',
          {
             formatString: 'dd.MM.yyyy',
             width: '140px',
             showDelay: 0,
             value: this.$$value.format('jqx'),
             culture: 'de-DE',
             firstDayOfWeek: jQuery.global.cultures['de-DE'].calendars.standard.firstDay
          }
        );
        
        this.jqx(
          this.$$timeWidget,
          'DateTimeInput', {
            width: '80px',
            formatString: 'HH:mm',
            showCalendarButton: false,
            value: this.$$value.format('jqx'),
            culture: 'de-DE'
          }
        );
        
        // prevent "close" event (without namespace) to bubble up and trigger "tab close"
        this.unwrap()
          .addClass('psc-cms-ui-serializable')
          .on('close', function (e) {
            e.stopImmediatePropagation();
          });
        
      },
      serialize: function (data) {
        data[this.findTime().attr('name')] = this.$$timeWidget.find('input').val();
        data[this.findDate().attr('name')] = this.$$dateWidget.find('input').val();
        
        return data;
      },
      findTime: function () {
        return this.unwrap().find('.datepicker-time').first();
      },
      findDate: function () {
        return this.unwrap().find('.datepicker-date').first();
      },
      toString: function() {
        return "[Psc.UI.DateTimePicker]";
      }
    }
  });
});