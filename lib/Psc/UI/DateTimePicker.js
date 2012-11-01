define(['Psc/UI/jqx/WidgetWrapper'], function () {
  Joose.Class('Psc.UI.DateTimePicker', {
    isa: Psc.UI.jqx.WidgetWrapper,

    has: {
      timeFormat: { is : 'rw', required: true, isPrivate: true },
      dateFormat: { is : 'rw', required: true, isPrivate: true }
    },
  
    after: {
      initialize: function () {
        this.checkWidget();
        this.linkWidget();
      
        this.init();
      }
    },
  
    methods: {
      init: function () {
        var $time = $('<div />'),
            $date = $('<div />'),
            $timeInput = this.findTime().hide().after($time),
            $dateInput = this.findDate().hide().after($date);
        
        this.jqx(
          $date,
          'DateTimeInput',
          {
             formatString: 'dd.MM.yyyy',
             width: '140px',
             showDelay: 0
            //value: $.jqx._jqxDateTimeInput.getDateTime(new Date())
          }
        );
        
        this.jqx($time, 'DateTimeInput', {
            width: '80px',
            formatString: 'HH:mm',
            showCalendarButton: false
            //value: $.jqx._jqxDateTimeInput.getDateTime(new Date())
          }
        );
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