/*
jQWidgets v2.4.2 (2012-Sep-12)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/

/*
* jqxradiobutton.js
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

    $.jqx.jqxWidget("jqxRadioButton", "", {});

    $.extend($.jqx._jqxRadioButton.prototype, {
        defineInstance: function () {
            // Type: Number
            // Default: 250
            // Gets or sets the delay of the fade animation when the CheckBox is going to be opened.
            this.animationShowDelay = 300,
            // Type: Number
            // Default: 300
            // Gets or sets the delay of the fade animation when the CheckBox is going to be closed. 
             this.animationHideDelay = 300,
            // Type: Number.
            // Default: null.
            // Sets the width.
            this.width = null;
            // Type: Number.
            // Default: null.
            // Sets the height.
            this.height = null;
            // Type: String
            // Default: '13px'
            // Gets or sets the radiobutton's size.
            this.boxSize = '13px';
            // Type: Bool and Null
            // Default: false
            // Gets or sets the ckeck state.
            // Possible Values: true, false and null.
            this.checked = false;
            // Type: Bool
            // Default: false
            // Gets or sets whether the radiobutton has 3 states - checked, unchecked and indeterminate.
            this.hasThreeStates = false;
            // Type: Bool
            // Default: false
            // Gets whether the CheckBox is disabled.
            this.disabled = false;
            // Type: Bool
            // Default: true
            // Gets or sets whether the clicks on the container are handled as clicks on the check box.
            this.enableContainerClick = true;
            // Type: Bool
            // Default: true
            // Gets or sets whether the checkbox is locked. In this mode the user is not allowed to check/uncheck the radio button.
            this.locked = false;
            // Type: String
            // Default: ''
            // Gets or sets the group name. When this property is set, the checkboxes in the same group behave as radio buttons.
            this.groupName = '';
            // 'checked' is triggered when the radiobutton is checked.
            // 'unchecked' is triggered when the radiobutton is unchecked.
            // 'indeterminate' is triggered when the radiobutton's ckecked property is going to be null.
            // 'change' is triggered when the radiobutton's state is changed.
            this.events =
			 [
			    'checked', 'unchecked', 'indeterminate', 'change'
             ];
        },

        createInstance: function (args) {
            this.setSize();
            var me = this;
            this.propertyChangeMap['width'] = function (instance, key, oldVal, value) {
                me.setSize();
            };

            this.propertyChangeMap['height'] = function (instance, key, oldVal, value) {
                me.setSize();
            };

            this.radiobutton = $('<div><div><span></span></div></div>');
            this.host.attr('tabIndex', 0);
            this.host.prepend(this.radiobutton);
            this.host.append($('<div style="clear: both;"></div>'));
            this.checkMark = $(this.radiobutton).find('span');
            this.box = $(this.radiobutton).find('div');

            this._supportsRC = true;
            if ($.browser.msie && $.browser.version < 9) {
                this._supportsRC = false;
            }

            this.box.addClass(this.toThemeProperty('jqx-fill-state-normal'));
            this.box.addClass(this.toThemeProperty('jqx-radiobutton-default'));
            this.host.addClass(this.toThemeProperty('jqx-widget'));

            if (this.disabled) {
                this.disable();
            }

            this.host.addClass(this.toThemeProperty('jqx-radiobutton'));

            if (this.locked) {
                this.host.css('cursor', 'auto');
            }

            var checked = this.element.getAttribute('checked');
            if (checked == 'checked' || checked == 'true' || checked == true) {
                this.checked = true;
            }

            this._render();
            this._addHandlers();
        },

        refresh: function (initialRefresh) {
            if (!initialRefresh) {
                this.setSize();
                this._render();
            }
        },

        setSize: function () {
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

        _addHandlers: function () {
            var me = this;
            this.addHandler(this.box, 'click', function (event) {
                if (!me.disabled && !me.enableContainerClick) {
                    me.toggle();
                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.host, 'keydown', function (event) {
                if (!me.disabled && !me.locked) {
                    if (event.keyCode == 32) {
                        me.toggle();
                        event.preventDefault();
                        return false;
                    }
                }
            });

            this.addHandler(this.host, 'click', function (event) {
                if (!me.disabled && me.enableContainerClick) {
                    me.toggle();
                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.host, 'selectstart', function (event) {
                if (!me.disabled && me.enableContainerClick) {
                    event.preventDefault();
                }
            });

            this.addHandler(this.host, 'mouseup', function (event) {
                if (!me.disabled && me.enableContainerClick) {
                    event.preventDefault();
                }
            });

            this.addHandler(this.host, 'mousedown', function (event) {
                if (!me.disabled && me.enableContainerClick) {
                    me.host.focus();
                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.host, 'focus', function (event) {
                if (!me.disabled && me.enableContainerClick && !me.locked) {
                    me.box.addClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.addClass(me.toThemeProperty('jqx-fill-state-focus'));
                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.host, 'blur', function (event) {
                if (!me.disabled && me.enableContainerClick && !me.locked) {
                    me.box.removeClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.host, 'mouseenter', function (event) {
                if (!me.disabled && me.enableContainerClick && !me.locked) {
                    me.box.addClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.addClass(me.toThemeProperty('jqx-fill-state-hover'));

                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.host, 'mouseleave', function (event) {
                if (!me.disabled && me.enableContainerClick && !me.locked) {
                    me.box.removeClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.box, 'mouseenter', function () {
                if (!me.disabled && !me.enableContainerClick) {
                    me.box.addClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.addClass(me.toThemeProperty('jqx-fill-state-hover'));
                }
            });

            this.addHandler(this.box, 'mouseleave', function () {
                if (!me.disabled && !me.enableContainerClick) {
                    me.box.removeClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                }
            });
        },

        _removeHandlers: function () {
            this.removeHandler(this.box, 'click');
            this.removeHandler(this.box, 'mouseenter');
            this.removeHandler(this.box, 'mouseleave');
            this.removeHandler(this.host, 'click');
            this.removeHandler(this.host, 'mouseup');
            this.removeHandler(this.host, 'mousedown');
            this.removeHandler(this.host, 'selectstart');
            this.removeHandler(this.host, 'mouseenter');
            this.removeHandler(this.host, 'mouseleave');
            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.host, 'focus');
            this.removeHandler(this.host, 'blur');
        },

        _render: function () {
            if (this.boxSize == null) this.boxSize = 13;

            this.box.width(this.boxSize);
            this.box.height(this.boxSize);

            if (!this.disabled) {
                if (this.enableContainerClick) {
                    this.host.css('cursor', 'pointer');
                }
                else this.host.css('cursor', 'auto');
            }
            else {
                this.disable();
            }

            this.updateStates();
        },

        // checks the ckeckbox.
        check: function () {
            this.checked = true;
            var me = this;
            this.checkMark.removeClass();

            this.checkMark.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
            if ($.browser.msie) {
                if (!this.disabled) {
                    this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-checked'));
                }
                else {
                    this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-disabled'));
                }
            }
            else {
                if (!this.disabled) {
                    this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-checked'));
                }
                else {
                    this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-disabled'));
                }

                this.checkMark.css('opacity', 0);
                this.checkMark.stop().animate({ opacity: 1 }, this.animationShowDelay, function () {
                });
            }

            var checkboxes = $.find('.jqx-radiobutton');

            if (this.groupName == null) this.groupName = '';
            $.each(checkboxes, function () {
                var groupName = $(this).jqxRadioButton('groupName');
                if (groupName == me.groupName && this != me.element) {
                    $(this).jqxRadioButton('uncheck')
                }
            });

            this._raiseEvent('0');
            this._raiseEvent('3', { checked: true });

            if (this.checkMark.height() == 0) {
                this.checkMark.height(this.boxSize);
                this.checkMark.width(this.boxSize);
            }
        },

        // unchecks the radiobutton.
        uncheck: function () {
            var oldCheck = this.checked;
            this.checked = false;
            var me = this;

            if ($.browser.msie) {
                me.checkMark.removeClass();
            }
            else {
                this.checkMark.css('opacity', 1);
                this.checkMark.stop().animate({ opacity: 0 }, this.animationHideDelay, function () {
                    me.checkMark.removeClass();
                });
            }

            if (oldCheck) {
                this._raiseEvent('1');
                this._raiseEvent('3', { checked: false });
            }
        },

        // sets the indeterminate state.
        indeterminate: function () {
            var oldCheck = this.checked;
            this.checked = null;
            this.checkMark.removeClass();

            if ($.browser.msie) {
                this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-indeterminate'));
            }
            else {
                this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-indeterminate'));
                this.checkMark.css('opacity', 0);
                this.checkMark.stop().animate({ opacity: 1 }, this.animationShowDelay, function () {
                });
            }

            if (oldCheck != null) {
                this._raiseEvent('2');
                this._raiseEvent('3', { checked: null });
            }
        },

        // toggles the check state.
        toggle: function () {
            if (this.disabled)
                return;

            if (this.locked)
                return;

            var oldChecked = this.checked;

            if (this.checked == true) {
                this.checked = this.hasTreeStates ? null : true;
            }
            else {
                this.checked = true;
            }

            if (oldChecked != this.checked) {
                this.updateStates();
            }
        },

        // updates check states depending on the value of the 'checked' property.
        updateStates: function () {
            if (this.checked) {
                this.check();
            }
            else if (this.checked == false) {
                this.uncheck();
            }
            else if (this.checked == null) {
                this.indeterminate();
            }
        },

        // disables the radiobutton.
        disable: function () {
            this.disabled = true;

            if (this.checked == true) {
                this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-disabled'));
            }
            else if (this.checked == null) {
                this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-indeterminate-disabled'));
            }
            this.box.addClass(this.toThemeProperty('jqx-radiobutton-disabled'));
            this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
        },

        // enables the radiobutton.
        enable: function () {
            this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
            if (this.checked == true) {
                this.checkMark.removeClass(this.toThemeProperty('jqx-radiobutton-check-disabled'));
            }
            else if (this.checked == null) {
                this.checkMark.removeClass(this.toThemeProperty('jqx-radiobutton-check-indeterminate-disabled'));
            }
            this.box.removeClass(this.toThemeProperty('jqx-radiobutton-disabled'));
         
            this.disabled = false;
        },

        destroy: function () {
            this._removeHandlers();
        },

        _raiseEvent: function (id, args) {
            var evt = this.events[id];
            var event = new jQuery.Event(evt);
            event.owner = this;
            event.args = args;

            try {
                var result = this.host.trigger(event);
            }
            catch (error) {
            }

            return result;
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (key == this.enableContainerClick && !this.disabled && !this.locked) {
                if (value) {
                    this.host.css('cursor', 'pointer');
                }
                else this.host.css('cursor', 'auto');
            }

            if (key == 'checked') {
                switch (value) {
                    case true:
                        this.check();
                        break;
                    case false:
                        this.uncheck();
                        break;
                    case null:
                        this.indeterminate();
                        break;
                }
            }

            if (key == 'theme') {
                $.jqx.utilities.setTheme(oldvalue, value, this.host);
            }

            if (key == 'disable') {
                if (value) {
                    this.disable();
                } else this.enable();
            }
        }
    });
})(jQuery);
