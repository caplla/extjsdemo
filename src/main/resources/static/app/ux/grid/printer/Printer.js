/**
 *打印grid所见区域内容
 */
/**
 *
 * Usage:
 *
 * 1 - Add Ext.Require Before the Grid code
 * Ext.require([
 *   'Ext.ux.grid.GridPrinter',
 * ]);
 *
 * 2 - Declare the Grid
 * var grid = Ext.create('Ext.grid.Panel', {
 *   columns: //some column model,
 *   store   : //some store
 * });
 *
 * 3 - Print!
 * Ext.ux.grid.Printer.mainTitle = 'Your Title here'; //optional
 * Ext.ux.grid.Printer.print(grid);
 *
 * Added param for page title.
 */
Ext.define("luter.ux.grid.printer.Printer", {
    requires: 'Ext.XTemplate',
    statics: {
        /**
         * Prints the passed grid. Reflects on the grid's column model to build a table, and fills it using the store
         * @param {Ext.grid.Panel} grid The grid to print
         */
        print: function (grid, featureId) {//featureId用来标识是否打印插件产生的内容.true，则连summary和expander信息全部打印，false则只打印表格
            var isGrouped = grid.store.isGrouped ? grid.store.isGrouped() : false;
            var groupField;
            if (isGrouped) {
                var feature = this.getFeature(grid, 'grouping');
                if (feature)
                    groupField = feature.getGroupField();
                else
                    isGrouped = false;
            }
            if (grid.columnManager) {
                var columns = grid.view.headerCt.getVisibleGridColumns();

            }
            else {
                var columns = [];
                Ext.each(grid.columns, function (c) {
                    if (c.items && c.items.length > 0) {
                        columns = columns.concat(c.items.items);
                    } else {
                        columns.push(c);
                    }
                });
            }

            console.log(groupField)
            var clearColumns = [];
            Ext.each(
                columns,
                function (column) {
                    if (column) {
                        if (!Ext.isEmpty(column.dataIndex) &&
                            !column.hidden &&
                            !isGrouped) {
                            clearColumns.push(column);
                        } else if (column.xtype === 'rownumberer') {
                            if (!column.text) column.text = 'Row';
                            clearColumns.push(column);
                        } else if (column.xtype === 'templatecolumn') {
                            clearColumns.push(column);
                        } else if (isGrouped &&
                            column.dataIndex !== groupField &&
                            column.xtype !== 'actioncolumn') {
                            clearColumns.push(column);
                        }
                    }
                }
            );
            columns = clearColumns;

            if (this.stylesheetPath === null) {
                var scriptPath = Ext.Loader.getPath('Ext.ux.grid.Printer');
                this.stylesheetPath = scriptPath.substring(0, scriptPath.indexOf('Printer.js')) + 'gridPrinterCss/print.css';
            }

            var headings = Ext.create('Ext.XTemplate', this.headerTpl).apply(columns);
            var body = this.generateBody(grid, columns, feature);
            var expanderTemplate,
                pluginsBodyMarkup = [];
            //获取表格插件
            Ext.each(grid.plugins, function (p) {
                if (p.ptype == 'rowexpander' && featureId) {//列展开内容一并打印
                    expanderTemplate = p.rowBodyTpl;
                }
            });

            if (expanderTemplate) {
                pluginsBodyMarkup = [
                    '<tr class="{[xindex % 2 === 0 ? "even" : "odd"]}"><td colspan="' + columns.length + '">',
                    '{[ this.applyTpl(values) ]}',
                    '</td></tr>'
                ];
            }

            //标题，没配置就显示grid的
            var title = (this.pageTitle) ? this.pageTitle : grid.title;
            var summaryFeature = this.getFeature(grid, 'summary');

            //Here because inline styles using CSS, the browser did not show the correct formatting of the data the first time that loaded
            var htmlMarkup = [
                '<!DOCTYPE html>',
                '<html class="' + Ext.baseCSSPrefix + 'ux-grid-printer">',
                '<head>',
                '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />',
                '<link href="' + this.stylesheetPath + '" rel="stylesheet" type="text/css" />',
                '<title>' + title + '</title>',
                '<script type="text/javascript">',
                'function printOnload() {["{"]}',
                'if (' + this.printAutomatically + ') {["{"]}',
                'window.print();',
                'if (' + this.closeAutomaticallyAfterPrint + ') {["{"]}',
                'window.close();',
                '{["}"]}',
                '{["}"]}',
                '{["}"]}',
                '</script>',
                '</head>',
                '<body class="' + Ext.baseCSSPrefix + 'ux-grid-printer-body" onload="printOnload();">',
                '<div class="' + Ext.baseCSSPrefix + 'ux-grid-printer-noprint ' + Ext.baseCSSPrefix + 'ux-grid-printer-links">',
                '<a class="' + Ext.baseCSSPrefix + 'ux-grid-printer-linkprint" href="javascript:void(0);" onclick="window.print();">' + this.printLinkText + '</a>',
                '<a class="' + Ext.baseCSSPrefix + 'ux-grid-printer-linkclose" href="javascript:void(0);" onclick="window.close();">' + this.closeLinkText + '</a>',
                '</div>',
                '<h1 style="text-align: center;margin-bottom: 40px">' + this.mainTitle + '</h1>',
                '<p style="margin-bottom:10px;float: right;font-size: 12px;font-weight: 800">Powered By : ',
                sysconfig['vendorname'],
                '  ',
                sysconfig['productname'],
                '<table>',
                '<tr>',
                headings,
                '</tr>',
                '<tpl for=".">',
                '<tr class="{[xindex % 2 === 0 ? "even" : "odd"]}">',
                body,
                '</tr>',
                pluginsBodyMarkup.join(''),
                '{% if (this.isGrouped && xindex > 0) break; %}',
                '</tpl>',
                '<tpl if="this.hasSummary">',
                '<tr>',
                '<tpl for="this.columns">',
                '{[ this.renderSummary(values, xindex) ]}',
                '</tpl>',
                '</tr>',
                '</tpl>',
                '</table>',
                // '<p style="margin-top:20px;float: right;font-size: 12px;font-weight: 800">Powered By : ',
                // sysconfig['vendorname'],
                // '  ',
                // sysconfig['productname'],
                '</p>',
                '</body>',
                '</html>',
                {
                    isGrouped: isGrouped,
                    grid: grid,
                    columns: columns,
                    hasSummary: Ext.isObject(summaryFeature) && featureId,
                    summaryFeature: summaryFeature,
                    expanderTemplate: expanderTemplate,
                    renderColumn: function (column, value, rcd, col) {
                        var meta = {
                            'align': column.align,
                            'cellIndex': col,
                            'classes': [],
                            'column': column,
                            'css': '',
                            'innerCls': '',
                            'record': rcd,
                            'recordIndex': grid.store.indexOf ? grid.store.indexOf(rcd) : undefined,
                            'style': '',
                            'tdAttr': '',
                            'tdCls': '',
                            'unselectableAttr': 'unselectable="on"',
                            'value': value
                        };
                        if (column.xtype == 'templatecolumn') {
                            value = column.tpl ? column.tpl.apply(rcd.getData(true)) : value;
                        }
                        else if (column.renderer) {
                            if (column instanceof Ext.tree.Column) {
                                value = column.renderer.call(column, value, meta, rcd, -1, col - 1, this.grid.store, this.grid.view);
                            } else {
                                value = column.renderer.call(this.grid, value, meta, rcd, -1, col - 1, this.grid.store, this.grid.view);
                            }
                        }

                        return this.getHtml(value, meta);
                    },
                    applyTpl: function (rcd) {
                        var html = this.expanderTemplate.apply(rcd.getData(true));

                        return html;
                    },
                    renderSummary: function (column, colIndex) {
                        var value;
                        if (this.summaryFeature.remoteRoot) {
                            var summaryRecord = this.summaryFeature.summaryRecord || (new this.grid.view.store.model(null, this.grid.view.id + '-summary-record'));
                            if (this.grid.view.store.proxy.reader.rawData) {
                                if (Ext.isArray(this.grid.view.store.proxy.reader.rawData[this.summaryFeature.remoteRoot]))
                                    summaryRecord.set(this.grid.view.store.proxy.reader.rawData[this.summaryFeature.remoteRoot][0]);
                                else
                                    summaryRecord.set(this.grid.view.store.proxy.reader.rawData[this.summaryFeature.remoteRoot]);
                            }
                            value = summaryRecord.get(column.dataIndex);
                        }
                        else {
                            value = this.getSummary(this.grid.store, column.summaryType, column.dataIndex, false);
                        }

                        if (column.summaryRenderer) {
                            var summaryObject;
                            if (Ext.getVersion().isLessThan('4.2.0')) {
                                summaryObject = this.getSummaryObject(column.align);
                                value = column.summaryRenderer.call(column, value, summaryObject, column.dataIndex);
                                return this.getHtml(value, summaryObject);
                            }
                            else {
                                var summaryRcd = this.getSummaryRecord42();
                                var summaryObject = this.getSummaryObject42(value, column, colIndex, summaryRcd);
                                value = column.summaryRenderer.call(this.grid,
                                    value,
                                    summaryObject,
                                    summaryRcd,
                                    -1,
                                    colIndex,
                                    this.grid.store,
                                    this.grid.view);

                                return this.getHtml(value, summaryObject);
                            }
                        }
                        else {
                            var meta = this.getSummaryObject42(column, colIndex);
                            if (value === undefined || value == 0)
                                return this.getHtml("&nbsp;", meta);
                            else
                                return this.getHtml(value, meta);
                        }
                    },
                    getSummaryObject: function (align) {
                        var summaryValues = {};
                        for (var i = 0; i < columns.length; i++) {
                            var valueObject = this.getSummary(this.grid.store, this.columns[i].summaryType, this.columns[i].dataIndex, false);
                            if (valueObject === undefined)
                                continue; // Do nothing
                            else
                                summaryValues[columns[i].id] = valueObject;
                        }
                        summaryValues['style'] = "text-align:" + align + ';';
                        return summaryValues;
                    },
                    getSummaryRecord42: function () {
                        if (this.summaryFeature.remoteRoot) {
                            var summaryRecord = this.summaryFeature.summaryRecord || (new this.grid.view.store.model(null, this.grid.view.id + '-summary-record'));
                            if (this.grid.view.store.proxy.reader.rawData) {
                                if (Ext.isArray(this.grid.view.store.proxy.reader.rawData[this.summaryFeature.remoteRoot]))
                                    summaryRecord.set(this.grid.view.store.proxy.reader.rawData[this.summaryFeature.remoteRoot][0]);
                                else
                                    summaryRecord.set(this.grid.view.store.proxy.reader.rawData[this.summaryFeature.remoteRoot]);
                            }
                            return summaryRecord;
                        }

                        var rcd = Ext.create(this.grid.store.model);
                        for (var i = 0; i < this.columns.length; i++) {
                            var valueObject = this.getSummary(this.grid.store, this.columns[i].summaryType, this.columns[i].dataIndex, false);
                            if (valueObject === undefined)
                                continue; // Do nothing
                            else
                                rcd.set(this.columns[i].dataIndex, valueObject);
                        }
                        return rcd;
                    },
                    getSummaryObject42: function (value, column, colIndex, rcd) {
                        return {
                            align: column.align,
                            cellIndex: colIndex,
                            'column': column,
                            classes: [],
                            css: '',
                            innerCls: '',
                            record: rcd,
                            recordIndex: -1,
                            style: '',
                            tdAttr: '',
                            tdCls: '',
                            unselectableAttr: 'unselectable="on"',
                            'value': value
                        };
                    },
                    /**
                     * Get the summary data for a field.
                     * @private
                     * @param {Ext.data.Store} store The store to get the data from
                     * @param {String/Function} type The type of aggregation. If a function is specified it will
                     * be passed to the stores aggregate function.
                     * @param {String} field The field to aggregate on
                     * @param {Boolean} group True to aggregate in grouped mode
                     * @return {Number/String/Object} See the return type for the store functions.
                     */
                    getSummary: function (store, type, field, group) {
                        if (type) {
                            if (Ext.isFunction(type)) {
                                return store.aggregate(type, null, group, [field]);
                            }

                            switch (type) {
                                case 'count':
                                    return store.count(group);
                                case 'min':
                                    return store.min(field, group);
                                case 'max':
                                    return store.max(field, group);
                                case 'sum':
                                    return store.sum(field, group);
                                case 'average':
                                    return store.average(field, group);
                                default:
                                    return group ? {} : '';
                            }
                        }
                    },
                    getHtml: function (value, meta) {
                        if (value == undefined)
                            value = '&nbsp;';

                        var html = '<td ';
                        var tdClasses = '';
                        if (meta.tdCls)
                            tdClasses = meta.tdCls;
                        if (meta.css)
                            if (tdClasses.length > 0)
                                tdClasses += " " + meta.css;
                            else
                                tdClasses = meta.css;
                        if (tdClasses.length > 0)
                            html += 'class="' + tdClasses + '"';
                        if (meta.tdAttr)
                            html += ' ' + meta.tdAttr;
                        html += '><div ';
                        if (meta.innerCls)
                            html += 'class="' + meta.innerCls + '"';
                        html += ' style="text-align: ' + meta.align + ';';
                        if (meta.style)
                            html += meta.style;
                        html += '" ';
                        if (meta.unselectableAttr)
                            html += meta.unselectableAttr;
                        html += '>' + value + '</div></td>';

                        return html;
                    }
                }
            ];

            var records;
            if (grid.store instanceof Ext.data.TreeStore) {
                records = [];
                grid.store.getRootNode().cascadeBy(function (node) {
                    if (node.isRoot() && !grid.rootVisible) return;
                    if (!node.isVisible()) return;
                    records.push(node);
                }, this);
            } else {
                records = grid.store.getRange();
            }
            var html = Ext.create('Ext.XTemplate', htmlMarkup).apply(records);

            //open up a new printing window, write to it, print it and close
            var win = window.open('', 'printgrid');

            //document must be open and closed
            win.document.open();
            win.document.write(html);
            win.document.close();
        },

        getFeature: function (grid, featureFType) {
            var view = grid.getView();

            var features;
            if (view.features)
                features = view.features;
            else if (view.featuresMC)
                features = view.featuresMC.items;
            else if (view.normalView.featuresMC)
                features = view.normalView.featuresMC.items;

            if (features)
                for (var i = 0; i < features.length; i++) {
                    if (featureFType == 'grouping')
                        if (features[i].ftype == 'grouping' || features[i].ftype == 'groupingsummary')
                            return features[i];
                    if (featureFType == 'groupingsummary')
                        if (features[i].ftype == 'groupingsummary')
                            return features[i];
                    if (featureFType == 'summary')
                        if (features[i].ftype == 'summary')
                            return features[i];
                }
            return undefined;
        },

        generateBody: function (grid, columns, feature) {
            var groups = [];
            var fields = grid.store.getProxy().getModel().getFields();
            var hideGroupField = true;
            var groupField;
            var body;
            var groupingSummaryFeature = this.getFeature(grid, 'groupingsummary');

            if (grid instanceof Ext.grid.Panel) {
                groups = grid.store.getGroups();
            }


            //if (groups.length && grid.store.isGrouped() && feature )
            if (grid.store.isGrouped() && groups && groups.length && feature) {
                hideGroupField = feature.hideGroupedHeader;  // bool
                groupField = feature.getGroupField();

                var groupColumn=[];
                Ext.each(grid.columns, function (col) {
                    if (col.dataIndex == groupField)
                        groupColumn = col;
                });

                if (!feature || !fields || !groupField) {
                    return;
                }

                if (hideGroupField) {
                    var removeGroupField = function (item) {
                        return (item.name != groupField);
                    };
                    fields = fields.filter(removeGroupField);
                }

                // Use group header template for the header.
                var html = feature.groupHeaderTpl.html || '';
                if (Ext.getVersion().isGreaterThanOrEqual('5.0.0')) {
                    var newGroups = [];
                    for (var i = 0; i < groups.getCount(); i++) {
                        var groupObj = groups.getAt(i);
                        newGroups.push({
                            name: groupObj.getGroupKey(),
                            children: groupObj.getRange()
                        });
                    }
                    groups = newGroups;
                }

                var bodyTpl = [
                    '<tpl for=".">',
                    '<tr class="group-header">',
                    '<td colspan="{[this.colSpan]}">',
                    '{[ this.applyGroupTpl(values) ]}',
                    '</td>',
                    '</tr>',
                    '<tpl for="children">',
                    '<tr class="{[xindex % 2 === 0 ? "even" : "odd"]}">',
                    '<tpl for="this.columns">',
                    '{[ this.renderColumn(values, parent.get(values.dataIndex), parent, xindex) ]}',
                    '</tpl>',
                    '</tr>',
                    '</tpl>',
                    '<tpl if="this.hasSummary">',
                    '<tr>',
                    '<tpl for="this.columns">',
                    '{[ this.renderSummary(values, xindex) ]}',
                    '</tpl>',
                    '</tr>',
                    '</tpl>',
                    '</tpl>',
                    {
                        // XTemplate configuration:
                        columns: columns,
                        groupColumn: groupColumn,
                        colSpan: columns.length,
                        grid: grid,
                        groupName: "",
                        groupTpl: feature.groupHeaderTpl,
                        hasSummary: Ext.isObject(groupingSummaryFeature) && groupingSummaryFeature.showSummaryRow,
                        summaryFeature: groupingSummaryFeature,
                        // XTemplate member functions:
                        childCount: function (c) {
                            return c.length;
                        },
                        renderColumn: function (column, value, rcd, col) {
                            var meta = {
                                'align': column.align,
                                'cellIndex': col,
                                'classes': [],
                                'column': column,
                                'css': '',
                                'innerCls': '',
                                'record': rcd,
                                'recordIndex': grid.store.indexOf(rcd),
                                'style': '',
                                'tdAttr': '',
                                'tdCls': '',
                                'unselectableAttr': 'unselectable="on"',
                                'value': value
                            };
                            if (column.renderer && column.xtype != 'templatecolumn')
                                value = column.renderer.call(this.grid, value, meta, rcd, -1, col - 1, this.grid.store, this.grid.view);
                            else if (column.renderer && column.xtype == 'templatecolumn')
                                value = column.tpl.apply(rcd.getData(true));

                            return this.getHtml(value, meta);
                        },
                        getHtml: function (value, meta) {
                            if (value == undefined)
                                value = '&nbsp;';

                            var html = '<td ';
                            var tdClasses = '';
                            if (meta.tdCls)
                            //html += 'class="' + meta.tdCls + '"';
                                tdClasses = meta.tdCls;
                            if (meta.css)
                                if (tdClasses.length > 0)
                                    tdClasses += " " + meta.css;
                                else
                                    tdClasses = meta.css;
                            if (tdClasses.length > 0)
                                html += 'class="' + tdClasses + '"';
                            if (meta.tdAttr)
                                html += ' ' + meta.tdAttr;
                            html += '><div ';
                            if (meta.innerCls)
                                html += 'class="' + meta.innerCls + '"';
                            html += ' style="text-align: ' + meta.align + ';';
                            if (meta.style)
                                html += meta.style;
                            html += '" ';
                            if (meta.unselectableAttr)
                                html += meta.unselectableAttr;
                            html += '>' + value + '</div></td>';

                            return html;
                        },
                        renderSummary: function (column, colIndex) {
                            var value;
                            var summaryObject;
                            if (this.summaryFeature.remoteRoot) {
                                var summaryRecord = this.summaryFeature.summaryRecord || (new this.grid.view.store.model(null, this.grid.view.id + '-summary-record'));
                                if (this.grid.view.store.proxy.reader.rawData) {
                                    if (Ext.isArray(this.grid.view.store.proxy.reader.rawData[this.summaryFeature.remoteRoot]))
                                        summaryRecord.set(this.getSummaryRcd(this.grid.view.store.proxy.reader.rawData[this.summaryFeature.remoteRoot], this.grid.store.groupField, this.groupName));
                                    else
                                        summaryRecord.set(this.grid.view.store.proxy.reader.rawData[this.summaryFeature.remoteRoot]);
                                }
                                value = summaryRecord.get(column.dataIndex);
                            }
                            else {
                                value = this.getSummary(this.grid.store, column.summaryType, column.dataIndex, this.grid.store.isGrouped());
                            }

                            if (Ext.isObject(value))
                                value = value[this.groupName];

                            if (column.summaryRenderer)
                                if (Ext.getVersion().isLessThan('4.2.0')) {
                                    value = column.summaryRenderer.call(column, value, this.getSummaryObject(column.align), column.dataIndex);
                                }
                                else {
                                    summaryObject = this.getSummaryObject42(column, colIndex);
                                    value = column.summaryRenderer.call(this.grid,
                                        value,
                                        this.getSummaryObject42(column, colIndex),
                                        this.getSummaryRecord42(),
                                        -1,
                                        colIndex,
                                        this.grid.store,
                                        this.grid.view);

                                    return this.getHtml(value, summaryObject);
                                }
                            else if (value == undefined || value == 0)
                                value = '&nbsp;';

                            return '<td><div>' + value + '</div></td>';
                        },
                        applyGroupTpl: function (rcd) {
                            // The only members in rcd are name and children
                            this.groupName = rcd.name;
                            rcd.groupField = this.grid.store.groupField;

                            var meta = {
                                'align': '',
                                'cellIndex': -1,
                                'classes': [],
                                'column': this.groupColumn,
                                'css': '',
                                'innerCls': '',
                                'record': rcd.children[0],
                                'recordIndex': this.grid.store.indexOf(rcd.children[0]),
                                'style': '',
                                'tdAttr': '',
                                'tdCls': '',
                                'unselectableAttr': 'unselectable="on"',
                                'value': rcd.name
                            };

                            if (this.groupColumn)
                                rcd.columnName = this.groupColumn.text;
                            else
                                rcd.columnName = this.groupField;

                            rcd.groupValue = rcd.name;

                            if (this.groupColumn && this.groupColumn.renderer) {
                                rcd.renderedGroupValue = this.groupColumn.renderer.call(this.grid, rcd.name, meta, rcd.children[0], -1, -1, this.grid.store, this.grid.view);
                            }
                            else
                                rcd.renderedGroupValue = rcd.name;
                            //rcd.rows = null;  // We don't support rcd.rows yet
                            return this.groupTpl.apply(rcd);
                        },
                        getSummaryObject: function (align) {
                            var summaryValues = {};
                            for (var i = 0; i < this.columns.length; i++) {
                                var valueObject = this.getSummary(this.grid.store, this.columns[i].summaryType, this.columns[i].dataIndex, this.grid.store.isGrouped());
                                if (valueObject === undefined)
                                    continue; // Do nothing
                                else if (Ext.isObject(valueObject))
                                    summaryValues[columns[i].id] = valueObject[this.groupName];
                                else
                                    summaryValues[columns[i].id] = valueObject;
                            }
                            summaryValues['style'] = "text-align:" + align + ';';
                            return summaryValues;
                        },
                        getSummaryRecord42: function () {
                            var rcd = Ext.create(this.grid.store.model);
                            for (var i = 0; i < this.columns.length; i++) {
                                var valueObject = this.getSummary(this.grid.store, this.columns[i].summaryType, this.columns[i].dataIndex, this.grid.store.isGrouped());
                                if (valueObject === undefined)
                                    continue; // Do nothing
                                else if (Ext.isObject(valueObject))
                                    rcd.set(this.columns[i].dataIndex, valueObject[this.groupName]);
                                else
                                    rcd.set(this.columns[i].dataIndex, valueObject);
                            }
                            return rcd;
                        },
                        getSummaryObject42: function (column, colIndex) {
                            return {
                                align: column.align,
                                cellIndex: colIndex,
                                classes: [],
                                css: '',
                                innerCls: '',
                                record: this.getSummaryRecord42(),
                                recordIndex: -1,
                                style: '',
                                tdAttr: '',
                                tdCls: '',
                                unselectableAttr: 'unselectable="on"',
                                value: '&#160;'
                            };
                        },
                        // Use the getSummary from Ext 4.1.3.  This function for 4.2.1 has been changed without updating the documentation
                        // In 4.2.1, group is a group object from the store (specifically grid.store.groups[i].items).
                        /**
                         * Get the summary data for a field.
                         * @private
                         * @param {Ext.data.Store} store The store to get the data from
                         * @param {String/Function} type The type of aggregation. If a function is specified it will
                         * be passed to the stores aggregate function.
                         * @param {String} field The field to aggregate on
                         * @param {Boolean} group True to aggregate in grouped mode
                         * @return {Number/String/Object} See the return type for the store functions.
                         */
                        getSummary: function (store, type, field, group) {
                            if (type) {
                                if (Ext.isFunction(type)) {
                                    return store.aggregate(type, null, group, [field]);
                                }

                                switch (type) {
                                    case 'count':
                                        return store.count(group);
                                    case 'min':
                                        return store.min(field, group);
                                    case 'max':
                                        return store.max(field, group);
                                    case 'sum':
                                        return store.sum(field, group);
                                    case 'average':
                                        return store.average(field, group);
                                    default:
                                        return group ? {} : '';

                                }
                            }
                        },

                        // return the record having fieldName == value
                        getSummaryRcd: function (rawDataObject, fieldName, value) {
                            if (Ext.isArray(rawDataObject)) {
                                for (var i = 0; i < rawDataObject.length; i++) {
                                    if (rawDataObject[i][fieldName] && rawDataObject[i][fieldName] == value)
                                        return rawDataObject[i];
                                }
                                return undefined;
                            }
                            else if (rawDataObject.data[fieldName])
                                return rawDataObject;
                            else
                                return undefined;
                        }
                    }
                ];

                body = Ext.create('Ext.XTemplate', bodyTpl).apply(groups);
            }
            else {
                var bodyTpl = [
                    '<tpl for="this.columns">',
                    '{[ this.renderColumn(values, parent.get(values.dataIndex), parent, xindex) ]}',
                    '</tpl>'
                ];

                body = bodyTpl.join('');
            }

            return body;
        },

        /**
         * @property stylesheetPath
         * @type String
         * The path at which the print stylesheet can be found (defaults to 'ux/grid/gridPrinterCss/print.css')
         */
        stylesheetPath: '/app/ux/grid/printer/gridPrinterCss/print.css',

        /**
         * @property printAutomatically
         * @type Boolean
         * True to open the print dialog automatically and close the window after printing. False to simply open the print version
         * of the grid (defaults to false)
         */
        printAutomatically: false,

        /**
         * @property closeAutomaticallyAfterPrint
         * @type Boolean
         * True to close the window automatically after printing.
         * (defaults to false)
         */
        closeAutomaticallyAfterPrint: false,

        /**
         * @property pageTitle
         * @type String
         * Title to be used on top of the table
         * (defaults to empty)
         */
        pageTitle: '表格打印',

        /**
         * @property mainTitle
         * @type String
         * Title to be used on top of the table
         * (defaults to empty)
         */
        mainTitle: '',

        /**
         * Text show on print link
         * @property printLinkText
         * @type String
         */
        printLinkText: '打印',

        /**
         * Text show on close link
         * @property closeLinkText
         * @type String
         */
        closeLinkText: '关闭',

        /**
         * @property headerTpl
         * @type {Object/Array} values
         * The markup used to create the headings row. By default this just uses <th> elements, override to provide your own
         */
        headerTpl: [
            '<tpl for=".">',
            '<th style="text-align: {align}">{text}</th>',
            '</tpl>'
        ],

        /**
         * @property bodyTpl
         * @type {Object/Array} values
         * The XTemplate used to create each row. This is used inside the 'print' function to build another XTemplate, to which the data
         * are then applied (see the escaped dataIndex attribute here - this ends up as "{dataIndex}")
         */
        bodyTpl: [
            '<tpl for="columns">',
            '\{\[ this.renderColumn(values, parent.get(values.dataIndex), parent, xindex) \]\}',
            '</tpl>'
        ]

    }
});