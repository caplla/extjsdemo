Ext.define('luter.view.sys.role.RoleList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.rolelistview',
    requires: [],
    store: 'RoleStore',
    itemId: 'roleGrid',
    columnLines: true,
    rowLines: true,
    viewConfig: {
        emptyText: '<b>暂无数据</b>'
    },
    initComponent: function () {
        var me = this;
        me.columns =
            [{
                header: "操作",
                xtype: "actioncolumn",
                width: 120,
                menuDisabled: true,
                sortable: false,
                items: [{
                    iconCls: 'x-fa fa-close  red-color',
                    tooltip: '删除这条记录',
                    isDisabled: function (grid, rowIndex, colIndex, item, record) {
                        return record.get('reserved')
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
                                            url: 'sys/role/delete',
                                            method: 'POST',
                                            params: {
                                                id: record.get('id')
                                            },
                                            success: function (response, options) {
                                                DealAjaxResponse(response);
                                                Ext.data.StoreManager.lookup('RoleStore').load();
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
                }, '-', {
                    iconCls: 'x-fa fa-bars  red-color',
                    tooltip: '角色授权',
                    isDisabled: function (grid, rowIndex, colIndex, item, record) {
                        // return record.get('reserved')
                        return false;
                    },
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        if (!record) {
                            toast({
                                msg: '请选择记录'
                            })
                        } else {
                            var view = Ext.create('luter.view.sys.role.RoleAuth', {
                                roleid: record.get('id'),
                                rolename: record.get('name')
                            });
                            view.loadView();
                            view.show()

                        }
                    }
                }, '-', {
                    iconCls: 'x-fa fa-users  blue-color',
                    tooltip: '查看角色用户',
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        if (record) {
                            var userPanel = Ext.getCmp('roleUserGrid');
                            if (userPanel.getCollapsed()) {
                                userPanel.expand();
                            }
                            me.getView().select(rowIndex);
                            userPanel.setTitle('角色:[' + record.get('name') + '] 的所有用户:')
                            Ext.getStore('RoleUserStore').getProxy().setExtraParam('roleid', record.get('id'));
                            Ext.getStore('RoleUserStore').load();

                        } else {
                            toast({
                                msg: '请选择记录'
                            })
                            return;
                        }
                    }
                }]
            }, {
                header: baseConfig.model.role.id,
                dataIndex: 'id',hidden:true,

                flex: 1
            },
                {
                    text: baseConfig.model.role.create_at,
                    dataIndex: 'create_at',
                    hidden: true,
                    flex: 1
                }, {
                text: baseConfig.model.role.name,
                dataIndex: 'name',
                flex: 1
            },
                {
                    text: baseConfig.model.role.remarks,
                    dataIndex: 'remarks',
                    flex: 2
                },
                {
                    text: baseConfig.model.role.update_at,
                    dataIndex: 'update_at',
                    hidden: true,
                    flex: 1
                },
                {
                    text: baseConfig.model.role.version,
                    dataIndex: 'version',
                    hidden: true,
                    flex: 1
                },

                {
                    text: baseConfig.model.role.reserved,
                    dataIndex: 'reserved',
                    renderer: Ext.util.Format.comboRenderer(yesNoCombo),
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
                text: '添加',
                iconCls: baseConfig.appicon.add,
                tooltip: '添加',
                handler: function () {
                    var win = Ext.create('luter.view.sys.role.RoleAdd', {animateTarget: this, shadow: false});
                    win.loadView();
                    win.show();
                }
            }]
        }]
        me.listeners = {
            'itemdblclick': function (table, record, html, row, event, opt) {
                if (record) {
                    var id = record.get('id');
                    var reserved = record.get('reserved');
                    if (!reserved) {
                        toast('系统角色不允许修改')
                    } else {
                        var view = Ext.create('luter.view.sys.role.RoleEdit', {
                            title: '编辑数据',
                            animateTarget: this,
                            shadow: false
                        });
                        view.loadView();
                        loadFormDataFromDb(view, 'sys/role/view?id=' + id);
                    }
                } else {
                    showFailMesg({
                        msg: '加载信息失败，请确认。'
                    })
                }

            },
            'itemclick': function (table, record, html, row, event, opt) {
                if (record) {
                    var userPanel = Ext.getCmp('roleUserGrid');
                    if (userPanel.getCollapsed()) {
                        userPanel.expand();
                    }
                    userPanel.setTitle('角色:[' + record.get('name') + '] 的所有用户:')
                    Ext.getStore('RoleUserStore').getProxy().setExtraParam('roleid', record.get('id'));
                    Ext.getStore('RoleUserStore').load();
                } else {
                    toast({
                        msg: '加载信息失败。'
                    })
                }

            }
        }
        me.plugins = []
        me.callParent(arguments);
    }
});
