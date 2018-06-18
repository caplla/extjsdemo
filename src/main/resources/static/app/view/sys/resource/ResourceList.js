Ext.define('luter.view.sys.resource.ResourceList', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.resourcelistview',
    requires: ['luter.combo.ResType', 'luter.combo.Icon'],
    store: 'ResourceStore',
    itemId: 'resourceGrid',
    columnLines: true,
    rowLines: true,
    viewConfig: {
        emptyText: '<b>暂无数据</b>'
    },
    stripeRows: true,
    rootVisible: true,
    tools: [{
        type: 'refresh',
        tooltip: '刷新资源数列表',
        handler: function (a, b, c) {
            c.up().getStore().load()
        }
    }, {
        type: 'collapse',
        tooltip: '展开',
        handler: function (a, b, c) {
            c.up().expandAll()
        }
    }],
    title: '系统资源',
    initComponent: function () {
        var me = this;
        var ResTypecombo = Ext.create('luter.combo.ResType')
        me.columns = [{
            text: "操作",
            xtype: "actioncolumn",
            menuDisabled: true,
            width: 120,
            sortable: false,
            items: [{
                text: "新增下级",
                iconCls: 'x-fa fa-plus  green-color',
                tooltip: "在此节点增加下级",
                handler: function (grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    var view = Ext.create('luter.view.sys.resource.ResourceAdd');
                    var pid = record.get('id');
                    var pname = record.get('name');
                    view.loadView({
                        pid: pid,
                        pname: pname,
                        res_type: record.get('res_type') == 1 ? 2 : 0
                    });
                    view.show()
                },
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('res_type') === 2;
                }
            }, '-', {
                text: "修改",
                iconCls: 'x-fa fa-edit  blue-color',
                tooltip: "修改数据",
                handler: function (grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    var id = record.get('id');
                    var view = Ext.create('luter.view.sys.resource.ResourceEdit', {
                        title: '编辑数据',
                        animateTarget: this,
                        shadow: false
                    });
                    view.loadView();
                    loadFormDataFromDb(view, 'sys/resource/view?id=' + id);
                },
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('id') == 0;
                }
            }, '-', {
                iconCls: 'x-fa fa-close  red-color',
                tooltip: '删除这条记录',
                isDisabled: function (grid, rowIndex, colIndex, item, record) {
                    // return record.get('res_type') != 2;
                    return false;
                },
                handler: function (grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    if (!record) {
                        toast({
                            msg: '请选中一条要删除的记录'
                        })
                    } else {
                        showConfirmMesg({
                            message: '确定删除这条记录?',
                            fn: function (btn) {
                                if (btn === 'yes') {
                                    Ext.Ajax.request({
                                        url: 'sys/resource/delete',
                                        method: 'POST',
                                        params: {
                                            id: record.get('id')
                                        },
                                        success: function (response, options) {
                                            DealAjaxResponse(response);
                                            Ext.getStore('ResourceStore').load();
                                        },
                                        failure: function (response, options) {
                                            DealAjaxResponse(response);
                                        }
                                    });
                                } else {
                                    return false;
                                }
                            }

                        })

                    }
                }
            }]
        }, {
            text: baseConfig.model.resource.icon,
            dataIndex: 'icon',
            renderer: function (value) {
                return '<i style="font-size: 20px;" class="' + value + '"></i>'
            },
            flex: 1
        }, {
            xtype: 'treecolumn',
            text: baseConfig.model.resource.name,
            flex: 3,
            sortable: true,
            dataIndex: 'name',
            renderer: function (value, metaData, list, rowIndex, colIndex, store, view) {
                var count = list.childNodes.length;
                return '<span data-qtip="' + list.data.tip + '">' + value + ' (' + count + ')' + '</span>';

            }
        }, {
            text: baseConfig.model.resource.res_type,
            dataIndex: 'res_type',
            renderer: Ext.util.Format.comboRenderer(ResTypecombo),
            flex: 1
        }, {
            text: baseConfig.model.resource.id,
            dataIndex: 'id',
            hidden: true,
            flex: 1
        },
            {
                text: baseConfig.model.resource.create_at,
                dataIndex: 'create_at', hidden: true,

                flex: 1
            },
            {
                text: baseConfig.model.resource.remarks,
                dataIndex: 'remarks', hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.resource.update_at,
                dataIndex: 'update_at',
                hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.resource.version,
                dataIndex: 'version',
                hidden: true,
                flex: 1
            },

            {
                text: baseConfig.model.resource.module,
                dataIndex: 'module',
                flex: 1
            },
            {
                text: baseConfig.model.resource.perm,
                dataIndex: 'perm',
                flex: 1
            },
            {
                text: baseConfig.model.resource.pid,
                dataIndex: 'pid',
                hidden: true,
                flex: 1
            },

            {
                text: baseConfig.model.resource.reversed,
                dataIndex: 'reversed',
                hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.resource.tip,
                dataIndex: 'tip',hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.resource.uri,
                dataIndex: 'uri',
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
        // me.listeners = {
        //     itemmouseenter: function (view, record, item) {
        //         Ext.fly(item).set({
        //             'data-qtip': '' + record.get('tip')
        //         });
        //     }
        // }
        me.plugins = []
        me.callParent(arguments);
    }
});
