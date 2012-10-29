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
        this.jqx(
          this.findTime(),
          'DateTimeInput',
          {
            /*
             width: '250px',
             height: '25px',
            */
            formatString: 'T',
            showCalendarButton: false
            //value: $.jqx._jqxDateTimeInput.getDateTime(new Date())
          }
        );

        this.jqx(
          this.findDate(),
          'DateTimeInput',
          {

             width: '250px',
             height: '25px',
             formatString: 'dd.MM.yyyy'
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