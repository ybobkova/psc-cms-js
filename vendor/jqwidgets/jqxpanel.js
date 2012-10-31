/*
jQWidgets v2.4.2 (2012-Sep-12)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/

/*
* jqxpanel.js
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
*   jqxcore.js
    jqxscrollbar.js
    jqxbuttons.js
*/


(function ($) {

    $.jqx.jqxWidget("jqxPanel", "", {});

    $.extend($.jqx._jqxPanel.prototype, {

        defineInstance: function () {
            //Type: String.
            //Default: null.
            //Sets the panel width.
            this.width = null;
            //Type: String.
            //Default: null.
            //Sets the panel height.
            this.height = null;
            // gets or sets whether the panel is disabled.
            this.disabled = false;
            // Type: Number
            // Default: 15
            // gets or sets the scrollbars size.
            this.scrollBarSize = 15;
            // Type: String
            // Default: 'fixed'
            // Sets the sizing mode. In the 'fixed' mode, the panel displays scrollbars, if its content requires it. 
            // In the wrap mode, the scrollbars are not displayed and the panel automatically changes its size.
            // Possible Values: 'fixed', 'wrap'
            this.sizeMode = 'fixed';
            // Type: Boolean
            // Default: false
            // Automatically updates the panel, if its children size is changed.
            this.autoUpdate = false;
            // Type: Number
            // Default: 500
            // Gets or sets the autoUpdate interval.
            this.autoUpdateInterval = 500;
            this.touchMode = 'auto';
            this.horizontalScrollBarMax = null;
            this.verticalScrollBarMax = null;
            this.touchModeStyle = 'auto';
            // jqxPanel events.
            this.events =
			[
            // occurs when the layout is performed.
		  	   'layout',
     		];
        },

        // creates a new jqxPanel instance.
        createInstance: function (args) {
            var self = this;
            this.host
			.addClass(this.toThemeProperty("jqx-panel"));
            this.host
			.addClass(this.toThemeProperty("jqx-widget"));
            this.host
			.addClass(this.toThemeProperty("jqx-widget-content"));
            this.host
            .addClass(this.toThemeProperty("jqx-rc-all"));

            var panelStructure = $("<div tabIndex=0 style='background-color: transparent; -webkit-appearance: none; outline: none; width:100%; height: 100%; align:left; border: 0px; padding: 0px; margin: 0px; left: 0px; top: 0px; valign:top; position: relative;'>" +
                "<div id='panelWrapper' tabIndex=0 style='background-color: transparent; -webkit-appearance: none; outline: none; width:100%; overflow: hidden; height: 100%; padding: 0px; margin: 0px; align:left; left: 0px; top: 0px; valign:top; position: relative;'>" +
                "<div id='panelContent' tabIndex=0 style='-webkit-appearance: none; outline: none; border: none; padding: 0px; margin: 0px; align:left; valign:top; left: 0px; top: 0px; position: absolute;'/>" +
                "<div id='verticalScrollBar' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'/>" +
                "<div id='horizontalScrollBar' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'/>" +
                "<div id='bottomRight' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'/>" +
                "</div>" +
                "</div>");

            var hostHeight = this.host.css('height');
            var hostWidth = this.host.css('width');

            if (this.width == null) this.width = hostWidth;
            if (this.height == null) this.height = hostHeight;

            this.host.wrapInner(panelStructure);
            var verticalScrollBar = this.host.find("#verticalScrollBar");
            verticalScrollBar[0].id = this.element.id + 'verticalScrollBar';

            this.vScrollBar = verticalScrollBar.jqxScrollBar({ 'vertical': true, touchMode: this.touchMode, theme: this.theme });
            var horizontalScrollBar = this.host.find("#horizontalScrollBar");
            horizontalScrollBar[0].id = this.element.id + 'horizontalScrollBar';
            this.hScrollBar = horizontalScrollBar.jqxScrollBar({ 'vertical': false, touchMode: this.touchMode, theme: this.theme });
            this.wrapper = this.host.find("#panelWrapper");
            this.wrapper[0].id = this.wrapper[0].id + this.element.id;
            this.content = this.host.find("#panelContent");
            this.content.addClass(this.toThemeProperty('jqx-widget-content'));
            if ($.browser.msie) {
                //  this.content.css('width', '110%');
            }
            this.content[0].id = this.content[0].id + this.element.id;
            this.bottomRight = this.host.find("#bottomRight").addClass(this.toThemeProperty('jqx-panel-bottomright'));
            this.bottomRight[0].id = 'bottomRight' + this.element.id;

            this.vScrollBar.css('visibility', 'visible');
            this.hScrollBar.css('visibility', 'visible');
            this.vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
            this.hScrollInstance = $.data(this.hScrollBar[0], 'jqxScrollBar').instance;

            var me = this;
            this.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                me.vScrollBar.jqxScrollBar({ disabled: me.disabled });
                me.hScrollBar.jqxScrollBar({ disabled: me.disabled });
            };

            this.vScrollBar.jqxScrollBar({ disabled: this.disabled });
            this.hScrollBar.jqxScrollBar({ disabled: this.disabled });

            this._addHandlers();
            this._arrange();

            $(window).resize(function () {
                self._arrange();
            });

            this.contentWidth = me.content[0].scrollWidth;
            this.contentHeight = me.content[0].scrollHeight;

            if (this.autoUpdate) {
                me._autoUpdate();
            }

            this.propertyChangeMap['autoUpdate'] = function (instance, key, oldVal, value) {
                if (me.autoUpdate) {
                    me._autoUpdate();
                }
                else {
                    clearInterval(me.autoUpdateId);
                    me.autoUpdateId = null;
                }
            }

            // unload
            $(window).bind('unload', function () {
                if (me.autoUpdateId != null) {
                    clearInterval(me.autoUpdateId);
                    me.autoUpdateId = null;
                    me.destroy();
                }
            });

            this._updateTouchScrolling();
        },

        _updateTouchScrolling: function () {
            var self = this;
            if (this.touchMode == true) {
                $.jqx.mobile.setMobileSimulator(this.element);
            }

            var isTouchDevice = this.isTouchDevice();
            if (isTouchDevice) {
                $.jqx.mobile.touchScroll(this.element, self.vScrollInstance.max, function (left, top) {
                    if (self.vScrollBar.css('visibility') == 'visible') {
                        var oldValue = self.vScrollInstance.value;
                        self.vScrollInstance.setPosition(oldValue + top);
                    }
                    if (self.hScrollBar.css('visibility') == 'visible') {
                        var oldValue = self.hScrollInstance.value;
                        self.hScrollInstance.setPosition(oldValue + left);
                    }
                }, this.element.id);
            }

            this.vScrollBar.jqxScrollBar({ touchMode: this.touchMode });
            this.hScrollBar.jqxScrollBar({ touchMode: this.touchMode });
        },

        isTouchDevice: function () {
            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            if (this.touchMode == true) {
                isTouchDevice = true;
            }
            else if (this.touchMode == false) {
                isTouchDevice = false;
            }
            if (isTouchDevice && this.touchModeStyle != false) {
                this.scrollBarSize = 10;
            }
            return isTouchDevice;
        },

        // append element.
        // @param element
        append: function (element) {
            if (element != null) {
                this.content.append(element);
                this._arrange();
            }
        },

        // prepend element.
        // @param element
        prepend: function (element) {
            if (element != null) {
                this.content.prepend(element);
                this._arrange();
            }
        },

        // clears the content.
        clearcontent: function () {
            this.content.text('');
            this.content.children().remove();
            this._arrange();
        },

        // remove element.
        // @param element
        remove: function (element) {
            if (element != null) {
                $(element).remove();
                this._arrange();
            }
        },

        _autoUpdate: function () {
            var me = this;

            this.autoUpdateId = setInterval(function () {
                var newWidth = me.content[0].scrollWidth;
                var newHeight = me.content[0].scrollHeight;
                var doarrange = false;
                if (me.contentWidth != newWidth) {
                    me.contentWidth = newWidth;
                    doarrange = true;
                }

                if (me.contentHeight != newHeight) {
                    me.contentHeight = newHeight;
                    doarrange = true;
                }

                if (doarrange) {
                    me._arrange();
                }
            }, this.autoUpdateInterval);
        },

        _addHandlers: function () {
            var self = this;
            this.addHandler(this.vScrollBar, 'valuechanged', function (event) {
                self._render(self);
            });

            this.addHandler(this.hScrollBar, 'valuechanged', function (event) {
                self._render(self);
            });

            this.addHandler(this.host, 'mousewheel', function (event) {
                self.wheel(event, self);
            });

            this.addHandler(this.content, 'mouseleave', function (event) {
                self.focused = false;
            });

            this.addHandler(this.content, 'focus', function (event) {
                self.focused = true;
            });

            this.addHandler(this.content, 'blur', function (event) {
                self.focused = false;
            });

            this.addHandler(this.content, 'mouseenter', function (event) {
                self.focused = true;
            });
        },

        _removeHandlers: function () {
            var self = this;
            this.removeHandler(this.vScrollBar, 'valuechanged');
            this.removeHandler(this.hScrollBar, 'valuechanged');
            this.removeHandler(this.host, 'mousewheel');
            this.removeHandler(this.content, 'mouseleave');
            this.removeHandler(this.content, 'focus');
            this.removeHandler(this.content, 'blur');
            this.removeHandler(this.content, 'mouseenter');
        },

        // performs mouse wheel.
        wheel: function (event, self) {
            var delta = 0;
            // fix for IE8 and IE7
            if (event.originalEvent && $.browser.msie && event.originalEvent.wheelDelta) {
                delta = event.originalEvent.wheelDelta / 120;
            }

            if (!event) /* For IE. */
                event = window.event;
            if (event.wheelDelta) { /* IE/Opera. */
                delta = event.wheelDelta / 120;
            } else if (event.detail) { /** Mozilla case. */
                delta = -event.detail / 3;
            }

            if (delta) {
                var result = self._handleDelta(delta);

                if (!result) {
                    if (event.preventDefault)
                        event.preventDefault();
                }

                if (!result) {
                    return result;
                }
                else return false;
            }

            if (event.preventDefault)
                event.preventDefault();
            event.returnValue = false;
        },

        // scrolls down.
        scrollDown: function () {
            if (this.vScrollBar.css('visibility') == 'hidden')
                return false;

            var vScrollInstance = this.vScrollInstance;
            if (vScrollInstance.value + vScrollInstance.largestep <= vScrollInstance.max) {
                vScrollInstance.setPosition(vScrollInstance.value + vScrollInstance.largestep);
                return true;
            }
            else {
                if (vScrollInstance.value + vScrollInstance.largestep != vScrollInstance.max) {
                    vScrollInstance.setPosition(vScrollInstance.max);
                    return true;
                }
            }

            return false;
        },

        // scrolls up.
        scrollUp: function () {
            if (this.vScrollBar.css('visibility') == 'hidden')
                return false;

            var vScrollInstance = this.vScrollInstance;
            if (vScrollInstance.value - vScrollInstance.largestep >= vScrollInstance.min) {
                vScrollInstance.setPosition(vScrollInstance.value - vScrollInstance.largestep);
                return true;
            }
            else {
                if (vScrollInstance.value - vScrollInstance.largestep != vScrollInstance.min) {
                    vScrollInstance.setPosition(vScrollInstance.min);
                    return true;
                }
            }
            return false;
        },

        _handleDelta: function (delta) {
            if (this.focused) {
                var oldvalue = this.vScrollInstance.value;
                if (delta < 0) {
                    this.scrollDown();
                }
                else this.scrollUp();
                var newvalue = this.vScrollInstance.value;
                if (oldvalue != newvalue) {
                    return false;
                }
            }

            return true;
        },

        _render: function (self) {
            if (self == undefined) self = this;
            var vScroll = self.vScrollInstance.value;
            var hScroll = self.hScrollInstance.value;
            self.content.css({ left: -hScroll, top: -vScroll });
        },

        // Moves the scrollbars to a specific position.
        // @param left. Specifies the horizontal scrollbar position.
        // @param top. Specifies the vertical scrollbar position.
        scrollTo: function (left, top) {
            if (left == undefined || top == undefined)
                return;

            this.vScrollInstance.setPosition(top);
            this.hScrollInstance.setPosition(left);
        },

        // Gets scrollable height.
        getScrollHeight: function () {
            return this.vScrollInstance.max;
        },

        // Gets vertical scroll position.
        getVScrollPosition: function () {
            return this.vScrollInstance.value;
        },

        // Gets scrollable width.
        getScrollWidth: function () {
            return this.hScrollInstance.max;
        },

        // gets the horizontal scroll position.
        getHScrollPosition: function () {
            return this.hScrollInstance.value;
        },

        _arrange: function () {
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

            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                this.host.width(this.width);
            }
            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                this.host.height(this.height);
            }

            if (this.width != null && this.width.toString().indexOf("auto") != -1) {
                this.host.width(this.width);
            }
            if (this.height != null && this.height.toString().indexOf("auto") != -1) {
                this.host.height(this.height);
            }

            //            this.wrapper.css('overflow', 'auto');
            //            this.vScrollBar.css('display', 'none');
            //            this.hScrollBar.css('display', 'none');

            this.content.css('margin-right', '0px');
            var width = null;
            var height = null;

            if ($.browser.msie && $.browser.version < 10) {
                var contentLeft = parseInt(this.content.css('left'));
                this.content.css('left', 0);
            }
            var contentWidth = parseInt(this.content[0].scrollWidth);
            $.each(this.content.children(), function () {
                contentWidth = Math.max(contentWidth, $(this).outerWidth());
            });

            if ($.browser.msie && $.browser.version < 10) {
                this.content.css('left', contentLeft);
            }
            if (contentWidth < parseInt(this.host.width())) {
                contentWidth = parseInt(this.host.width());
            }

            var contentHeight = parseInt(this.content[0].scrollHeight);

            if (this.sizeMode == 'wrap') {
                this.host.width(contentWidth);
                this.host.height(contentHeight);
                this.vScrollBar.css('visibility', 'hidden');
                this.hScrollBar.css('visibility', 'hidden');
                return;
            }

            var scrollSizeAndOffset = 4 + parseInt(this.scrollBarSize);
            var vScrollMaximum = scrollSizeAndOffset + contentHeight - parseInt(this.host.height());
            var hScrollMaximum = scrollSizeAndOffset + contentWidth - parseInt(this.host.width());
            if (this.horizontalScrollBarMax != undefined) {
                hScrollMaximum = this.horizontalScrollBarMax;
            }
            if (this.verticalScrollBarMax != undefined) {
                vScrollMaximum = this.verticalScrollBarMax;
            }

            var voffset = 0;
            if (vScrollMaximum > scrollSizeAndOffset) {
                if (hScrollMaximum <= 0) {
                    vScrollMaximum = contentHeight - parseInt(this.host.height());
                }

                this.vScrollBar.jqxScrollBar({ 'max': vScrollMaximum });
                this.vScrollBar.css('visibility', 'visible');
            }
            else {
                this.vScrollBar.jqxScrollBar('setPosition', 0);
                this.vScrollBar.css('visibility', 'hidden');
            }
            if (hScrollMaximum > scrollSizeAndOffset + voffset) {
                if (vScrollMaximum <= 0 && this.horizontalScrollBarMax == undefined) {
                    hScrollMaximum = contentWidth - parseInt(this.host.width());
                }
                if ($.browser.msie && $.browser.version >= 8) {
                    if (hScrollMaximum - 10 <= scrollSizeAndOffset + voffset) {
                        this.hScrollBar.css('visibility', 'hidden');
                        this.hScrollBar.jqxScrollBar('setPosition', 0);
                    }
                    else {
                        this.hScrollBar.jqxScrollBar({ 'max': hScrollMaximum });
                        this.hScrollBar.css('visibility', 'visible');
                    }
                }
                else if ($.browser.msie && $.browser.version < 8) {
                    if (hScrollMaximum - 20 <= scrollSizeAndOffset + voffset) {
                        this.hScrollBar.css('visibility', 'hidden');
                        this.hScrollBar.jqxScrollBar('setPosition', 0);
                    }
                    else {
                        this.hScrollBar.jqxScrollBar({ 'max': hScrollMaximum });
                        this.hScrollBar.css('visibility', 'visible');
                    }
                }
                else {
                    this.hScrollBar.jqxScrollBar({ 'max': hScrollMaximum });
                    this.hScrollBar.css('visibility', 'visible');
                }
            }
            else {
                this.hScrollBar.css('visibility', 'hidden');
                this.hScrollBar.jqxScrollBar('setPosition', 0);
                if (this.vScrollBar.css('visibility') == 'visible') {
                    var me = this;
                    me.content.css('margin-right', scrollSizeAndOffset);
                    //          me.content.width(contentWidth - scrollSizeAndOffset);
                }
            }

            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                width = this.width;
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    width = this.width;
                };

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                height = this.height;
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                height = this.height;
            };

            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                width = this.host.width();
            }
            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                height = this.host.height();
            }


            var hostBorderSize = this.host.css('border-width');
            if (hostBorderSize == null) {
                hostBorderSize = 0;
            }

            if (width != null) {
                width = parseInt(width);
                this.host.width(this.width);
            }

            if (height != null) {
                height = parseInt(height);
                this.host.height(this.height);
            }

            // scrollbar Size.
            var scrollSize = this.scrollBarSize;
            if (isNaN(scrollSize)) {
                scrollSize = parseInt(scrollSize);
                if (isNaN(scrollSize)) {
                    scrollSize = '17px';
                }
                else scrollSize = scrollSize + 'px';
            }

            scrollSize = parseInt(scrollSize);
            var scrollOffset = 4;
            var bottomSizeOffset = 2;
            var rightSizeOffset = 0;
            // right scroll offset. 
            if (this.vScrollBar.css('visibility') == 'visible') {
                rightSizeOffset = scrollSize + scrollOffset;
            }

            // bottom scroll offset.
            if (this.hScrollBar.css('visibility') == 'visible') {
                bottomSizeOffset = scrollSize + scrollOffset;
            }

            this.hScrollBar.height(scrollSize);
            this.hScrollBar.css({ top: height - scrollOffset - scrollSize + 'px', left: '0px' });
            this.hScrollBar.width(width - scrollSize - scrollOffset + 'px');

            if (rightSizeOffset == 0) {
                this.hScrollBar.width(width - 2);
            }

            if (this.vScrollBar.css('visibility') != 'hidden') {
                this.vScrollBar.width(scrollSize);
            }
            else this.vScrollBar.width(0);

            this.vScrollBar.height(parseInt(height) - bottomSizeOffset + 'px');
            this.vScrollBar.css({ left: parseInt(width) - parseInt(scrollSize) - scrollOffset + 'px', top: '0px' });
            var vScrollInstance = this.vScrollInstance;
            vScrollInstance.disabled = this.disabled;
            vScrollInstance.refresh();

            var hScrollInstance = this.hScrollInstance;
            hScrollInstance.disabled = this.disabled;
            hScrollInstance.refresh();

            if ((this.vScrollBar.css('visibility') == 'visible') && (this.hScrollBar.css('visibility') == 'visible')) {
                this.bottomRight.css('visibility', 'visible');
                this.bottomRight.css({ left: 1 + parseInt(this.vScrollBar.css('left')), top: 1 + parseInt(this.hScrollBar.css('top')) });
                this.bottomRight.width(parseInt(scrollSize) + 3);
                this.bottomRight.height(parseInt(scrollSize) + 3);
            }
            else this.bottomRight.css('visibility', 'hidden');

            this._raiseevent(0);
            var self = this;

            if (this.sizeMode == 'horizontalwrap') {
                this.host.width(contentWidth);
                this.vScrollBar.css({ left: this.host.width() - parseInt(scrollSize) - scrollOffset + 'px', top: '0px' });
                this.hScrollBar.css('visibility', 'hidden');
            }
            else if (this.sizeMode == 'verticalwrap') {
                this.host.height(contentHeight);
                if (this.hScrollBar.css('visibility') == 'visible') {
                    contentHeight += 20;
                    this.host.height(contentHeight);
                }
                this.hScrollBar.css({ top: contentHeight - scrollOffset - scrollSize + 'px', left: '0px' });
                this.vScrollBar.css('visibility', 'hidden');
            }
            if (this.sizeMode == 'overflowy') {
                this.hScrollBar.css('visibility', 'hidden');
                this.content.width(this.host.width() - rightSizeOffset);
            }
        },

        destroy: function () {
            this._removeHandlers();
            $(window).unbind('unload');
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

        beginUpdateLayout: function () {
            this.updating = true;
        },

        resumeUpdateLayout: function () {
            this.updating = false;
            this.vScrollInstance.value = 0;
            this.hScrollInstance.value = 0;
            this._arrange();
            this._render();
        },

        propertyChangedHandler: function (object, key, oldValue, value) {
            if (!object.isInitialized)
                return;

            if (!object.updating) {
                if (key == 'scrollBarSize' || key == 'width' || key == 'height') {
                    object._arrange();
                }
            }
            if (key == 'touchMode') {
                if (value != 'auto') {
                    object._updateTouchScrolling();
                }
            }
            if (key == 'theme') {
                object.host.removeClass();
                object.host.addClass(this.toThemeProperty("jqx-panel"));
                object.host.addClass(this.toThemeProperty("jqx-widget"));
                object.host.addClass(this.toThemeProperty("jqx-widget-content"));
                object.host.addClass(this.toThemeProperty("jqx-rc-all"));
                object.vScrollBar.jqxScrollBar({ theme: this.theme });
                object.hScrollBar.jqxScrollBar({ theme: this.theme });
                object.bottomRight.removeClass();
                object.bottomRight.addClass(this.toThemeProperty('jqx-panel-bottomright'));
                object.content.removeClass();
                object.content.addClass(this.toThemeProperty('jqx-widget-content'));
            }
        },

        refresh: function () {
        }
    });
})(jQuery);
