# Dependency to jq-widgets

Please remove if you can(!)

  * Psc.Date format() uses the jqx library to format into the jqx format. Maybe we can implement this natively. Or better: remove everything with jqx dates
  - Psc.ko.Table is using the data adapter (but is this used in production?)
  - Psc.UI.DatePicker is implemented with jqx. Use another datepicker here
  - Psc.UI.DateTimePicker is implemented with jqx.
  - Psc.UI.jqx.GridTableEditor uses jqx (is this used in production?)
  - Psc.UI.I18nWrapper uses jqx.Tabs
  - Psc.UI.PagesMenu uses jqx.DataAdapter, jqx.Menu

Widgets found so far: jqx.Tabs, jqx.DateTimeInput, jqx.DataAdapter, jqx.Menu