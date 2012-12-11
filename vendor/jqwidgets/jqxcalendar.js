/*
jQWidgets v2.5.5 (2012-Nov-28)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/

/*
* jqxcalendar.js
*
* This source is property of jqwidgets and/or its partners and is subject to jqwidgets Source Code License agreement and jqwidgets EULA.
* Copyright (c) 2012 jqwidgets.
* <Licensing info>
* 
* http://www.jQWidgets.com
*/


(function ($) {

    $.jqx.jqxWidget("jqxCalendar", "", {});

    $.extend($.jqx._jqxCalendar.prototype, {
        defineInstance: function () {
            // enables or disables the Calendar control.
            if (this.disabled == undefined) {
                this.disabled = false;
            }

            // not available in this version.
            if (this.multipleMonthRows == undefined) {
                this.multipleMonthRows = 1;
            }

            // not available in this version.
            if (this.multipleMonthColumns == undefined) {
                this.multipleMonthColumns = 1;
            }

            // Specifies the Calendar's minimum navigation date.
            if (this.minDate == undefined) {
                this.minDate = $.jqx._jqxDateTimeInput.getDateTime(new Date());
                this.minDate._setYear(1900);
                this.minDate._setMonth(1);
                this.minDate._setDay(1);
                this.minDate._setHours(1);
                this.minDate._setMinutes(1);
                this.minDate._setSeconds(1);
                this.minDate._setMilliseconds(1);
            }

            // Specifies the Calendar's maximum navigation date.
            if (this.maxDate == undefined) {
                this.maxDate = $.jqx._jqxDateTimeInput.getDateTime(new Date());
                this.maxDate._setYear(2100);
                this.maxDate._setMonth(1);
                this.maxDate._setDay(1);
                this.maxDate._setHours(1);
                this.maxDate._setMinutes(1);
                this.maxDate._setSeconds(1);
                this.maxDate._setMilliseconds(1);
            }

            // Type: Number
            // Default: 1
            // Gets or sets the navigation step.
            if (this.stepMonths == undefined) {
                this.stepMonths = 1; // Number of months to step back/forward
            }

            // Type: Number
            // Default: null
            // Gets or sets the Calendar's width.
            if (this.width == undefined) {
                this.width = null;
            }

            // Type: height
            // Default: null
            // Gets or sets the Calendar's height.
            if (this.height == undefined) {
                this.height = null;
            }

            // Type: $.jqx._jqxDateTimeInput.getDateTime
            // Default:  $.jqx._jqxDateTimeInput.getDateTime(new Date()); (Today)
            // Gets or sets the Calendar's value.
            if (this.value == undefined) {
                this.value = $.jqx._jqxDateTimeInput.getDateTime(new Date());
                this.value._setHours(1);
                this.value._setMinutes(1);
                this.value._setSeconds(1);
                this.value._setMilliseconds(1);
            }

            // Type: Number.
            // Default: 0
            // Gets or sets the first day of the week - Sunday = 0, Monday = 1, Tuesday = 2, Wednesday = 3, Thursday = 4, Friday = 5, Saturday = 6.
            if (this.firstDayOfWeek == undefined) {
                this.firstDayOfWeek = 0;
            }

            // Type: Boolean.
            // Default: false.
            // Shows or hides the week numbers.
            if (this.showWeekNumbers == undefined) {
                this.showWeekNumbers = false;
            }

            // Type: Boolean.
            // Default: true.
            // Shows or hides the Day Names.
            if (this.showDayNames == undefined) {
                this.showDayNames = true;
            }

            // Type: Boolean
            // Default: false
            // Enables or disables the weekend highlight option.
            if (this.enableWeekend == undefined) {
                this.enableWeekend = false;
            }

            // Type: Boolean
            // Default: true
            // Enables or disables the other month highlight.
            if (this.enableOtherMonthDays == undefined) {
                this.enableOtherMonthDays = true;
            }

            // Type: Boolean
            // Default: true
            // Shows or hides the other month days.
            if (this.showOtherMonthDays == undefined) {
                this.showOtherMonthDays = true;
            }

            // Gets or sets the row header's width.
            // Type: Number.
            if (this.rowHeaderWidth == undefined) {
                this.rowHeaderWidth = 25;
            }

            // Default: 20
            // Gets or sets the column header's height.
            // Type: Number.
            if (this.columnHeaderHeight == undefined) {
                this.columnHeaderHeight = 20;
            }

            // Default: 25
            // Gets or sets the title's height.
            // Type: Number.
            if (this.titleHeight == undefined) {
                this.titleHeight = 25;
            }

            // Type: String.
            // Gets or sets the string format of the day names.
            // Possible values: default, shortest, firstTwoLetters, firstLetter, full
            if (this.dayNameFormat == undefined) {
                this.dayNameFormat = 'firstTwoLetters';
            }

            // Type: string.
            // Represents the title format displayed between the navigation arrow.
            if (this.titleFormat == undefined) {
                this.titleFormat = "MMMM yyyy";
            }

            // Type: Boolean.
            // Default: false
            // Gets or sets the readonly state. In this state the user can navigate through the months, but is not allowed to select.
            if (this.readOnly == undefined) {
                this.readOnly = false;
            }

            //Type: string
            //Default: 'default'
            //Gets or sets the calendar's culture.
            if (this.culture == undefined) {
                this.culture = "default";
            }

            // Type: Boolean
            // Default: true.
            // Enables or disables the fast navigation when the user holds the mouse pressed over a navigation arrow.
            if (this.enableFastNavigation == undefined) {
                this.enableFastNavigation = true;
            }

            // Type: Boolean
            // Default: true
            // Enables or disables the hover state.
            if (this.enableHover == undefined) {
                this.enableHover = true;
            }

            // Type: Boolean
            // Default: true
            // When this property is true, click on other month date will automatically navigate to the previous or next month.
            if (this.enableAutoNavigation == undefined) {
                this.enableAutoNavigation = true;
            }

            // Type: Boolean
            // Default: false
            // enables or disabled the calendar tooltips.
            if (this.enableTooltips == undefined) {
                this.enableTooltips = false;
            }

            // Type: String
            // Back Button Text.
            if (this.backText == undefined) {
                this.backText = "Back";
            }

            // Type: String
            // Forward Button Text.
            if (this.forwardText == undefined) {
                this.forwardText = "Forward";
            }

            // Type: Array
            // Represents a collection of special calendar days.
            if (this.specialDates == undefined) {
                this.specialDates = new Array();
            }
            this.keyboardNavigation = true;
            // Selects a range of dates.
            this.selectionMode = 'default';
            this.todayString = 'Today';
            this.clearString = 'Clear';
            this.showFooter = false;
            this.selection = { from: null, to: null };
            //Type: Number.
            //Default: 0.
            //Sets height of the calendar in pixels. 
            this.height = null;

            // Calendar events.
            this.events =
			[
            // occurs when the back button is clicked.
		  	   'backButtonClick',
            // occurs when the forward button is clicked.
               'nextButtonClick',
            // occurs when the value is changed.
               'valuechanged',
            // occurs when the user clicks a cell.
               'cellMouseDown',
            // occurs when the user clicks a cell but is still holding the mouse key pressed.
               'cellMouseUp',
            // occurs when the user selects a cell.
               'cellSelected',
            // occurs when a cell is unselected. For example: user selects a cell and then selects another cell. The first selected cell is unselected.
               'cellUnselected'
			];
        },

        createInstance: function (args) {
            this.setCalendarSize();
            if (this.element.id == "") {
                this.element.id = $.jqx.utilities.createId();
            }

            var id = this.element.id;
            var me = this;
            this.propertyChangeMap['width'] = function (instance, key, oldVal, value) {
                me.setCalendarSize();
            };

            this.propertyChangeMap['height'] = function (instance, key, oldVal, value) {
                me.setCalendarSize();
            };

            this.host.attr('tabIndex', 0);
            this.host.css('outline', 'none');
            this.host.addClass(this.toThemeProperty("jqx-calendar"));
            this.host.addClass(this.toThemeProperty("jqx-widget"));
            this.host.addClass(this.toThemeProperty("jqx-widget-content"));
            this.host.addClass(this.toThemeProperty("jqx-rc-all"));
            this._addInput();

            this.addHandler($($(this.element)[0]), 'keydown',
            function (event) {
                var result = true;
                if (me.keyboardNavigation) {
                    if (me._handleKey != undefined) {
                        result = me._handleKey(event);
                        if (!result) {
                            if (event.stopPropagation) event.stopPropagation();
                        }
                    }
                }
                return result;
            });

            var loaded = false;
            var myCalendar = this;
            this.render();

            var percentageSize = false;

            if (me.width != null && me.width.toString().indexOf("%") != -1) {
                percentageSize = true;
            }

            if (me.height != null && me.height.toString().indexOf("%") != -1) {
                percentageSize = true;
            }

            $(window).bind('resize.calendar' + this.element.id, function () {
                var month = myCalendar.host.find("#View1" + me.element.id);
                if (!loaded) {
                    loaded = true;
                    myCalendar.render();
                }
                else myCalendar.refreshTitle(month);

                if (percentageSize) {
                    if (me.refreshTimer) {
                        clearTimeout(me.refreshTimer);
                    }

                    me.refreshTimer = setTimeout(function () {
                        me.refreshControl();
                    }, 1);
                }
            });

            if (percentageSize) {
                setInterval(function () {
                    var width = me.host.width();
                    var height = me.host.height();
                    if (me._lastWidth != width || me._lastHeight != height) {
                        me.refreshControl();
                    }
                    me._lastWidth = width;
                    me._lastHeight = height;
                }, 100);
            }

            var calendarID = 'View1';
            this.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (value) {
                    instance.host.addClass(me.toThemeProperty('jqx-fill-state-disabled'));
                }
                else {
                    instance.host.removeClass(me.toThemeProperty('jqx-fill-state-disabled'));
                }
                me.refreshControl();
            }
        },

        _addInput: function () {
            var name = this.host.attr('name');
            if (!name) name = this.element.id;
            this.input = $("<input type='hidden'/>");
            this.host.append(this.input);
            this.input.attr('name', name);
            this.input.val(this.getDate().toString());
        },

        setCalendarSize: function () {
            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    this.host.width(this.width);
                };

            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                this.host.width(this.width);
            }

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.host.height(this.height);
            };

            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                this.host.height(this.height);
            }
        },

        _handleKey: function (event) {
            if (this.readOnly)
                return true;

            var key = event.keyCode;
            var selectedDate = this._getSelectedDate();
            if (selectedDate == undefined)
                return true;

            if (event.altKey) {
                return true;
            }

            var date = new $.jqx._jqxDateTimeInput.getDateTime(selectedDate);
            var start = this.getViewStart();
            var end = this.getViewEnd();
            var monthInstance = $.data(this.element, "View1" + this.element.id);
            if (monthInstance == undefined || monthInstance == null)
                return true;

            if (key == 38) {
                date._addDays(-7);
                if (date.dateTime < start) {
                    var res = this.navigateBackward();
                    if (!res)
                        return false;
                }

                this._selectDate(date.dateTime, 'key');
                for (i = 0; i < monthInstance.cells.length; i++) {
                    var cell = monthInstance.cells[i];
                    var cellDate = cell.dateTime.dateTime;
                    if (cell.isOtherMonth && cell.isSelected && cellDate <= date.dateTime) {
                        this.navigateBackward();
                        this._selectDate(date.dateTime, 'key');
                        break;
                    }
                }
                return false;
            }
            else if (key == 40) {
                date._addDays(7);
                if (date.dateTime > end) {
                    var res = this.navigateForward();
                    if (!res)
                        return false;
                }

                this._selectDate(date.dateTime, 'key');
                for (i = 0; i < monthInstance.cells.length; i++) {
                    var cell = monthInstance.cells[i];
                    var cellDate = cell.dateTime.dateTime;
                    if (cell.isOtherMonth && cell.isSelected && cellDate >= date.dateTime) {
                        this.navigateForward();
                        this._selectDate(date.dateTime, 'key');
                        break;
                    }
                }

                return false;
            }

            if (key == 37) {
                date._addDays(-1);
                if (date.dateTime < start) {
                    var res = this.navigateBackward();
                    if (!res)
                        return false;
                }

                this._selectDate(date.dateTime, 'key');
                for (i = 0; i < monthInstance.cells.length; i++) {
                    var cell = monthInstance.cells[i];
                    var cellDate = cell.dateTime.dateTime;
                    if (cell.isOtherMonth && cell.isSelected && cellDate <= date.dateTime) {
                        if (date.dateTime < this.getMinDate() || date.dateTime > this.getMaxDate()) {
                            return;
                        }

                        this.navigateBackward();
                        this._selectDate(date.dateTime, 'key');
                        break;
                    }
                }

                return false;
            }
            else if (key == 39) {
                date._addDays(1);
                if (date.dateTime > end) {
                    var res = this.navigateForward();
                    if (!res)
                        return false;
                }

                this._selectDate(date.dateTime, 'key');
                for (i = 0; i < monthInstance.cells.length; i++) {
                    var cell = monthInstance.cells[i];
                    var cellDate = cell.dateTime.dateTime;
                    if (cell.isOtherMonth && cell.isSelected && cellDate >= date.dateTime) {
                        if (date.dateTime < this.getMinDate() || date.dateTime > this.getMaxDate()) {
                            return;
                        }

                        this.navigateForward();
                        this._selectDate(date.dateTime, 'key');
                        break;
                    }
                }
                return false;
            }

            return true;
        },

        render: function () {
            if (this.multipleMonthRows == 1 && this.multipleMonthColumns == 1) {
                var month = this._renderSingleCalendar("View1" + this.element.id);
                this.host.append(month);
            }
            else {
            }
        },

        // adds a special date to the calendar.
        // @param - Date.
        // @param - css class name(optional).
        // @param - string for the special date's tooltip(optional).
        addSpecialDate: function (date, className, tooltipContent) {
            if (this.multipleMonthRows == 1 && this.multipleMonthColumns == 1) {
                var specialDatesLength = this.specialDates.length;
                this.specialDates[specialDatesLength] = { Date: date, Class: className, Tooltip: tooltipContent };

                this.refreshControl();
            }
        },

        refresh: function (initialRefresh) {
            if (!initialRefresh) {
                this.render();
            }
        },

        refreshControl: function () {
            if (this.multipleMonthRows == 1 && this.multipleMonthColumns == 1) {
                this.refreshSingleCalendar("View1" + this.element.id, null);
            }
        },

        // gets the view's start date.
        getViewStart: function () {
            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);
            return firstDay.dateTime;
        },

        // gets the view's end date.
        getViewEnd: function () {
            var start = this.getViewStart();
            var end = new $.jqx._jqxDateTimeInput.getDateTime(start);
            end._addDays(41);
            return end.dateTime;
        },

        refreshSingleCalendar: function (calendarID, parent) {
            var month = this.host.find("#" + calendarID);
            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);

            this.refreshTitle(month);
            this.refreshCalendarCells(month, firstDay, calendarID);
            this.refreshRowHeader(month, calendarID);
            if (this.selectedDate != undefined) {
                this._selectDate(this.selectedDate);
            }
            var contentHeight = this.host.height() - this.titleHeight - this.columnHeaderHeight;
            if (!this.showDayNames) {
                contentHeight = this.host.height() - this.titleHeight;
            }
            if (this.showFooter) {
                contentHeight -= 20;
            }

            var cellsTableElement = month.find("#cellsTable" + calendarID);
            var rowHeaderElement = month.find("#calendarRowHeader" + calendarID);
            cellsTableElement.height(contentHeight);
            rowHeaderElement.height(contentHeight);
        },

        refreshRowHeader: function (month, calendarID) {
            if (!this.showWeekNumbers)
                return;

            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);
            var dayOfWeek = firstDay.dayOfWeek;
            var weekOfYear = this.getWeekOfYear(firstDay);
            var rowHeader = month.find('#rowHeader');

            rowHeader.width(this.rowHeaderWidth);
            //   month.find("#calendarRowHeader" + month[0].id).append(rowHeader);
            var currentDate = firstDay;
            var rowHeaderCells = new Array();

            for (i = 0; i < 6; i++) {
                var weekString = weekOfYear.toString();
                var cell = new $.jqx._jqxCalendar.cell(currentDate.dateTime);
                var cellID = i + 1;
                var cellElement = rowHeader.find("#headerCell" + cellID);
                cell.element = cellElement;
                cell.row = i;
                cell.column = 0;
                var cellContent = cellElement.find("#headerCellContent" + cellID);
                cellContent.addClass(this.toThemeProperty('jqx-calendar-row-cell'));
                cellContent[0].innerHTML = weekOfYear;
                rowHeaderCells[i] = cell;
                currentDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(currentDate._addWeeks(1)));
                weekOfYear = this.getWeekOfYear(currentDate);
            }

            var monthInstance = $.data(this.element, month[0].id);
            monthInstance.rowCells = rowHeaderCells;
            this._refreshOtherMonthRows(monthInstance, calendarID);
        },

        _refreshOtherMonthRows: function (month, calendarID) {
            if (this.showOtherMonthDays)
                return;

            this._displayLastRow(true, calendarID);
            this._displayFirstRow(true, calendarID);

            var canDisplayFirstRow = false;
            var canDisplayLastRow = false;

            for (i = 0; i < month.cells.length; i++) {
                var cell = month.cells[i];
                if (cell.isVisible && i < 7) {
                    canDisplayFirstRow = true;
                }
                else if (cell.isVisible && i >= month.cells.length - 7) {
                    canDisplayLastRow = true;
                }
            }

            if (!canDisplayFirstRow) {
                this._displayFirstRow(false, calendarID);
            }

            if (!canDisplayLastRow) {
                this._displayLastRow(false, calendarID);
            }
        },

        _displayLastRow: function (show, calendarID) {
            var month = this.host.find("#" + calendarID);
            var calendarRowHeader = month.find("#calendarRowHeader" + month[0].id);
            var lastRow = calendarRowHeader.find("#headerCellContent6");
            var lastMonthRow = month.find("#cellsTable" + month[0].id).find("#row6");

            if (show) {
                lastRow.css('display', 'block');
                lastMonthRow.css('display', 'table-row');
            }
            else {
                lastRow.css('display', 'none');
                lastMonthRow.css('display', 'none');
            }
        },

        _displayFirstRow: function (show, calendarID) {
            var month = this.host.find("#" + calendarID);
            var calendarRowHeader = month.find("#calendarRowHeader" + month[0].id);
            var firstRow = calendarRowHeader.find("#headerCellContent1");
            var firstMonthRow = month.find("#cellsTable" + month[0].id).find("#row1");

            if (show) {
                firstRow.css('display', 'block');
                firstMonthRow.css('display', 'table-row');
            }
            else {
                firstRow.css('display', 'none');
                firstMonthRow.css('display', 'none');
            }
        },

        _renderSingleCalendar: function (calendarID, parent) {
            var oldMonthElement = this.host.find("#" + calendarID.toString());
            if (oldMonthElement != null) {
                oldMonthElement.remove();
            }

            var month = $("<div id='" + calendarID.toString() + "'></div>");

            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);
            var endDay = new $.jqx._jqxDateTimeInput.getDateTime(firstDay.dateTime);
            endDay._addMonths(1);

            var monthInstance = $.jqx._jqxCalendar.monthView(firstDay, endDay, null, null, null, month);

            if (parent == undefined || parent == null) {
                this.host.append(month);

                if (this.height != undefined && !isNaN(this.height)) {
                    month.height(this.height);
                }
                else if (this.height != null && this.height.toString().indexOf("px") != -1) {
                    month.height(this.height);
                }

                if (this.width != undefined && !isNaN(this.width)) {
                    month.width(this.width);
                }
                else if (this.width != null && this.width.toString().indexOf("px") != -1) {
                    month.width(this.width);
                }

                if (this.width != null && this.width.toString().indexOf("%") != -1) {
                    month.width('100%');
                }
                if (this.height != null && this.height.toString().indexOf("%") != -1) {
                    month.height('100%');
                }
            }
            else parent.append(month);

            $.data(this.element, calendarID, monthInstance);

            var contentHeight = this.host.height() - this.titleHeight - this.columnHeaderHeight;
            if (!this.showDayNames) {
                contentHeight = this.host.height() - this.titleHeight;
            }
            if (this.showFooter) {
                contentHeight -= 20;
            }

            if (this.rowHeaderWidth < 0) this.rowHeaderWidth = 0;
            if (this.columnHeaderHeight < 0) this.columnHeaderHeight = 0;
            if (this.titleHeight < 0) this.titleHeight = 0;

            var rowHeaderWidth = this.rowHeaderWidth;
            var columnHeaderHeight = this.columnHeaderHeight;

            if (!this.showWeekNumbers) {
                rowHeaderWidth = 0;
            }

            if (!this.showDayNames) {
                columnHeaderHeight = 0;
            }


            var title = $("<div style='height:" + this.titleHeight + "px;'><table style='margin: 0px; width: 100%; height: 100%; border-spacing: 0px;' cellspacing='0' cellpadding='0'><tr id='calendarTitle' width='100%'>" +
               "<td NOWRAP id='leftNavigationArrow'></td>" + "<td align='center' NOWRAP id='calendarTitleHeader'></td>" + "<td NOWRAP id='rightNavigationArrow'></td>" +
               "</tr></table></div>");

            title.addClass(this.toThemeProperty('jqx-calendar-title-container'));
            month.append(title);
            var monthStructure = $("<table style='margin: 0px; border-spacing: 0px;' cellspacing='0' cellpadding='0'>" +
               "<tr id='calendarHeader' height='" + columnHeaderHeight + "'>" +
               "<td id='selectCell' width='" + rowHeaderWidth + "'></td>" + "<td colspan='2' style='padding-left: 2px; padding-right: 2px' id='calendarColumnHeader'></td>" +
               "</tr>" +
               "<tr id='calendarContent'>" +
               "<td id='calendarRowHeader' valign='top' height='" + contentHeight + "' width='" + rowHeaderWidth + "'></td>" + "<td valign='top' colspan='2' style='padding-left: 2px; padding-right: 2px' id='cellsTable' height='" + contentHeight + "'></td>" +
               "</tr>" +
               "</table>"
           );

            var footerHeight = 20;
            var footer = $("<div style='margin: 0px; display: none; height:" + footerHeight + "px;'><table style='width: 100%; height: 100%; border-spacing: 0px;' cellspacing='0' cellpadding='0'>" +
            "<tr id='calendarFooter'>" +
            "<td align='right' id='todayButton'></td>" + "<td align='left' colspan='2' id=doneButton></td>" +
            "</tr>" + "</table></div>");

            if (this.showFooter) {
                footer.css('display', 'block');
            }

            month.append(monthStructure);
            month.append(footer);
            monthStructure.addClass(this.toThemeProperty('jqx-calendar-month'));

            month.find('#calendarTitle')[0].id = 'calendarTitle' + calendarID;
            month.find('#leftNavigationArrow')[0].id = 'leftNavigationArrow' + calendarID;
            month.find('#calendarTitleHeader')[0].id = 'calendarTitleHeader' + calendarID;
            month.find('#rightNavigationArrow')[0].id = 'rightNavigationArrow' + calendarID;
            month.find('#cellsTable')[0].id = 'cellsTable' + calendarID;
            month.find('#calendarRowHeader')[0].id = 'calendarRowHeader' + calendarID;
            month.find('#calendarFooter')[0].id = 'calendarFooter' + calendarID;
            month.find('#todayButton')[0].id = 'todayButton' + calendarID;
            month.find('#doneButton')[0].id = 'doneButton' + calendarID;
            month.find('#selectCell')[0].id = 'selectCell' + calendarID;
            month.find('#calendarColumnHeader')[0].id = 'calendarColumnHeader' + calendarID;

            month.find('td').css({ padding: 0, margin: 0, border: 'none' });
            month.find('tr').addClass(this.toThemeProperty('jqx-reset'));

            month.addClass(this.toThemeProperty("jqx-widget-content"));
            month.addClass(this.toThemeProperty("jqx-calendar-month-container"));

            var selectCellElement = month.find("#selectCell" + calendarID);
            selectCellElement.addClass(this.toThemeProperty('jqx-reset'));
            selectCellElement.addClass(this.toThemeProperty('jqx-calendar-top-left-header'));

            if (this.showWeekNumbers) {
                this._renderRowHeader(month);
            }
            else {
                var cellsTableElement = month.find("#cellsTable" + calendarID);
                cellsTableElement[0].colSpan = 3;
                var columnHeaderElement = month.find("#calendarColumnHeader" + calendarID);
                columnHeaderElement[0].colSpan = 3;
                var rowHeaderElement = month.find("#calendarRowHeader" + calendarID);
                rowHeaderElement.css('display', 'none');
                var selectCellElement = month.find("#selectCell" + calendarID);
                selectCellElement.css('display', 'none');
            }

            if (this.showFooter) {
                var footer = month.find("#calendarFooter" + calendarID);
                footer.height(20);
                var todayButton = month.find("#todayButton" + calendarID);
                var doneButton = month.find("#doneButton" + calendarID);

                var todayLink = $("<a href='#'>" + this.todayString + "</a>");
                todayLink.appendTo(todayButton);
                var clearLink = $("<a href='#'>" + this.clearString + "</a>");
                clearLink.appendTo(doneButton);
                clearLink.addClass(this.toThemeProperty('jqx-calendar-footer'));
                todayLink.addClass(this.toThemeProperty('jqx-calendar-footer'));
                var self = this;
                this.addHandler(todayLink, 'click', function () {
                    self.setDate(new Date(), 'mouse');
                    if (self.today) self.today();
                });
                this.addHandler(clearLink, 'click', function () {
                    self.setDate(null, 'mouse');
                    if (self.clear) self.clear();
                });
            }

            if (this.showDayNames) {
                this.renderColumnHeader(month);
            }

            if (parent == undefined || parent == null) {
                this.renderTitle(month);
            }

            this.renderCalendarCells(month, firstDay, calendarID)
            this._refreshOtherMonthRows(monthInstance, calendarID);
            month.find('tbody').css({ border: 'none', background: 'transparent' });
            if (this.selectedDate != undefined) {
                this._selectDate(this.selectedDate);
            }

            return month;
        },

        renderTitle: function (month) {
            if ($.global == null || $.global == undefined) {
                throw "jquery.global.js is not loaded.";
            }

            $.global.preferCulture(this.culture);

            var leftArrow = $("<div style='float: left;'></div>");
            var rightArrow = $("<div style='float: right;'></div>");
            var titleElement = month.find("#calendarTitle" + month[0].id);
            titleElement.addClass(this.toThemeProperty("jqx-reset"));
            titleElement.addClass(this.toThemeProperty("jqx-widget-header"));
            titleElement.addClass(this.toThemeProperty("jqx-calendar-title-header"));
            //  titleElement.css('margin', 0);
            //    titleElement.css('padding', 0);

            if ($.browser.msie && $.browser.version < 8) {
                if (titleElement.find('td').css('background-color') != 'transparent') {
                    var bgColor = titleElement.css('background-color');
                    titleElement.find('td').css('background-color', bgColor);
                }
                if (titleElement.find('td').css('background-image') != 'transparent') {
                    var bgImage = titleElement.css('background-image');
                    var bgRepeat = titleElement.css('background-repeat');
                    var bgPosition = titleElement.css('background-position');

                    titleElement.find('td').css('background-image', bgImage);
                    titleElement.find('td').css('background-repeat', bgRepeat);
                    titleElement.find('td').css('background-position', 'left center scroll');
                }
            }
            else {
                titleElement.find('td').css('background-color', 'transparent');
            }

            if (this.disabled) {
                titleElement.addClass(this.toThemeProperty("jqx-calendar-title-header-disabled"));
            }

            leftArrow.addClass(this.toThemeProperty("jqx-calendar-title-navigation"));
            leftArrow.addClass(this.toThemeProperty("icon-arrow-left"));

            var leftArrowElement = month.find("#leftNavigationArrow" + month[0].id).append(leftArrow);

            rightArrow.addClass(this.toThemeProperty("jqx-calendar-title-navigation"));
            rightArrow.addClass(this.toThemeProperty("icon-arrow-right"));

            var rightArrowElement = month.find("#rightNavigationArrow" + month[0].id).append(rightArrow);

            if (this.enableTooltips) {
                if ($(leftArrowElement).jqxTooltip) {
                    $(leftArrowElement).jqxTooltip({name: this.element.id, position: 'mouse', theme: this.theme, content: this.backText });
                    $(rightArrowElement).jqxTooltip({ name: this.element.id, position: 'mouse', theme: this.theme, content: this.forwardText });
                }
            }

            var titleHeader = month.find("#calendarTitleHeader" + month[0].id);
            var title = $.global.format(this.value.dateTime, this.titleFormat, this.culture);
            var titleContent = $("<div style='background: transparent; margin: 0; padding: 0; border: none;' id='titleContent'>" + title + "</div>");
            titleHeader.append(titleContent);
            titleContent.addClass(this.toThemeProperty('jqx-calendar-title-content'));

            var arrowWidth = parseInt(leftArrow.width());
            var headerWidth = month.width() - 2 * arrowWidth;
            var newContent = titleHeader.find("#titleContent").width(headerWidth);

            $.data(leftArrow, 'navigateLeft', this);
            $.data(rightArrow, 'navigateRight', this);
            var isTouchDevice = $.jqx.mobile.isTouchDevice();

            if (!this.disabled) {
                this.addHandler(leftArrow, 'mousedown',
                function (event) {
                    $.data(leftArrow, 'navigateLeftRepeat', true);
                    var element = $.data(leftArrow, 'navigateLeft');
                    if (element.enableFastNavigation && !isTouchDevice) {
                        element.startRepeat(element, leftArrow, true, 250);
                    }
                    element.navigateBackward();
                    return element._raiseEvent(0, event)
                });

                this.addHandler(leftArrow, 'mouseup',
                function (event) {
                    $.data(leftArrow, 'navigateLeftRepeat', false);
                });

                this.addHandler(leftArrow, 'mouseleave',
                function (event) {
                    $.data(leftArrow, 'navigateLeftRepeat', false);
                });

                this.addHandler(rightArrow, 'mousedown',
                function (event) {
                    $.data(rightArrow, 'navigateRightRepeat', true);
                    var element = $.data(rightArrow, 'navigateRight')

                    if (element.enableFastNavigation && !isTouchDevice) {
                        element.startRepeat(element, rightArrow, false, 250);
                    }
                    element.navigateForward();
                    return element._raiseEvent(1, event)
                });

                this.addHandler(rightArrow, 'mouseup',
                function (event) {
                    $.data(rightArrow, 'navigateRightRepeat', false);
                });

                this.addHandler(rightArrow, 'mouseleave',
                function (event) {
                    $.data(rightArrow, 'navigateRightRepeat', false);
                });
            }
        },

        refreshTitle: function (month) {
            if ($.global == null || $.global == undefined) {
                throw "jquery.global.js is not loaded.";
            }

            $.global.preferCulture(this.culture);

            var title = $.global.format(this.value.dateTime, this.titleFormat, this.culture);

            var titleHeader = month.find("#calendarTitleHeader" + month[0].id);
            var oldContent = titleHeader.find("#titleContent");

            var titleContent = $("<div style='background: transparent; margin: 0; padding: 0; border: none;' id='titleContent'>" + title + "</div>");
            titleHeader.append(titleContent);
            titleContent.addClass(this.toThemeProperty('jqx-calendar-title-content'));

            if (oldContent != null) {
                oldContent.remove();
            }

            //            var leftArrow = this.host.find('.jqx-calendar-title-navigation');
            //            var arrowWidth = parseInt(leftArrow.width());
            //            var headerWidth = month.width() - 2 * arrowWidth;

            //   var newContent = titleHeader.find("#titleContent").width(headerWidth);
        },

        startRepeat: function (element, navigationElement, isLeft, timeout) {
            var timeoutobj = window.setTimeout(function () {

                var value = $.data(navigationElement, 'navigateLeftRepeat');
                if (!isLeft) {
                    value = $.data(navigationElement, 'navigateRightRepeat');
                }

                if (value) {
                    if (timeout < 25) timeout = 25;

                    if (isLeft) {
                        element.navigateBackward();
                        element.startRepeat(element, navigationElement, true, timeout - 25);
                    }
                    else {
                        element.navigateForward();
                        timeoutobj = element.startRepeat(element, navigationElement, false, timeout - 25);
                    }
                }
                else {
                    window.clearTimeout(timeoutobj);
                    return;
                }
            }, timeout);
        },

        // navigates (n) month(s) forward.
        // @param - Date
        navigateForward: function (step) {
            if (step == undefined || step == null) {
                step = this.stepMonths;
            }

            var day = this.value.day;
            var month = this.value.month;
            if (month + step <= 12) {
                var maxDays = this.value._daysInMonth(this.value.year, this.value.month + step);
                if (day > maxDays)
                    day = maxDays;
            }

            return this.navigateTo(new Date(this.value.year, this.value.month - 1 + step, day));
        },

        // navigates (n) month(s) back.
        // @param - Number  
        navigateBackward: function (step) {
            if (step == undefined || step == null) {
                step = this.stepMonths;
            }

            var day = this.value.day;
            var month = this.value.month;
            if (month - step >= 1) {
                var maxDays = this.value._daysInMonth(this.value.year, this.value.month - step);
                if (day > maxDays)
                    day = maxDays;
            }

            var date = new Date(this.value.year, this.value.month - 1 - step, day);
            return this.navigateTo(date);
        },

        refreshCalendarCells: function (month, firstDay, calendarID) {
            var tableElement = month.find("#cellsTable" + month[0].id);
            var cellsTable = tableElement.find("#" + 'cellTable' + calendarID.toString());
            var currentDate = firstDay;
            var cells = new Array();
            var k = 0;
            var today = new $.jqx._jqxDateTimeInput.getDateTime(new Date());
            //var cellWidth = (month.width() - this.rowHeaderWidth - 2) / 7;
            //if (!this.showWeekNumbers) {
            //    cellWidth = (month.width() - 2) / 7;
            //}

            for (i = 0; i < 6; i++) {
                for (j = 0; j < 7; j++) {
                    var cellRowID = i + 1;
                    var cellColumnID = j + 1;
                    var cellID = "#cell" + cellRowID + cellColumnID;
                    var cell = new $.jqx._jqxCalendar.cell(currentDate.dateTime);
                    var cellElement = cellsTable.find(cellID);
                    cell.element = cellElement;
                    cell.row = i;
                    cell.column = j;

                    cell.isVisible = true;
                    cell.isOtherMonth = false;
                    cell.isToday = false;
                    cell.isWeekend = false;
                    cell.isHighlighted = false;
                    cell.isSelected = false;

                    if (currentDate.month != this.value.month) {
                        cell.isOtherMonth = true;
                        cell.isVisible = this.showOtherMonthDays;
                    }

                    if (currentDate.month == today.month && currentDate.day == today.day && currentDate.year == today.year) {
                        cell.isToday = true;
                    }

                    if (currentDate.isWeekend()) {
                        cell.isWeekend = true;
                    }

                    $.data(this.element, "cellContent" + cellID.substring(1), cell);
                    cells[k] = cell;
                    k++;
                    var cellContent = cellElement.find("#cellContent" + cellID.substring(1));  
                    cellContent.html(currentDate.day);
                    this._applyCellStyle(cell, cellElement, cellContent);

                    currentDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(currentDate._addDays(1)));
                }
            }

            var monthInstance = $.data(this.element, month[0].id);
            if (monthInstance != undefined && monthInstance != null) {
                monthInstance.cells = cells;
            }
        },

        renderCalendarCells: function (month, firstDay, calendarID) {
            var cellsTable = $("<table style='border-spacing: 0px; width: 100%; height: 100%;' cellspacing='0' cellpadding='1' id=" + 'cellTable' + calendarID.toString() + ">" +
               "<tr id='row1'>" +
               "<td id='cell11'></td>" + "<td id='cell12'></td>" + "<td id='cell13'></td>" + "<td id='cell14'></td>" + "<td id='cell15'></td>" + "<td id='cell16'></td>" + "<td id='cell17'></td>" +
               "</tr>" +
               "<tr id='row2'>" +
               "<td id='cell21'></td>" + "<td id='cell22'></td>" + "<td id='cell23'></td>" + "<td id='cell24'></td>" + "<td id='cell25'></td>" + "<td id='cell26'></td>" + "<td id='cell27'></td>" +
               "</tr>" +
               "<tr id='row3'>" +
               "<td id='cell31'></td>" + "<td id='cell32'></td>" + "<td id='cell33'></td>" + "<td id='cell34'></td>" + "<td id='cell35'></td>" + "<td id='cell36'></td>" + "<td id='cell37'></td>" +
               "</tr>" +
               "<tr id='row4'>" +
               "<td id='cell41'></td>" + "<td id='cell42'></td>" + "<td id='cell43'></td>" + "<td id='cell44'></td>" + "<td id='cell45'></td>" + "<td id='cell46'></td>" + "<td id='cell47'></td>" +
               "</tr>" +
               "<tr id='row5'>" +
               "<td id='cell51'></td>" + "<td id='cell52'></td>" + "<td id='cell53'></td>" + "<td id='cell54'></td>" + "<td id='cell55'></td>" + "<td id='cell56'></td>" + "<td id='cell57'></td>" +
               "</tr>" +
               "<tr id='row6'>" +
               "<td id='cell61'></td>" + "<td id='cell62'></td>" + "<td id='cell63'></td>" + "<td id='cell64'></td>" + "<td id='cell65'></td>" + "<td id='cell66'></td>" + "<td id='cell67'></td>" +
               "</tr>" +
               "</table>"
           );

            var tableElement = month.find("#cellsTable" + month[0].id);
            cellsTable.find('table').css({ background: 'none', padding: 0, margin: 0, border: 0 });
            cellsTable.find('td').css({ background: 'none', padding: 1, margin: 0, border: 0 });
            cellsTable.find('tr').css({ background: 'none', padding: 0, margin: 0, border: 0 });

            var oldCellsTable = tableElement.find("#" + 'cellTable' + calendarID.toString());
            if (oldCellsTable != null) {
                oldCellsTable.remove();
            }

            tableElement.append(cellsTable);

            cellsTable.addClass(this.toThemeProperty("jqx-calendar-view"));
            var currentDate = firstDay;

            var startRow = this.showDayNames ? 1 : 0;
            var startColumn = this.showWeekNumbers ? 1 : 0;
            var cells = new Array();
            var k = 0;

            var cellWidth = (month.width() - this.rowHeaderWidth - 2) / 7;
            if (!this.showWeekNumbers) {
                cellWidth = (month.width() - 2) / 7;
            }
            cellWidth = parseInt(cellWidth);
            var today = new $.jqx._jqxDateTimeInput.getDateTime(new Date());

            for (i = 0; i < 6; i++) {
                for (j = 0; j < 7; j++) {
                    var cellRowID = i + 1;
                    var cellColumnID = j + 1;
                    var cellID = "#cell" + cellRowID + cellColumnID;
                    var cell = new $.jqx._jqxCalendar.cell(currentDate.dateTime);
                    var cellElement = cellsTable.find(cellID);

                    cell.isVisible = true;
                    if (currentDate.month != this.value.month) {
                        cell.isOtherMonth = true;
                        cell.isVisible = this.showOtherMonthDays;
                    }

                    if (currentDate.month == today.month && currentDate.day == today.day && currentDate.year == today.year) {
                        cell.isToday = true;
                    }

                    if (currentDate.isWeekend()) {
                        cell.isWeekend = true;
                    }

                    cell.element = cellElement;
                    cell.row = startRow;
                    cell.column = startColumn;

                    if (cell.isVisible) {
                        var cellContent = $("<div id='cellContent" + cellID.substring(1) + "'>" + currentDate.day + "</div>");
                        cellElement.append(cellContent);
                        cellElement.width(cellWidth);
                   //     cellContent.css('padding', '3px');
                    }
                    else {
                        var cellContent = $("<div id='cellContent" + cellID.substring(1) + "'>" + currentDate.day + "</div>");
                        cellElement.append(cellContent);
                        cellElement.width(cellWidth);
                    //    cellContent.css('padding', '3px');
                    }

                    currentDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(currentDate._addDays(1)));

                    $.data(cellElement, cellID, this);
                    $.data(this.element, "cellContent" + cellID.substring(1), cell);
                    var me = this;
                    this.addHandler(cellElement, 'mousedown',
                   function (event) {
                       var element = $.data(cellElement, cellID);
                       if (!element.readOnly && !me.disabled) {
                           var content = $(event.target);
                           var cell = $.data(me.element, content[0].id);

                           var result = element._raiseEvent(3, event);
                           if (cell != null && cell != undefined) {
                               if (!cell.isDisabled) {
                                   if (cell.isOtherMonth && element.enableAutoNavigation) {
                                       if (cell.row < 2)
                                           element.navigateBackward();
                                       else
                                           element.navigateForward();
                                       element._selectDate(cell.dateTime.dateTime, 'mouse');
                                   }
                                   else element._selectDate(cell.dateTime.dateTime, 'mouse');
                               }
                           }

                           return result;
                       }
                   });

                    if (!me.disabled) {
                        this.addHandler(cellElement, 'mouseup',
                       function (event) {
                           var element = $.data(cellElement, cellID);
                           if (!element.readOnly) {
                               return element._raiseEvent(4, event)
                           }
                       });

                        this.addHandler(cellElement, 'mouseover',
                              function (event) {
                                  var element = $.data(cellElement, cellID)
                                  if (!element.readOnly) {
                                      var content = $(event.target);
                                      var cell = $.data(me.element, content[0].id);

                                      if (cell != null && cell != undefined) {
                                          cell.isHighlighted = true;
                                          element._applyCellStyle(cell, cell.element, content);
                                      }
                                  }
                              });

                        this.addHandler(cellElement, 'mouseout',
                              function (event) {
                                  var element = $.data(cellElement, cellID)
                                  if (!element.readOnly) {
                                      var content = $(event.target);
                                      var cell = $.data(me.element, content[0].id);

                                      if (cell != null && cell != undefined) {
                                          cell.isHighlighted = false;
                                          element._applyCellStyle(cell, cell.element, content);
                                      }
                                  }
                              });
                    }

                    startColumn++;
                    cells[k] = cell;
                    k++;
                }
                startColumn = 0;
                startRow++;
            }

            var monthInstance = $.data(this.element, month[0].id);
            if (monthInstance != undefined && monthInstance != null) {
                monthInstance.cells = cells;
            }

            this._applyCellStyles();
        },

        // sets the maximum navigation date. 
        // @param - Date
        setMaxDate: function (date) {
            this.maxDate = $.jqx._jqxDateTimeInput.getDateTime(date);
        },

        // gets the maximum navigation date.
        getMaxDate: function () {
            if (this.maxDate != null && this.maxDate != undefined) {
                return this.maxDate.dateTime;
            }

            return null;
        },

        // sets the minimum date. 
        // @param - Date
        setMinDate: function (date) {
            this.minDate = $.jqx._jqxDateTimeInput.getDateTime(date);
        },

        // gets the minimum date.
        getMinDate: function () {
            if (this.minDate != null && this.minDate != undefined) {
                return this.minDate.dateTime;
            }

            return null;
        },

        // sets the calendar's date. 
        // @param - Date
        navigateTo: function (date) {
            if (date < this.getMinDate() || date > this.getMaxDate()) {
                return false;
            }

            if (date == null) {
                return false;
            }

            this.value._setYear(date.getFullYear());
            this.value._setDay(date.getDate());
            this.value._setMonth(date.getMonth() + 1);
            this.refreshControl();
            this._raiseEvent('2');
            return true;
        },

        // sets the calendar's date. 
        // @param - Date
        setDate: function (date) {
            this.navigateTo(date);
            this._selectDate(date);
            if (this.selectionMode == 'range') {
                this._selectDate(date, 'mouse');
            }

            return true;
        },

        // gets the calendar's date.
        getDate: function () {
            if (this.selectedDate == undefined)
                return new Date();

            return this.selectedDate;
        },

        getValue: function()
        {
            if (this.value == undefined)
                return new Date();

            return this.value.dateTime;;
        },

        setRange: function (from, to) {
            this.navigateTo(from);
            this._selectDate(from, 'mouse');
            this._selectDate(to, 'mouse');
        },

        getRange: function () {
            return this.selection;
        },

        // selects a date.
        // @param - Date
        _selectDate: function (date, type) {
            if (this.selectionMode == 'none')
                return;

            if (type == null || type == undefined) type = 'none';
            var monthInstance = $.data(this.element, "View1" + this.element.id);
            if (monthInstance == undefined || monthInstance == null)
                return;

            var self = this;
            if (this.input) {
                if (date != null) {
                    this.input.val(date.toString());
                }
                else this.input.val("");
            }
            this.selectedDate = date;

            $.each(monthInstance.cells, function (index) {
                var cell = this;
                var cellDate = cell.dateTime;
                var cellElement = $(cell.element);
                var cellContent = cellElement.find("#cellContent" + cellElement[0].id);

                if (date == null) {
                    cell.isSelected = false;
                    cell.isDisabled = false;
                    if (index == 0) {
                        self.selection = { from: null, to: null };                              
                        self._raiseEvent('2');
                        self._raiseEvent('5', { selectionType: type });
                    }
                }
                else {
                    if (self.selectionMode != 'range' || type == 'key') {
                        if (cellDate.day == date.getDate() && cellDate.month == (1 + date.getMonth()) && cellDate.year == date.getFullYear() && cell.isSelected) {
                            self._applyCellStyle(cell, cellElement, cellContent);
                            return;
                        }

                        if (cell.isSelected) {
                            self._raiseEvent('6', { selectionType: type });
                        }

                        cell.isSelected = false;
                        if (cellDate.day == date.getDate() && cellDate.month == (1 + date.getMonth()) && cellDate.year == date.getFullYear()) {
                            cell.isSelected = true;
                            if (index == 0) {
                                self.selection = { date: date };
                            }
                            cell.element.focus();
                            if (!cell.isOtherMonth) {
                                self.value._setMonth(date.getMonth() + 1);
                                self.value._setDay(date.getDate());
                                self.value._setYear(date.getFullYear());
                                self._raiseEvent('2');
                                self._raiseEvent('5', { selectionType: type });
                            }
                        }
                    }
                    else if (self.selectionMode == 'range') {
                        if (index == 0) {
                            if (type != 'none') {
                                if (self._clicks == undefined) self._clicks = 0;
                                self._clicks++;

                                if (self._clicks == 1) {
                                    self.selection = { from: date, to: date };
                                }
                                else if (self._clicks == 2) {
                                    var from = self.selection.from;
                                    var min = from <= date ? from : date;
                                    var max = from <= date ? date : from;
                                    self.selection = { from: min, to: max };
                                    self._clicks = 0;
                                }
                            }
                            else {
                                if (self.selection == null || self.selection.from == null) {
                                    self.selection = { from: date, to: date };
                                    if (self._clicks == undefined) self._clicks = 0;
                                    self._clicks++;
                                    if (self._clicks == 2) self._clicks = 0;
                                }
                            }
                        }

                        var getDatePart = function (date) {
                            var newDate = new Date();
                            newDate.setHours(0, 0, 0, 0);
                            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                            return newDate;
                        }

                        if (!cell.isOtherMonth && getDatePart(cellDate.dateTime).toString() == getDatePart(date).toString()) {
                            self.value._setMonth(date.getMonth() + 1);
                            self.value._setDay(date.getDate());
                            self.value._setYear(date.getFullYear());
                            self._raiseEvent('2');
                            self._raiseEvent('5', { selectionType: type });
                        }
                        cell.isSelected = false;
                        cell.isDisabled = false;

                        if (getDatePart(cellDate.dateTime) < getDatePart(self.selection.from) && self._clicks == 1) {
                            cell.isDisabled = true;
                        }

                        if (getDatePart(cellDate.dateTime) >= getDatePart(self.selection.from) && getDatePart(cellDate.dateTime) <= getDatePart(self.selection.to)) {
                            cell.isSelected = true;
                        }
                    }
                }

                self._applyCellStyle(cell, cellElement, cellContent);
            });
        },

        // gets the selected date.
        _getSelectedDate: function () {
            var monthInstance = $.data(this.element, "View1" + this.element.id);
            if (monthInstance == undefined || monthInstance == null)
                return;

            for (var i = 0; i < monthInstance.cells.length; i++) {
                var cell = monthInstance.cells[i];
                var cellDate = cell.dateTime.dateTime;
                if (cell.isSelected) {
                    return cellDate;
                }
            }
            if (this.selectedDate) {
                return this.selectedDate;
            }
        },

        // gets the selected cell.
        _getSelectedCell: function () {
            var monthInstance = $.data(this.element, "View1" + this.element.id);
            if (monthInstance == undefined || monthInstance == null)
                return;

            for (var i = 0; i < monthInstance.cells.length; i++) {
                var cell = monthInstance.cells[i];
                var cellDate = cell.dateTime.dateTime;
                if (cell.isSelected) {
                    return cell;
                }
            }
        },

        _applyCellStyle: function (cell, cellElement, cellContent) {
            var self = this;
            cellContent.removeClass();
            cellContent.addClass(this.toThemeProperty("jqx-rc-all"));

            if (this.disabled || cell.isDisabled) {
                cellContent.addClass(this.toThemeProperty("jqx-calendar-cell-disabled"));
                cellContent.addClass(this.toThemeProperty("jqx-fill-state-disabled"));
            }

            if (cell.isOtherMonth && this.enableOtherMonthDays && cell.isVisible) {
                cellContent.addClass(this.toThemeProperty("jqx-calendar-cell-othermonth"));
            }

            if (cell.isWeekend && this.enableWeekend && cell.isVisible && cell.isVisible) {
                cellContent.addClass(this.toThemeProperty("jqx-calendar-cell-weekend"));
            }

            if (!cell.isVisible) {
                cellContent.addClass(this.toThemeProperty("jqx-calendar-cell-hidden"));
            }
            else {
                cellContent.addClass(this.toThemeProperty("jqx-calendar-cell"));
            }

            if (cell.isSelected && cell.isVisible) {
                cellContent.addClass(this.toThemeProperty("jqx-calendar-cell-selected"));
                cellContent.addClass(this.toThemeProperty("jqx-fill-state-pressed"));
            }

            if (cell.isHighlighted && cell.isVisible && this.enableHover) {
                if (!cell.isDisabled) {
                    cellContent.addClass(this.toThemeProperty("jqx-calendar-cell-hover"));
                    cellContent.addClass(this.toThemeProperty("jqx-fill-state-hover"));
                }
            }

            if (cell.isToday && cell.isVisible) {
                cellContent.addClass(this.toThemeProperty("jqx-calendar-cell-today"));
            }

            if (this.specialDates.length > 0) {
                var me = this;
                $.each(this.specialDates, function () {
                    if (this.Class != undefined && this.Class != null && this.Class != '') {
                        cellContent.removeClass(this.Class);
                    }
                    else {
                        cellContent.removeClass(self.toThemeProperty("jqx-calendar-cell-specialDate"));
                    }

                    if (cell.dateTime._equalDate(this.Date)) {
                        if (cell.tooltip == null && this.Tooltip != null) {
                            cell.tooltip = this.Tooltip;
                            if ($(cellContent).jqxTooltip) {
                                $(cellContent).jqxTooltip({ name: me.element.id, content: this.Tooltip, position: 'mouse', theme: me.theme });
                            }
                        }

                        cellContent.removeClass(self.toThemeProperty("jqx-calendar-cell-othermonth"));
                        cellContent.removeClass(self.toThemeProperty("jqx-calendar-cell-weekend"));

                        if (this.Class == undefined || this.Class == '') {
                            cellContent.addClass(self.toThemeProperty("jqx-calendar-cell-specialDate"));
                            return false;
                        }
                        else {
                            cellContent.addClass(this.Class);
                            return false;
                        }
                    }
                }
                );
            }
        },

        _applyCellStyles: function () {
            var monthInstance = $.data(this.element, "View1" + this.element.id);
            if (monthInstance == undefined || monthInstance == null)
                return;

            for (i = 0; i < monthInstance.cells.length; i++) {
                var cell = monthInstance.cells[i];
                var cellElement = $(cell.element);
                var cellContent = cellElement.find("#cellContent" + cellElement[0].id);
                this._applyCellStyle(cell, cellElement, cellContent);
            }
        },

        // gets the week of year by Date.
        getWeekOfYear: function (date) {
            var dayOfYear = date.dayOfYear(date.dateTime) - 1;
            var week = date.dayOfWeek - (dayOfYear % 7);
            var offset = ((week - this.firstDayOfWeek) + 14) % 7;
            return Math.ceil((((dayOfYear + offset) / 7) + 1));
        },

        renderColumnHeader: function (month) {
            if (!this.showDayNames)
                return;

            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);
            var dayOfWeek = firstDay.dayOfWeek;
            var weekOfYear = this.getWeekOfYear(firstDay);

            if ($.global == null || $.global == undefined) {
                throw "jquery.global.js is not loaded.";
            }

            $.global.preferCulture(this.culture);
            var day = this.firstDayOfWeek;
            var dayNames = $.global.culture.calendar.days.names;

            var columnHeader = $("<table style='border-spacing: 0px; border-collapse: collapse; width: 100%; height: 100%;' cellspacing='0' cellpadding='1' id='columnHeader'>" +
               "<tr id='columnHeader'>" +
               "<td id='columnCell1'></td>" + "<td id='columnCell2'></td>" + "<td id='columnCell3'></td>" + "<td id='columnCell4'></td>" + "<td id='columnCell5'></td>" + "<td id='columnCell6'></td>" + "<td id='columnCell7'></td>" +
               "</tr>" +
               "</table>"
            );

            columnHeader.find('table').addClass(this.toThemeProperty('jqx-reset'));
            columnHeader.find('tr').addClass(this.toThemeProperty('jqx-reset'));
            columnHeader.find('td').css({ background: 'transparent', padding: 1, margin: 0, border: 'none' });

            columnHeader.addClass(this.toThemeProperty("jqx-reset"));
            columnHeader.addClass(this.toThemeProperty("jqx-calendar-column-header"));
            var calendarColumnHeader = month.find("#calendarColumnHeader" + month[0].id);
            var oldHeader = calendarColumnHeader.find("#columnHeader");
            if (oldHeader != null) oldHeader.remove();
            calendarColumnHeader.append(columnHeader);
            var columnHeaderCells = new Array();
            var currentDate = firstDay;
            var cellWidth = (month.width() - this.rowHeaderWidth - 2) / 7;
            if (!this.showWeekNumbers) {
                cellWidth = (month.width() - 2) / 7;
            }

            for (var i = 0; i < 7; i++) {
                var dayString = dayNames[day];

                // Possible values: default, shortest, firstTwoLetters, firstLetter, full
                switch (this.dayNameFormat) {
                    case 'default':
                        dayString = $.global.culture.calendar.days.namesAbbr[day];
                        break;
                    case 'shortest':
                        dayString = $.global.culture.calendar.days.namesShort[day];
                        break;
                    case 'firstTwoLetters':
                        dayString = dayString.substring(0, 2);
                        break;
                    case 'firstLetter':
                        dayString = dayString.substring(0, 1);
                        break;
                }

                var cell = new $.jqx._jqxCalendar.cell(currentDate.dateTime);
                var cellID = i + 1;
                var cellElement = columnHeader.find("#columnCell" + cellID);

                var oldI = i;

                if (this.enableTooltips) {
                    if ($(cellElement).jqxTooltip) {
                        $(cellElement).jqxTooltip({
                            name: this.element.id, content: dayNames[day], theme: this.theme, position: 'mouse'
                        });
                    }
                }

                if (day >= 6) {
                    day = 0;
                }
                else {
                    day++;
                }

                i = oldI;
                cell.element = cellElement;
                cell.row = 0;
                cell.column = i + 1;
                var textWidth = this._textwidth(dayString);
                var cellContent = "<div style='padding: 0; margin: 0; border: none; background: transparent;' id='columnCell" + cellID + "'>" + dayString + "</div>";
                cellElement.append(cellContent);
                cellElement.find("#columnCell" + cellID).addClass(this.toThemeProperty('jqx-calendar-column-cell'));
                cellElement.width(cellWidth);
                if (this.disabled) {
                    cellElement.find("#columnCell" + cellID).addClass(this.toThemeProperty('jqx-calendar-column-cell-disabled'));
                }

                if (textWidth > 0 && cellWidth > 0) {
                    while (textWidth > cellElement.width()) {
                        if (dayString.length == 0)
                            break;

                        dayString = dayString.substring(0, dayString.length - 1);
                        cellElement.find("#columnCell" + cellID).html(dayString);
                        textWidth = this._textwidth(dayString);
                    }
                }

                columnHeaderCells[i] = cell;
                currentDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(currentDate._addDays(1)));
            }

            if (parseInt(calendarColumnHeader.width()) > parseInt(this.host.width())) {
                calendarColumnHeader.width(this.host.width())
            }

            var monthInstance = $.data(this.element, month[0].id);
            monthInstance.columnCells = columnHeaderCells;
        },

        _textwidth: function (text) {
            var measureElement = $('<span>' + text + '</span>');
            measureElement.addClass(this.toThemeProperty('jqx-calendar-column-cell'));
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

        _renderRowHeader: function (month) {
            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);
            var dayOfWeek = firstDay.dayOfWeek;
            var weekOfYear = this.getWeekOfYear(firstDay);

            var rowHeader = $("<table style='overflow: hidden; width: 100%; height: 100%;' cellspacing='0' cellpadding='1' id='rowHeader'>" +
               "<tr id='rowHeader1'>" +
               "<td id='headerCell1'></td>" +
               "</tr>" +
               "<tr id='rowHeader2'>" +
               "<td id='headerCell2'/>" +
               "</tr>" +
               "<tr id='rowHeader3'>" +
               "<td id='headerCell3'/>" +
               "</tr>" +
               "<tr id='rowHeader4'>" +
               "<td id='headerCell4'/>" +
               "</tr>" +
               "<tr id='rowHeader5'>" +
               "<td id='headerCell5'/>" +
               "</tr>" +
               "<tr id='rowHeader6'>" +
               "<td id='headerCell6'/>" +
               "</tr>" +
               "</table>"
           );

            rowHeader.find('table').addClass(this.toThemeProperty('jqx-reset'));
            rowHeader.find('td').addClass(this.toThemeProperty('jqx-reset'));
            rowHeader.find('tr').addClass(this.toThemeProperty('jqx-reset'));

            rowHeader.addClass(this.toThemeProperty("jqx-calendar-row-header"));

            rowHeader.width(this.rowHeaderWidth);
            var rowHeaderElement = month.find("#rowHeader");

            if (rowHeaderElement != null) {
                rowHeaderElement.remove();
            }

            month.find("#calendarRowHeader" + month[0].id).append(rowHeader);

            var currentDate = firstDay;
            var rowHeaderCells = new Array();

            for (i = 0; i < 6; i++) {
                var weekString = weekOfYear.toString();
                var cell = new $.jqx._jqxCalendar.cell(currentDate.dateTime);
                var cellID = i + 1;
                var cellElement = rowHeader.find("#headerCell" + cellID);
                cell.element = cellElement;
                cell.row = i;
                cell.column = 0;
                var cellContent = "<div style='background: transparent; border: none; padding: 0; margin: 0;' id ='headerCellContent" + cellID + "'>" + weekString + "</div>";
                cellElement.append(cellContent);
                cellElement.find("#headerCellContent" + cellID).addClass(this.toThemeProperty('jqx-calendar-row-cell'));
                rowHeaderCells[i] = cell;
                currentDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(currentDate._addWeeks(1)));
                weekOfYear = this.getWeekOfYear(currentDate);
            }

            var monthInstance = $.data(this.element, month[0].id);
            monthInstance.rowCells = rowHeaderCells;
        },

        // gets the first week day.
        // @param - Date
        getFirstDayOfWeek: function (visibleDate) {
            var date = visibleDate;

            if (this.firstDayOfWeek < 0 || this.firstDayOfWeek > 6)
                this.firstDayOfWeek = 6;

            var num = date.dayOfWeek - this.firstDayOfWeek;
            if (num <= 0) {
                num += 7;
            }

            var newDate = $.jqx._jqxDateTimeInput.getDateTime(date._addDays(-num));
            return newDate;
        },

        // gets the visible date in the current month.
        getVisibleDate: function () {
            var visibleDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(this.value.dateTime));
            if (visibleDate < this.minDate) {
                visibleDate = this.minDate;
            }

            if (visibleDate > this.maxDate) {
                this.visibleDate = this.maxDate;
            }

            var dayInMonth = visibleDate.day;
            var newVisibleDate = $.jqx._jqxDateTimeInput.getDateTime(visibleDate._addDays(-dayInMonth + 1));
            visibleDate = newVisibleDate;
            return visibleDate;
        },

        destroy: function () {
            this.host
			.removeClass();
            this.host.remove();
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            var args = arg ? arg : {};

            args.owner = this;
            var event = new jQuery.Event(evt);
            event.owner = this;
            event.args = args;
            if (id == 0 || id == 1 || id == 2 || id == 3 || id == 4 || id == 5 || id == 6) {
                event.args.date = this.getValue();
                event.args.selectedDate = this._getSelectedDate();
            }

            var result = this.host.trigger(event);
            if (id == 0 || id == 1) {
                result = false;
            }

            return result;
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (key == 'width' || key == 'height') {
                var month = this.host.find("#View1" + this.element.id);
                if (month.length > 0) {
                    this.setCalendarSize();
                    if (this.height != undefined && !isNaN(this.height)) {
                        month.height(this.height);
                    }
                    else if (this.height != null && this.height.toString().indexOf("px") != -1) {
                        month.height(this.height);
                    }

                    if (this.width != undefined && !isNaN(this.width)) {
                        month.width(this.width);
                    }
                    else if (this.width != null && this.width.toString().indexOf("px") != -1) {
                        month.width(this.width);
                    }

                    var contentHeight = this.host.height() - this.titleHeight - this.columnHeaderHeight;
                    var calendarID = "View1" + this.element.id;
                    month.find('#cellsTable' + calendarID).height(contentHeight);
                    month.find('#calendarRowHeader' + calendarID).height(contentHeight);

                    this.refreshControl();
                }
                return;
            }
            else if (key == 'theme') {
                $.jqx.utilities.setTheme(oldvalue, value, this.host);
            }
            else {
                this.render();
            }
        }
    });
})(jQuery);

(function ($) {
    $.jqx._jqxCalendar.cell = function (date) {
        var cell =
        {
            dateTime: new $.jqx._jqxDateTimeInput.getDateTime(date),

            isToday: false,
            isWeekend: false,
            isOtherMonth: false,
            isVisible: true,
            isSelected: false,
            isHighlighted: false,
            element: null,
            row: -1,
            column: -1,
            tooltip: null
        };

        return cell;
    } // calendar cell

    $.jqx._jqxCalendar.monthView = function (startDate, endDate, cells, rowHeaderCells, columnHeaderCells, element) {
        var month =
        {
            start: startDate,
            end: endDate,
            cells: cells,
            rowCells: rowHeaderCells,
            columnCells: columnHeaderCells,
            element: element
        };

        return month;
    } // calendar month

})(jQuery);