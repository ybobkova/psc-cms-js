/*
jQWidgets v2.4.2 (2012-Sep-12)
Copyright (c) 2011-2012 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {
    $.extend($.jqx._jqxGrid.prototype, {
        _calculateaggregate: function (column, aggregates, formatData) {
            var aggregate = column.aggregates;
            if (!aggregate) aggregate = aggregates;

            if (aggregate) {
                var formatstrings = new Array();
                for (var i = 0; i < aggregate.length; i++) {
                    if (aggregate[i] == 'count') {
                        continue;
                    }
                    formatstrings[formatstrings.length] = column.cellsformat;
                }

                if (this.source && this.source.getAggregatedData) {
                    if (formatData == undefined || formatData == true) {
                        var summaryData = this.source.getAggregatedData
                ([{ name: column.datafield, aggregates: aggregate, formatStrings: formatstrings}], this.gridlocalization);
                        return summaryData;
                    }
                    else {
                        var summaryData = this.source.getAggregatedData
                ([{ name: column.datafield, aggregates: aggregate}], this.gridlocalization);
                        return summaryData;
                    }
                }
            }
            return null;
        },

        getcolumnaggregateddata: function (datafield, aggregates, formatdata) {
            var column = this.getcolumn(datafield);
            var format = (formatdata == undefined || formatdata == false) ? false : formatdata;
            if (aggregates == null) return "";

            var summaryData = this._calculateaggregate(column, aggregates, format)[datafield];
            return summaryData;
        },

        refresheaggregates: function () {
            this._updatecolumnsaggregates();
        },

        renderaggregates: function () {
            this._updateaggregates();
        },

        _updatecolumnaggregates: function (column, aggregates, columnelement) {
            var me = this;
            if (!aggregates) {
                columnelement.children().remove();
                columnelement.html('');
                if (column.aggregatesrenderer) {
                    var renderstring = column.aggregatesrenderer(column);
                    columnelement.html(renderstring);
                }
                return;
            }

            columnelement.children().remove();
            columnelement.html('');
            if (column.aggregatesrenderer) {
                if (aggregates) {
                    var renderstring = column.aggregatesrenderer(aggregates[column.datafield], column);
                    columnelement.html(renderstring);
                }
            }
            else {
                $.each(aggregates, function () {
                    var aggregate = this;
                    for (obj in aggregate) {
                        var field = $('<div style="position: relative; margin: 4px; overflow: hidden;"></div>');
                        var name = obj;
                        name = me._getaggregatename(name);
                        field.html(name + ':' + aggregate[obj]);
                        columnelement.append(field);
                    }
                });
            }
        },

        _getaggregatename: function (obj) {
            var name = obj;
            switch (obj) {
                case 'min':
                    name = 'Min';
                    break;
                case 'max':
                    name = 'Max';
                    break;
                case 'count':
                    name = 'Count';
                    break;
                case 'avg':
                    name = 'Avg';
                    break;
                case 'product':
                    name = 'Product';
                    break;
                case 'var':
                    name = 'Var';
                    break;
                case 'stdevp':
                    name = 'StDevP';
                    break;
                case 'stdev':
                    name = 'StDev';
                    break;
                case 'varp':
                    name = 'VarP';
                case 'sum':
                    name = 'Sum';
                    break;
            }
            return name;
        },

        _updatecolumnsaggregates: function () {
            var columnslength = this.columns.records.length;
            for (j = 0; j < columnslength; j++) {
                var tablecolumn = $(this.statusbar[0].cells[j]);
                var columnrecord = this.columns.records[j];
                var summaryData = this._calculateaggregate(columnrecord);
                this._updatecolumnaggregates(columnrecord, summaryData, tablecolumn);
            }
        },

        _updateaggregates: function () {
            var tablerow = $('<div style="position: relative;" id="row' + i + this.element.id + '"></div>');
            var left = 0;
            var columnslength = this.columns.records.length;
            var cellclass = this.toThemeProperty('jqx-grid-cell');
            cellclass += ' ' + this.toThemeProperty('jqx-grid-cell-pinned');
            //var cellclass = this.toThemeProperty('jqx-widget-header');
            var zindex = columnslength + 10;
            var cells = new Array();
            this.statusbar[0].cells = cells;
            for (j = 0; j < columnslength; j++) {
                var columnrecord = this.columns.records[j];
                var summaryData = this._calculateaggregate(columnrecord);
                var width = columnrecord.width;
                if (width < columnrecord.minwidth) width = columnrecord.minwidth;
                if (width > columnrecord.maxwidth) width = columnrecord.maxwidth;

                var tablecolumn = $('<div style="overflow: hidden; position: absolute; height: 100%;" class="' + cellclass + '"></div>');
                tablerow.append(tablecolumn);
                tablecolumn.css('left', left);
                tablecolumn.css('z-index', zindex--);
                tablecolumn.width(width);
                tablecolumn[0].left = left;
                if (!(columnrecord.hidden && columnrecord.hideable)) {
                    left += width;
                }
                else {
                    tablecolumn.css('display', 'none');
                }
                cells[cells.length] = tablecolumn[0];
                this._updatecolumnaggregates(columnrecord, summaryData, tablecolumn);
            }

            if ($.browser.msie && $.browser.version < 8) {
                tablerow.css('z-index', zindex--);
            }

            tablerow.width(parseInt(left) + 2);
            tablerow.height(this.statusbarheight);
            this.statusbar.children().remove();
            this.statusbar.append(tablerow);
            this.statusbar.removeClass(this.toThemeProperty('jqx-widget-header'));
            this.statusbar.addClass(cellclass);
            this.statusbar.css('border-bottom-color', 'transparent');
            this.statusbar.css('border-top-width', '1px');
        }
    });
})(jQuery);


