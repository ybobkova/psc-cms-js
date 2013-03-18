define(['psc-tests-assert','text!fixtures/datetimepicker.html', 'jquery-simulate', 'Psc/Date','Psc/UI/DateTimePicker','Psc/Test/DoublesManager'], function(t, html) {

  module("Psc.UI.DateTimePicker");
  
  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var $widget = t.visibleFixture(html);
    
    var datePicker = new Psc.UI.DateTimePicker({
      dateFormat: 'd.m.Y',
      timeFormat: 'h:i',
      //  21.11.2012 11:15:04 (UTC)
      value: {'date': "1353496504", 'timezone': "not relevant"},
      widget: $widget
    });
    
    return t.setup(test, {datePicker: datePicker, $widget: $widget});
  };

  test("acceptance", function() {
    setup(this);
      
    this.assertInstanceOf(Psc.Date, this.datePicker.getValue());
  });
  
  test("div shows date from constructor / inputfield, time shows value from constructor", function() {
    var that = setup(this);
    
    var $date = that.assertjQueryLength(1, that.$widget.find('.jqx-widget[role=dateTimeInput]:first'));
    var $time = that.assertjQueryLength(1, that.$widget.find('.jqx-widget[role=dateTimeInput]:eq(1)'));
    
    var widgetDate = new Psc.Date.create($date.jqxDateTimeInput('getDate'));
    
    var expectedDate = Psc.Date.create({month: 11, day: 21, year: 2012, hours: 11, minute: 15, second: 4, utc:true});
    this.assertTrue(
      widgetDate.equals(expectedDate),
      'date field does not equal: '+expectedDate+' == '+widgetDate
    );
    
    var widgetTime = new Psc.Date.create($time.jqxDateTimeInput('getDate'));
    this.assertTrue(
      widgetTime.equals(expectedDate),
      'time field ield does not equal: '+expectedDate+' == '+widgetTime
    );
  });
  
  test("close event from widget does not bubble up", function () {
    var that = setup(this);
    var $container = t.visibleFixture();
    
    var $date = that.assertjQueryLength(1, that.$widget.find('.jqx-widget[role=dateTimeInput]:first'));
    
    // i'm not able to trigger the close event of the calendar widget here "manual"
    // and with jqxDateTimeInput('close') its close event is not triggered
    $container.on('close', function (e) {
      that.fail('event should not bubble up');
    });
    
    $date.trigger('close');
  });
  
  test("widget will be serialized to value in inputs", function () {
    // wir müssen das datum changen, sonst ist es ein blöder test
    var that = setup(this);
    
    var serializeDate = Psc.Date.create({month: 12, day: 12, year: 2012, hours: 12, minute: 22, second: 13});
    var $date = that.assertjQueryLength(1, that.$widget.find('.jqx-widget[role=dateTimeInput]:first'));
    var $time = that.assertjQueryLength(1, that.$widget.find('.jqx-widget[role=dateTimeInput]:eq(1)'));
    
    // needs native date as setter
    $date.jqxDateTimeInput('setDate', serializeDate.getDate());
    $time.jqxDateTimeInput('setDate', serializeDate.getDate());
    
    
    var data = {};
    
    that.datePicker.serialize(data);
    
    // wir "faken" die inputs im serialize
    that.assertjQueryHasClass('psc-cms-ui-serializable', that.$widget);
    that.assertEquals('12:22', data['start[time]']);
    that.assertEquals('12.12.2012', data['start[date]']);
  });
  
  test("datetimepicker without a real value can still be constructed, and date is current", function () {
    var that = setup(this);
    
    var datePicker = new Psc.UI.DateTimePicker({
      dateFormat: 'd.m.Y',
      timeFormat: 'h:i',
      value: null,
      widget: that.$widget
    });
    
    var current = new Psc.Date();
    
    this.assertEquals(
      current.format('d.m.Y'),
      datePicker.getValue().format('d.m.Y')
    );
  });
});
