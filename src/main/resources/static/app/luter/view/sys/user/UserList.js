Ext.define('luter.view.sys.user.UserList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.userlistview',
    requires: [],
    store: 'UserStore',
    itemId: 'userGrid',
    columnLines: true,
    viewConfig: {
        emptyText: '<b>暂无数据</b>',
        autoFill: true,
        getRowClass: function(record, rowIndex, rowParams, store) {
            return record.get('locked') ? 'no' : '';

        }
    },
    initComponent: function () {
        var genderCombo=Ext.create('luter.combo.GenderCombo');
        var yesnoCombo=Ext.create('luter.combo.YesNoCombo');
        var me = this;
        me.columns = [{
            xtype: 'rownumberer',
            text: '序号',
            width: 60
        }, {
            header: "操作",
            xtype: "actioncolumn",
            width: 60,
            sortable: false,
            items: [{
                text: "删除",
                iconCls: 'icon-delete',
                tooltip: "删除这条记录",
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
                                    showToastMessage('啥意思?');
                                    Ext.Ajax.request({
                                        url: '/user/delete',
                                        method: 'POST',
                                        params: {
                                            id: record.get('id')
                                        },
                                        success: function (response, options) {
                                            DealAjaxResponse(response);
                                            Ext.data.StoreManager.lookup('UserStore').load();
                                        },
                                        failure: function (response, options) {
                                            DealAjaxResponse(response);
                                        }
                                    });
                                } else {
                                    Ext.toast({
                                        title: '看...',
                                        width: 200,
                                        html: '不删了.....'
                                    });
                                    return false;
                                }
                            }

                        })

                    }

                }
            }]
        }, {
            header: baseConfig.model.user.id,
            dataIndex: 'id',
            hidden: true,
            flex: 1
        },

            {
                header: baseConfig.model.user.username,
                dataIndex: 'username',
                flex: 1
            },
            {
                header: baseConfig.model.user.gender,
                dataIndex: 'gender',
                renderer:Ext.util.Format.comboRenderer(genderCombo),
                flex: 1
            },
            {
                header: baseConfig.model.user.locked,
                dataIndex: 'locked',
                renderer:Ext.util.Format.comboRenderer(yesnoCombo),
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
                    var win = Ext.create('luter.view.sys.user.UserAdd', {
                        animateTarget: this//以这个按钮为锚点动画打开win
                    });
                    win.loadView();//给form加入元素
                    win.show();//显示这个窗体

                }
            }]
        }]
        me.listeners = {
            'itemdblclick': function (table, record) {
                if (record) {
                    var id = record.get('id');
                    var view = Ext.create('luter.view.sys.user.UserEdit', {title: '编辑数据', animateTarget: this});
                    view.loadView();
                    //为了保证数据完整性，拿到这条数据的ID后，需要从后台获取当前这条数据，然后再修改
                    //对于后台而言，最好对数据设置@version功能，确保数据一致性。
                    loadFormDataFromDb(view, '/user/get?id=' + id);
                } else {
                    showFailMesg({
                        message: '加载信息失败，请确认。'
                    })
                }

            }
        }
        me.plugins = []
        me.callParent(arguments);
    }
});
