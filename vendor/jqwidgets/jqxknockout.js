/*
jQWidgets v2.4.2 (2012-Sep-12)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($, ko) {
    ko.jqwidgets = ko.jqwidgets || {};

    ko.jqwidgets.Knockout = function (settings) {
        var me = this;
        var binding = {},
        name = settings.name;
        var updating = false;
        var updatingFromObservable = false;

        binding.init = function (element, valueAccessor, allBindingAccessor, viewModel) {
            var unwrappedValue = ko.utils.unwrapObservable(valueAccessor());
            var modelOptions = ko.toJS(unwrappedValue);
            widget = $.data(element)[name].instance;

            if (settings.events) {
                $.each(settings.events, function () {
                    var eventName = this;
                    $(element).bind(eventName + '.' + element.id, function (event) {
                        if (!updatingFromObservable) {
                            updating = true;
                            var val = valueAccessor();
                            var property = settings.getProperty(widget, event, eventName);
                            if (val.value && $.isFunction(val.value)) {
                                val.value(property.value);
                            }
                            else if (val.value) {
                                valueAccessor(property.value);
                            }

                            updating = false;
                        }
                    });
                });
            }
        };

        binding.update = function (element, valueAccessor, allBindingAccessor, viewModel) {
            var unwrappedValue = ko.utils.unwrapObservable(valueAccessor());
            var modelOptions = ko.toJS(unwrappedValue);
            widget = $.data(element)[name].instance;
            if (updating)
                return;

            $.each(settings, function (name, value) {
                if (widget[name] && modelOptions[name]) {
                    if (!updating) {
                        updatingFromObservable = true;
                        settings.setProperty(widget, name, widget[name], modelOptions[name]);
                        updatingFromObservable = false;
                    }
                }
            });
        };

        ko.bindingHandlers[settings.name] = binding;
    };

    // jqxDateTimeInput
    ko.jqwidgets.Knockout = new ko.jqwidgets.Knockout({
        name: "jqxDateTimeInput",
        value: null,
        events: ['valuechanged'],
        getProperty: function (object, event, eventName) {
            if (eventName == 'valuechanged') {
                return { name: "value", value: event.args.date };
            }
        },
        setProperty: function (object, key, value, newValue) {
            if (key == 'value') {
                object.setDate(newValue);
            }
        }
    });

    // jqxNumberInput
    ko.jqwidgets.Knockout = new ko.jqwidgets.Knockout({
        name: "jqxNumberInput",
        value: null,
        events: ['valuechanged'],
        getProperty: function (object, event, eventName) {
            if (eventName == 'valuechanged') {
                return { name: "value", value: object.val() };
            }
        },
        setProperty: function (object, key, value, newValue) {
            if (key == 'value') {
                object.val(newValue);
            }
        }
    });

} (jQuery, ko));