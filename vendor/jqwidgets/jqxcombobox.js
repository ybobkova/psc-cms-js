/*
jQWidgets v2.4.2 (2012-Sep-12)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/



(function ($) {

    $.jqx.jqxWidget("jqxComboBox", "", {});

    $.extend($.jqx._jqxComboBox.prototype, {
        defineInstance: function () {
            // enables/disables the combobox.
            this.disabled = false;
            // gets or sets the listbox width.
            this.width = null;
            // gets or sets the listbox height.
            this.height = null;
            // Represents the collection of list items.
            this.items = new Array();
            // Gets or sets the selected index.
            this.selectedIndex = -1;
            // data source.
            this.source = null;
            // gets or sets the scrollbars size.
            this.scrollBarSize = 15;
            // gets or sets the scrollbars size.
            this.arrowSize = 18;
            // enables/disables the hover state.
            this.enableHover = true;
            // enables/disables the selection.
            this.enableSelection = true;
            // gets the visible items. // this property is internal for the combobox.
            this.visualItems = new Array();
            // gets the groups. // this property is internal for the combobox.
            this.groups = new Array();
            // gets or sets whether the items width should be equal to the combobox's width.
            this.equalItemsWidth = true;
            // gets or sets the height of the ListBox Items. When the itemHeight == - 1, each item's height is equal to its desired height.
            this.itemHeight = -1;
            // represents the combobox's events.
            this.visibleItems = new Array();
            // emptry group's text.
            this.emptyGroupText = 'Group';
            // Type: Number
            // Default: 100
            // Showing Popup Animation's delay.
            if (this.openDelay == undefined) {
                this.openDelay = 350;
            }
            // Type: Number
            // Default: 200
            // Hiding Popup Animation's delay.
            if (this.closeDelay == undefined) {
                this.closeDelay = 400;
            }
            // default, none
            // Type: String.
            // enables or disables the animation.
            this.animationType = 'default';
            // Type: String
            // Default: auto ( the drop down takes the combobox's width.)
            // Sets the popup's width.
            this.dropDownWidth = 'auto';
            // Type: String
            // Default: 200px ( the height is 200px )
            // Sets the popup's height.
            this.dropDownHeight = '200px';
            // Type: Boolean
            // Default: false
            // Sets the popup's height to be equal to the items summary height;            
            this.autoDropDownHeight = false;
            // Type: Boolean
            // Default: false
            // Enables or disables the browser detection.
            this.enableBrowserBoundsDetection = false;
            this.dropDownHorizontalAlignment = 'left';
            // Type: String
            // Default: startswithignorecase
            // Possible Values: 'none, 'contains', 'containsignorecase', 'equals', 'equalsignorecase', 'startswithignorecase', 'startswith', 'endswithignorecase', 'endswith'
            this.searchMode = 'startswithignorecase';
            this.autoComplete = false;
            this.remoteAutoComplete = false;
            this.remoteAutoCompleteDelay = 500;
            this.minLength = 2;
            this.displayMember = "";
            this.valueMember = "";
            this.keyboardSelection = true;
            this.renderer = null;
            this.autoOpen = false;
            this.events =
	   	    [
            // occurs when the combobox is opened.
		      'open',
            // occurs when the combobox is closed.
              'close',
            // occurs when an item is selected.
              'select',
            // occurs when an item is unselected.
              'unselect',
            // occurs when the selection is changed.
              'change'
            ];
        },

        createInstance: function (args) {
            this.isanimating = false;

            var comboStructure = $("<div tabIndex=0 style='background-color: transparent; -webkit-appearance: none; outline: none; width:100%; height: 100%; padding: 0px; margin: 0px; border: 0px; position: relative;'>" +
                "<div id='dropdownlistWrapper' style='padding: 0; margin: 0; border: none; background-color: transparent; float: left; width:100%; height: 100%; position: relative;'>" +
                "<div id='dropdownlistContent' style='padding: 0; margin: 0; border-left: none; border-top: none; border-bottom: none; float: left; position: absolute;'/>" +
                "<div id='dropdownlistArrow' style='padding: 0; margin: 0; border-left-width: 1px; border-bottom-width: 0px; border-top-width: 0px; border-right-width: 0px; float: right; position: absolute;'/>" +
                "</div>" +
                "</div>");

            if ($.jqx._jqxListBox == null || $.jqx._jqxListBox == undefined) {
                throw "jqxListBox is not loaded.";
            }

            try {
                var listBoxID = 'listBox' + this.element.id;
                var oldContainer = $($.find('#' + listBoxID));
                if (oldContainer.length > 0) {
                    oldContainer.remove();
                }

                var container = $("<div style='overflow: hidden; border: none; background-color: transparent; position: absolute;' id='listBox" + this.element.id + "'><div id='innerListBox" + this.element.id + "'></div></div>");
                if ($.jqx.utilities.getBrowser().browser == 'opera') {
                    container.hide();
                }
                container.appendTo(document.body);
                this.container = container;
                this.listBoxContainer = $($.find('#innerListBox' + this.element.id));

                var width = this.width;
                if (this.dropDownWidth != 'auto') {
                    width = this.dropDownWidth;
                }

                if (this.dropDownHeight == null) {
                    this.dropDownHeight = 200;
                }

                this.listBoxContainer.jqxListBox({ renderer: this.renderer, itemHeight: this.itemHeight, incrementalSearch: false, width: width, scrollBarSize: this.scrollBarSize, autoHeight: this.autoDropDownHeight, height: this.dropDownHeight, displayMember: this.displayMember, valueMember: this.valueMember, source: this.source, theme: this.theme });
                this.container.width(parseInt(width) + 25);
                this.container.height(parseInt(this.dropDownHeight) + 25);
                this.listBoxContainer.css({ position: 'absolute', zIndex: 100000, top: 0, left: 0 });
                this.listBoxContainer.css('border-top-width', '1px');
                this.listBox = $.data(this.listBoxContainer[0], "jqxListBox").instance;
                this.listBox.enableSelection = this.enableSelection;
                this.listBox.enableHover = this.enableHover;
                this.listBox.equalItemsWidth = this.equalItemsWidth;
                this.listBox.selectIndex(this.selectedIndex);
                this.listBox._arrange();
                this.listBox.rendered = function () {
                    me.listBox.selectIndex(me.selectedIndex);
                    me.renderSelection('mouse');
                    if (me.remoteAutoComplete) {
                        me.container.height(me.listBox.virtualSize.height + 25);
                        me.listBoxContainer.height(me.listBox.virtualSize.height);
                        if (me.searchString != undefined) {
                            if (me.listBox.items.length > 0) {
                                if (!me.isOpened()) {
                                    me.open();
                                }
                            }
                            else me.close();
                        }
                    }
                }
                var me = this;
                this.addHandler(this.host, 'loadContent', function (event) {
                    me._arrange();
                });
                this.addHandler(this.listBoxContainer, 'unselect', function (event) {
                    me._raiseEvent('3', { index: event.args.index, type: event.args.type, item: event.args.item });
                });

                this.addHandler(this.listBoxContainer, 'change', function (event) {
                    me._raiseEvent('4', { index: event.args.index, type: event.args.type, item: event.args.item });
                });

                if (this.animationType == 'none') {
                    this.container.css('display', 'none');
                }
                else {
                    this.container.hide();
                }
            }
            catch (e) {

            }

            this.touch = $.jqx.mobile.isTouchDevice();

            this.host.append(comboStructure);

            this.dropdownlistWrapper = this.host.find('#dropdownlistWrapper');
            this.dropdownlistArrow = this.host.find('#dropdownlistArrow');
            this.dropdownlistContent = this.host.find('#dropdownlistContent');
            this.dropdownlistContent.addClass(this.toThemeProperty('jqx-combobox-content'));
            this.dropdownlistContent.addClass(this.toThemeProperty('jqx-widget-content'));
            this.dropdownlistWrapper[0].id = "dropdownlistWrapper" + this.element.id;
            this.dropdownlistArrow[0].id = "dropdownlistArrow" + this.element.id;
            this.dropdownlistContent[0].id = "dropdownlistContent" + this.element.id;

            this.dropdownlistContent.append($('<input autocomplete="off" style="margin: 0; padding: 0; border: 0;" type="textarea"/>'));
            this.input = this.dropdownlistContent.find('input');
            this.input.addClass(this.toThemeProperty('jqx-combobox-input'));
            this.input.addClass(this.toThemeProperty('jqx-widget-content'));

            var self = this;
            self.input.attr('disabled', self.disabled);
            this.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (value) {
                    instance.host.addClass(self.toThemeProperty('jqx-combobox-state-disabled'));
                    instance.host.addClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropdownlistContent.addClass(self.toThemeProperty('jqx-combobox-content-disabled'));
                }
                else {
                    instance.host.removeClass(self.toThemeProperty('jqx-combobox-state-disabled'));
                    instance.host.removeClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropdownlistContent.removeClass(self.toThemeProperty('jqx-combobox-content-disabled'));
                }
                instance.input.attr('disabled', self.disabled);
            }

            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-combobox-state-disabled'));
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                this.dropdownlistContent.addClass(this.toThemeProperty('jqx-combobox-content-disabled'));
            }

            this.host.addClass(this.toThemeProperty('jqx-combobox-state-normal'));
            this.host.addClass(this.toThemeProperty('jqx-rc-all'));
            this.host.addClass(this.toThemeProperty('jqx-widget'));
            this.host.addClass(this.toThemeProperty('jqx-widget-content'));
            this.dropdownlistArrowIcon = $("<div></div>");
            this.dropdownlistArrowIcon.addClass(this.toThemeProperty('icon-arrow-down'));
            this.dropdownlistArrowIcon.addClass(this.toThemeProperty('icon'));
            this.dropdownlistArrow.append(this.dropdownlistArrowIcon);
            this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-combobox-arrow-normal'));
            this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-fill-state-normal'));
            this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-rc-r'));

            this._setSize();
            this.render();

            this.addHandler(this.input, 'keyup.textchange', function (event) {
                var foundMatch = me._search(event);
            });

            // fix for IE7
            if ($.browser.msie && $.browser.version < 8) {
                if (this.host.parents('.jqx-window').length > 0) {
                    var zIndex = this.host.parents('.jqx-window').css('z-index');
                    container.css('z-index', zIndex + 10);
                    this.listBoxContainer.css('z-index', zIndex + 10);
                }
            }
        },

        _search: function (event) {
            if (event.keyCode == 9)
                return;

            if (this.searchMode == 'none' || this.searchMode == null || this.searchMode == 'undefined') {
                return;
            }

            if (event.keyCode == 16 || event.keyCode == 17 || event.keyCode == 20)
                return false;

            if (!this.isanimating) {
                if (event.altKey && event.keyCode == 38) {
                    this.hideListBox();
                    return false;
                }

                if (event.altKey && event.keyCode == 40) {
                    if (!this.isOpened()) {
                        this.showListBox();
                    }
                    return false;
                }
            }

            if (event.keyCode == 37 || event.keyCode == 39)
                return false;

            if (event.altKey || event.keyCode == 18)
                return;

            if (event.keyCode >= 33 && event.keyCode <= 40) {
                return;
            }

            var value = this.input.val();
            if (value.length == 0 && !this.autoComplete) {
                this.hideListBox();
                this.listBox.selectIndex(-1, true);
                return;
            }

            if (this.remoteAutoComplete) {
                var me = this;
                if (value.length >= me.minLength) {
                    if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                        if (me.searchString != value) {
                            if (this._searchTimer) clearTimeout(this._searchTimer);
                            if (event.keyCode != 13 && event.keyCode != 27) {
                                this._searchTimer = setTimeout(function () {
                                    me.listBox.vScrollInstance.value = 0;
                                    me.selectedIndex = -1;
                                    me.listBox.selectedIndex = -1;
                                    me.listBox.clearSelection();
                                    me.listBox.autoHeight = true;
                                    me.searchString = me.input.val();
                                    me.search(me.input.val());
                                }, this.remoteAutoCompleteDelay);
                            }
                        }
                        me.searchString = value;
                    }
                }
                else if (this._searchTimer) clearTimeout(this._searchTimer);

                return;
            }

            var me = this;
            var matches = this._getMatches(value);
            var matchItems = matches.matchItems;
            var index = matches.index;

            if (me.autoComplete) {
                if (matchItems.length > 0 || value == '') {
                    this.listBox.vScrollInstance.value = 0;
                    this.listBox._addItems();
                    this.listBox.autoHeight = false;
                    if (this.listBox.virtualSize.height < parseInt(this.dropDownHeight)) {
                        this.listBox.autoHeight = true;
                        this.container.height(this.listBox.virtualSize.height + 25);
                        this.listBoxContainer.height(this.listBox.virtualSize.height);
                        this.listBox._arrange();
                    }
                    else {
                        this.listBox.height = this.dropDownHeight;
                        this.container.height(parseInt(this.dropDownHeight) + 25);
                        this.listBoxContainer.height(parseInt(this.dropDownHeight));
                        this.listBox._arrange();
                    }

                    this.listBox._addItems();
                    this.listBox._renderItems();

                    index = 0;
                }
                else index = -1;

                if (index == -1) {
                    this.hideListBox();
                }
            }

            if (event.keyCode == '13') {
                return;
            }
            else if (event.keyCode == '27') {
                if (this.tempSelectedIndex != undefined) {
                    this.listBox.selectIndex(this.tempSelectedIndex, true);
                    this.renderSelection('mouse');
                }

                this.hideListBox();
                event.preventDefault();
                return false;
            }
            else {
                if (index > -1) {
                    if (!this.isOpened() && !this.opening) {
                        this.tempSelectedIndex = this.listBox.selectedIndex;
                        this.showListBox();
                    }

                    this.listBox.selectIndex(index, true);
                }
                else if (index == -1) {
                    this.listBox.selectIndex(index, true);
                }
            }
        },

        // get all matches of a searched value.
        _getMatches: function (value) {
            var items = this.getItems();
            if (items == undefined) {
                return { index: -1, mathItem: new Array() }
            }

            var me = this;
            var index = -1;
            var matchItems = new Array();
            var newItemsIndex = 0;

            $.each(items, function (i) {
                var itemValue = '';
                if (!this.isGroup) {
                    if (this.label) {
                        itemValue = this.label;
                    }
                    else if (this.value) {
                        itemValue = this.value;
                    }
                    else if (this.title) {
                        itemValue = this.title;
                    }
                    else itemValue = 'jqxItem';

                    var mathes = false;
                    switch (me.searchMode) {
                        case 'containsignorecase':
                            mathes = $.jqx.string.containsIgnoreCase(itemValue, value);
                            break;
                        case 'contains':
                            mathes = $.jqx.string.contains(itemValue, value);
                            break;
                        case 'equals':
                            mathes = $.jqx.string.equals(itemValue, value);
                            break;
                        case 'equalsignorecase':
                            mathes = $.jqx.string.equalsIgnoreCase(itemValue, value);
                            break;
                        case 'startswith':
                            mathes = $.jqx.string.startsWith(itemValue, value);
                            break;
                        case 'startswithignorecase':
                            mathes = $.jqx.string.startsWithIgnoreCase(itemValue, value);
                            break;
                        case 'endswith':
                            mathes = $.jqx.string.endsWith(itemValue, value);
                            break;
                        case 'endswithignorecase':
                            mathes = $.jqx.string.endsWithIgnoreCase(itemValue, value);
                            break;
                    }

                    if (me.autoComplete && !mathes) {
                        this.visible = false;
                    }

                    if (mathes && me.autoComplete) {
                        matchItems[newItemsIndex++] = this;
                        this.visible = true;
                    }

                    if (value == '' && me.autoComplete) {
                        this.visible = true;
                        mathes = false;
                    }

                    if (mathes && !me.autoComplete) {
                        index = this.visibleIndex;
                        return false;
                    }
                }
            });

            return { index: index, matchItems: matchItems };
        },

        // gets all items that match to a search value.
        findItems: function (value) {
            var items = this.getItems();
            var me = this;
            var index = 0;
            var matchItems = new Array();

            $.each(items, function (i) {
                var itemValue = '';
                if (!this.isGroup) {
                    if (this.label) {
                        itemValue = this.label;
                    }
                    else if (this.value) {
                        itemValue = this.value;
                    }
                    else if (this.title) {
                        itemValue = this.title;
                    }
                    else itemValue = 'jqxItem';

                    var mathes = false;
                    switch (me.searchMode) {
                        case 'containsignorecase':
                            mathes = $.jqx.string.containsIgnoreCase(itemValue, value);
                            break;
                        case 'contains':
                            mathes = $.jqx.string.contains(itemValue, value);
                            break;
                        case 'equals':
                            mathes = $.jqx.string.equals(itemValue, value);
                            break;
                        case 'equalsignorecase':
                            mathes = $.jqx.string.equalsIgnoreCase(itemValue, value);
                            break;
                        case 'startswith':
                            mathes = $.jqx.string.startsWith(itemValue, value);
                            break;
                        case 'startswithignorecase':
                            mathes = $.jqx.string.startsWithIgnoreCase(itemValue, value);
                            break;
                        case 'endswith':
                            mathes = $.jqx.string.endsWith(itemValue, value);
                            break;
                        case 'endswithignorecase':
                            mathes = $.jqx.string.endsWithIgnoreCase(itemValue, value);
                            break;
                    }

                    if (mathes) {
                        matchItems[index++] = this;
                    }
                }
            });

            return matchItems;
        },

        //[optimize]
        _resetautocomplete: function () {
            $.each(this.listBox.items, function (i) {
                this.visible = true;
            });
            this.listBox.vScrollInstance.value = 0;
            this.listBox._addItems();
            this.listBox.autoHeight = false;

            this.listBox.height = this.dropDownHeight;
            this.container.height(parseInt(this.dropDownHeight) + 25);
            this.listBoxContainer.height(parseInt(this.dropDownHeight));
            this.listBox._arrange();

            this.listBox._addItems();
            this.listBox._renderItems();
        },

        // gets all items.
        getItems: function () {
            var item = this.listBox.items;
            return item;
        },

        _setSize: function () {
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

            var isPercentage = false;
            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                isPercentage = true;
                this.host.width(this.width);
            }

            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                isPercentage = true;
                this.host.height(this.height);
            }

            if (isPercentage) {
                this.refresh(false);
                var me = this;
                var width = this.host.width();
                if (this.dropDownWidth != 'auto') {
                    width = this.dropDownWidth;
                }
                this.listBoxContainer.jqxListBox({ width: width });
                this.container.width(parseInt(width) + 25);

                var resizeFunc = function () {
                    me._arrange();
                    if (me.dropDownWidth == 'auto') {
                        var width = me.host.width();
                        me.listBoxContainer.jqxListBox({ width: width });
                        me.container.width(parseInt(width) + 25);
                    }
                }

                $(window).resize(function () {
                    resizeFunc();
                });

                setInterval(function () {
                    var width = me.host.width();
                    var height = me.host.height();
                    if (me._lastWidth != width || me._lastHeight != height) {
                        resizeFunc();
                    }
                    me._lastWidth = width;
                    me._lastHeight = height;
                }, 100);
            }
        },

        // returns true when the listbox is opened, otherwise returns false.
        isOpened: function () {
            var me = this;
            var openedListBox = $.data(document.body, "openedComboJQXListBox");

            if (this.container.css('display') != 'block')
                return false;

            if (openedListBox != null && openedListBox == me.listBoxContainer) {
                return true;
            }

            return false;
        },

        render: function () {
            var self = this;
            var hovered = false;
            this.removeHandlers();

            if (!this.touch) {
                this.host.hover(function () {
                    if (!self.disabled && self.enableHover) {
                        hovered = true;
                        self.host.addClass(self.toThemeProperty('jqx-combobox-state-hover'));
                        self.dropdownlistArrowIcon.addClass(self.toThemeProperty('icon-arrow-down-hover'));
                        self.dropdownlistArrow.addClass(self.toThemeProperty('jqx-combobox-arrow-hover'));
                        self.dropdownlistArrow.addClass(self.toThemeProperty('jqx-fill-state-hover'));
                    }
                }, function () {
                    if (!self.disabled && self.enableHover) {
                        self.host.removeClass(self.toThemeProperty('jqx-combobox-state-hover'));
                        self.dropdownlistArrowIcon.removeClass(self.toThemeProperty('icon-arrow-down-hover'));
                        self.dropdownlistArrow.removeClass(self.toThemeProperty('jqx-combobox-arrow-hover'));
                        self.dropdownlistArrow.removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                        hovered = false;
                    }
                });
            }

            if (self.autoOpen) {
                this.addHandler(this.host, 'mouseenter', function () {
                    var isOpened = self.isOpened();
                    if (!isOpened && self.autoOpen) {
                        self.open();
                        self.host.focus();
                    }
                });

                $(document).bind('mousemove.' + self.element.id, function (event) {
                    var isOpened = self.isOpened();
                    if (isOpened && self.autoOpen) {
                        var offset = self.host.offset();
                        var top = offset.top;
                        var left = offset.left;
                        var popupOffset = self.container.offset();
                        var popupLeft = popupOffset.left;
                        var popupTop = popupOffset.top;

                        canClose = true;

                        if (event.pageY >= top && event.pageY <= top + self.host.height() + 2) {
                            if (event.pageX >= left && event.pageX < left + self.host.width())
                                canClose = false;
                        }
                        if (event.pageY >= popupTop && event.pageY <= popupTop + self.container.height() - 20) {
                            if (event.pageX >= popupLeft && event.pageX < popupLeft + self.container.width())
                                canClose = false;
                        }

                        if (canClose) {
                            self.close();
                        }
                    }
                });
            }

            this.addHandler(this.dropdownlistArrow, 'mousedown',
            function (event) {
                if (!self.disabled) {
                    var isOpen = self.container.css('display') == 'block';
                    if (!self.isanimating) {
                        if (isOpen) {
                            self.hideListBox();
                        }
                        else {
                            if (self.autoComplete) {
                                self._resetautocomplete();
                            }
                            if (self.autoDropDownHeight) {
                                self.container.height(self.listBoxContainer.height() + 25);
                                var autoheight = self.listBoxContainer.jqxListBox('autoHeight');
                                if (!autoheight) {
                                    self.listBoxContainer.jqxListBox({ autoHeight: self.autoDropDownHeight })
                                    self.listBox._arrange();
                                    self.listBox.ensureVisible(0);
                                    self.listBox._renderItems();
                                    self.container.height(self.listBoxContainer.height() + 25);
                                }
                            }
                            self.showListBox();
                        }
                    }
                }
            });

            this.addHandler(this.input, 'focus', function () {
                self.host.addClass(self.toThemeProperty('jqx-combobox-state-focus'));
                self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
            });
            this.addHandler(this.input, 'blur', function () {
                self.host.removeClass(self.toThemeProperty('jqx-combobox-state-focus'));
                self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                if (self._searchTimer) clearTimeout(self._searchTimer);
            });
            this.addHandler($(document), 'mousedown.' + this.element.id, self.closeOpenedListBox, { me: this, listbox: this.listBox, id: this.element.id });
            if (this.touch) {
                this.addHandler($(document), 'touchstart.' + this.element.id, self.closeOpenedListBox, { me: this, listbox: this.listBox, id: this.element.id });
            }
            if (window.frameElement) {
                if (window.top != null) {
                    var eventHandle = function (event) {
                        if (self.isOpened()) {
                            var data = { me: self, listbox: self.listBox, id: self.element.id };
                            event.data = data;
                            //self.closeOpenedListBox(event);
                        }
                    };

                    if (window.top.document.addEventListener) {
                        window.top.document.addEventListener('mousedown', eventHandle, false);

                    } else if (window.top.document.attachEvent) {
                        window.top.document.attachEvent("on" + 'mousedown', eventHandle);
                    }
                }
            }

            this.addHandler(this.host, 'keydown', function (event) {
                var isOpen = self.container.css('display') == 'block';

                if (self.host.css('display') == 'none') {
                    return true;
                }

                if (event.keyCode == '13') {
                    if (isOpen && !self.isanimating) {
                        self.renderSelection('mouse');
                        self.hideListBox();
                        if (!self.keyboardSelection) {
                            self._raiseEvent('2', { index: self.selectedIndex, type: 'keyboard', item: self.getItem(self.selectedIndex) });
                        }
                        else if (self.autoComplete) {
                            self._raiseEvent('2', { index: self.selectedIndex, type: 'keyboard', item: self.listBox.getVisibleItem(self.selectedIndex) });
                        }
                        return false;
                    }
                    else if (!isOpen) {
                        self.showListBox();
                    }
                }

                if (event.keyCode == 115) {
                    if (!self.isanimating) {
                        if (!self.isOpened()) {
                            self.showListBox();
                        }
                        else if (self.isOpened()) {
                            self.hideListBox();
                        }
                    }
                    return false;
                }

                if (event.altKey) {
                    if (self.host.css('display') == 'block') {
                        if (!self.isanimating) {
                            if (event.keyCode == 38) {
                                if (self.isOpened()) {
                                    self.hideListBox();
                                }
                            }
                            else if (event.keyCode == 40) {
                                if (!self.isOpened()) {
                                    self.showListBox();
                                }
                            }
                        }
                    }
                }

                if (event.keyCode == '27') {
                    if (self.tempSelectedIndex != undefined) {
                        self.selectIndex(self.tempSelectedIndex);
                    }
                    self.hideListBox();
                    event.preventDefault();
                    return false;
                }

                if (isOpen && !self.disabled) {
                    return self.listBox._handleKeyDown(event);
                }
                else if (!self.disabled && !isOpen) {
                    var key = event.keyCode;
                    // arrow keys.
                    if (key == 33 || key == 34 || key == 35 || key == 36 || key == 38 || key == 40) {
                        return self.listBox._handleKeyDown(event);
                    }
                }
            });

            this.addHandler(this.listBoxContainer, 'select', function (event) {
                if (!self.disabled) {
                    if (event.args.type != 'keyboard' || self.keyboardSelection) {
                        self.renderSelection(event.args.type);
                        self._raiseEvent('2', { index: event.args.index, type: event.args.type, item: event.args.item });
                        if (event.args.type == 'mouse') {
                            self.hideListBox();
                        }
                    }
                }
            });
            if (this.listBox != null && this.listBox.content != null) {
                this.addHandler(this.listBox.content, 'click', function (event) {
                    if (!self.disabled) {
                        self.renderSelection('mouse');
                        if (!self.touch && !self.ishiding) {
                            self.hideListBox();
                        }
                    }
                });
            }
        },

        removeHandlers: function () {
            var self = this;
            this.removeHandler(this.dropdownlistWrapper, 'mousedown');
            this.removeHandler(this.host, 'keydown');
            this.host.unbind('hover');
            this.removeHandler(this.input, 'focus');
            this.removeHandler(this.input, 'blur');
            this.removeHandler(this.host, 'mouseenter');
            $(document).unbind('mousemove.' + self.element.id);
        },

        // gets an item by index.
        getItem: function (index) {
            var item = this.listBox.getItem(index);
            return item;
        },

        // renders the selection.
        renderSelection: function (type) {
            if (type == undefined || type == 'none') {
                return;
            }

            if (this.listBox == null)
                return;

            var item = this.listBox.visibleItems[this.listBox.selectedIndex];
            if (item == null) {
                //  this.input.val("");
                return;
            }

            this.selectedIndex = this.listBox.selectedIndex;
            var spanElement = $('<span></span>');
            spanElement.appendTo($(document.body));
            spanElement.addClass(this.toThemeProperty('jqx-listitem-state-normal'));

            if (item.label != undefined && item.label != null && item.label.toString().length > 0) {
                spanElement.html(item.label);
            }
            else if (item.value != undefined && item.value != null && item.value.toString().length > 0) {
                spanElement.html(item.value);
            }
            else if (item.title != undefined && item.title != null && item.title.toString().length > 0) {
                spanElement.html(item.title);
            }
            else spanElement.html('jqxItem');

            var fontsize = this.dropdownlistContent.css('font-size');
            var fontfamily = this.dropdownlistContent.css('font-family');
            var topPadding = this.dropdownlistContent.css('padding-top');
            var bottomPadding = this.dropdownlistContent.css('padding-bottom');

            spanElement.css('font-size', fontsize);
            spanElement.css('font-family', fontfamily);
            spanElement.css('padding-top', topPadding);
            spanElement.css('padding-bottom', bottomPadding);

            var spanHeight = spanElement.outerHeight();
            this.input.val(spanElement.text());
            spanElement.remove();
            spanElement.removeClass();
            if (this.renderSelectedItem) {
                var result = this.renderSelectedItem(this.listBox.selectedIndex, item);
                if (result != undefined) {
                    this.input.val(result);
                }
            }
        },

        dataBind: function () {
            this.listBoxContainer.jqxListBox({ source: this.source });
            this.renderSelection('mouse');
            if (this.source == null) {
                this.clearSelection();
            }
        },

        clear: function () {
            this.listBoxContainer.jqxListBox({ source: null });
            this.clearSelection();
        },

        // clears the selection.
        clearSelection: function (render) {
            this.selectedIndex = -1;
            this.listBox.clearSelection();
            this.input.val("");
        },

        // unselects an item at specific index.
        // @param Number
        unselectIndex: function (index, render) {
            if (isNaN(index))
                return;

            this.listBox.unselectIndex(index, render);
            this.renderSelection('mouse');
        },

        // selects an item at specific index.
        // @param Number
        selectIndex: function (index, ensureVisible, render, forceSelect) {
            this.listBox.selectIndex(index, ensureVisible, render, forceSelect);
            this.renderSelection('mouse');
            this.selectedIndex = index;
        },

        // gets the selected index.
        getSelectedIndex: function () {
            return this.selectedIndex;
        },

        // gets the selected item.
        getSelectedItem: function () {
            return this.getItem(this.selectedIndex);
        },

        // inserts an item at specific index.
        // @param Number
        insertAt: function (item, index) {
            if (item == null)
                return false;

            return this.listBox.insertAt(item, index);
        },

        // adds a new item.
        addItem: function (item) {
            return this.listBox.addItem(item);
        },

        // removes an item at specific index.
        // @param Number
        removeAt: function (index) {
            var result = this.listBox.removeAt(index);
            this.renderSelection('mouse');
            return result;
        },

        // ensures that an item is visible.
        // @param Number
        ensureVisible: function (index) {
            this.listBox.ensureVisible(index);
        },

        // disables an item at specific index.
        // @param Number
        disableAt: function (index) {
            this.listBox.disableAt(index);
        },

        // enables an item at specific index.
        // @param Number
        enableAt: function (index) {
            this.listBox.enableAt(index);
        },

        _findPos: function (obj) {
            while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
                obj = obj['nextSibling'];
            }
            var position = $(obj).offset();
            return [position.left, position.top];
        },

        testOffset: function (element, offset, inputHeight) {
            var dpWidth = element.outerWidth();
            var dpHeight = element.outerHeight();
            var viewWidth = $(window).width() + $(window).scrollLeft();
            var viewHeight = $(window).height() + $(window).scrollTop();

            if (offset.left + dpWidth > viewWidth) {
                if (dpWidth > this.host.width()) {
                    var hostLeft = this.host.offset().left;
                    var hOffset = dpWidth - this.host.width();
                    offset.left = hostLeft - hOffset + 2;
                }
            }

            offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
                Math.abs(dpHeight + inputHeight + 23) : 0);

            return offset;
        },

        open: function () {
            this.showListBox();
        },

        close: function () {
            this.hideListBox();
        },

        //OBSOLETE use close instead. 
        hide: function () {
            this.close();
        },

        //OBSOLETE use open instead. 
        show: function () {
            this.open();
        },

        // shows the listbox.
        showListBox: function () {
            if (this.listBox.items && this.listBox.items.length == 0)
                return;

            var self = this;
            var listBox = this.listBoxContainer;
            var listBoxInstance = this.listBox;
            var scrollPosition = $(window).scrollTop();
            var scrollLeftPosition = $(window).scrollLeft();
            var top = parseInt(this._findPos(this.host[0])[1]) + parseInt(this.host.outerHeight()) + 'px';
            var left = parseInt(this.host.offset().left) + 'px';
            if ($.browser.mozilla) {
                //     var left = parseInt(this.host.offset().left) + 1 + 'px';
            }
            if (!this.keyboardSelection) {
                this.listBox.selectIndex(this.selectedIndex);
                this.listBox.ensureVisible(this.selectedIndex);
            }

            this.tempSelectedIndex = this.selectedIndex;
            var isMobileBrowser = $.jqx.mobile.isSafariMobileBrowser();
            this.ishiding = false;

            if (isMobileBrowser != null && isMobileBrowser) {
                left = $.jqx.mobile.getLeftPos(this.element);
                top = $.jqx.mobile.getTopPos(this.element) + parseInt(this.host.outerHeight());
            }

            this.host.addClass(this.toThemeProperty('jqx-combobox-state-selected'));
            this.dropdownlistArrowIcon.addClass(this.toThemeProperty('icon-arrow-down-selected'));
            this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-combobox-arrow-selected'));
            this.dropdownlistArrow.addClass(this.toThemeProperty('jqx-fill-state-pressed'));

            this.container.css('left', left);
            this.container.css('top', top);
            listBoxInstance._arrange();

            var closeAfterSelection = true;

            var positionChanged = false;

            if (this.dropDownHorizontalAlignment == 'right') {
                var containerWidth = this.container.width();
                var containerLeftOffset = Math.abs(containerWidth - this.host.width());
                if (containerWidth > this.host.width()) {
                    this.container.css('left', 25 + parseInt(left) - containerLeftOffset + "px");
                }
                else this.container.css('left', 25 + parseInt(left) + containerLeftOffset + "px");
            }

            if (this.enableBrowserBoundsDetection) {
                var newOffset = this.testOffset(listBox, { left: parseInt(this.container.css('left')), top: parseInt(top) }, parseInt(this.host.outerHeight()));
                if (parseInt(this.container.css('top')) != newOffset.top) {
                    positionChanged = true;
                    listBox.css('top', 23);
                }
                else listBox.css('top', 0);

                this.container.css('top', newOffset.top);
                this.container.css('top', newOffset.top);
                if (parseInt(this.container.css('left')) != newOffset.left) {
                    this.container.css('left', newOffset.left);
                }
            }

            if (this.animationType == 'none') {
                this.container.css('display', 'block');
                $.data(document.body, "openedComboJQXListBoxParent", self);
                $.data(document.body, "openedComboJQXListBox", listBox);
                listBox.css('margin-top', 0);
                listBox.css('opacity', 1);
            }
            else {
                this.container.css('display', 'block');
                var height = listBox.outerHeight();
                listBox.stop();
                if (this.animationType == 'fade') {
                    listBox.css('margin-top', 0);
                    listBox.css('opacity', 0);
                    listBox.animate({ 'opacity': 1 }, this.openDelay, function () {
                        self.isanimating = false;
                        self.opening = false;
                        $.data(document.body, "openedComboJQXListBoxParent", self);
                        $.data(document.body, "openedComboJQXListBox", listBox);
                    });
                }
                else {
                    listBox.css('opacity', 1);
                    if (positionChanged) {
                        listBox.css('margin-top', height);
                    }
                    else {
                        listBox.css('margin-top', -height);
                    }
                    this.isanimating = true;
                    this.opening = true;
                    listBox.animate({ 'margin-top': 0 }, this.openDelay, function () {
                        self.isanimating = false;
                        self.opening = false;
                        $.data(document.body, "openedComboJQXListBoxParent", self);
                        $.data(document.body, "openedComboJQXListBox", listBox);
                    });
                }
            }
            listBoxInstance._renderItems();
            this._raiseEvent('0', listBoxInstance);
        },

        // hides the listbox.
        hideListBox: function () {
            var listBox = this.listBoxContainer;
            var listBoxInstance = this.listBox;
            var container = this.container;
            if (this.container.css('display') == 'none')
                return;

            this.tempSelectedIndex = undefined;
            var me = this;
            $.data(document.body, "openedComboJQXListBox", null);
            if (this.animationType == 'none') {
                this.container.css('display', 'none');
            }
            else {
                if (!this.ishiding) {
                    var height = listBox.outerHeight();
                    listBox.css('margin-top', 0);
                    listBox.stop();
                    this.isanimating = true;
                    var animationValue = -height;
                    if (parseInt(this.container.offset().top) < parseInt(this.host.offset().top)) {
                        animationValue = height;
                    }
                    if (this.animationType == 'fade') {
                        listBox.css({ 'opacity': 1 });
                        listBox.animate({ 'opacity': 0 }, this.closeDelay, function () {
                            me.isanimating = false;
                            container.css('display', 'none');
                            me.ishiding = false;
                        });
                    }
                    else {
                        listBox.animate({ 'margin-top': animationValue }, this.closeDelay, function () {
                            me.isanimating = false;
                            container.css('display', 'none'); me.ishiding = false;
                        });
                    }
                }
            }

            this.ishiding = true;
            this.host.removeClass(this.toThemeProperty('jqx-combobox-state-selected'));
            this.dropdownlistArrowIcon.removeClass(this.toThemeProperty('icon-arrow-down-selected'));
            this.dropdownlistArrow.removeClass(this.toThemeProperty('jqx-combobox-arrow-selected'));
            this.dropdownlistArrow.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));

            this._raiseEvent('1', listBoxInstance);
        },

        /* Close popup if clicked elsewhere. */
        closeOpenedListBox: function (event) {
            var self = event.data.me;
            var $target = $(event.target);
            var openedListBox = event.data.listbox;
            if (openedListBox == null)
                return true;

            if ($(event.target).ischildof(event.data.me.host)) {
                return;
            }

            var dropdownlistInstance = self;

            var isListBox = false;
            $.each($target.parents(), function () {
                if (this.className != 'undefined') {
                    if (this.className.indexOf) {
                        if (this.className.indexOf('jqx-listbox') != -1) {
                            isListBox = true;
                            return false;
                        }
                        if (this.className.indexOf('jqx-combobox') != -1) {
                            if (self.element.id == this.id) {
                                isListBox = true;
                            }
                            return false;
                        }
                    }
                }
            });

            if (openedListBox != null && !isListBox) {
                if (!self.touch) {
                    if (self.tempSelectedIndex != undefined) {
                        self.listBox.selectIndex(self.tempSelectedIndex, true);
                        self.renderSelection('mouse');
                    }
                }

                self.hideListBox();
            }

            return true;
        },

        loadFromSelect: function (id) {
            this.listBox.loadFromSelect(id);
        },

        refresh: function (partialRefresh) {
            this._arrange();
            this.renderSelection('mouse');
            if (partialRefresh != true) {
                this.dataBind();
            }
        },

        _arrange: function () {
            var width = parseInt(this.host.width());
            var height = parseInt(this.host.height());
            var arrowHeight = this.arrowSize;
            var arrowWidth = this.arrowSize;
            var rightOffset = 1;
            var contentWidth = width - arrowWidth - 1 * rightOffset;
            if (contentWidth > 0) {
                this.dropdownlistContent.width(contentWidth + 'px');
            }

            this.dropdownlistContent.height(height);
            this.dropdownlistContent.css('left', 0);
            this.dropdownlistContent.css('top', 0);

            this.dropdownlistArrow.width(arrowWidth);
            this.dropdownlistArrow.height(height);
            this.dropdownlistArrow.css('left', 1 + contentWidth + 'px');
            this.input.css('width', '100%');
            this.input.addClass(this.toThemeProperty('jqx-rc-all'));
            var top = parseInt(height) / 2 - parseInt(this.input.height()) / 2;
            if (top > 0) {
                this.input.css('margin-top', top);
            }
        },

        destroy: function () {
            this.listBoxContainer.remove();
            this.host.removeClass();
            this.removeHandler($(document), 'mousedown.' + this.element.id, self.closeOpenedListBox);
        },

        //[optimize]
        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            args = arg;
            args.owner = this;

            var event = new jQuery.Event(evt);
            event.owner = this;
            if (id == 2 || id == 3 || id == 4) {
                event.args = arg;
            }

            var result = this.host.trigger(event);
            return result;
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (object.isInitialized == undefined || object.isInitialized == false)
                return;

            if (key == 'autoOpen') {
                object.render();
            }

            if (key == 'renderer') {
                object.listBox.renderer = object.renderer;
            }
            if (key == 'itemHeight') {
                object.listBox.itemHeight = value;
            }

            if (key == 'source') {
                object.listBoxContainer.jqxListBox({ source: object.source });
                object.renderSelection('mouse');
                if (object.source == null) {
                    object.clearSelection();
                }
            }

            if (key == "displayMember" || key == "valueMember") {
                object.listBoxContainer.jqxListBox({ displayMember: object.displayMember, valueMember: object.valueMember });
                object.renderSelection('mouse');
            }

            if (key == "autoDropDownHeight") {
                object.listBoxContainer.jqxListBox({ autoHeight: object.autoDropDownHeight });
                if (object.autoDropDownHeight) {
                    object.container.height(object.listBoxContainer.height() + 25);
                }
                else {
                    object.listBoxContainer.jqxListBox({ height: object.dropDownHeight });
                    object.container.height(parseInt(object.dropDownHeight) + 25);
                }
            }

            if (key == "dropDownHeight") {
                if (!object.autoDropDownHeight) {
                    object.listBoxContainer.jqxListBox({ height: object.dropDownHeight });
                    object.container.height(parseInt(object.dropDownHeight) + 25);
                }
            }

            if (key == "dropDownWidth" || key == "scrollBarSize") {
                var width = object.width;
                if (object.dropDownWidth != 'auto') {
                    width = object.dropDownWidth;
                }

                object.listBoxContainer.jqxListBox({ width: width, scrollBarSize: object.scrollBarSize });
                object.container.width(parseInt(width) + 25);
            }

            if (key == 'autoComplete') {
                object._resetautocomplete();
            }

            if (key == 'theme' && value != null) {
                object.listBoxContainer.jqxListBox({ theme: value });
                object.dropdownlistContent.removeClass();
                object.dropdownlistContent.addClass(object.toThemeProperty('jqx-combobox-content'));
                object.dropdownlistContent.addClass(object.toThemeProperty('jqx-widget-content'));
                object.input.removeClass();
                object.input.addClass(object.toThemeProperty('jqx-combobox-input'));
                object.input.addClass(this.toThemeProperty('jqx-widget-content'));
                object.host.removeClass();
                object.host.addClass(object.toThemeProperty('jqx-combobox-state-normal'));
                object.host.addClass(object.toThemeProperty('jqx-rc-all'));
                object.host.addClass(object.toThemeProperty('jqx-widget'));
                object.host.addClass(object.toThemeProperty('jqx-widget-content'));
                object.dropdownlistArrow.removeClass();
                object.dropdownlistArrowIcon.addClass(object.toThemeProperty('icon-arrow-down'));
                object.dropdownlistArrow.addClass(object.toThemeProperty('jqx-combobox-arrow-normal'));
                object.dropdownlistArrow.addClass(object.toThemeProperty('jqx-fill-state-normal'));
            }

            if (key == 'width' || key == 'height') {
                object._setSize();
                object._arrange();
            }

            if (key == 'selectedIndex') {
                object.listBox.selectIndex(value);
                object.renderSelection('mouse');
            }
        }
    });
})(jQuery);
