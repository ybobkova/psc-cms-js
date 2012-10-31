/*
jQWidgets v2.4.2 (2012-Sep-12)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/

/*
* jqxtooltip.js
*
* This source is property of jqwidgets and/or its partners and is subject to jqwidgets Source Code License agreement and jqwidgets EULA.
* Copyright (c) 2011 jqwidgets.
* <Licensing info>
* 
* http://www.jQWidgets.com
*
*/
/*
* Depends:
*   jqxcore.js*/
(function ($) {

    $.jqx.jqxWidget("jqxTooltip", "", {});

    $.extend($.jqx._jqxTooltip.prototype, {
        defineInstance: function () {
            // Type: String
            // Default: 'Header'
            // Tooltip header.
            this.header = "Header";
            // Type: String
            // Default: jqxTooltip
            // Tooltip content.
            this.content = "jqxTooltip";
            //Type: Number
            if (this.width == undefined) {
                this.width = null;
            }

            //Type: Number
            if (this.height == undefined) {
                this.height = null;
            }
            //Type: String.
            //Default: "bottom-right".
            //Possible values: "top", "left", "bottom", "right", "bottom-right", "top-right", "top-left", "absolute", "relative"
            this.location = "bottom-right",
            // Type: Number
            // Default: 0
            // Gets or sets the horizontal offset of the tooltip when the location is set to 'absolute' or 'relative.
            this.horizontalOffset = 0;
            // Type: Number
            // Default: 0
            // Gets or sets the vertical offset of the tooltip when the location is set to 'absolute' or 'relative.
            this.verticalOffset = 0;
            // Type: Bool.
            // Default true.
            // Gets or sets whether the fade animation is enabled.  
            this.enableAnimation = true;
            // Type: Number
            // Default: 450
            // Gets or sets the delay of the fade animation when the tooltip is going to be opened.
            this.animationShowDuration = 450,
            // Type: Number
            // Default: 250
            // Gets or sets the delay of the fade animation when the tooltip is going to be hidden.
            this.animationHideDuration = 250,
            // Type: Number
            // Default: 4000
            // Gets or sets the delay of the fade animation when the tooltip is going to be closed. 
            this.animationHideDelay = 4000,
            // Type: Number
            // Default: 100
            // Gets or sets the initial delay before showing the tooltip
            this.animationShowDelay = 100,
            // Type: Bool
            // Default: false
            // Gets or sets whether to display html inside the tooltip
            this.showHtml = false;
            // Type: Bool
            // Default: false
            // Gets or sets whether the tooltip will always stay opened until the close method is called.
            this.staysOpen = false;
            // Type: Bool
            // Default: false
            // Gets whether the tooltip is opened.           
            this.isOpen = false;
            // Type: Bool
            // Defualt: false
            // Gets whether the tooltip is opened.
            this.disabled = false;

            // Represents Tooltip events:
            this.events =
			[
			    'shown', 'closed'
            ];
        },

        createInstance: function (args) {
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

            this.elements = new Array();
            this.index = 0;
        },

        destroy: function () {
            this.host
			.removeClass("jqx-tooltip jqx-rc-all");
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            args = arg;
            args.owner = this;
            if (id == 0) {
                this.isOpen = true;
            }
            if (id == 1) {
                this.isOpen = false;
            }
            var event = new jQuery.Event(evt);
            event.owner = this;
            var result = this.host.trigger(event);
            return result;
        },

        // closes all opened tooltips
        close: function (element) {
            var self = this;
            if (element == undefined || element == null) {
                $.each(this.elements, function () {
                    var tooltip = $.data(this.element[0], 'Tooltip');
                    if (tooltip == undefined) {
                        tooltip = $.data(self, 'Tooltip');
                    }

                    if (tooltip != null) {
                        if (self.enableAnimation) {
                            tooltip.stop().fadeOut(this.animationHideDuration, function () { $(this).remove(); });
                        } else {
                            tooltip.remove();
                        }
                        self._raiseEvent(1);
                        $.data(this, 'Tooltip', null);
                    }
                });
            }
            else {
                var tooltip = $.data(element, 'Tooltip');
                if (tooltip == undefined) {
                    tooltip = $.data(this, 'Tooltip');
                }

                if (tooltip == undefined && element != null) {
                    tooltip = $(document.body).find('#' + 'Tooltip' + element.id);
                }

                if (tooltip != null) {
                    if (this.enableAnimation) {
                        tooltip.stop().fadeOut(this.animationHideDuration, function () { $(this).remove(); });
                    } else {
                        tooltip.remove();
                    }

                    this._raiseEvent(1);
                    $.data(element, 'Tooltip', null);
                }
            }
        },

        // opens a tooltip.
        open: function () {
            var args = Array.prototype.slice.call(arguments, 0);
            var element = null;

            if (args.length > 0) {
                element = $(args[0]);
            }
            else return;

            var content = "Tooltip";
            if (args.length > 1) {
                content = args[1];
            }

            var top = 0;
            var left = 0;

            if (args.length > 2) {
                top = args[2];
            }

            if (args.length > 3) {
                left = args[3];
            }

            var canOpen = false;

            for (loopIndex = 0; loopIndex < this.elements.length; loopIndex++) {
                if (this.elements[loopIndex].element[0] == element[0]) {
                    canOpen = true;
                    break;
                }
            }

            var newElement = { element: element, header: "", content: content };

            var tooltip = $.data(element[0], "Tooltip");
            if (!tooltip) {
                tooltip = $('<div><table><tr><td/></tr></table></div>');
                $(tooltip.find('table')[0]).addClass(this.toThemeProperty('jqx-tooltip-table'));
                $(tooltip.find('td')[0]).addClass(this.toThemeProperty('jqx-tooltip-content'));
                $(tooltip.find('td')[0]).addClass(this.toThemeProperty('jqx-fill-state-normal'));

                tooltip.css({ position: 'absolute', zIndex: 100000 });
                tooltip[0].id = 'Tooltip' + element[0].id;
                $.data(element[0], 'Tooltip', tooltip);
                $.data(document.body, 'jqxOpenedTooltip', tooltip);
            }

            tooltip.remove().css({ top: 0, left: 0, visibility: 'hidden', display: 'block' }).appendTo(document.body);
            tooltip.find('.' + this.toThemeProperty('jqx-tooltip-content', true))[this.showHtml ? 'html' : 'text'](content);

            var currentPosition = element.offset();
            var scrollTop = $(window).scrollTop();
            var scrollLeft = $(window).scrollLeft();
            var isSafari = $.jqx.mobile.isSafariMobileBrowser();
            if (isSafari) {
                currentPosition = { left: currentPosition.left - scrollLeft, top: currentPosition.top - scrollTop };
            }
            var tooltipWidth = parseInt(tooltip[0].offsetWidth);
            var tooltipHeight = parseInt(tooltip[0].offsetHeight);
            var elementWidth = parseInt(element[0].offsetWidth);
            var elementHeight = parseInt(element[0].offsetHeight);

            var toolTipPosition = { position: currentPosition, width: tooltipWidth, heigth: tooltipHeight, elementWidth: elementWidth, elementHeight: elementHeight };
            $.data(element[0], 'TooltipBounds', toolTipPosition);

            switch (this.location) {
                case "bottom-right":
                    tooltip.css({ top: currentPosition.top + elementHeight, left: currentPosition.left + elementWidth });
                    break;
                case "bottom":
                    tooltip.css({ top: currentPosition.top + elementHeight, left: currentPosition.left + elementWidth / 2 - tooltipWidth / 2 });
                    break;
                case "top":
                    tooltip.css({ top: currentPosition.top - tooltipHeight, left: currentPosition.left + elementWidth / 2 - tooltipWidth / 2 });
                    break;
                case "bottom-left":
                    tooltip.css({ top: currentPosition.top + elementHeight, left: currentPosition.left - tooltipWidth });
                    break;
                case "top-left":
                    tooltip.css({ top: currentPosition.top - tooltipHeight, left: currentPosition.left - tooltipWidth });
                    break;
                case "top-right":
                    tooltip.css({ top: currentPosition.top - tooltipHeight, left: currentPosition.left + elementWidth });
                    break;
                case "right":
                    tooltip.css({ top: currentPosition.top + elementHeight / 2 - tooltipHeight / 2, left: currentPosition.left + elementWidth });
                    break;
                case "left":
                    tooltip.css({ top: currentPosition.top + elementHeight / 2 - tooltipHeight / 2, left: currentPosition.left - tooltipWidth });
                    break;
                case "absolute":
                    tooltip.css({ top: parseInt(this.verticalOffset), left: parseInt(this.horizontalOffset) });
                    break;
                case "relative":
                    tooltip.css({ top: parseInt(this.verticalOffset) + parseInt(currentPosition.top), left: parseInt(this.horizontalOffset) + parseInt(currentPosition.left) });
                    break;
            }

            if (this.enableAnimation) {
                tooltip.css({ opacity: 0, display: 'block', visibility: 'visible' }).animate({ opacity: 1.0 }, this.animationShowDuration);
            }
            else {
                tooltip.css({ visibility: 'visible' });
            }

            var self = this;
            setTimeout(function () {
                if (tooltip == undefined || tooltip == null) {
                    var tooltip = $.data(element[0], 'Tooltip');
                    if (tooltip == undefined) {
                        tooltip = $.data(document.body, 'jqxOpenedTooltip');
                    }
                }

                if (tooltip != undefined && !self.staysOpen) {
                    if (self.enableAnimation) {
                        tooltip.stop().fadeOut(self.animationHideDuration, function () {
                            $(this).remove();
                        });
                    } else {
                        tooltip.remove();
                    }
                    self._raiseEvent(1);
                }
                else self.close();
            }, self.animationHideDelay);

            this._raiseEvent(0);
        },

        // adds a tooltip to an element.
        add: function (element, content, header) {
            if (element == null || element == undefined)
                return;

            var self = this;
            if (element[0] == undefined) {
                element = $(element);
            }

            var alreadyAdded = false;
            if (element[0] != null) {
                $.each(this.elements, function () {
                    if (this.element[0] == element[0]) {
                        alreadyAdded = true;
                        return false;
                    }
                });
            }

            if (alreadyAdded)
                return;

            var newElement = { element: element, header: header, content: content, canDisplay: true, index: this.index, timer: null };
            this.elements[this.index] = newElement;
            this.timer = null;

            var element = this.elements[this.index];
            this.index++;

            this.isTouchDevice = $.jqx.mobile.isTouchDevice();
            if (this.isTouchDevice) {
                $(element.element).bind('click', function () {
                    var tooltip = $.data(element.element[0], 'Tooltip');
                    if (tooltip != undefined) {
                        self.close(element.element[0]);
                    }
                    else self._open(self, element);
                });
                return;
            }

            $(element.element).bind('mouseleave', function () {
                self._close(self, element);

            });

            $(element.element).bind('mouseenter', function (event) {
                self._open(self, element);
            });
        },

        _close: function (self, element) {
            if (element.timer != null) {
                window.clearTimeout(element.timer);
            }

            var tooltip = $.data(element.element[0], 'Tooltip');

            if (tooltip != undefined && !self.staysOpen) {
                element.canDisplay = false;
                if (this.enableAnimation) {
                    tooltip.stop().fadeOut(this.animationHideDuration, function () { $(this).remove(); });
                } else {
                    tooltip.remove();
                }
                element.canDisplay = true;
                $(element.element).stop(true, true)
                self._raiseEvent(1);
            }
        },

        _open: function (self, element) {
            if (element.timer != null) {
                window.clearTimeout(element.timer);
            }

            element.timer = window.setTimeout(function () {

                var hasHeaderAndContent = element.header != undefined && element.content != undefined && element.header != null && element.content != null && element.header.length > 0 && element.content.length > 0;
                var me = this;

                var tooltip = $.data(element.element[0], "Tooltip");

                if (self.disabled) {
                    return false;
                }

                if (!element.canDisplay) {
                    return false;
                }

                if (tooltip != null && self.staysOpen) {
                    return false;
                }

                if (!tooltip) {
                    if (hasHeaderAndContent) {
                        tooltip = $('<div><table><tr><td/></tr><tr><td/></tr></table></div>');
                    }
                    else tooltip = $('<div><table><tr><td/></tr></table></div>');

                    if (tooltip.find('td').length > 1) {
                        $(tooltip.find('td')[0]).addClass(self.toThemeProperty('jqx-tooltip-header'));
                        $(tooltip.find('td')[1]).addClass(self.toThemeProperty('jqx-tooltip-content'));
                        $(tooltip.find('td')[0]).addClass(self.toThemeProperty('jqx-fill-state-normal'));
                        $(tooltip.find('td')[1]).addClass(self.toThemeProperty('jqx-fill-state-normal'));
                    }
                    else if (tooltip.find('td').length > 0) {
                        $(tooltip.find('td')[0]).addClass(self.toThemeProperty('jqx-tooltip-content'));
                        $(tooltip.find('td')[0]).addClass(self.toThemeProperty('jqx-fill-state-normal'));
                    }

                    $(tooltip.find('table')[0]).addClass(self.toThemeProperty('jqx-tooltip-table'));
                    $(tooltip.find('table')[0]).addClass(self.toThemeProperty('jqx-rc-all'));
                    $(tooltip.find('table')[0]).addClass(self.toThemeProperty('jqx-widget'));

                    tooltip.css({ position: 'absolute', zIndex: 100000 });
                    $.data(element.element[0], 'Tooltip', tooltip);
                }

                tooltip.remove().css({ top: 0, left: 0, visibility: 'hidden', display: 'block' }).appendTo(document.body);

                if (hasHeaderAndContent) {
                    tooltip.find('.' + self.toThemeProperty('jqx-tooltip-header', true))[self.showHtml ? 'html' : 'text'](element.header);
                }

                tooltip.find('.' + self.toThemeProperty('jqx-tooltip-content', true))[self.showHtml ? 'html' : 'text'](element.content);

                var currentPosition = element.element.offset();
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                var isSafari = $.jqx.mobile.isSafariMobileBrowser();
                if (isSafari) {
                    currentPosition = { left: currentPosition.left - scrollLeft, top: currentPosition.top - scrollTop };
                }

                var tooltipWidth = parseInt(tooltip[0].offsetWidth);
                var tooltipHeight = parseInt(tooltip[0].offsetHeight);
                var elementWidth = parseInt(element.element[0].offsetWidth);
                var elementHeight = parseInt(element.element[0].offsetHeight);

                var toolTipPosition = { position: currentPosition, width: tooltipWidth, heigth: tooltipHeight, elementWidth: elementWidth, elementHeight: elementHeight };
                $.data(element.element[0], 'TooltipBounds', toolTipPosition);

                switch (self.location) {
                    case "bottom-right":
                        tooltip.css({ top: currentPosition.top + elementHeight, left: currentPosition.left + elementWidth });
                        break;
                    case "bottom":
                        tooltip.css({ top: currentPosition.top + elementHeight, left: currentPosition.left + elementWidth / 2 - tooltipWidth / 2 });
                        break;
                    case "top":
                        tooltip.css({ top: currentPosition.top - tooltipHeight, left: currentPosition.left + elementWidth / 2 - tooltipWidth / 2 });
                        break;
                    case "bottom-left":
                        tooltip.css({ top: currentPosition.top + elementHeight, left: currentPosition.left - tooltipWidth });
                        break;
                    case "top-left":
                        tooltip.css({ top: currentPosition.top - tooltipHeight, left: currentPosition.left - tooltipWidth });
                        break;
                    case "top-right":
                        tooltip.css({ top: currentPosition.top - tooltipHeight, left: currentPosition.left + elementWidth });
                        break;
                    case "right":
                        tooltip.css({ top: currentPosition.top + elementHeight / 2 - tooltipHeight / 2, left: currentPosition.left + elementWidth });
                        break;
                    case "left":
                        tooltip.css({ top: currentPosition.top + elementHeight / 2 - tooltipHeight / 2, left: currentPosition.left - tooltipWidth });
                        break;
                    case "absolute":
                        tooltip.css({ top: parseInt(self.verticalOffset), left: parseInt(self.horizontalOffset) });
                        break;
                    case "relative":
                        tooltip.css({ top: parseInt(self.verticalOffset) + parseInt(currentPosition.top), left: parseInt(self.horizontalOffset) + parseInt(currentPosition.left) });
                        break;
                }

                $.each(self.elements, function () {
                    if (this.element[0] != element.element[0]) {
                        var myTooltip = $.data(this.element[0], "Tooltip");
                        if (myTooltip != null) {
                            myTooltip.remove();
                        }
                    }
                });

                if (self.enableAnimation) {
                    tooltip.css({ opacity: 0, display: 'block', visibility: 'visible' }).animate({ opacity: 1.0 }, self.animationShowDuration);
                }
                else {
                    tooltip.css({ visibility: 'visible' });
                }

                setTimeout(function () {
                    var tooltip = $.data(element.element[0], 'Tooltip');

                    if (tooltip != undefined && !self.staysOpen) {
                        if (self.enableAnimation) {
                            tooltip.stop().fadeOut(self.animationHideDuration, function () {
                                $(this).remove();
                            });
                        } else {
                            tooltip.remove();
                        }
                        self._raiseEvent(1);
                    }
                }, self.animationHideDelay);

                self._raiseEvent(0);

            }, self.animationShowDelay)
        },

        hasTooltip: function (element) {
            var found = false;
            $.each(this.elements, function () {
                var currentElement = this;
                if (currentElement.element[0] == element[0]) {
                    found = true;
                    return false;
                }
            });

            return found;
        },

        // removes a tooltip.
        remove: function (element) {
            if (element == undefined || element == null)
                return;

            if (element[0] == undefined) {
                element = $(element);
            }

            this.close();
            var self = this;
            var index = 0;
            var found = false;
            $.each(this.elements, function () {
                var currentElement = this;
                if (currentElement.element[0] == element[0]) {
                    $.data(currentElement.element[0], "Tooltip", null);
                    found = true;
                    return false;
                }
                index++;
            });

            if (found) {
                this.elements.splice(index, 1);
                this.index--;
            }

            if (element.element != null) {
                if (element.element[0] != null) {
                    var tooltip = $.data(element.element[0], "Tooltip");
                }

                $(element.element).unbind('mouseenter');
                $(element.element).unbind('mouseleave');
            }
            else {
                element.unbind('mouseenter');
                element.unbind('mouseleave');
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

        }
    });
})(jQuery);
