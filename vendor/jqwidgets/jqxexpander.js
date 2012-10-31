/*
jQWidgets v2.4.2 (2012-Sep-12)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/

/*
* Depends:
*   jqxcore.js
*/
(function ($) {

    $.jqx.jqxWidget('jqxExpander', '', {});

    $.extend($.jqx._jqxExpander.prototype, {
        defineInstance: function () {
            // Type: Number
            // Default: 250
            // Gets or sets the expanding animation duration.
            this.expandAnimationDuration = 350,
            // Type: Number
            // Default: 250
            // Gets or sets the collapsing animation duration.
            this.collapseAnimationDuration = 400,
            // Type: Bool
            // Default: true;
            // Gets or sets expander's state (collapsed or expanded).
            this.expanded = true;
            // Type: Bool
            // Default: false
            // Gets or sets whether the expander is disabled.
            this.disabled = false;
            // Type: String
            // Default: slide
            // Gets or sets the animation type. Possible values ['slide', 'fade', 'none'].
            this.animationType = 'slide';
            // Type: String
            // Default: top
            // Gets or sets header's position. Possible values ['top', 'bottom']
            this.headerPosition = 'top';
            // Type: String
            // Default: click
            // Gets or sets user interaction used for expanding or collapsing the content. Possible values ['click', 'dblclick', 'mouseenter', 'none'].
            this.toggleMode = 'click';
            // Type: String
            // Default: right
            // Gets or sets header's arrow position. Possible values ['left', 'right'].
            this.arrowPosition = 'right';
            // Type: Bool
            // Default: true
            // Gets or sets whether header's arrow is going to be shown.
            this.showArrow = true;
            // Type: String
            // Default: auto
            // Gets or sets expander's height. Possible values - 'auto' and string like this 'Npx' where N is any Number.
            this.height = 'auto';
            // Type: String
            // Default: auto
            // Gets or sets expander's width. Possible values - 'auto' and string like this 'Npx' where N is any Number.
            this.width = 'auto';
            // Type: Object
            // Default: null
            // Gets or sets expander's content. Possible value is any object.
            this._content = null;
            // Type: Boolean
            // Default: true
            // Gets or sets whether the expander's hover state is enabled.            
            this.enableHover = true;
            // Type: String
            // Default: header
            // Gets or sets the toggle behavior of the expander. Possible values ['header', 'arrow']
            this.toggleBehaviour = 'header';


            this._header = null;
            this._triggerMethod = undefined;
            this._contentResizeMethod = undefined;
            this._firstSlideExpand = true;
            this._events =
			 [
			    'expanding', 'expanded', 'collapsing', 'collapsed'
             ];
            this._directions = {
                'left': 'right',
                'right': 'left',
                'top': 'bottom',
                'bottom': 'top'
            };
            // Messages for invalid argument exceptions.
            this._invalidArgumentExceptions = {
                'invalidExpandAnimationDuration': 'The duration of the expanding animation is invalid.',
                'invalidCollapseAnimationDuration': 'The duration of the collapsing animation is invalid.',
                'invalidAnimationType': 'The animation type is invalid.',
                'invalidHeaderPosition': 'The header position is invalid.',
                'invalidToggleMode': 'The toggle mode is invalid.',
                'invalidArrowPosition': 'The arrow position is invalid.',
                'invalidExpanderSize': 'This size is not valid.',
                'invalidExpanderStructure': 'Please add 2 sub div elements to your html that will represent the expander header and content.'
            };
        },

        //Creating new instance of the expander.
        //Getting some key parts of the expander (header, content).
        //Validating properties, renderering, performing layout, applying theme, adding event listeners.
        //Collapsing the expander if necessary (if expanded == false).
        createInstance: function (args) {
            this.host.addClass(this.toThemeProperty('jqx-widget'));
            this.host.addClass(this.toThemeProperty('jqx-expander'));
            this.host.css('visibility', 'hidden');
            this._header = this.host.children('.' + this.toThemeProperty('jqx-expander-header', true));
            this._content = this.host.children('.' + this.toThemeProperty('jqx-expander-content', true));
            this._setExpanderSize();

            var subDivs = this.host.children('div');
            if (subDivs.length > 0) {
                if (this._header.length == 0) {
                    this._header = $(subDivs[0]);
                    this._header.addClass(this.toThemeProperty('jqx-widget-header'));
                    this._header.addClass(this.toThemeProperty('jqx-expander-header'));
                }

                if (this._content.length == 0 && subDivs.length > 1) {
                    this._content = $(subDivs[1]);
                    this._content.addClass(this.toThemeProperty('jqx-widget-content'));
                    this._content.addClass(this.toThemeProperty('jqx-expander-content'));
                }
            }

            try {
                if (this._header == null || this._content == null) {
                    throw this._invalidArgumentExceptions['invalidExpanderStructure'];
                }
            } catch (exception) {
                alert(exception.Data);
            }

            this._createExpander();

            var me = this;

            if (this.expanded) {
                this._header.addClass(this.toThemeProperty('jqx-expander-header-expanded'));
                this._content.addClass(this.toThemeProperty('jqx-expander-content-expanded'));
                this._header.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
                var arrowDiv = this.host.find('.jqx-expander-arrow');
                arrowDiv.addClass(this.toThemeProperty('jqx-expander-arrow-expanded'));
            }

            this.host.css('visibility', 'visible');
        },

        // This method sets the jqxExpander width and height properties.
        _setExpanderSize: function () {
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
        },

        //Method used in create instance and property change hadler
        _createExpander: function () {
            var content = this._content[0];
            $.data(content, 'isAnimating', false);
            this._firstSlideExpand = true;

            this._validateProperties();
            this._render(true);
            this._applyTheme();
            this._performLayout();
            this._addEventHandlers();

            if (!this.expanded) {
                this._absoluteCollapse();
            }

            var self = this;
        },

        //Collapsing the expander so it's going to be ready for expanding with any animation.
        //For use only in the creation (or property change handler).
        //In the end of the method I'm setting display to none, because when using images there's
        //displacement along the loading proccess this display none is fixing it.
        _absoluteCollapse: function (self) {
            var self = self || this;
            if (self.animationType !== 'none') {
                self._content.css('visibility', 'hidden');
            }
            if (self.animationType === 'slide') {
                self._slideCollapse(0);
            } else if (self.animationType === 'fade') {
                self._fadeCollapse(0);
            } else if (self.animationType === 'none') {
                self._toggleCollapse();
            }
            if ((!self.height || self.height === 'auto') && self.animationType !== 'none') {
                self._content.height(0);
            }
            this._header.removeClass(this.toThemeProperty('jqx-expander-header-expanded'));
            this._content.removeClass(this.toThemeProperty('jqx-expander-content-expanded'));
            self._raiseEvent(3);
        },

        //Validating all properties of the expander and throwing an exception if there's invalid property.
        _validateProperties: function () {
            try {
                if (this.expandAnimationDuration <= 0) {
                    throw this._invalidArgumentExceptions['invalidExpandAnimationDuration'];
                }
                if (this.collapseAnimationDuration <= 0) {
                    throw this._invalidArgumentExceptions['invalidCollapseAnimationDuration'];
                }
                if ((parseInt(this.width) <= 0 || parseInt(this.height) <= 0) &&
                (this.width != 'auto' && this.height != 'auto' ||
                this.width != undefined && this.height != undefined)) {
                    throw this._invalidArgumentExceptions['invalidExpanderSize'];
                }
                if (this.animationType != 'slide' && this.animationType != 'fade' && this.animationType != 'none') {
                    throw this._invalidArgumentExceptions['invalidAnimationType'];
                }
                if (this.headerPosition != 'top' && this.headerPosition != 'bottom') {
                    throw this._invalidArgumentExceptions['invalidHeaderPosition'];
                }
                if (this.toggleMode != 'click' && this.toggleMode != 'none' &&
             this.toggleMode != 'dblclick' && this.toggleMode != 'mouseenter') {
                    throw this._invalidArgumentExceptions['invalidToggleMode'];
                }
                if (this.arrowPosition != 'left' && this.arrowPosition != 'right') {
                    throw this._invalidArgumentExceptions['invalidArrowPosition'];
                }
            } catch (exception) {
                alert(exception);
            }
        },

        //Attaching event listeners.
        _addEventHandlers: function (oldBehavior) {
            var self = this;
            var content = this._content;
            var headerArrow = this._header.children(this.toThemeProperty('.jqx-expander-arrow', true));

            if (this.toggleBehaviour != 'arrow') {
                this.removeHandler(this._header, 'click');
                this.removeHandler(this._header, 'dblclick');
                this.removeHandler(this._header, 'mouseover');
            }
            else {
                this.removeHandler(headerArrow, 'click');
                this.removeHandler(headerArrow, 'dblclick');
                this.removeHandler(headerArrow, 'mouseover');
            }

            if (oldBehavior != undefined && oldBehavior != this.toggleBehavior) {
                if (oldBehavior == 'arrow') {
                    this.removeHandler(headerArrow, 'click');
                    this.removeHandler(headerArrow, 'dblclick');
                    this.removeHandler(headerArrow, 'mouseover');
                }
                else {
                    this.removeHandler(this._header, 'click');
                    this.removeHandler(this._header, 'dblclick');
                    this.removeHandler(this._header, 'mouseover');
                }
            }
            this.removeHandler(this._header, 'mouseenter');
            this.removeHandler(this._header, 'mouseleave');
            this.removeHandler(this._header, 'mousedown');
            this.removeHandler(this._header, 'mouseup');
            this.removeHandler(this._header, 'selectstart');


            if (this._triggerMethod === undefined) {
                self._triggerMethod = function (event) {
                    self._expanderTrigger(self);
                    return false;
                };
            }
            var toggleElement = this.toggleBehaviour == 'arrow' ? headerArrow : this._header;
            this.addHandler(this._header, 'mousedown', function () {
                return false;
            });

            this.addHandler(this._header, 'mouseup', function () {
                return false;
            });

            this.addHandler(this._header, 'selectstart', function () {
                return false;
            });

            switch (this.toggleMode) {
                case 'click':
                    this.addHandler(toggleElement, 'click', this._triggerMethod);
                    this._header.removeClass(this.toThemeProperty('jqx-expander-header-toggle-none'));
                    break;
                case 'dblclick':
                    this.addHandler(toggleElement, 'dblclick', this._triggerMethod);
                    this._header.removeClass(this.toThemeProperty('jqx-expander-header-toggle-none'));
                    break;
                case 'mouseenter':
                    this.addHandler(toggleElement, 'mouseover', this._triggerMethod);
                    this._header.removeClass(this.toThemeProperty('jqx-expander-header-toggle-none'));
                    break;
                case 'none':
                    this._header.addClass(this.toThemeProperty('jqx-expander-header-toggle-none'));
                    break;

            }
            this.removeHandler($(window), 'resize.expander' + this.element.id);
            this.addHandler($(window), 'resize.expander' + this.element.id, function () {
                if ($.data(content, 'isAnimating') == false) {
                    self._performLayout();
                }
            });

            var isTouchDevice = $.jqx.mobile.isTouchDevice();

            this.addHandler(this._header, 'mouseenter', function () {
                if (!self.disabled && self.enableHover && !isTouchDevice) {
                    self._header.addClass(self.toThemeProperty('jqx-expander-header-hover'));
                    self._header.addClass(self.toThemeProperty('jqx-fill-state-hover'));
                }
            });
            this.addHandler(this._header, 'mouseleave', function () {
                if (!self.disabled && self.enableHover && !isTouchDevice) {
                    self._header.removeClass(self.toThemeProperty('jqx-expander-header-hover'));
                    self._header.removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                }
            });
        },

        //Expanding or collapsing the expander. Depending on it's current state and disabled property.
        _expanderTrigger: function (expander) {
            if (!expander.disabled) {
                if (expander.expanded) {
                    expander.collapse();
                } else {
                    expander.expand();
                }
            }
        },

        //Renderering the expander.
        //If this method is called in the initialization phase (initialize == true) adding wrapper to the content (because of the fixed size expanding and collapsing)
        //This method is also appending the elements (header, content, $contentWrapper) in the correct order and calling headerRender
        _render: function (initialize) {
            if (initialize) {
                this._headerRender();
            }
            switch (this.headerPosition) {
                case 'top':
                    this._header.detach();
                    this._content.detach();
                    this._header.appendTo(this.host);
                    this._content.appendTo(this.host);
                    break;
                case 'bottom':
                    this._header.detach();
                    this._content.detach();
                    this._content.appendTo(this.host);
                    this._header.appendTo(this.host);
                    break;
            }

            // position should be set to 'relative' as this fixes 'overflow' setting issue in IE6 and IE7. 
            this._content.wrap('<div class="jqx-expander-contentWrapper" style="background-color: transparent; margin: 0; padding: 0; position: relative; overflow: hidden;">');
            this.$contentWrapper = this._content.closest('.jqx-expander-contentWrapper');
        },

        //This method is positioning and resizing all components of the expander and calling headerPerformLayout.
        _performLayout: function () {
            if (!$.data(this._content[0], 'isAnimating')) {
                var width = this.host.width();
                this._headerPerformLayout();

                if (this.height && this.height !== 'auto') {
                    this.host.height(parseInt(this.height) + 'px');
                    var borderAndPaddingHeight = parseInt(this._content.css('border-top-width')) + parseInt(this._content.css('border-bottom-width')) +
                        parseInt(this._content.css('padding-bottom')) + parseInt(this._content.css('padding-top'));
                    this._content.height(parseInt(this.host.innerHeight()) - parseInt(this._header.outerHeight()) - borderAndPaddingHeight);
                    $.data(this._content, 'contentHeight', this._content.height());
                } else {
                    this._header.height('auto');
                    this._content.height('auto');
                    this.host.height('auto');
                    $.data(this._content, 'contentHeight', 'auto');
                }
                if (this.width) {
                    if (this.width == 'auto' && $.browser.msie && $.browser.version < 8) {
                        this.host.width(width);
                    }
                    else {
                        this.host.width(this.width);
                    }
                } else {
                    this.host.width('100%');
                }
                return;
                //     this._content.css('position', 'relative');
            }
        },

        //Adding div element containing the arrow as background and wrapper for the content of the header. Adding these elements in the correct order.
        _headerRender: function () {
            var arrowDiv = $('<div class="' + this.toThemeProperty('jqx-expander-arrow') + '"></div>');
            var headerContent = $('<div class="' + this.toThemeProperty('jqx-expander-header-content') + '"></div>');
            headerContent.html(this._header.html());
            this._header.empty();

            arrowDiv.appendTo(this._header);
            headerContent.appendTo(this._header);

            if (this.showArrow) {
                var arrowOrientation = 'jqx-expander-arrow-' + ((this.expanded) ? (this._directions[this.headerPosition]) : (this.headerPosition));
                var arrowOrientationClassName = arrowOrientation;
                arrowDiv.addClass(this.toThemeProperty(arrowOrientationClassName));
            }
        },

        //Positioning and resizing all header elements (arrow div and header's content wrapper).
        _headerPerformLayout: function () {
            var headerArrow = this._header.children(this.toThemeProperty('.jqx-expander-arrow', true));
            var headerContent = this._header.children(this.toThemeProperty('.jqx-expander-header-content', true));
            var arrowWidth = headerArrow.outerWidth();
            var headerWidth = this._header.innerWidth();
            switch (this.arrowPosition) {
                case 'left':
                    headerArrow.removeClass(this.toThemeProperty('jqx-expander-arrow-align-right'));
                    headerArrow.addClass(this.toThemeProperty('jqx-expander-arrow-align-left'));
                    headerArrow.css('float', 'left');
                    break;
                case 'right':
                    headerArrow.removeClass(this.toThemeProperty('jqx-expander-arrow-align-left'));
                    headerArrow.addClass(this.toThemeProperty('jqx-expander-arrow-align-right'));
                    headerArrow.css('float', 'right');
                    break;
            }

            this._fitContent(this, headerArrow, headerContent)

            // vertical position headerContent
            var headerHeight = this._header.height();
            var middle = parseInt(headerHeight) / 2 - parseInt(headerContent.height()) / 2;
            headerContent.css('margin-top', middle + 'px');

            // vertical position arrow
            var middle = parseInt(headerHeight) / 2 - parseInt(headerArrow.height()) / 2;
            headerArrow.css('margin-top', middle + 'px');
        },

        //        _getImageSize: function () {
        //            var width = 0;
        //            var height = 0;
        //            if (this.showArrow) {
        //                width = height = 16;
        //                var imageUrl = this._header.children(this.toThemeProperty('.jqx-expander-arrow', true)).css('backgroundImage');
        //                imageUrl = imageUrl.replace('url("', '');
        //                imageUrl = imageUrl.replace('")', '');
        //                imageUrl = imageUrl.replace('url(', '');
        //                imageUrl = imageUrl.replace(')', '');

        //                var image = $('<span><img style="height: auto; width: auto; visibility:hidden;" src="' + imageUrl + '"  /></span>');
        //                image.appendTo(document.body);
        //                var self = this;
        //                width = image.width();
        //                height = image.height();

        //                image.load(function () {
        //                    self._fitContent(self, headerArrow, headerContent)
        //                    image.remove();
        //                    width = image.width();
        //                    height = image.height();
        //                });

        //                width = Math.max(16, width);
        //                height = Math.max(16, height);

        //                image.remove();
        //            }

        //            return { width: width, height: height };
        //        },

        _fitContent: function (expander, headerArrow, headerContent) {
            //            if (expander.showArrow) {
            //                headerContent.width(
            //                    parseInt(expander.width) -
            //                    parseInt(headerArrow.outerWidth()) -
            //                    parseInt(expander._header.css('padding-left')) -
            //                    parseInt(expander._header.css('padding-right')) -
            //                    parseInt(headerArrow.css('padding-left')) -
            //                    parseInt(headerArrow.css('padding-right')) -
            //                    parseInt(headerContent.css('padding-left')) -
            //                    parseInt(headerContent.css('padding-right')));
            //            }
        },

        _showSpecificArrowDirection: function (direction) {
            this._header.children(this.toThemeProperty('.jqx-expander-arrow', true)).removeClass(this.toThemeProperty('jqx-expander-arrow-' + this._directions[direction]));
            this._header.children(this.toThemeProperty('.jqx-expander-arrow', true)).addClass(this.toThemeProperty('jqx-expander-arrow-' + direction));
        },

        _applyTheme: function () {
            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-expander-disabled'));
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                this._header.addClass(this.toThemeProperty('jqx-expander-header-disabled'));
                this._content.addClass(this.toThemeProperty('jqx-expander-content-disabled'));
            }
            switch (this.headerPosition) {
                case 'top':
                    this._header.removeClass(this.toThemeProperty('jqx-expander-header-bottom'));
                    this._content.removeClass(this.toThemeProperty('jqx-expander-content-top'));
                    this._header.addClass(this.toThemeProperty('jqx-expander-header-top'));
                    this._content.addClass(this.toThemeProperty('jqx-expander-content-bottom'));
                    break;
                case 'bottom':
                    this._header.removeClass(this.toThemeProperty('jqx-expander-header-top'));
                    this._content.removeClass(this.toThemeProperty('jqx-expander-content-bottom'));
                    this._header.addClass(this.toThemeProperty('jqx-expander-header-bottom'));
                    this._content.addClass(this.toThemeProperty('jqx-expander-content-top'));
                    break;
            }
        },

        destroy: function () {
            this.host
			.removeClass();
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this._events[id];
            args = arg;
            args.owner = this;
            var cancel = false;

            if (id == 1) {
                if (this.showArrow) {
                    this._showSpecificArrowDirection(this._directions[this.headerPosition]);
                }
                this.expanded = true;
            }
            if (id == 3) {
                if (this.showArrow) {
                    this._showSpecificArrowDirection(this.headerPosition);
                }
                this.expanded = false;
            }

            var event = new jQuery.Event(evt);
            event.owner = this;
            event.cancel = cancel;
            var result = this.host.trigger(event);

            if (!event.cancel) {
                if (id == 0) {
                    if (this.showArrow) {
                        this._showSpecificArrowDirection(this._directions[this.headerPosition]);
                    }
                    return event.cancel;
                }
                if (id == 2) {
                    if (this.showArrow) {
                        this._showSpecificArrowDirection(this.headerPosition);
                    }
                    return event.cancel;
                }
            }

            return result;
        },

        //Method which is collapsing the expander. It's making backup of expander's content size and performing toggle or animation for
        //hidding the content. This method is also raising event which indicates that the expander is collapsed.
        collapse: function () {
            var result = this._raiseEvent(2);
            if (result)
                return;
            if (this.element != null) {
                if (this.animationType != 'none') {

                    $.data(this._content[0], 'isAnimating', true);
                    this._content.css('visibility', 'visible');

                    if (!this.height || this.height === 'auto') {
                        this._content.height($.data(this._content, 'contentHeight'));
                    }
                    this._content.stop();
                    if (this.animationType == 'slide') {
                        this._slideCollapse(this.collapseAnimationDuration, true);
                    } else if (this.animationType == 'fade') {
                        this._fadeCollapse(this.collapseAnimationDuration, true);
                    }
                } else {
                    this._toggleCollapse(true);
                }
            }
            this._header.removeClass(this.toThemeProperty('jqx-expander-header-expanded'));
            this._header.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            this._content.removeClass(this.toThemeProperty('jqx-expander-content-expanded'));
            var arrowDiv = this.host.find('.jqx-expander-arrow');
            arrowDiv.removeClass(this.toThemeProperty('jqx-expander-arrow-expanded'));
        },

        _toggleCollapse: function (raiseEvent) {
            var self = this;
            $(self._content).hide(0, function () { self._collapseCallback(self, raiseEvent) });
        },

        //If the expander is not with fixed size I'm fading out not just the content wrapper but also the content
        //because contentWrapper's children are not fading
        _fadeCollapse: function (duration, raiseEvent) {
            var self = this;
            if (!this.height || this.height === 'auto') {
                $(self._content).fadeOut(duration, function () { self._collapseCallback(self, raiseEvent) });
            } else {
                $(self._content).fadeTo(duration, 0.01, function () { self._collapseCallback(self, raiseEvent) });
            }
        },

        //Hidding all data. If the size isn't fixed than the contentWrapper's display is going to be set to 'none', because it must not take any space.
        _collapseCallback: function (expander, raiseEvent) {
            $.data(expander._content[0], 'isAnimating', false);
            if (raiseEvent) {
                expander._raiseEvent(3);
                expander._content.css('height', '0');
                expander._content.css('visibility', 'hidden');
            }
        },

        _slideCollapse: function (duration, raiseEvent) {
            var self = this;
            var content = self._content;
            var $header = $(self._header);
            var borderOffset = Math.max(2, parseInt($header.css('border-bottom-width')) + parseInt($header.css('border-top-width')));
            if (isNaN(borderOffset)) borderOffset = 0;
            // to do: check why this is necessary.
            if ($.browser.mozilla) {
                borderOffset = 1;
            }

            content.stop();
            switch (this.headerPosition) {
                case 'top':
                    if (duration == 0) {
                        $(content).css({ 'margin-top': -parseInt(content.height()) - borderOffset + 'px' });
                    }
                    else {
                        $(content).animate({ 'margin-top': -parseInt(content.height()) - borderOffset + 'px' }, duration, 'easeInOutSine', function () { self._collapseCallback(self, raiseEvent) });
                    }
                    break;
                case 'bottom':
                    if (this.height && this.height !== 'auto') {
                        $(content).animate({ 'bottom': -parseInt(content.height()) + 'px' }, duration, 'linear', function () { self._collapseCallback(self, raiseEvent) });
                    } else {
                        $(content).animate({ 'margin-bottom': -parseInt(content.height()) + 'px' }, duration, 'easeInOutSine', function () { self._collapseCallback(self, raiseEvent) });
                    }
                    break;
            }
        },

        //Method used for expanding the expander's content. It's calling any animation or toggle method required for hidding expander's content.
        //It's also raising event which indicates that the expander is expanded.
        expand: function () {
            this._raiseEvent(0);
            if (this.element != null) {
                if (this.animationType != 'none') {

                    this._content.css('display', 'block');

                    $.data(this._content[0], 'isAnimating', true);
                    this._content.css('visibility', 'visible');

                    if ((!this.height || this.height === 'auto')) {
                        this._content.height($.data(this._content, 'contentHeight'));
                    }
                    else if (this._content.height() == 0) {
                        this._content.height(this._content.height($.data(this._content, 'contentHeight')));
                    }

                    this._content.stop();
                    if (this.animationType == 'slide') {
                        this._slideExpand(this.expandAnimationDuration, true);
                    } else if (this.animationType == 'fade') {
                        this._fadeExpand(this.expandAnimationDuration, true);
                    }
                } else {
                    this._content.css('display', 'none');
                    this._toggleExpand(true);
                }
            }
            this._header.addClass(this.toThemeProperty('jqx-expander-header-expanded'));
            this._header.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
            this._content.addClass(this.toThemeProperty('jqx-expander-content-expanded'));
            var arrowDiv = this.host.find('.jqx-expander-arrow');
            arrowDiv.addClass(this.toThemeProperty('jqx-expander-arrow-expanded'));
        },

        _toggleExpand: function (raiseEvent) {
            var self = this;
            this._content.css('visibility', 'visible');

            if ((!this.height || this.height === 'auto')) {
                this._content.height($.data(this._content, 'contentHeight'));
            }
            else if (this._content.height() == 0) {
                this._content.height(this._content.height($.data(this._content, 'contentHeight')));
            }
            $(self._content).show(0, function () { self._expandCallback(self, raiseEvent) });
        },

        _fadeExpand: function (duration, raiseEvent) {
            var self = this;
            if (!this.height || this.height === 'auto') {
                $(self._content).fadeIn(duration, function () { self._expandCallback(self, raiseEvent) });
            } else {
                $(self._content).fadeTo(duration, 1, function () { self._expandCallback(self, raiseEvent) });
            }
        },

        _expandCallback: function (expander, raiseEvent) {
            $.data(expander._content[0], 'isAnimating', false);
            if (raiseEvent) {
                expander._raiseEvent(1);
            }
        },


        //Setting container's margin or top/bottom
        //Using _firstSlideExpand because when the current expander is a child and it's created after his parent creation
        //it's margin must be fixed. That's why I'm passing raiseEvent = false parameter, because it's just fix and I don't need to raise event.
        _slideExpand: function (duration, raiseEvent) {
            if (this._firstSlideExpand) {
                this._slideCollapse(0, false);
                this._firstSlideExpand = false;
            }
            var self = this;
            var content = this._content;
            content.stop();
            switch (this.headerPosition) {
                case 'top':
                    if (duration == 0) {
                        $(content).css({ 'margin-top': '0px' });
                    }
                    else {
                        $(content).animate({ 'margin-top': '0px' }, duration, 'easeInOutSine', function () { self._expandCallback(self, raiseEvent) });
                    }
                    break;
                case 'bottom':
                    if (this.height && this.height !== 'auto') {
                        $(content).animate({ 'bottom': '0px' }, duration, 'linear', function () { self._expandCallback(self, raiseEvent) });
                    } else {
                        $(content).animate({ 'margin-bottom': '0px' }, duration, 'easeInOutSine', function () { self._expandCallback(self, raiseEvent) });
                    }
                    break;
            }
        },

        //Setting content's height
        setContentHeight: function (height) {
            this._content.height(height);
            $.data(this._content, 'contentHeight', height)
            if (height === 'auto') {
                this._content.css('minHeight', 0);
            }
            if (!this.expanded) {
                this._absoluteCollapse();
            }
        },

        //This method is disabling the expander.
        disable: function () {
            this.disabled = true;
            this._applyTheme();
        },

        //This method is enabling the expander.
        enable: function () {
            this.disabled = false;
            this.host.removeClass(this.toThemeProperty('jqx-expander-disabled'));
            this._header.removeClass(this.toThemeProperty('jqx-expander-header-disabled'));
            this._content.removeClass(this.toThemeProperty('jqx-expander-content-disabled'));
        },

        //This method is setting specific content to the expander's header.
        setHeaderContent: function (content) {
            if (content) {
                var headerContainer = this._header.children(this.toThemeProperty('.jqx-expander-header-content', true));
                headerContainer.html(content);
                this._performLayout();
            }
        },

        //This method is setting specific content to the expander.
        setContent: function (content) {
            if (content) {
                this._content.html(content);
                this._performLayout();
            }
        },

        //Getting expander's current content.
        getContent: function () {
            if (this._content != null) {
                return this._content.html();
            }

            return null;
        },

        //Getting expander's header content.
        getHeaderContent: function () {
            return this._header.children(this.toThemeProperty('.jqx-expander-header-content', true)).html();
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (key == 'theme') {
                this.host.removeClass();
                this.host.addClass(this.toThemeProperty('jqx-widget'));
                this.host.addClass(this.toThemeProperty('jqx-expander'));
                this._header.removeClass();
                this._header.addClass(this.toThemeProperty('jqx-widget-header'));
                this._header.addClass(this.toThemeProperty('jqx-expander-header'));
                this._content.removeClass();
                this._content.addClass(this.toThemeProperty('jqx-widget-content'));
                this._content.addClass(this.toThemeProperty('jqx-expander-content'));
                var arrowDiv = this.host.find('.jqx-expander-arrow');
                var headerContent = this.host.find('.jqx-expander-header-content');
                arrowDiv.removeClass();
                arrowDiv.addClass(this.toThemeProperty('jqx-expander-arrow'));
                headerContent.addClass(this.toThemeProperty('jqx-expander-header-content'));
                this._applyTheme();
                if (this.showArrow) {
                    var arrowOrientation = 'jqx-expander-arrow-' + ((this.expanded) ? (this._directions[this.headerPosition]) : (this.headerPosition));
                    var arrowOrientationClassName = arrowOrientation;
                    arrowDiv.addClass(this.toThemeProperty(arrowOrientationClassName));
                }
                this._headerPerformLayout();
            }

            if (key == 'showArrow') {
                var arrows = this.host.find('.' + this.toThemeProperty('jqx-expander-arrow', true));
                if (value) {
                    arrows.css('visibility', 'visible');
                }
                else {
                    arrows.css('visibility', 'hidden');
                }
            }
            else if (key == 'arrowPosition') {
                this._headerPerformLayout();
            }
            else if (key == 'toggleMode') {
                this._addEventHandlers();
            }
            else if (key == 'toggleBehavior') {
                this._addEventHandlers(oldvalue);
            }
            else if (key == 'disabled') {
                this.disabled = value;
                if (value) {
                    this.host.addClass(this.toThemeProperty('jqx-expander-disabled'));
                    this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                    this._header.addClass(this.toThemeProperty('jqx-expander-header-disabled'));
                    this._content.addClass(this.toThemeProperty('jqx-expander-content-disabled'));
                } else {
                    this.host.removeClass(this.toThemeProperty('jqx-expander-disabled'));
                    this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
                    this._header.removeClass(this.toThemeProperty('jqx-expander-header-disabled'));
                    this._content.removeClass(this.toThemeProperty('jqx-expander-content-disabled'));
                }
            } else if (key == 'expanded' && !value) {
                var expandAnimationDuration = this.expandAnimationDuration;
                var collapseAnimationDuration = this.collapseAnimationDuration;
                this.collapseAnimationDuration = 0;
                this.expandAnimationDuration = 0;
                this.collapse();
                this.expandAnimationDuration = expandAnimationDuration;
                this.collapseAnimationDuration = collapseAnimationDuration;
            } else if (key == 'expanded' && value) {
                var heightBackup = undefined;

                if (key == 'expanded' && value) {
                    heightBackup = this._content.height();
                }

                if (heightBackup) {
                    this._content.height(heightBackup);
                    $.data(this._content, 'contentHeight', heightBackup)
                }

                var expandAnimationDuration = this.expandAnimationDuration;
                var collapseAnimationDuration = this.collapseAnimationDuration;
                this.collapseAnimationDuration = 0;
                this.expandAnimationDuration = 0;
                this.expand();
                this.expandAnimationDuration = expandAnimationDuration;
                this.collapseAnimationDuration = collapseAnimationDuration;
            } else if (key == 'headerPosition') {
                var header = $('<div></div>').html(this._header.children(this.toThemeProperty('.jqx-expander-header-content', true)).html());
                var content = $('<div></div>').html(this._content.html());

                var headerClassList = this._header.attr('class').split(/\s+/);
                var contentClassList = this._content.attr('class').split(/\s+/);
                var heightBackup = undefined;

                if (key == 'expanded' && value) {
                    heightBackup = this._content.height();
                }

                this.$contentWrapper.detach();
                this._content.detach();
                this._header.detach();

                this._content = content;
                this._header = header;
                this._header.addClass(this.toThemeProperty('jqx-widget-header'));
                this._header.addClass(this.toThemeProperty('jqx-expander-header'));
                this._content.addClass(this.toThemeProperty('jqx-widget-content'));
                this._content.addClass(this.toThemeProperty('jqx-expander-content'));

                for (var i = 0; i < headerClassList.length; i++) {
                    this._header.addClass(headerClassList[i]);
                }
                for (var i = 0; i < contentClassList.length; i++) {
                    this._content.addClass(contentClassList[i]);
                }
                this._createExpander();

                if (heightBackup) {
                    this._content.height(heightBackup);
                    $.data(this._content, 'contentHeight', heightBackup)
                }
            }
        }
    });
})(jQuery);