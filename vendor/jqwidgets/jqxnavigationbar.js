/*
jQWidgets v2.4.2 (2012-Sep-12)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/


/*
* jqxnavigationbar.js
*
* This source is property of jqwidgets and/or its partners and is subject to jqwidgets Source Code License agreement and jqwidgets EULA.
* Copyright (c) 2011 jqwidgets.
* <Licensing info>
* 
* http://www.jQWidgets.com
*/
/*
* Depends:
*   jqxcore.js
*   jqxexpander.js
*/
(function ($) {

    $.jqx.jqxWidget('jqxNavigationBar', '', {});

    $.extend($.jqx._jqxNavigationBar.prototype, {
        defineInstance: function () {
            // Type: Number
            // Default: 250
            // Gets or sets the expanding animation duration.
            this.expandAnimationDuration = 350,
            // Type: Number
            // Default: 250
            // Gets or sets the collapsing animation duration.
            this.collapseAnimationDuration = 350,
            // Type: Bool
            // Default: false
            // Gets or sets whether the navigation bar is disabled.
            this.disabled = false;
            // Type: String
            // Default: slide
            // Gets or sets the animation type. Possible values ['slide', 'fade', 'none'].
            this.animationType = 'slide';
            // Type: String
            // Default: click
            // Gets or sets user interaction used for expanding or collapsing any item. Possible values ['click', 'dblclick', 'mouseenter', 'none'].
            this.toggleMode = 'click';
            // Type: String
            // Default: single
            // Gets or sets navigation bar's expand mode. Possible values ['single', 'multiple', 'toggle', 'none'].
            this.expandMode = 'single';
            // Type: String
            // Default: auto
            // Gets or sets navigation bar's size mode. Possible values ['fitAvailableHeight', 'maxItemHeight', 'auto'].
            this.sizeMode = 'auto';
            // Type: Bool
            // Default: true
            // Gets or sets whether header's arrow is going to be shown.
            this.showArrow = true;
            // Type: String
            // Default: right
            // Gets or sets arrow's position.
            this.arrowPosition = 'right';
            // Type: Array
            // Default: undefined
            // Gets or sets the expanded items in multiple expand mode. Sample value [1,0,2]. When the value of this variable is like in the sample
            // the first, second and third items will be expanded.
            this.expandedIndexes = undefined;
            // Type: Number
            // Default: -1
            // Gets or sets the expanded index for single or toggle expand modes.
            this.expandedIndex = -1;
            // Type: String
            // Default: auto
            // Gets or sets expander's height. Possible values - every value which is valid in CSS.
            this.height = 'auto';
            // Type: String
            // Default: auto
            // Gets or sets expander's width. Possible values - every value which is valid in CSS.
            this.width = 'auto';

            //Private variables.
            this._expandersList = [];
            this._toggleModesBackup = [];
            this._expandedIndexes = undefined;
            this._maxHeight = 0;
            this._currentExpandedItem = null;
            //Events.
            this._events =
            [
                'expandingItem', 'expandedItem', 'collapsingItem', 'collapsedItem'
            ];
            // Messages for invalid argument exceptions.
            this._invalidArgumentExceptions = {
                'invalidStructure': 'Invalid structure of the navigation bar!',
                'invalidExpandAnimationDuration': 'Expand animation duration is invalid!',
                'invalidCollapseAnimationDuration': 'Collapse animation duration is invalid!',
                'invalidAnimationType': 'The animation type is invalid!',
                'invalidToggleMode': 'The toggle mode is invalid!',
                'invalidArrowPosition': 'The arrow position is invalid!',
                'invalidNavigationBarSize': 'This size is not valid!',
                'invalidExpandModeException': 'The expand mode you\'ve entered is invalid!',
                'invalidExpandedIndexesLength': 'expandedIndexes is not with valid size.',
                'invalidExpandedIndex': 'Invalid expanded index!',
                'invalidModeException': 'You can\'t use fitAvailableHeight in multiple expand mode!',
                'invalidSizeMode': 'You have entered invalid size mode!'
            };
        },

        createInstance: function (args) {
            this.host
			.addClass(this.toThemeProperty('jqx-navigationbar'));
            this.host
			.addClass(this.toThemeProperty('jqx-widget'));
            this.host.css('visibility', 'hidden');

            var headersList = this.host.children('.' + this.toThemeProperty('jqx-expander-header', true)).detach();
            var contentsList = this.host.children('.' + this.toThemeProperty('jqx-expander-content', true)).detach();
            try {
                if (headersList.length === 0 || contentsList.length === 0) {
                    var elements = this._addExpanderClasses();
                    headersList = elements['headersList'];
                    contentsList = elements['contentsList'];
                }
                if (headersList.length != contentsList.length) {
                    throw this._invalidArgumentExceptions['invalidStructure'];
                }
            } catch (exception) {
                alert(exception);
            }

            this.headersList = headersList;
            this.contentsList = contentsList;
            this._createNavigationBar(headersList, contentsList);
            this.host.css('visibility', 'visible');
        },

        //[optimize]
        _addExpanderClasses: function () {
            var subDivs = this.host.children('div');
            if (subDivs.length > 0) {
                var headersList = [];
                for (var i = 0, j = 0; i < subDivs.length; i += 2, j++) {
                    headersList[j] = $(subDivs[i]).detach();
                    headersList[j].addClass(this.toThemeProperty('jqx-widget-header'));
                    headersList[j].addClass(this.toThemeProperty('jqx-expander-header'));
                }
                if (subDivs.length > 1) {
                    var contentsList = [];
                    for (var i = 1, j = 0; i < subDivs.length; i += 2, j++) {
                        contentsList[j] = $(subDivs[i]).detach();
                        contentsList[j].addClass(this.toThemeProperty('jqx-widget-content'));
                        contentsList[j].addClass(this.toThemeProperty('jqx-expander-content'));
                    }
                } else {
                    throw this._invalidArgumentExceptions['invalidStructure'];
                }
            } else {
                throw this._invalidArgumentExceptions['invalidStructure'];
            }
            return { headersList: headersList, contentsList: contentsList }
        },

        //[optimize]
        _updateExpandedIndexes: function (length) {
            if (length == null || length == undefined) length = 0;

            this._expandedIndexes = [];
            if (this.expandedIndexes === undefined) {
                this.expandedIndexes = [];
            } else {
                for (var i = 0; i < length; i++) {
                    this._expandedIndexes[i] = false;
                }
                for (var i = 0; i < this.expandedIndexes.length; i++) {
                    if (this.expandedIndexes[i] < length) {
                        this._expandedIndexes[this.expandedIndexes[i]] = true;
                    }
                }
            }
        },

        //In the end of the method I'm setting host's height because there is about a pixel displacement
        //in MSIE (version 8 or older), Opera, Safari and Chrome. In toggle expand mode we're
        //using just the margin fix.
        _createNavigationBar: function (headersList, contentsList) {
            this._updateExpandedIndexes(headersList.length);
            this._render(headersList, contentsList);
            this._refreshNavigationBar();
        },

        //[optimize]
        _refreshNavigationBar: function () {
            this._validateProperties();
            this._fixView();
            this._performLayout();
            this._fixView();
        },

        //[optimize]
        _collapseItems: function () {
            for (var i = 0; i < this._expandersList.length; i++) {
                if (!this._expandedIndexes[i]) {
                    $(this._expandersList[i]).jqxExpander('_absoluteCollapse');
                }
            }
        },

        //[optimize]
        _removeArrayItem: function (item, array) {
            var index = this._getItemIndex(item, array);
            if (index >= 0) {
                array.splice(index, 1);
            }
        },

        //[optimize]
        _removeEventHandlers: function () {
            var self = this;
            $.each(this._expandersList, function () {
                var expander = this;
                self.removeHandler($(expander), 'expanded');
                self.removeHandler($(expander), 'collapsed');
                self.removeHandler($(expander), 'collapsing');
                self.removeHandler($(expander), 'expanding');
                self.removeHandler($(window), 'load');
            });
        },

        //[optimize]
        _addEventHandlers: function (expander) {
            var self = this;

            this.addHandler($(expander), 'mouseenter', function () {
                expander.css('z-index', 100);
            });

            this.addHandler($(expander), 'mouseleave', function () {
                expander.css('z-index', 0);
            });

            this.addHandler($(expander), 'expanded', function () {
                var index = self._getItemIndex(expander, self._expandersList);
                self._expandedIndexes[index] = true;
                if (self.expandMode === 'single') {
                    self.expandedIndex = index;
                }
                $(this).css('margin-bottom', 0);
                var itemIndex = self._getItemIndex(this, self._expandersList);
                // check whether the item exists before pushing it in the Array. Otherwise, calling the expandAt method multiple times will result in wrong array. 
                // To Do: check this logic once more.
                if (self.expandedIndexes[itemIndex] == undefined) {
                    self.expandedIndexes.push(itemIndex);
                }

                self._raiseEvent(1, self._getItemIndex(this, self._expandersList));
            });
            this.addHandler($(expander), 'collapsed', function () {
                var index = self._getItemIndex(expander, self._expandersList);
                self._expandedIndexes[index] = false;
                self._removeArrayItem(self._getItemIndex(this, self._expandersList), self.expandedIndexes);

                self._raiseEvent(3, self._getItemIndex(this, self._expandersList));
            });
            this.addHandler($(expander), 'collapsing', function (event) {
                self._raiseEvent(2, self._getItemIndex(this, self._expandersList));
                if (self.expandMode === 'single') {
                    $(this).jqxExpander('toggleMode', self.toggleMode);
                }
            });
            this.addHandler($(expander), 'expanding', function (event) {
                if (self.expandMode === 'single' || self.expandMode === 'toggle') {

                    if (self._currentExpandedItem &&
                        self._getItemIndex(event.owner.element, self._expandersList) >= 0) {

                        self.collapseAt(self._getItemIndex(self._currentExpandedItem, self._expandersList));
                        $(self._currentExpandedItem).jqxExpander('toggleMode', self.toggleMode);

                        //Fixing displacement in opera, chrome, safari and versions of MSIE before 9
                        if ((self.sizeMode === 'maxItemHeight' || self.sizeMode === 'fitAvailableHeight') &&
                            ($.browser.webkit || $.browser.opera ||
                            $.browser.msie && parseInt($.browser.version) < 9)) {
                            //   $(this).css('margin-bottom', -1);
                        }
                    }
                    self._currentExpandedItem = this;

                    if (self.expandMode === 'single') {
                        $(this).jqxExpander('toggleMode', 'none');
                    }
                    //Make it slowly
                    if (self.animationType !== 'none') {
                        //            self._disableItems();
                        //              setTimeout(function () { self._enableItems(); }, Math.max(self.expandAnimationDuration, self.collapseAnimationDuration));
                    }
                }
                self._raiseEvent(0, self._getItemIndex(this, self._expandersList));
            });
            this.addHandler($(window), 'load', function (event) {
                if (self.sizeMode === 'maxItemHeight') {
                    self._refreshNavigationBar();
                }
            });
        },

        //[optimize]
        _getItemIndex: function (item, array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === item || array[i][0] === item) {
                    return i;
                }
            }
            return -1;
        },

        //[optimize]
        _validateProperties: function () {
            try {
                if ((parseInt(this.width) <= 0 || parseInt(this.height) <= 0) &&
                (this.width !== 'auto' && this.height !== 'auto' ||
                this.width !== undefined && this.height !== undefined)) {
                    throw this._invalidArgumentExceptions['invalidNavigationBarSize'];
                }
                if (this.animationType !== 'slide' && this.animationType !== 'none' && this.animationType !== 'fade') {
                    throw this._invalidArgumentExceptions['invalidAnimationType'];
                }
                if (this.expandMode !== 'single' && this.expandMode !== 'multiple' &&
                this.expandMode !== 'none' && this.expandMode !== 'toggle') {
                    throw this._invalidArgumentExceptions['invalidExpandMode'];
                }
                if (this.expandedIndexes.length > this._expandersList.length) {
                    throw this._invalidArgumentExceptions['invalidExpandedIndexesLength'];
                }
                if (this.expandedIndex > (this._expandersList.length - 1)) {
                    throw this._invalidArgumentExceptions['invalidExpandedIndex'];
                }
                if (this.sizeMode !== 'auto' && this.sizeMode !== 'fitAvailableHeight' &&
                this.sizeMode !== 'maxItemHeight') {
                    throw this._invalidArgumentExceptions['invalidSizeMode'];
                }
                if (this.expandMode === 'multiple' && this.sizeMode === 'fitAvailableHeight') {
                    throw this._invalidArgumentExceptions['invalidModeException'];
                }
            } catch (exception) {
                alert(exception);
            }
        },

        //[optimize]
        _render: function (headersList, contentsList) {
            this._maxHeight = 0;
            for (var i = 0; i < headersList.length; i++) {
                var expanderHeader = $(headersList[i]).addClass(this.toThemeProperty('jqx-expander-header'));
                var expanderContent = $(contentsList[i]).addClass(this.toThemeProperty('jqx-expander-content'));
                expanderHeader.addClass(this.toThemeProperty('jqx-widget-header'));
                expanderContent.addClass(this.toThemeProperty('jqx-widget-content'));
                var expanderDiv = $('<div class="' + this.toThemeProperty('jqx-expander') + '"></div>');
                expanderDiv.append(expanderHeader);
                expanderDiv.append(expanderContent);
                this.host.append(expanderDiv);
                this._expandersList[i] = this._createExpanderByNavigationBarExpandMode(i, expanderDiv);
                var contentHeight = parseInt($(this._expandersList[i]).children('.jqx-expander-contentWrapper', true).children(this.toThemeProperty('.jqx-expander-content', true)).outerHeight());

                if (this._maxHeight < contentHeight) {
                    this._maxHeight = contentHeight;
                }
                this._addEventHandlers(this._expandersList[i]);
            }
        },

        //[optimize]
        _performLayout: function () {
            var headersHeight = 0;
            for (var j = 0; j < this._expandersList.length; j++) {
                headersHeight += this._expandersList[j].children(this.toThemeProperty('.jqx-expander-header', true)).outerHeight();
            }
            switch (this.sizeMode) {
                case 'auto':
                    break;
                case 'fitAvailableHeight':
                    for (var i = 0; i < this._expandersList.length; i++) {
                        var borders = 0;
                        borders += parseInt(this._expandersList[0].children(this.toThemeProperty('.jqx-expander-header', true)).css('border-top-width')) +
                                   parseInt(this._expandersList[this._expandersList.length - 1].children('.jqx-expander-contentWrapper').
                                   children(this.toThemeProperty('.jqx-expander-content', true)).css('border-bottom-width'));
                        var contentHeight = parseInt(this.height) - headersHeight; // -this._expandersList.length * borders;
                        $(this._expandersList[i]).jqxExpander('setContentHeight', contentHeight);
                    }
                    break;
                case 'maxItemHeight':
                    for (var i = 0; i < this._expandersList.length; i++) {
                        $(this._expandersList[i]).jqxExpander('setContentHeight', this._maxHeight);
                    }
                    break;
            }
            this._performHostLayout(headersHeight);
        },

        //[optimize]
        _performHostLayout: function (headersHeight) {
            if (this.width) {
                this.host.width(this.width);
            }
            for (var i = 0; i < this._expandersList.length; i++) {
                if (!this._expandedIndexes[i]) {
                    $(this._expandersList[i]).jqxExpander('expanded', false);
                } else {
                    $(this._expandersList[i]).jqxExpander('expanded', true);
                }
            }
            if ((this.sizeMode === 'maxItemHeight') &&
                (this.expandMode === 'single')) {
                var contentBorderHeight = parseInt(this._expandersList[this._expandersList.length - 1].children('.jqx-expander-contentWrapper', true).
                                   children(this.toThemeProperty('.jqx-expander-content', true)).css('border-bottom-width'));
                this.host.height(headersHeight + this._maxHeight + contentBorderHeight + 'px');
            } else if ((this.sizeMode === 'fitAvailableHeight') &&
                       (this.expandMode === 'toggle' || this.expandMode === 'single')) {
                this.host.height(parseInt(this.height));
            } else {
                this.host.height('auto');
            }
        },

        //[optimize]
        _fixView: function () {
            for (var i = 0; i < this._expandersList.length; i++) {
                this._expandersList[i].css('position', 'relative');
                var expanderHeader = this._expandersList[i].children('.' + this.toThemeProperty('jqx-expander-header', true));
                var expanderContent = this._expandersList[i].children('.' + this.toThemeProperty('jqx-expander-contentWrapper', true));
                //    expanderHeader.css('border-top-width', '0px');
                if (i > 0)
                    expanderHeader.css('margin-top', '-1px');

                expanderContent.css('border-left-width', '0px');
                expanderContent.css('border-right-width', '0px');
                expanderContent.css('border-top-width', '0px');
                expanderContent.css('border-bottom-width', '0px');
                expanderContent.children().css('border-top-width', '0px');

                if (i !== 0 && i !== (this._expandersList.length - 1)) {
                    this._removeRoundedCorners(this._expandersList[i], true, true);
                }
                if (i === 0) {
                    this._removeRoundedCorners(this._expandersList[i], false, true);
                }
                if (i === (this._expandersList.length - 1)) {
                    this._removeRoundedCorners(this._expandersList[i], true, false);
                }
            }
        },

        //[optimize]
        _createExpander: function (expanderDiv, toggleModeValue) {
            var expander = $(expanderDiv).jqxExpander({ expanded: true, width: this.width, arrowPosition: this.arrowPosition, expandAnimationDuration: this.expandAnimationDuration,
                collapseAnimationDuration: this.collapseAnimationDuration, disabled: this.disabled, animationType: this.animationType, showArrow: this.showArrow, toggleMode: toggleModeValue
                , theme: this.theme
            });
            return expander;
        },

        //[optimize]
        _createExpanderByNavigationBarExpandMode: function (expanderIndex, expanderDiv) {
            var self = this;
            var expander;
            switch (this.expandMode) {
                case 'single':
                    expander = this._singleExpandModeCreateExpander(expanderIndex, expanderDiv);
                    break;
                case 'multiple':
                    expander = this._multipleExpandModeCreateExpander(expanderIndex, expanderDiv);
                    break;
                case 'toggle':
                    expander = this._toggleExpandModeCreateExpander(expanderIndex, expanderDiv);
                    break;
                case 'none':
                    expander = this._noneExpandModeCreateExpander(expanderIndex, expanderDiv);
                    break;
            }
            return expander;
        },

        //[optimize]
        _disableItems: function () {
            for (var i = 0; i < this._expandersList.length; i++) {
                this._toggleModesBackup[i] = $(this._expandersList[i]).jqxExpander('toggleMode');
                $(this._expandersList[i]).jqxExpander('toggleMode', 'none');
            }
        },

        //[optimize]
        _enableItems: function () {
            for (var i = 0; i < this._expandersList.length; i++) {
                $(this._expandersList[i]).jqxExpander('toggleMode', this._toggleModesBackup[i]);
            }
        },

        //[optimize]
        _isValidIndex: function (index) {
            return (index < this._expandersList.length);
        },

        //[optimize]
        _toggleExpandModeCreateExpander: function (expanderIndex, expanderDiv) {
            var expander;
            if (this.expandedIndex === expanderIndex) {
                expander = this._createExpander(expanderDiv, this.toggleMode, true);
                this._expandedIndexes[expanderIndex] = true;
                this._currentExpandedItem = expander;
            } else {
                expander = this._createExpander(expanderDiv, this.toggleMode, false);
                this._expandedIndexes[expanderIndex] = false;
            }
            return expander;
        },

        //[optimize]
        _singleExpandModeCreateExpander: function (expanderIndex, expanderDiv) {
            var expander;
            if ((this.expandedIndex === -1 && expanderIndex === 0) || this.expandedIndex === expanderIndex) {
                expander = this._createExpander(expanderDiv, this.toggleMode, true);
                this._expandedIndexes[expanderIndex] = true;
                this._currentExpandedItem = expander;
            } else {
                expander = this._createExpander(expanderDiv, this.toggleMode, false);
                this._expandedIndexes[expanderIndex] = false;
            }
            return expander;
        },

        //[optimize]
        _multipleExpandModeCreateExpander: function (expanderIndex, expanderDiv) {
            var expander;
            if (this._expandedIndexes[expanderIndex]) {
                expander = this._createExpander(expanderDiv, this.toggleMode, this._expandedIndexes[expanderIndex]);
                this._expandedIndexes[expanderIndex] = true;
            } else {
                expander = this._createExpander(expanderDiv, this.toggleMode, this._expandedIndexes[expanderIndex]);
                this._expandedIndexes[expanderIndex] = false;
            }
            return expander;
        },

        //[optimize]
        _noneExpandModeCreateExpander: function (expanderIndex, expanderDiv) {
            var expander;
            if (this._expandedIndexes[expanderIndex]) {
                expander = this._createExpander(expanderDiv, this.toggleMode, this._expandedIndexes[expanderIndex]);
                this._expandedIndexes[expanderIndex] = true;
            } else {
                expander = this._createExpander(expanderDiv, this.toggleMode, this._expandedIndexes[expanderIndex]);
                this._expandedIndexes[expanderIndex] = false;
            }
            return expander;
        },

        //[optimize]
        _removeRoundedCorners: function (expander, top, bottom) {
            if (top) {
                var header = $(expander).children(this.toThemeProperty('.jqx-expander-header', true));
                header.css('-moz-border-radius', '0px');
                expander.css('-moz-border-radius-topleft', '0px');
                expander.css('-moz-border-radius-topright', '0px');
                header.css('border-radius', '0px');
                expander.css('border-top-left-radius', '0px');
                expander.css('border-top-right-radius', '0px');
            }
            if (bottom) {
                var content = $(expander).children('.jqx-expander-contentWrapper').children(this.toThemeProperty('.jqx-expander-content', true));
                content.css('-moz-border-radius', '0px');
                expander.css('-moz-border-radius-topleft', '0px');
                expander.css('-moz-border-radius-topright', '0px');
                content.css('border-radius', '0px');
                expander.css('border-bottom-left-radius', '0px');
                expander.css('border-bottom-right-radius', '0px');
            }
        },

        //Collapsing item with  any index
        collapseAt: function (index) {
            if (this._isValidIndex(index)) {
                $(this._expandersList[index]).jqxExpander('collapse');
                this._expandedIndexes[index] = false;

                this.expandedIndexes.splice(index, 1);
                if (this.expandedIndex == index) {
                    this.expandedIndex = -1;
                }
            }
        },

        //Expanding item with  any index
        expandAt: function (index) {
            if (this._isValidIndex(index)) {
                $(this._expandersList[index]).jqxExpander('expand');
                this._expandedIndexes[index] = true;
                this.expandedIndex = index;
            }
        },

        // gets item states.
        getItemStates: function () {
            return this._expandedIndexes;
        },

        //Disabling item with  any index
        disableAt: function (index) {
            if (this._isValidIndex(index)) {
                if (!$(this._expandersList[index]).jqxExpander('disabled')) {
                    $(this._expandersList[index]).jqxExpander('disabled', true)
                }
            }
        },

        //Enabling item with  any index
        enableAt: function (index) {
            if (this._isValidIndex(index)) {
                if ($(this._expandersList[index]).jqxExpander('disabled')) {
                    $(this._expandersList[index]).jqxExpander('disabled', false)
                }
            }
        },

        //Setting content to item with  any index
        setContentAt: function (index, content) {
            if (this._isValidIndex(index)) {
                $(this._expandersList[index]).jqxExpander('setContent', content);
            }
        },

        //Setting header content to item with  any index
        setHeaderContentAt: function (index, content) {
            if (this._isValidIndex(index)) {
                $(this._expandersList[index]).jqxExpander('setHeaderContent', content);
            }
        },

        //Getting header content of item with  any index
        getHeaderContentAt: function (index) {
            if (this._isValidIndex(index)) {
                return $(this._expandersList[index]).jqxExpander('getHeaderContent');
            }
            return null;
        },

        //Getting content of item with  any index
        getContentAt: function (index) {
            if (this._isValidIndex(index)) {
                return $(this._expandersList[index]).jqxExpander('getContent');
            }
            return null;
        },

        //Forbidding expand/collapse for item with specific index
        lockAt: function (index) {
            if (this._isValidIndex(index)) {
                $(this._expandersList[index]).jqxExpander('toggleMode', 'none');
            }
        },

        //Allowing expand/collapse for item with specific index. This method is useful
        //only when the item is already locked.
        unlockAt: function (index) {
            if (this._isValidIndex(index)) {
                $(this._expandersList[index]).jqxExpander('toggleMode', this.toggleMode);
            }
        },

        //Showing the arrow of expander with specific index
        showArrowAt: function (index) {
            if (this._isValidIndex(index)) {
                $(this._expandersList[index]).jqxExpander('showArrow', true);
            }
        },

        //Hiding the arrow of expander with specific index
        hideArrowAt: function (index) {
            if (this._isValidIndex(index)) {
                $(this._expandersList[index]).jqxExpander('showArrow', false);
            }
        },

        //This method is disabling the navigation bar.
        disable: function () {
            for (var i = 0; i < this._expandersList.length; i++) {
                this.disableAt(i);
            }
        },

        //This method is enabling the navigation bar.
        enable: function () {
            for (var i = 0; i < this._expandersList.length; i++) {
                this.enableAt(i);
            }
        },

        destroy: function () {
            this.host
			.removeClass();
        },

        //[optimize]
        _raiseEvent: function (id, itemIndex) {
            if (itemIndex == undefined) {
                itemIndex = -1;
            }
            var eventType = this._events[id];
            var event = $.Event(eventType);

            event.owner = itemIndex;
            event.item = itemIndex;

            var result = this.host.trigger(event);
            return result;
        },

        //[optimize]
        _getHeaders: function () {
            var headersList = [];
            for (var i = 0; i < this._expandersList.length; i++) {

                headersList[i] = $('<div class="' + this.toThemeProperty('jqx-expander-header') + '" />').append($(this._expandersList[i]).jqxExpander('getHeaderContent'));
            }
            return headersList;
        },

        //[optimize]
        _getContents: function () {
            var contentsList = [];
            for (var i = 0; i < this._expandersList.length; i++) {
                contentsList[i] = $('<div class="' + this.toThemeProperty('jqx-expander-content') + '" />').append($(this._expandersList[i]).jqxExpander('getContent'));
            }
            return contentsList;
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            this._validateProperties();
            if (key === 'arrowPosition') {
                $.each(object._expandersList, function () {
                    this.jqxExpander({ arrowPosition: value });
                });
            }
            else if (key === 'expandAnimationDuration') {
                $.each(object._expandersList, function () {
                    this.jqxExpander({ expandAnimationDuration: value });
                });
            }
            else if (key === 'collapseAnimationDuration') {
                $.each(object._expandersList, function () {
                    this.jqxExpander({ collapseAnimationDuration: value });
                });
            }
            else if (key === 'showArrow') {
                $.each(object._expandersList, function () {
                    this.jqxExpander({ showArrow: value });
                });
            }
            else if (key === 'toggleMode') {
                $.each(object._expandersList, function () {
                    this.jqxExpander({ toggleMode: value });
                });
            }
            else if (key === 'theme') {
                $.each(object._expandersList, function () {
                    this.jqxExpander({ theme: value });
                });
            }
            else if (key === 'animationType') {
                $.each(object._expandersList, function () {
                    this.jqxExpander({ animationType: value });
                });
            }
            else if (key === 'disabled') {
                $.each(object._expandersList, function () {
                    this.jqxExpander({ disabled: value });
                });
            }
            else if (key === 'expandedIndexes') {
                $.each(object.expandedIndexes, function () {
                    if (value) {
                        object.expandAt(this);
                    }
                    else {
                        object.collapseAt(this);
                    }
                });
            }
            else
                if (key === 'disabled') {
                    if (value) {
                        this.disable();
                    } else {
                        this.enable();
                    }
                } else {
                    this._updateExpandedIndexes(this.headersList.length);
                    this._refreshNavigationBar();
                }
        }
    });
})(jQuery);