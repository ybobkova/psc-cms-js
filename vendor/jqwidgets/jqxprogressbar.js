/*
jQWidgets v2.5.5 (2012-Nov-28)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.jqx.jqxWidget("jqxProgressBar", "", {});

    $.extend($.jqx._jqxProgressBar.prototype, {

        defineInstance: function () {
            //Type: Number.
            //Default: 0.
            //Sets the progress value.
            this.value = 0;
            //Type: Number.
            //Default: null.
            //Sets the progress value.            
            this.oldValue = null;
            //Type: Number.
            //Default: 100.
            //Sets the progress max value.
            this.max = 100;
            //Type: Number.
            //Default: 0.
            //Sets the progress min value.
            this.min = 0;
            //Type: String.
            //Default: 'horizontal'.
            //Sets the orientation.
            this.orientation = 'horizontal';
            //Type: String.
            //Default: null.
            //Sets the progress bar width.
            this.width = null;
            //Type: String.
            //Default: null.
            //Sets the progress height width.
            this.height = null;
            //Type: Boolean.
            //Default: false.
            //Sets the visibility of the progress bar's text.
            this.showText = false;
            //Type: Number.
            //Default: 300
            //Sets the duration of the progress bar's animation.
            this.animationDuration = 300;
            // gets or sets whether the progress bar is disabled.
            this.disabled = false;
            // Progress Bar events.
            this.events =
			[
            // occurs when the value is changed.
		  	   'valuechanged',
            // occurs when the value is invalid.
               'invalidvalue',
            // occurs when the value becomes equal to the maximum value.
               'complete'
			];
        },

        // creates a new jqxProgressBar instance.
        createInstance: function (args) {

            var self = this;
            this.host
			.addClass(this.toThemeProperty("jqx-progressbar"));

            this.host
			.addClass(this.toThemeProperty("jqx-widget"));
            this.host
			.addClass(this.toThemeProperty("jqx-widget-content"));
            this.host
            .addClass(this.toThemeProperty("jqx-rc-all"));

            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    this.host.width(this.width);
                };

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.host.height(this.height);
            };

            this.valueDiv = $("<div></div>").appendTo(this.element);

            if (this.orientation == 'horizontal') {
                this.valueDiv.width(0);
                this.valueDiv.addClass(this.toThemeProperty("jqx-progressbar-value"));
            }
            else {
                this.valueDiv.height(0);
                this.valueDiv.addClass(this.toThemeProperty("jqx-progressbar-value-vertical"));
            }
            this.valueDiv.addClass(this.toThemeProperty("jqx-fill-state-pressed"));

            this.feedbackElementHost = $("<div style='width: 100%; height: 100%; position: relative;'></div>").appendTo(this.host);

            this.feedbackElement = $("<span class='text'></span>").appendTo(this.feedbackElementHost);
            this.feedbackElement.addClass(this.toThemeProperty('jqx-progressbar-text'));
            this.oldValue = this._value();
            this.refresh();

            $(window).resize(function () {
                self.refresh();
            });
        },

        destroy: function () {
            this.host.removeClass();
            this.valueDiv.removeClass();
            this.valueDiv.remove();
            this.feedbackElement.remove();
        },

        _raiseevent: function (id, oldValue, newValue) {
            if (this.isInitialized != undefined && this.isInitialized == true) {
                var evt = this.events[id];
                var event = new jQuery.Event(evt);
                event.previousValue = oldValue;
                event.currentValue = newValue;
                event.owner = this;
                var result = this.host.trigger(event);
                return result;
            }
        },

        // gets or sets the progress bar value.
        // @param Number. Represents the new value
        actualValue: function (newValue) {
            if (newValue === undefined) {
                return this._value();
            }

            $.jqx.setvalueraiseevent(this, 'value', newValue);

            return this._value();
        },

        propertyChangedHandler: function (object, key, oldValue, value) {
            if (!this.isInitialized)
                return;

            var widget = this;

            if (key == "min" && object.value < value) {
                object.value = value;
            }
            else if (key == "max" && object.value > value) {
                object.value = value;
            }

            if (key === "value" && widget.value != undefined) {
                widget.value = value;
                widget.oldValue = oldValue;

                if (value < widget.min || value > widget.max) {
                    widget._raiseevent(1, oldValue, value);
                }

                widget.refresh();
                if (widget._value() === widget.max) {
                    widget._raiseevent(2, oldValue, value);
                }
            }

            if (key == "renderText" || key == "orientation" || key == "showText" || key == "min" || key == "max") {
                widget.refresh();
            }
            else if (key == "width" && widget.width != undefined) {
                if (widget.width != undefined && !isNaN(widget.width)) {
                    widget.host.width(widget.width);
                    widget.refresh();
                }
            }
            else if (key == "height" && widget.height != undefined) {
                if (widget.height != undefined && !isNaN(widget.height)) {
                    widget.host.height(widget.height);
                    widget.refresh();
                }
            }
            if (key == "disabled") widget.refresh();
        },

        _value: function () {
            var val = this.value;
            // normalize invalid value
            if (typeof val !== "number") {
                var result = parseInt(val);
                if (isNaN(result)) {
                    val = 0;
                }
                else val = result;
            }
            return Math.min(this.max, Math.max(this.min, val));
        },

        _percentage: function () {
            return 100 * this._value() / this.max;
        },

        _textwidth: function (text) {
            var measureElement = $('<span>' + text + '</span>');
            $(this.host).append(measureElement);
            var width = measureElement.width();
            measureElement.remove();
            return width;
        },

        _textheight: function (text) {
            var measureElement = $('<span>' + text + '</span>');
            $(this.host).append(measureElement);
            var height = measureElement.height();
            measureElement.remove();
            return height;
        },

        refresh: function () {
            var value = this.actualValue();
            var percentage = this._percentage();

            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-progressbar-disabled'));
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                return;
            }
            else {
                this.host.removeClass(this.toThemeProperty('jqx-progressbar-disabled'));
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
                $(this.element.children[0]).show();
            }

            if (isNaN(value)) {
                return;
            }

            if (isNaN(percentage)) {
                return;
            }

            if (this.oldValue !== value) {
                this._raiseevent(0, this.oldValue, value);
                this.oldValue = value;
            }

            var height = this.host.outerHeight();
            var width = this.host.outerWidth();

            if (this.width != null) {
                width = parseInt(this.width);
            }
            if (this.height != null) {
                height = parseInt(this.height);
            }

            var halfWidth = parseInt(this.host.outerWidth()) / 2;
            var halfHeight = parseInt(this.host.outerHeight()) / 2;

            if (isNaN(percentage)) {
                percentage = 0;
            }
            var me = this;
            try {
                var valueElement = this.element.children[0];
                if (this.orientation == "horizontal") {
                    $(valueElement)
                    .toggle(value >= this.min)
                    $(valueElement).animate({ width: percentage.toFixed(0) + "%" }, this.animationDuration, function () {
                    });
                    this.feedbackElementHost.css('margin-top', -this.host.height());
                }
                else {
                    $(valueElement)
			        .toggle(value >= this.min)

                    this.feedbackElementHost.animate({ 'margin-top': -(percentage.toFixed(0) * me.host.height()) / 100 }, this.animationDuration, function () {
                    });
                    $(valueElement).animate({ height: percentage.toFixed(0) + "%" }, this.animationDuration, function () {
                        if (percentage.toFixed(0) == me.min) {
                            $(valueElement).hide();
                        }
                    });

                }
            }
            catch (ex) {
            }


            this.feedbackElement
			    .html(percentage.toFixed(0) + "%")
                .toggle(this.showText == true);
            if (this.renderText) {
                this.feedbackElement.html(this.renderText(percentage.toFixed(0) + "%"));
            }

            this.feedbackElement.css('position', 'absolute');
            this.feedbackElement.css('top', '50%');
            this.feedbackElement.css('left', '0');

            var textHeight = this.feedbackElement.height();
            var textWidth = this.feedbackElement.width();
            var centerWidth = Math.floor(halfWidth - (parseInt(textWidth) / 2));

            this.feedbackElement.css({ "left": (centerWidth), "margin-top": -parseInt(textHeight) / 2 + 'px' });
        }
    });
})(jQuery);
