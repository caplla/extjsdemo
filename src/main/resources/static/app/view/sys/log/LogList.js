Ext.define('luter.view.sys.log.LogList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.loglistview',
    requires: ['luter.ux.datetime.DateTimeField', 'luter.ux.grid.printer.Printer'],
    store: 'LogStore',
    itemId: 'logGrid',
    columnLines: true,
    rowLines: true,
    multiColumnSort: false,
    grouped: true,
    viewConfig: {
        emptyText: '<b>暂无数据</b>'
    },
    autoScroll: true,
    title: '系统日志列表',
    initComponent: function () {
        var me = this;
        me.columns = [{
            text: baseConfig.model.log.id,
            dataIndex: 'id', hidden: false,
            flex: 1
        },
            {
                text: baseConfig.model.log.create_at,
                dataIndex: 'create_at', hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.log.remarks,
                dataIndex: 'remarks', hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.log.update_at,
                dataIndex: 'update_at', hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.log.version,
                dataIndex: 'version', hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.log.browser_type,
                dataIndex: 'browser_type',
                flex: 1
            },
            {
                text: baseConfig.model.log.client_ip,
                dataIndex: 'client_ip',
                flex: 1
            },
            {
                text: baseConfig.model.log.content,
                dataIndex: 'content', hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.log.log_class,
                dataIndex: 'log_class',
                flex: 1
            },
            {
                text: baseConfig.model.log.request_method,
                dataIndex: 'request_method', hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.log.request_params,
                dataIndex: 'request_params', hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.log.request_time,
                dataIndex: 'request_time',
                flex: 2
            },
            {
                text: baseConfig.model.log.request_url,
                dataIndex: 'request_url',
                flex: 2
            },
            {
                text: baseConfig.model.log.user_agent,
                dataIndex: 'user_agent', hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.log.userid,
                dataIndex: 'userid', hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.log.username,
                dataIndex: 'username',
                flex: 1
            }


        ]

        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            displayInfo: true,
            displayMsg: '当前数据 {0} - {1} 总数： {2}',
            emptyMsg: "没数据显示",
            plugins: [new Ext.create('luter.ux.grid.PagingToolbarResizer', {
                options: [5, 10, 15, 20, 25, 50, 100]
            })]
        })
        me.dockedItems = [{
            xtype: 'toolbar',
            items: [{
                tooltip: '删除所有选中信息',
                iconCls: baseConfig.appicon.delete,
                handler: function () {
                    var IdJsonArray = [];
                    var sel = me.getSelectionModel().getSelection();
                    if (sel.length && sel.length > 0) {
                        for (var a in sel) {
                            IdJsonArray.push(sel[a].get('id'));
                        }
                    } else {
                        toast({
                            msg: '请至少选择一条记录'
                        });
                        return
                    }
                    if (IdJsonArray && IdJsonArray.length > 0) {
                        showConfirmMesg({
                            msg: '删除' + IdJsonArray.length + '条选定的日志，确定吗?',
                            fn: function (btn) {
                                if (btn === 'yes') {
                                    var myMask = new Ext.LoadMask(me, {msg: "处理中，请稍等..."});
                                    myMask.show();
                                    Ext.Ajax.request({
                                        method: 'POST',
                                        url: 'sys/log/delete/batch',
                                        success: function (response, options) {
                                            DealAjaxResponse(response);
                                            me.getStore('LogStore').load();
                                            myMask.hide();
                                        },
                                        failure: function (response, options) {
                                            DealAjaxResponse(response);
                                            myMask.hide();
                                        },
                                        params: {
                                            ids: IdJsonArray
                                        }
                                    });

                                } else {
                                    return false;
                                }
                            }
                        })


                    } else {
                        toast({
                            msg: '请至少选择一条记录'
                        });
                        return
                    }
                }
            }, {
                text: '打印',
                tooltip: '打印当前表格中的内容，显示什么就打印什么，不需要选择',
                iconCls: baseConfig.appicon.printer,
                handler: function () {
                    var filename = '系统日志 - ' + Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, -1), "Y-m-d-h-i-s");
                    luter.ux.grid.printer.Printer.printAutomatically = false;
                    luter.ux.grid.printer.Printer.mainTitle = filename;
                    luter.ux.grid.printer.Printer.pageTitle = filename;
                    luter.ux.grid.printer.Printer.print(me, false);//true，则连summary和expander信息全部打印，false则只打印表格
                }
            }, {
                xtype: 'textfield',
                flex: 1,
                emptyText: '输入用户名的部分全部、拼音或者首字母,回车开始搜索',
                // minLength:2,
                // minLengthText: '请输入{0}个字以内',
                itemId: 'logquery',
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var queryEl = getCmpByItemId('logquery');
                            var value = queryEl.getValue();
                            Ext.getStore('LogStore').getProxy().setExtraParam('query', value);
                            Ext.getStore('LogStore').getProxy().setExtraParam('start_time', Ext.getCmp('log_start_time').getRawValue() || '');
                            Ext.getStore('LogStore').getProxy().setExtraParam('end_time', Ext.getCmp('log_end_time').getRawValue() || '');
                            Ext.getStore('LogStore').load();
                            me.setTitle('查询日志，用户名:' + value + ',开始时间:' + Ext.getCmp('log_start_time').getRawValue() + ",结束时间:" + Ext.getCmp('log_end_time').getRawValue())
                        }
                    }
                }
            }, {
                xtype: "datetimefield",
                fieldLabel: '从',
                id: 'log_start_time',
                format: baseConfig.unit.DateFormatLong,
                endDateField: 'log_end_time',
                labelAlign: 'right',
                allowBlank: true,
                flex: 1
            }, {
                xtype: "datetimefield",
                fieldLabel: '到',
                labelAlign: 'right',
                id: 'log_end_time',
                StartDateField: 'log_start_time',
                format: baseConfig.unit.DateFormatLong,
                allowBlank: true,
                flex: 1
            }, {
                text: '',
                width: 50,
                iconCls: baseConfig.appicon.search,
                tooltip: '搜索',
                handler: function () {
                    var queryEl = getCmpByItemId('logquery');
                    var value = queryEl.getValue();
                    Ext.getStore('LogStore').getProxy().setExtraParam('query', value);
                    Ext.getStore('LogStore').getProxy().setExtraParam('start_time', Ext.getCmp('log_start_time').getRawValue() || '');
                    Ext.getStore('LogStore').getProxy().setExtraParam('end_time', Ext.getCmp('log_end_time').getRawValue() || '');
                    Ext.getStore('LogStore').load();
                    me.setTitle('查询日志，用户名:' + value + ',开始时间:' + Ext.getCmp('log_start_time').getRawValue() + ",结束时间:" + Ext.getCmp('log_end_time').getRawValue())

                }
            }, {
                text: '',
                width: 50,
                iconCls: baseConfig.appicon.reset,
                tooltip: '清除搜索条件',
                handler: function () {
                    me.setTitle('系统日志列表');
                    var queryEl = getCmpByItemId('logquery');
                    queryEl.setValue('');
                    Ext.getCmp('log_start_time').setValue('');
                    Ext.getCmp('log_end_time').setValue('');
                    Ext.getStore('LogStore').getProxy().setExtraParams({});
                    Ext.getStore('LogStore').load();

                }
            }]
        }]
        me.listeners = {
            itemmouseenter: function (view, record, item) {
                Ext.fly(item).set({
                    'data-qtip': '' + record.get('content')
                });
            }
        }
        me.features = [{
            ftype: 'grouping',
            showGroupsText: '分组显示',
            groupByText: '以此字段分组数据',
            expandTip: '点击展开，按住CTRL键可以展开所有其他',
            collapseTip: '点击合起， 按住CTRL键可以合起所有其他',
            showSummaryRow: false,
        }, {
            ftype: 'summary'
        }];
        me.plugins = [{
            ptype: 'rowexpander',
            rowBodyTpl: [
                '<table>',
                '<tpl foreach=".">',
                '<tr><td style="font-weight: 800">{$}:</td><td>{.}</td></tr>',
                '</tpl>',
                '</table>'
            ]
        }]
        me.selModel = Ext.create('Ext.selection.CheckboxModel', {
            mode: 'MULTI'
        });
        me.callParent(arguments);
    }
});
