/*
jQWidgets v2.4.2 (2012-Sep-12)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/

/*
*   Depends:
*       jqxcore.js
*       jqxbuttons.js
*       jqxpanel.js
*       jqxscrollbar.js
*       jqxcheckbox.js (optional to enable the checkboxes feature.)
*/

(function ($) {

    $.jqx.jqxWidget("jqxTree", "", {});

    $.extend($.jqx._jqxTree.prototype, {
        defineInstance: function () {
            //Type: Array
            //Gets the tree's items.
            this.items = new Array();
            //Type: Number.
            //Default: null.
            //Sets the width.
            this.width = null;
            //Type: Number.
            //Default: null.
            //Sets the height.
            this.height = null;
            //Type: String.
            //Default: easeInOutSine.
            //Gets or sets the animation's easing to one of the JQuery's supported easings.         
            this.easing = 'easeInOutCirc';
            //Type: Number.
            //Default: 'fast'.
            //Gets or sets the duration of the show animation.         
            this.animationShowDuration = 'fast';
            //Type: Number.
            //Default: 'fast'.
            //Gets or sets the duration of the hide animation.
            this.animationHideDuration = 'fast';
            //Type: Array.
            this.treeElements = new Array();
            //Type: Boolean.
            //Default: true.
            //Enables or disables the tree.
            this.disabled = false;
            // Type: Boolean
            // Default: true
            // enables or disables the hover state.
            this.enableHover = true;
            // Type: Boolean
            // Default: true
            // enables or disables the key navigation.
            this.keyboardNavigation = true;
            this.enableKeyboardNavigation = true;
            // Type: String
            // Default: click
            // Gets or sets user interaction used for expanding or collapsing any item. Possible values ['click', 'dblclick'].
            this.toggleMode = 'dblclick';
            // Type: Object
            // Default: null
            // data source.
            this.source = null;
            // Type: Boolean
            // Default: false
            // Gets or sets whether the tree should display a checkbox next to each item.
            this.checkboxes = false;
            this.checkSize = 13;
            this.toggleIndicatorSize = 16;
            // Type: Boolean
            // Default: false
            // Gets or sets whether the tree checkboxes have three states - checked, unchecked and indeterminate.           
            this.hasThreeStates = false;
            // Type: Object
            // Default: null
            // Private
            // gets the selected item. To select an item, use the selectItem function.
            this.selectedItem = null;
            this.touchMode = 'auto';
            // tree events.
            // expand is triggered when the user expands a tree item.
            // collapse is triggered when the user collapses a tree item.
            // select is triggered when the user selects a tree item.
            // add is triggered when the user adds a new tree item.
            // remove is triggered when the user removes a tree item.
            // checkchange is triggered when the user checks, unchecks or the checkbox is in indeterminate state.
            this.allowDrag = true;
            this.allowDrop = true;
            this.animationHideDelay = 0;
            // Possible values: 'none, 'default', 'copy'
            this.dropAction = 'default';
            this.events =
		    [
                'expand', 'collapse', 'select', 'initialized', 'added', 'removed', 'checkChange', 'dragEnd', 'dragStart'
            ];
        },

        createInstance: function (args) {
            var self = this;

            this.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (self.disabled) {
                    self.host.addClass(self.toThemeProperty('jqx-tree-disabled'));
                }
                else {
                    self.host.removeClass(self.toThemeProperty('jqx-tree-disabled'));
                }
            }

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

            this.host.attr('tabIndex', 1);

            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-tree-disabled'));
            }

            if (this.host.jqxDragDrop) {
                jqxTreeDragDrop();
            }

            this.originalInnerHTML = this.element.innerHTML;
            this.createdTree = false;
            if (this.element.innerHTML.indexOf('UL')) {
                var innerElement = this.host.find('ul:first');
                if (innerElement.length > 0) {
                    this.createTree(innerElement[0]);
                    this.createdTree = true;
                }
            }

            if (this.source != null) {
                var html = this.loadItems(this.source);
                this.element.innerHTML = html;
                var innerElement = this.host.find('ul:first');
                if (innerElement.length > 0) {
                    this.createTree(innerElement[0]);
                    this.createdTree = true;
                }
            }

            this._itemslength = this.items.length;

            if (!this.createdTree) {
                if (this.host.find('ul').length == 0) {
                    this.host.append($('<ul></ul>'));
                    var innerElement = this.host.find('ul:first');
                    if (innerElement.length > 0) {
                        this.createTree(innerElement[0]);
                        this.createdTree = true;
                    }

                    this.createdTree = true;
                }
            }

            if (this.createdTree == true) {
                this._render();
                this._handleKeys();
            }

            this._updateCheckLayout(0);
        },

        checkItems: function (item, baseItem) {
            var me = this;
            if (item != null) {
                var count = 0;
                var hasIndeterminate = false;
                var itemsCount = 0;

                var childItems = $(item.element).find('li');
                itemsCount = childItems.length;

                $.each(childItems, function (index) {
                    var child = me.itemMapping["id" + this.id].item;
                    if (child.checked != false) {
                        if (child.checked == null) {
                            hasIndeterminate = true;
                        }
                        count++;
                    }
                });

                if (item != baseItem) {
                    if (count == itemsCount) {
                        this.checkItem(item.element, true);
                    }
                    else {
                        if (count > 0) {
                            this.checkItem(item.element, null);
                        }
                        else this.checkItem(item.element, false);

                    }
                }
                else {
                    var checked = baseItem.checked;
                    var childItems = $(baseItem.element).find('li');
                    $.each(childItems, function () {
                        var child = me.itemMapping["id" + this.id].item;
                        me.checkItem(this, checked);
                    });
                }

                this.checkItems(this._parentItem(item), baseItem);
            }
            else {
                var checked = baseItem.checked;
                var childItems = $(baseItem.element).find('li');
                $.each(childItems, function () {
                    var child = me.itemMapping["id" + this.id].item;
                    me.checkItem(this, checked);
                });
            }
        },

        _handleKeys: function () {
            var self = this;
            this.addHandler(this.host, 'keydown', function (event) {
                var key = event.keyCode;
                if (self.keyboardNavigation || self.enableKeyboardNavigation) {
                    if (self.selectedItem != null) {
                        var element = self.selectedItem.element;
                        switch (key) {
                            case 32:
                                if (self.checkboxes) {
                                    self.fromKey = true;
                                    var checked = $(self.selectedItem.checkBoxElement).jqxCheckBox('checked');
                                    self.checkItem(self.selectedItem.element, !checked);
                                    if (self.hasThreeStates) {
                                        self.checkItems(self.selectedItem, self.selectedItem);
                                    }
                                }
                                return false;
                            case 33:
                                var itemsOnPage = self._getItemsOnPage();
                                var prevItem = self.selectedItem;
                                for (i = 0; i < itemsOnPage; i++) {
                                    prevItem = self._prevVisibleItem(prevItem);
                                }
                                if (prevItem != null) {
                                    self.selectItem(prevItem.element);
                                    self.ensureVisible(prevItem.element);
                                }
                                else {
                                    self.selectItem(self._firstItem().element);
                                    self.ensureVisible(self._firstItem().element);
                                }
                                return false;
                            case 34:
                                var itemsOnPage = self._getItemsOnPage();
                                var nextItem = self.selectedItem;
                                for (i = 0; i < itemsOnPage; i++) {
                                    nextItem = self._nextVisibleItem(nextItem);
                                }
                                if (nextItem != null) {
                                    self.selectItem(nextItem.element);
                                    self.ensureVisible(nextItem.element);
                                }
                                else {
                                    self.selectItem(self._lastItem().element);
                                    self.ensureVisible(self._lastItem().element);
                                }
                                return false;
                            case 37:
                                if (self.selectedItem.hasItems) {
                                    self.collapseItem(element);
                                }
                                return false;
                            case 39:
                                if (self.selectedItem.hasItems) {
                                    self.expandItem(element);
                                }
                                return false;
                            case 13:
                                if (self.selectedItem.hasItems) {
                                    if (self.selectedItem.isExpanded) {
                                        self.collapseItem(element);
                                    }
                                    else {
                                        self.expandItem(element);
                                    }
                                }
                                return false;
                            case 36:
                                self.selectItem(self._firstItem().element);
                                self.ensureVisible(self._firstItem().element);
                                return false;
                            case 35:
                                self.selectItem(self._lastItem().element);
                                self.ensureVisible(self._lastItem().element);
                                return false;
                            case 38:
                                var prevItem = self._prevVisibleItem(self.selectedItem);
                                if (prevItem != null) {
                                    self.selectItem(prevItem.element);
                                    self.ensureVisible(prevItem.element);
                                }
                                return false;
                            case 40:
                                var nextItem = self._nextVisibleItem(self.selectedItem);
                                if (nextItem != null) {
                                    self.selectItem(nextItem.element);
                                    self.ensureVisible(nextItem.element);
                                }
                                return false;
                        }
                    }
                }
            });
        },

        _firstItem: function () {
            var item = null;
            var me = this;
            var innerElement = this.host.find('ul:first');
            var liTags = $(innerElement).find('li');

            for (i = 0; i <= liTags.length - 1; i++) {
                var listTag = liTags[i];
                item = this.itemMapping["id" + listTag.id].item;
                if (me._isVisible(item)) {
                    return item;
                }
            }

            return null;
        },

        _lastItem: function () {
            var item = null;
            var me = this;
            var innerElement = this.host.find('ul:first');
            var liTags = $(innerElement).find('li');

            for (i = liTags.length - 1; i >= 0; i--) {
                var listTag = liTags[i];
                item = this.itemMapping["id" + listTag.id].item;
                if (me._isVisible(item)) {
                    return item;
                }
            }

            return null;
        },

        _parentItem: function (item) {
            if (item == null || item == undefined)
                return null;

            var parent = item.parentElement;
            var parentItem = null;

            $.each(this.items, function () {
                if (this.element == parent) {
                    parentItem = this;
                    return false;
                }
            });

            return parentItem;
        },

        _nextVisibleItem: function (item) {
            if (item == null || item == undefined)
                return null;

            var currentItem = item;
            while (currentItem != null) {
                currentItem = currentItem.nextItem;
                if (this._isVisible(currentItem) && !currentItem.disabled)
                    return currentItem;
            }

            return null;
        },

        _prevVisibleItem: function (item) {
            if (item == null || item == undefined)
                return null;

            var currentItem = item;
            while (currentItem != null) {
                currentItem = currentItem.prevItem;
                if (this._isVisible(currentItem) && !currentItem.disabled)
                    return currentItem;
            }

            return null;
        },

        _isVisible: function (item) {
            if (item == null || item == undefined)
                return false;

            if (!this._isElementVisible(item.element))
                return false;

            var currentItem = this._parentItem(item);

            if (currentItem == null)
                return true;

            if (currentItem != null) {
                if (!this._isElementVisible(currentItem.element)) {
                    return false;
                }

                if (currentItem.isExpanded) {
                    while (currentItem != null) {
                        currentItem = this._parentItem(currentItem);
                        if (currentItem != null && !this._isElementVisible(currentItem.element)) {
                            return false;
                        }

                        if (currentItem != null && !currentItem.isExpanded)
                            return false;
                    }
                }
                else {
                    return false;
                }
            }

            return true;
        },

        _getItemsOnPage: function () {
            var itemsCount = 0;
            var position = this.panel.jqxPanel('getVScrollPosition');
            var height = parseInt(this.host.height());
            var itemsHeight = 0;
            var firstItem = this._firstItem();

            if (parseInt($(firstItem.element).height()) > 0) {
                while (itemsHeight <= height) {
                    itemsHeight += parseInt($(firstItem.element).outerHeight());
                    itemsCount++;
                }
            }

            return itemsCount;
        },

        _isElementVisible: function (element) {
            if (element == null)
                return false;

            if ($(element).css('display') != 'none' && $(element).css('visibility') != 'hidden') {
                return true;
            }

            return false;
        },

        refresh: function () {
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

            if (this.panel) {
                if (this.width != null && this.width.toString().indexOf("%") != -1) {
                    var me = this;
                    this.panel.jqxPanel('width', '100%');
                    $(window).resize(function () {
                        me._calculateWidth();
                    });
                }
                else {
                    this.panel.jqxPanel('width', this.host.width());
                }
                this.panel.jqxPanel('height', this.height);
                this.panel.jqxPanel('_arrange');
            }
            this._calculateWidth();
        },

        loadItems: function (items) {
            if (items == null) {
                return;
            }

            var self = this;
            this.items = new Array();
            var html = '<ul>';
            $.map(items, function (item) {
                if (item == undefined)
                    return null;

                html += self._parseItem(item);
            });

            html += '</ul>';
            return html;
        },

        _parseItem: function (item) {
            var html = "";

            if (item == undefined)
                return null;

            var label = item.label;
            if (!item.label && item.html) {
                label = item.html;
            }
            if (!label) {
                label = "Item";
            }

            var expanded = false;
            if (item.expanded != undefined && item.expanded) {
                expanded = true;
            }

            var locked = false;
            if (item.locked != undefined && item.locked) {
                locked = true;
            }

            var selected = false;
            if (item.selected != undefined && item.selected) {
                selected = true;
            }

            var disabled = false;
            if (item.disabled != undefined && item.disabled) {
                disabled = true;
            }

            var checked = false;
            if (item.checked != undefined && item.checked) {
                checked = true;
            }

            var icon = item.icon;
            var iconsize = item.iconsize;

            html += '<li';
            if (expanded) {
                html += ' item-expanded="true" ';
            }

            if (locked) {
                html += ' item-locked="true" ';
            }

            if (disabled) {
                html += ' item-disabled="true" ';
            }

            if (selected) {
                html += ' item-selected="true" ';
            }

            if (iconsize) {
                html += ' item-iconsize="' + item.iconsize + '" ';
            }

            if (icon != null && icon != undefined) {
                html += ' item-icon="' + icon + '" ';
            }

            if (item.label && !item.html) {
                html += ' item-label="' + label + '" ';
            }

            if (item.value != null) {
                html += ' item-value="' + item.value + '" ';
            }

            if (item.checked != undefined) {
                html += ' item-checked="' + checked + '" ';
            }

            if (item.id != undefined) {
                html += ' id="' + item.id + '" ';
            }

            html += '>' + label;

            if (item.items) {
                html += this.loadItems(item.items);
            }

            html += '</li>';
            return html;
        },

        // ensures the visibility of an element.
        // @ param element.
        ensureVisible: function (element) {
            if (element == null || element == undefined)
                return;

            var position = this.panel.jqxPanel('getVScrollPosition');
            var hposition = this.panel.jqxPanel('getHScrollPosition');
            var height = parseInt(this.host.height());
            var elementPosition = $(element).position().top;

            if (elementPosition <= position || elementPosition >= height + position) {
                this.panel.jqxPanel('scrollTo', hposition, elementPosition - height + $(element).outerHeight());
            }
        },

        // adds an element.
        // @param Array of items
        // @param id of parent item.
        addTo: function (items, parentElement, refresh) {
            if (items == undefined || items == null) {
                return;
            }

            var me = this;
            var array = new Array();

            if (!$.isArray(items)) {
                array[0] = items;
            }
            else array = items;

            if (this.element.innerHTML.indexOf('UL')) {
                var innerElement = me.host.find('ul:first');
            }
            if (innerElement.length == 0)
                return;

            $.each(array, function () {
                var item = this;
                var html = me._parseItem(item);
                if (html.length > 0) {
                    if (parentElement == undefined && parentElement == null) {
                        var element = $(html);
                        innerElement.append(element);
                        me._createItem(element[0]);
                    }
                    else {
                        parentElement = $(parentElement);
                        var parentUL = parentElement.find('ul:first');
                        var element = null;
                        if (parentUL.length == 0) {
                            ulElement = $('<ul></ul>');
                            $(parentElement).append(ulElement);
                            element = $(html);
                            parentUL = parentElement.find('ul:first');
                            var item = me.itemMapping["id" + parentElement[0].id].item;
                            item.subtreeElement = parentUL[0];
                            item.hasItems = true;
                            parentUL.addClass(me.toThemeProperty('jqx-tree-dropdown'));
                            parentUL.append(element);
                            element = parentUL.find('li:first');
                        }
                        else {
                            element = $(html);
                            parentUL.append(element);
                        }
                        me._createItem(element[0]);
                    }
                }
            });

            if (refresh == false) {
                this._raiseEvent('4', { items: items });
                return;
            }

            me._updateItemsNavigation();
            me._render();
            this._raiseEvent('4', { items: items });
            if (this.allowDrag && this._enableDragDrop) {
                this._enableDragDrop();
            }
        },

        // removes an element.
        // @param element
        removeItem: function (element, refresh) {
            if (element == undefined || element == null) {
                return;
            }

            var me = this;
            var id = element.id;

            if (this.host.find('#' + element.id).length > 0) {
                $(element).remove();
            }

            if (refresh == false) {
                this._raiseEvent('5');
                return;
            }

            me._updateItemsNavigation();
            me._render();
            if (me.selectedItem != null) {
                if (me.selectedItem.element == element) {
                    $(me.selectedItem.titleElement).removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                    $(me.selectedItem.titleElement).removeClass(me.toThemeProperty('jqx-tree-item-selected'));
                    me.selectedItem = null;
                }
            }
            this._raiseEvent('5');
            if (this.allowDrag && this._enableDragDrop) {
                this._enableDragDrop();
            }
        },

        clear: function () {
            this.items = new Array();
            this.itemMapping = new Array();
            var element = this.host.find('ul:first');
            if (element.length > 0) {
                element[0].innerHTML = "";
            }
            this.selectedItem = null;
        },

        // disables a tree item.
        // @param element
        disableItem: function (element) {
            if (element == null)
                return false;

            var me = this;
            $.each(me.items, function () {
                var item = this;
                if (item.element == element) {
                    // me.collapseItem(item.element);
                    item.disabled = true;
              //      $(item.titleElement).removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
              //      $(item.titleElement).removeClass(me.toThemeProperty('jqx-tree-item-selected'));
                    $(item.titleElement).addClass(me.toThemeProperty('jqx-fill-state-disabled'));
                    $(item.titleElement).addClass(me.toThemeProperty('jqx-tree-item-disabled'));
                    if (me.checkboxes && item.checkBoxElement) {
                        $(item.checkBoxElement).jqxCheckBox({ disabled: true });
                    }
                    return false;
                }
            });
        },

        // checks a tree item.
        // @param element
        // @param checked state - true, false or null
        checkItem: function (element, checked) {
            if (element == null)
                return false;

            var me = this;
            var stateChanged = false;
            $.each(me.items, function () {
                var item = this;
                if (item.element == element && !item.disabled) {
                    stateChanged = true;
                    item.checked = checked;
                    $(item.checkBoxElement).jqxCheckBox({ checked: checked });
                    return false;
                }
            });

            if (stateChanged) {
                this._raiseEvent('6', { element: element, checked: checked });
            }
        },

        // enables a tree item.
        // @param element
        enableItem: function (element) {
            if (element == null)
                return false;

            var me = this;
            $.each(me.items, function () {
                var item = this;
                if (item.element == element) {
                    item.disabled = false;
                    $(item.titleElement).removeClass(me.toThemeProperty('jqx-fill-state-disabled'));
                    $(item.titleElement).removeClass(me.toThemeProperty('jqx-tree-item-disabled'));
                    if (me.checkboxes && item.checkBoxElement) {
                        $(item.checkBoxElement).jqxCheckBox({ disabled: false });
                    }
                    return false;
                }
            });
        },

        // enables all items.
        enableAll: function () {
            var me = this;
            $.each(me.items, function () {
                var item = this;
                item.disabled = false;
                $(item.titleElement).removeClass(me.toThemeProperty('jqx-tree-item-disabled'));
                $(item.titleElement).removeClass(me.toThemeProperty('jqx-fill-state-disabled'));
                if (me.checkboxes && item.checkBoxElement) {
                    $(item.checkBoxElement).jqxCheckBox({ disabled: false });
                }
            });
        },

        // locks a tree item.
        // @param element
        lockItem: function (element) {
            if (element == null)
                return false;

            var me = this;
            $.each(me.items, function () {
                var item = this;
                if (item.element == element) {
                    item.locked = true;
                    return false;
                }
            });
        },

        // unlocks a tree item.
        // @param element
        unlockItem: function (element) {
            if (element == null)
                return false;

            var me = this;
            $.each(me.items, function () {
                var item = this;
                if (item.element == element) {
                    item.locked = false;
                    return false;
                }
            });
        },

        // gets all tree items.
        getItems: function () {
            return this.items;
        },

        // gets item's instance.
        getItem: function (element) {
            if (element == null || element == undefined)
                return null;

            if (this.itemMapping["id" + element.id]) {
                var item = this.itemMapping["id" + element.id].item;
                return item;
            }

            return null;
        },

        // gets whether the element is expanded.
        isExpanded: function (element) {
            if (element == null || element == undefined)
                return false;

            var item = this.itemMapping["id" + element.id].item;
            if (item != null) {
                return item.isExpanded;
            }

            return false;
        },

        // gets whether the element is selected.
        isSelected: function (element) {
            if (element == null || element == undefined)
                return false;

            var item = this.itemMapping["id" + element.id].item;
            if (item != null) {
                return item == this.selectedItem;
            }

            return false;
        },

        getPrevItem: function (element) {
            var item = this.getItem(element);
            var prevItem = this._prevVisibleItem(item);
            return prevItem;
        },

        getNextItem: function (element) {
            var item = this.getItem(element);
            var nextItem = this._nextVisibleItem(item);
            return nextItem;
        },

        getSelectedItem: function (element) {
            return this.selectedItem;
        },

        // selects an item.
        // @param element
        selectItem: function (element) {
            if (this.disabled)
                return;

            var me = this;

            if (element == null || element == undefined) {
                if (me.selectedItem != null) {
                    $(me.selectedItem.titleElement).removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                    $(me.selectedItem.titleElement).removeClass(me.toThemeProperty('jqx-tree-item-selected'));
                    me.selectedItem = null;
                }
                return;
            }

            if (this.selectedItem != null && this.selectedItem.element == element)
                return;

            var oldSelectedElement = this.selectedItem != null ? this.selectedItem.element : null;

            $.each(me.items, function () {
                var item = this;
                if (!item.disabled) {
                    if (item.element == element) {
                        if (me.selectedItem == null || (me.selectedItem != null && me.selectedItem.titleElement != item.titleElement)) {
                            if (me.selectedItem != null) {
                                $(me.selectedItem.titleElement).removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                                $(me.selectedItem.titleElement).removeClass(me.toThemeProperty('jqx-tree-item-selected'));
                            }

                            $(item.titleElement).addClass(me.toThemeProperty('jqx-fill-state-pressed'));
                            $(item.titleElement).addClass(me.toThemeProperty('jqx-tree-item-selected'));
                            me.selectedItem = item;
                        }
                    }
                }
            });

            this._raiseEvent('2', { element: element, prevElement: oldSelectedElement });
        },

        // collapses all items.
        collapseAll: function () {
            var me = this;
            var items = me.items;
            $.each(items, function () {
                var item = this;
                if (item.isExpanded == true) {
                    me._collapseItem(me, item);
                }
            });
        },

        // expands all items.
        expandAll: function () {
            var me = this;

            $.each(this.items, function () {
                var item = this;
                if (item.hasItems) {
                    me._expandItem(me, item);
                }
            });
        },

        //  @param element
        //  expands a tree item by its html element.
        collapseItem: function (element) {
            if (element == null)
                return false;

            var me = this;
            $.each(this.items, function () {
                var item = this;
                if (item.isExpanded == true && item.element == element) {
                    me._collapseItem(me, item);
                    return false;
                }
            });

            return true;
        },

        // @param element
        // expands a tree item by its html element.
        expandItem: function (element) {
            if (element == null)
                return false;

            var me = this;
            $.each(me.items, function () {
                var item = this;

                if (item.isExpanded == false && item.element == element && !item.disabled && !item.locked) {
                    me._expandItem(me, item);
                    if (item.parentElement) {
                        me.expandItem(item.parentElement);
                    }
                }
            });

            return true;
        },

        _getClosedSubtreeOffset: function (item) {
            var $subtree = $(item.subtreeElement);
            var top = -$subtree.outerHeight();
            var left = -$subtree.outerWidth();
            left = 0;
            return { left: left, top: top };
        },

        _collapseItem: function (me, item, subs, force) {
            if (me == null || item == null)
                return false;

            if (item.disabled)
                return false;

            if (me.disabled)
                return false;

            if (me.locked)
                return false;

            var $subtree = $(item.subtreeElement);

            var subtreeOffset = this._getClosedSubtreeOffset(item);
            var top = subtreeOffset.top;
            var left = subtreeOffset.left;

            $treeElement = $(item.element);
            var delay = me.animationHideDelay;
            delay = 0;

            if ($subtree.data('timer').show != null) {
                clearTimeout($subtree.data('timer').show);
                $subtree.data('timer').show = null;
            }

            var hideFunc = function () {
                item.isExpanded = false;

                if (me.checkboxes) {
                    var checkboxes = $subtree.find('.chkbox');
                    checkboxes.stop();
                    checkboxes.css('opacity', 1);
                    $subtree.find('.chkbox').animate({ opacity: 0 }, 50);
                }

                $subtree.slideUp(me.animationHideDuration, function () {
                    item.isCollapsing = false;
                    me._calculateWidth();
                    var $arrowSpan = $(item.arrow);
                    if ($arrowSpan.length > 0) {
                        $arrowSpan.removeClass();
                        $arrowSpan.addClass(me.toThemeProperty('jqx-tree-item-arrow-collapse'));
                    }
                    $subtree.hide();
                    me._raiseEvent('1', { element: item.element });
                })
            }

            if (delay > 0) {
                $subtree.data('timer').hide = setTimeout(function () {
                    hideFunc();
                }, delay);
            }
            else {
                hideFunc();
            }
        },

        _expandItem: function (me, item) {
            if (me == null || item == null)
                return false;

            if (item.isExpanded)
                return false;

            if (item.locked)
                return false;

            if (item.disabled)
                return false;

            if (me.disabled)
                return false;

            var $subtree = $(item.subtreeElement);
            // stop hiding process.
            if (($subtree.data('timer')) != null && $subtree.data('timer').hide != null) {
                clearTimeout($subtree.data('timer').hide);
            }

            var $treeElement = $(item.element);

            var top = 0;
            var left = 0;

            if (parseInt($subtree.css('top')) == top) {
                item.isExpanded = true;
                return;
            }

            var $arrowSpan = $(item.arrow);
            if ($arrowSpan.length > 0) {
                $arrowSpan.removeClass();
                $arrowSpan.addClass(me.toThemeProperty('jqx-tree-item-arrow-expand'));
            }

            if (me.checkboxes) {
                var checkboxes = $subtree.find('.chkbox');
                checkboxes.stop();
                checkboxes.css('opacity', 0);
                checkboxes.animate({ opacity: 1 }, me.animationShowDuration);
            }

            $subtree.slideDown(me.animationShowDuration, me.easing,
                        function () {
                            item.isExpanded = true;
                            item.isExpanding = false;
                            me._raiseEvent('0', { element: item.element });
                            me._calculateWidth();
                        }) //animate subtree into view         
            //     }, 0);

            if (me.checkboxes) {
                me._updateCheckItemLayout(item);
                if (item.subtreeElement) {
                    var listTags = $(item.subtreeElement).find('li');
                    $.each(listTags, function () {
                        var subItem = me.getItem(this);
                        if (subItem != null) {
                            me._updateCheckItemLayout(subItem);
                        }
                    });
                }
            }
        },

        _calculateWidth: function () {
            var me = this;
            var checkboxOffset = this.checkboxes ? 20 : 0;
            var maxWidth = 0;

            $.each(this.items, function () {
                var height = $(this.element).height();
                if (height != 0) {
                    var titleWidth = this.titleElement.outerWidth() + 20 + checkboxOffset + (1 + this.level) * 25;
                    maxWidth = Math.max(maxWidth, titleWidth);
                    if (this.hasItems) {
                        var paddingOffset = parseInt($(this.titleElement).css('padding-top'));
                        if (isNaN(paddingOffset)) {
                            paddingOffset = 0;
                        }

                        paddingOffset = paddingOffset * 2;
                        paddingOffset += 2;

                        var offset = (paddingOffset + $(this.titleElement).height()) / 2 - 17 / 2;
                        if ($.browser.msie && $.browser.version < 9) {
                            $(this.arrow).css('margin-top', '3px');
                        }
                        else {
                            if (parseInt(offset) >= 0) {
                                $(this.arrow).css('margin-top', parseInt(offset) + 'px');
                            }
                        }
                    }
                }
            });

            if (this.toggleIndicatorSize > 16) {
                maxWidth = maxWidth + this.toggleIndicatorSize - 16;
            }

            if (maxWidth > this.host.width()) {
                var scrollWidth = maxWidth - this.host.width();
                me.panel.jqxPanel({ horizontalScrollBarMax: scrollWidth });
            }
            else {
                me.panel.jqxPanel({ horizontalScrollBarMax: null });
            }

            me.panel.jqxPanel('_arrange');
        },

        _initialize: function (mode, oldmode) {
            var me = this;
            var maxHeight = 0;
            this.host.removeClass();
            this.host.addClass(me.toThemeProperty('jqx-widget'));
            this.host.addClass(me.toThemeProperty('jqx-widget-content'));
            this.host.addClass(me.toThemeProperty('jqx-tree'));
            this._updateDisabledState();

            $.each(this.items, function () {
                var item = this;
                $element = $(item.element);
                var $arrowSpan = null;
                var oldArrow = $(item.arrow);
                if (oldArrow.length > 0) {
                    oldArrow.unbind('hover');
                    oldArrow.remove();
                }

                $arrowSpan = $('<span style="height: 17px; border: none; background-color: transparent;" id="arrow' + $element[0].id + '"></span>');
                $arrowSpan.prependTo($element);
                $arrowSpan.css('float', 'left');
                $arrowSpan.width(me.toggleIndicatorSize);

                if (!item.isExpanded) {
                    $arrowSpan.addClass(me.toThemeProperty('jqx-tree-item-arrow-collapse'));
                }
                else {
                    $arrowSpan.addClass(me.toThemeProperty('jqx-tree-item-arrow-expand'));
                }

                var paddingOffset = parseInt($(this.titleElement).css('padding-top'));
                if (isNaN(paddingOffset)) {
                    paddingOffset = 0;
                }

                paddingOffset = paddingOffset * 2;
                paddingOffset += 2;

                var offset = (paddingOffset + $(this.titleElement).height()) / 2 - 17 / 2;
                if ($.browser.msie && $.browser.version < 9) {
                    $arrowSpan.css('margin-top', '3px');
                }
                else {
                    if (parseInt(offset) >= 0) {
                        $arrowSpan.css('margin-top', parseInt(offset) + 'px');
                    }
                }
                $element.addClass(me.toThemeProperty('jqx-disableselect'));
                $arrowSpan.addClass(me.toThemeProperty('jqx-disableselect'));

                var eventName = 'click';
                var isTouchDevice = me.isTouchDevice();
                if (isTouchDevice) {
                    eventName = 'touchend';
                }
                $arrowSpan.bind(eventName, function () {
                    if (!item.isExpanded) {
                        me._expandItem(me, item);
                    }
                    else {
                        me._collapseItem(me, item);
                    }

                    return false;
                });

                me.addHandler($arrowSpan, 'selectstart', function () {
                    return false;
                });

                me.addHandler($arrowSpan, 'mouseup', function () {
                    if (!isTouchDevice) {
                        return false;
                    }
                });

                $arrowSpan.hover(function () {
                    $arrowSpan.removeClass();
                    if (item.isExpanded) {
                        $arrowSpan.addClass(me.toThemeProperty('jqx-tree-item-arrow-expand-hover'));
                    }
                    else {
                        $arrowSpan.addClass(me.toThemeProperty('jqx-tree-item-arrow-collapse-hover'));
                    }

                }, function () {
                    $arrowSpan.removeClass();
                    if (item.isExpanded) {
                        $arrowSpan.addClass(me.toThemeProperty('jqx-tree-item-arrow-expand'));
                    }
                    else {
                        $arrowSpan.addClass(me.toThemeProperty('jqx-tree-item-arrow-collapse'));
                    }
                });

                item.hasItems = $(item.element).find('li').length > 0;

                item.arrow = $arrowSpan[0];
                if (!item.hasItems) {
                    $arrowSpan.css('visibility', 'hidden');
                }

                $element.css('float', 'none');
            });
        },

        _getOffset: function (object) {
            var scrollTop = $(window).scrollTop();
            var scrollLeft = $(window).scrollLeft();
            var isSafari = $.jqx.mobile.isSafariMobileBrowser();
            var offset = $(object).offset();
            var top = offset.top;
            var left = offset.left;
            if (isSafari != null && isSafari) {
                return { left: left - scrollLeft, top: top - scrollTop };
            }
            else return $(object).offset();
        },

        _renderHover: function ($treeElement, item, isTouchDevice) {
            var me = this;
            if (!isTouchDevice) {
                $(item.titleElement).unbind('hover');
                $(item.titleElement).hover(function () {
                    if (!item.disabled && me.enableHover && !me.disabled) {
                        $(item.titleElement).addClass(me.toThemeProperty('jqx-fill-state-hover'));
                        $(item.titleElement).addClass(me.toThemeProperty('jqx-tree-item-hover'));
                    }
                },
                function () {
                    if (!item.disabled && me.enableHover && !me.disabled) {
                        $(item.titleElement).removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                        $(item.titleElement).removeClass(me.toThemeProperty('jqx-tree-item-hover'));
                    }
                });
            }
        },

        _updateDisabledState: function () {
            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }
            else {
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }
        },

        render: function () {
            this._updateItemsNavigation();
            this._render();
        },

        _render: function (mode, oldMode) {
            if ($.browser.msie && $.browser.version < 8) {
                var me = this;
                $.each(this.items, function () {
                    var $element = $(this.element);
                    var $parent = $element.parent();
                    var totalWidth = parseInt(this.titleElement.css('margin-left')) + this.titleElement[0].scrollWidth + 13;

                    $element.css('min-width', totalWidth);

                    var parentWidth = parseInt($parent.css('min-width'));
                    if (isNaN(parentWidth)) parentWidth = 0;
                    var elementMinWidth = $element.css('min-width');

                    if (parentWidth < parseInt($element.css('min-width'))) {
                        $parent.css('min-width', elementMinWidth);
                    }
                    this.titleElement[0].style.width = null;
                });
            }

            var zIndex = 1000;
            var popupElementoffset = [5, 5];
            var me = this;
            $.data(me.element, 'animationHideDelay', me.animationHideDelay);
            $.data(document.body, 'treeel', this);
            this._initialize();

            var isTouchDevice = this.isTouchDevice();
            if (isTouchDevice && this.toggleMode == 'dblclick') {
                this.toggleMode = 'click';
            }

            $.each(this.items, function () {
                me._updateItemEvents(me, this);
            });

            // add panel.
            if (this.host.jqxPanel) {
                if (this.host.find('#panel' + this.element.id).length > 0) {
                    this.panel.jqxPanel({ touchMode: this.touchMode });
                    return;
                }

                this.host.find('ul:first').wrap('<div style="background-color: transparent; overflow: hidden; width: 100%; height: 100%;" id="panel' + this.element.id + '"></div>');
                var panel = this.host.find('div:first');
                var sizeMode = 'fixed';
                if (this.height == null || this.height == 'auto') {
                    sizeMode = 'verticalwrap';
                }
                if (this.width == null || this.width == 'auto') {
                    if (sizeMode == 'fixed') {
                        sizeMode = 'horizontalwrap';
                    }
                    else sizeMode = 'wrap';
                }

                panel.jqxPanel({ theme: this.theme, width: this.width, height: this.height, autoUpdateInterval: 30, touchMode: this.touchMode, autoUpdate: true, sizeMode: sizeMode });
                var panelInstance = $.data(panel[0], 'jqxPanel').instance;
                if (panelInstance != null) {
                    this.vScrollInstance = panelInstance.vScrollInstance;
                    this.hScrollInstance = panelInstance.hScrollInstance;
                }
                this.panelInstance = panelInstance;
                if ($.browser.msie && $.browser.version < 8) {
                    this.host.attr('hideFocus', true);
                    this.host.find('div').attr('hideFocus', true);
                    this.host.find('ul').attr('hideFocus', true);
                }

                panel[0].className = '';
                this.panel = panel;
            }
            this._raiseEvent('3', this);
        },

        _updateItemEvents: function (me, item) {
            var isTouchDevice = this.isTouchDevice();
            if (isTouchDevice) {
                this.toggleMode = 'touchend';
            }

            var $treeElement = $(item.element);

            if (me.enableRoundedCorners) {
                $treeElement.addClass(me.toThemeProperty('jqx-rc-all'));
            }

            var checkEventName = !isTouchDevice ? 'click' : 'touchend';
            me.removeHandler($(item.checkBoxElement), checkEventName);
            me.addHandler($(item.checkBoxElement), checkEventName, function (event) {
                this.treeItem.checked = !this.treeItem.checked;
                me.checkItem(this.treeItem.element, this.treeItem.checked);
                if (me.hasThreeStates) {
                    me.checkItems(this.treeItem, this.treeItem);
                }
                return false;
            });

            me.removeHandler($treeElement, 'mousedown');
            me.removeHandler($treeElement, 'mouseenter');
            me.removeHandler($treeElement, 'mouseleave');
            me.removeHandler($treeElement, 'mousedown');
            me.removeHandler($treeElement, 'mouseup');
            me.removeHandler($treeElement, 'selectstart');

            me._renderHover($treeElement, item, isTouchDevice);
            var $subtree = $(item.subtreeElement);
            if ($subtree.length > 0) {
                var display = item.isExpanded ? 'block' : 'none';
                $subtree.css({ overflow: 'hidden', display: display })
                $subtree.data('timer', {});
            }
            me.removeHandler($(item.titleElement), 'dblclick');
            me.removeHandler($(item.titleElement), 'click');

            me.addHandler($(item.titleElement), 'selectstart', function (event) {
                return false;
            });

            if ($.browser.opera) {
                me.removeHandler($(item.titleElement), 'mousedown');
                me.addHandler($(item.titleElement), 'mousedown', function (event) {
                    return false;
                });
            }

            if (me.toggleMode != 'click') {
                me.addHandler($(item.titleElement), 'click', function (event) {
                    me.selectItem(item.element);

                    if (me.panel != null) {
                        me.panel.jqxPanel({ focused: true });
                    }
                    me.host.focus();
                });
            }

            me.removeHandler($(item.titleElement), me.toggleMode);
            me.addHandler($(item.titleElement), me.toggleMode, function (event) {
                if ($subtree.length > 0) {
                    clearTimeout($subtree.data('timer').hide)
                }

                if (me.panel != null) {
                    me.panel.jqxPanel({ focused: true });
                }

                me.selectItem(item.element);
                if (item.isExpanding == undefined)
                    item.isExpanding = false;
                if (item.isCollapsing == undefined)
                    item.isCollapsing = false;

                me.panel.jqxPanel({ autoUpdate: false });
                if ($subtree.length > 0) {
                    if (!item.isExpanded) {
                        if (false == item.isExpanding) {
                            item.isExpanding = true;
                            me._expandItem(me, item);
                        }
                    }
                    else {
                        if (false == item.isCollapsing) {
                            item.isCollapsing = true;
                            me._collapseItem(me, item, true);
                        }
                    }
                }

                me.panel.jqxPanel({ autoUpdate: true });
            });
        },

        isTouchDevice: function () {
            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            if (this.touchMode == true) {
                isTouchDevice = true;
            }
            else if (this.touchMode == false) {
                isTouchDevice = false;
            }
            return isTouchDevice;
        },

        createID: function () {
            var id = Math.random() + '';
            id = id.replace('.', '');
            id = '99' + id;
            id = id / 1;
            while (this.items[id]) {
                id = Math.random() + '';
                id = id.replace('.', '');
                id = id / 1;
            }
            return 'treeItem' + id;
        },

        // creates the tree.
        createTree: function (uiObject) {
            if (uiObject == null)
                return;

            var self = this;
            var liTags = $(uiObject).find('li');
            var k = 0;

            this.items = new Array();

            this.itemMapping = new Array();
            $(uiObject).addClass(self.toThemeProperty('jqx-tree-dropdown-root'));
            //$(uiObject).width(this.host.width());

            for (var index = 0; index < liTags.length; index++) {
                this._createItem(liTags[index]);
            }

            this._updateItemsNavigation();
            this._updateCheckStates();
            if (this.allowDrag && this._enableDragDrop) {
                this._enableDragDrop();
            }
        },

        _updateCheckLayout: function (level) {
            var me = this;
            $.each(this.items, function () {
                if (this.level == level || level == undefined) {
                    me._updateCheckItemLayout(this);
                }
            });
        },

        _updateCheckItemLayout: function (item) {
            if (this.checkboxes) {
                if ($(item.titleElement).css('display') != 'none') {
                    var checkbox = $(item.checkBoxElement);
                    var offset = $(item.titleElement).outerHeight() / 2 - 1 - parseInt(this.checkSize) / 2;
                    checkbox.css('margin-top', offset);
                    if ($.browser.msie && $.browser.version < 8) {
                        item.titleElement.css('margin-left', parseInt(this.checkSize) + 25);
                    }
                    else {
                        checkbox.css('margin-left', this.toggleIndicatorSize);
                    }
                }
            }
        },

        _updateCheckStates: function () {
            var me = this;
            if (me.hasThreeStates) {
                $.each(this.items, function () {
                    me._updateCheckState(this);
                });
            }
            else {
                $.each(this.items, function () {
                    if (this.checked == null) {
                        me.checkItem(this.element, false);
                    }
                });
            }
        },

        _updateCheckState: function (item) {
            if (item == null || item == undefined)
                return;
            var me = this;
            var count = 0;
            var hasIndeterminate = false;
            var itemsCount = 0;

            var childItems = $(item.element).find('li');
            itemsCount = childItems.length;

            if (item.checked && itemsCount > 0) {
                $.each(childItems, function (index) {
                    var child = me.itemMapping["id" + this.id].item;
                    var checked = child.element.getAttribute('item-checked');
                    if (checked == undefined || checked == null || checked == 'true' || checked == true) {
                        me.checkItem(child.element, true);
                    }
                });
            }

            $.each(childItems, function (index) {
                var child = me.itemMapping["id" + this.id].item;
                if (child.checked != false) {
                    if (child.checked == null) {
                        hasIndeterminate = true;
                    }
                    count++;
                }
            });

            if (itemsCount > 0) {
                if (count == itemsCount) {
                    this.checkItem(item.element, true);
                }
                else {
                    if (count > 0) {
                        this.checkItem(item.element, null);
                    }
                    else this.checkItem(item.element, false);
                }
            }
        },

        _updateItemsNavigation: function () {
            var innerElement = this.host.find('ul:first');
            var liTags = $(innerElement).find('li');
            var k = 0;
            for (i = 0; i < liTags.length; i++) {
                var listTag = liTags[i];
                if (this.itemMapping["id" + listTag.id]) {
                    var treeItem = this.itemMapping["id" + listTag.id].item;
                    if (!treeItem)
                        continue;

                    treeItem.prevItem = null;
                    treeItem.nextItem = null;
                    if (i > 0) {
                        if (this.itemMapping["id" + liTags[i - 1].id]) {
                            treeItem.prevItem = this.itemMapping["id" + liTags[i - 1].id].item;
                        }
                    }

                    if (i < liTags.length - 1) {
                        if (this.itemMapping["id" + liTags[i + 1].id]) {
                            treeItem.nextItem = this.itemMapping["id" + liTags[i + 1].id].item;
                        }
                    }
                }
            }
        },

        _applyTheme: function (oldTheme, newTheme) {
            var me = this;
            this.host.removeClass('jqx-tree-' + oldTheme);
            this.host.removeClass('jqx-widget-' + oldTheme);
            this.host.removeClass('jqx-widget-content-' + oldTheme);
            this.host.addClass(me.toThemeProperty('jqx-tree'));
            this.host.addClass(me.toThemeProperty('jqx-widget'));
            var uiObject = this.host.find('ul:first');
            $(uiObject).removeClass(me.toThemeProperty('jqx-tree-dropdown-root-' + oldTheme));
            $(uiObject).addClass(me.toThemeProperty('jqx-tree-dropdown-root'));

            var liTags = $(uiObject).find('li');
            for (var index = 0; index < liTags.length; index++) {
                var listTag = liTags[index];
                $(listTag).children().each(function () {
                    if (this.tagName == 'ul' || this.tagName == 'UL') {
                        $(this).removeClass(me.toThemeProperty('jqx-tree-dropdown-' + oldTheme));
                        $(this).addClass(me.toThemeProperty('jqx-tree-dropdown'));
                        return false;
                    }
                });
            }

            $.each(this.items, function () {
                var item = this;
                var $treeElement = $(item.element);

                $treeElement.removeClass(me.toThemeProperty('jqx-tree-item-li-' + oldTheme));
                $treeElement.addClass(me.toThemeProperty('jqx-tree-item-li'));

                $(item.titleElement).removeClass(me.toThemeProperty('jqx-tree-item-' + oldTheme));
                $(item.titleElement).addClass(me.toThemeProperty('jqx-tree-item'));

                $(item.titleElement).removeClass('jqx-item-' + oldTheme);
                $(item.titleElement).addClass(me.toThemeProperty('jqx-item'));

                var $arrowSpan = $(item.arrow);

                if (!item.isExpanded) {
                    $arrowSpan.addClass(me.toThemeProperty('jqx-tree-item-arrow-collapse'));
                }
                else {
                    $arrowSpan.addClass(me.toThemeProperty('jqx-tree-item-arrow-expand'));
                }

                if (item.checkBoxElement) {
                    $(item.checkBoxElement).jqxCheckBox({ theme: newTheme });
                }
                if (me.enableRoundedCorners) {
                    $treeElement.removeClass('jqx-rc-all-' + oldTheme);
                    $treeElement.addClass(me.toThemeProperty('jqx-rc-all'));
                }
            });

            if (this.host.jqxPanel) {
                this.panel.jqxPanel({ theme: newTheme });
            }
        },

        _refreshMapping: function () {
            var liTags = this.host.find('li');
            var itemMapping = new Array();

            var newItems = new Array();
            var storage = $.data(document.body, 'treeItemsStorage');
            var me = this;
            for (var index = 0; index < liTags.length; index++) {
                var listTag = liTags[index];
                var item = storage[listTag.id];
                newItems[newItems.length] = item;
                this._updateItemEvents(this, item);
                item.level = $(listTag).parents('li').length;
                item.treeInstance = this;
                var parentElement = null;
                var parentId = null;
                $(item.titleElement).removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                $(item.titleElement).removeClass(me.toThemeProperty('jqx-tree-item-selected'));

                $(listTag).children().each(function () {
                    if (this.tagName == 'ul' || this.tagName == 'UL') {
                        item.subtreeElement = this;
                        $(this).addClass(me.toThemeProperty('jqx-tree-dropdown'));
                        return false;
                    }
                });

                $(listTag).parents().each(function () {
                    if ((this.tagName == 'li' || this.tagName == 'LI')) {
                        parentId = this.id;
                        parentElement = this;
                        return false;
                    }
                });

                item.parentElement = parentElement;
                item.parentId = parentId;
                item.hasItems = $(item.element).find('li').length > 0;

                if (item != null) {
                    itemMapping[index] = { element: listTag, item: item };
                    itemMapping["id" + listTag.id] = itemMapping[index];
                }
            }

            this.itemMapping = itemMapping;
            this.items = newItems;
        },

        _createItem: function (element) {
            if (element == null || element == undefined)
                return;

            var id = element.id;
            if (!id) {
                id = this.createID();
            }

            var listTag = element;
            var $listTag = $(element);

            listTag.id = id;

            var treeItemsStorage = $.data(document.body, 'treeItemsStorage');
            if (treeItemsStorage == undefined) {
                treeItemsStorage = new Array();
            }

            var k = this.items.length;
            this.items[k] = new $.jqx._jqxTree.jqxTreeItem();
            this.treeElements[id] = this.items[k];
            treeItemsStorage[listTag.id] = this.items[k];
            $.data(document.body, 'treeItemsStorage', treeItemsStorage)
            k = this.items.length;
            var parentId = 0;
            var me = this;
            var parentElement = null;

            $(listTag).children().each(function () {
                if (this.tagName == 'ul' || this.tagName == 'UL') {
                    me.items[k - 1].subtreeElement = this;
                    $(this).addClass(me.toThemeProperty('jqx-tree-dropdown'));
                    return false;
                }
            });

            $(listTag).parents().each(function () {
                if ((this.tagName == 'li' || this.tagName == 'LI')) {
                    parentId = this.id;
                    parentElement = this;
                    return false;
                }
            });

            var expanded = element.getAttribute('item-expanded');
            if (expanded == null || expanded == undefined || (expanded != 'true' && expanded != true)) {
                expanded = false;
            }
            else expanded = true;
            $listTag.removeAttr('item-expanded');

            var locked = element.getAttribute('item-locked');
            if (locked == null || locked == undefined || (locked != 'true' && locked != true)) {
                locked = false;
            }
            else locked = true;
            $listTag.removeAttr('item-locked');

            var selected = element.getAttribute('item-selected');
            if (selected == null || selected == undefined || (selected != 'true' && selected != true)) {
                selected = false;
            }
            else selected = true;
            $listTag.removeAttr('item-selected');

            var disabled = element.getAttribute('item-disabled');
            if (disabled == null || disabled == undefined || (disabled != 'true' && disabled != true)) {
                disabled = false;
            }
            else disabled = true;
            $listTag.removeAttr('item-disabled');

            var checked = element.getAttribute('item-checked');
            if (checked == null || checked == undefined || (checked != 'true' && checked != true)) {
                checked = false;
            }
            else checked = true;
            //            $listTag.removeAttr('item-checked');

            var title = element.getAttribute('item-title');
            if (title == null || title == undefined || (title != 'true' && title != true)) {
                title = false;
            }
            $listTag.removeAttr('item-title');

            var icon = element.getAttribute('item-icon');
            var iconsize = element.getAttribute('item-iconsize');
            var label = element.getAttribute('item-label');
            var value = element.getAttribute('item-value');

            $listTag.removeAttr('item-icon');
            $listTag.removeAttr('item-iconsize');
            $listTag.removeAttr('item-label');
            $listTag.removeAttr('item-value');

            var treeItem = this.items[k - 1];
            treeItem.id = id;
            treeItem.value = value;
            treeItem.icon = icon;
            treeItem.iconsize = iconsize;
            treeItem.parentId = parentId;
            treeItem.disabled = disabled;
            treeItem.parentElement = parentElement;
            treeItem.element = element;
            treeItem.locked = locked;
            treeItem.selected = selected;
            treeItem.checked = checked;
            treeItem.isExpanded = expanded;
            treeItem.treeInstance = this;

            this.itemMapping[k - 1] = { element: listTag, item: treeItem };
            this.itemMapping["id" + listTag.id] = this.itemMapping[k - 1];
            var hasTitleAttribute = $(element).find('[item-title="true"]').length > 0;
            var isSameLI = $(listTag).find('[item-title="true"]').parents('li:first')[0] == listTag;
            hasTitleAttribute = false;
            if (!hasTitleAttribute || !isSameLI) {
                if ($(listTag.firstChild).length > 0) {
                    if (treeItem.icon) {
                        var iconsize = treeItem.iconsize;
                        if (!iconsize) iconsize = 16;

                        var icon = $('<img width="' + iconsize + '" height="' + iconsize + '" style="float: left;" class="itemicon" src="' + treeItem.icon + '"/>');
                        $(listTag).prepend(icon);
                        icon.css('margin-right', '4px');
                    }

                    var ulindex = listTag.innerHTML.indexOf('<ul');
                    if (ulindex == -1) {
                        ulindex = listTag.innerHTML.indexOf('<UL');
                    }

                    if (ulindex == -1) {
                        treeItem.originalTitle = listTag.innerHTML;
                        $(listTag).wrapInner('<div style="display: inline-block;"/>');
                        treeItem.titleElement = $($(listTag)[0].firstChild);
                    }
                    else {
                        var listhtml = listTag.innerHTML.substring(0, ulindex);
                        listhtml = $.trim(listhtml);
                        treeItem.originalTitle = listhtml;
                        listhtml = $('<div style="display: inline-block;">' + listhtml + '</div>');

                        var ul = $(listTag).find('ul:first');
                        ul.remove();
                        listTag.innerHTML = "";
                        $(listTag).prepend(listhtml);
                        $(listTag).append(ul);

                        treeItem.titleElement = listhtml;
                    }

                    if ($.browser.msie && $.browser.version < 8) {
                        $($(listTag)[0].firstChild).css('display', 'inline-block');
                    }
                }
                else {
                    treeItem.originalTitle = "Item";
                    $(listTag).append($('<span>Item</span>'));
                    $(listTag.firstChild).wrap('<span/>');
                    treeItem.titleElement = $(listTag)[0].firstChild;
                    if ($.browser.msie && $.browser.version < 8) {
                        $(listTag.firstChild).css('display', 'inline-block');
                    }
                }
            }

            var $itemTitle = $(treeItem.titleElement);
            $itemTitle.addClass(this.toThemeProperty('jqx-rc-all'));
            if (this.allowDrag) {
                $itemTitle.addClass('draggable');
            }
            if (label == null || label == undefined) {
                label = treeItem.titleElement;
                treeItem.label = $.trim($itemTitle.text());
            }
            else treeItem.label = label;

            $(listTag).addClass(this.toThemeProperty('jqx-tree-item-li'));

            $itemTitle.addClass(this.toThemeProperty('jqx-tree-item'));
            $itemTitle.addClass(this.toThemeProperty('jqx-item'));
            treeItem.level = $(element).parents('li').length;

            if (this.checkboxes) {
                if (this.host.jqxCheckBox) {
                    var checkbox = $('<div style="position: absolute; width: 18px; height: 18px;" tabIndex=0 class="chkbox"/>');
                    checkbox.width(parseInt(this.checkSize));
                    checkbox.height(parseInt(this.checkSize));
                    $(listTag).prepend(checkbox);

                    checkbox.jqxCheckBox({ checked: treeItem.checked, boxSize: this.checkSize, animationShowDelay: 0, animationHideDelay: 0, disabled: disabled, theme: this.theme });
                    $itemTitle.css('margin-left', parseInt(this.checkSize) + 6);
                    treeItem.checkBoxElement = checkbox[0];
                    checkbox[0].treeItem = treeItem;
                    var offset = $itemTitle.outerHeight() / 2 - 1 - parseInt(this.checkSize) / 2;
                    checkbox.css('margin-top', offset);
                    if ($.browser.msie && $.browser.version < 8) {
                        $itemTitle.css('width', '1%');
                        $itemTitle.css('margin-left', parseInt(this.checkSize) + 25);
                    }
                    else {
                        checkbox.css('margin-left', this.toggleIndicatorSize);
                    }
                }
                else {
                    alert('jqxcheckbox.js is not loaded.');
                }
            }
            else {
                if ($.browser.msie && $.browser.version < 8) {
                    $itemTitle.css('width', '1%');
                }
            }

            if (disabled) {
                this.disableItem(treeItem.element);
            }

            if (selected) {
                this.selectItem(treeItem.element);
            }

            if ($.browser.msie && $.browser.version < 8) {
                $(listTag).css('margin', '0px');
                $(listTag).css('padding', '0px');
            }
            treeItem.hasItems = $(element).find('li').length > 0;
        },

        destroy: function () {
            this.host.removeClass();
            this.host.remove();
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            args = arg;
            args.owner = this;

            var event = new jQuery.Event(evt);
            event.owner = this;
            event.args = args;

            var result = this.host.trigger(event);
            return result;
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (key == 'disabled') {
                object._updateDisabledState();
            }

            if (key == 'theme') {
                object._applyTheme(oldvalue, value);
            }

            if (key == "keyboardNavigation") {
                object.enableKeyboardNavigation = value;
            }

            if (key == 'width' || key == 'height') {
                object.refresh();
                object._initialize();
                object._calculateWidth();

                if (object.host.jqxPanel) {
                    var sizeMode = 'fixed';
                    if (this.height == null || this.height == 'auto') {
                        sizeMode = 'verticalwrap';
                    }
                    if (this.width == null || this.width == 'auto') {
                        if (sizeMode == 'fixed') {
                            sizeMode = 'horizontalwrap';
                        }
                        else sizeMode = 'wrap';
                    }

                    this.panel.jqxPanel({ sizeMode: sizeMode });
                }
            }

            if (key == 'touchMode') {
                if (value) {
                    object.enableHover = false;
                }
                object._render();
            }

            if (key == 'source') {
                if (this.source != null) {
                    var html = this.loadItems(this.source);
                    this.element.innerHTML = html;
                    var innerElement = this.host.find('ul:first');
                    if (innerElement.length > 0) {
                        this.createTree(innerElement[0]);
                        this._render();
                    }
                }
            }

            if (key == 'hasThreeStates') {
                this._render();
                this._updateCheckStates();
            }

            if (key == 'toggleIndicatorSize') {
                this._updateCheckLayout();
                this._render();
            }
        }
    });
})(jQuery);

(function ($) {
    $.jqx._jqxTree.jqxTreeItem = function(id, parentId, type) {
        var treeItem =
        {
            // gets the item's label.
            label: null,
            // gets the id.
    	    id: id,
            // gets the parent id.
            parentId: parentId,
            // gets the parent element.
            parentElement: null,
            // gets the parent item instance.
            parentItem: null,
            // gets whether the item is disabled.
            disabled: false,
            // gets whether the item is selected.
            selected: false,
            // gets whether the item is locked.
            locked: false,
            // gets the checked state.
            checked: false,
            // gets the item's level.
            level: 0,
            // gets a value whether the item is opened.
            isExpanded: false,
            // has sub elements.
            hasItems: false,
            // li element
            element: null,
            // subtree element.
            subtreeElement: null,
            // checkbox element.
            checkBoxElement: null,
            // titleElement element.
            titleElement: null,
            // arrow element.
            arrow: null,
            // prev item.
            prevItem: null,
            // next item.
            nextItem: null
         }
        return treeItem;
    }; // 
})(jQuery);
