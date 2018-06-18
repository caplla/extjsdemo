Ext.define('luter.view.sys.user.UserList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.userlistview',
    requires: [],
    store: 'UserStore',
    itemId: 'userGrid',
    columnLines: true,
    rowLines: true,
    viewConfig: {
        emptyText: '<b>暂无数据</b>'
    },
    initComponent: function () {
        var me = this;

        me.columns = [{
            text: baseConfig.model.user.id,
            dataIndex: 'id', hidden: true,
            flex: 1
        },
            {
                text: baseConfig.model.user.username,
                dataIndex: 'username',
                flex: 1
            },

            {
                text: baseConfig.model.user.remarks,
                dataIndex: 'remarks',
                hidden: true,
                flex: 1
            },

            {
                text: baseConfig.model.user.avatar,
                dataIndex: 'avatar',
                hidden: true,
                flex: 1
            },
            {
                text: baseConfig.model.user.locked,
                dataIndex: 'locked',
                renderer: function (value, metaData) {
                    if (value) {
                        metaData.css = 'bg-red'
                    }
                    return value ? '是' : '否'
                },
                flex: 1
            },


            {
                text: baseConfig.model.user.realname,
                dataIndex: 'realname',
                flex: 1
            },
            {
                text: baseConfig.model.user.reserved,
                dataIndex: 'reserved',
                xtype: 'booleancolumn',
                trueText: '是',
                falseText: '否',
                flex: 1
            },
            {
                header: "操作",
                xtype: "actioncolumn",
                width: 150,
                sortable: false,
                menuDisabled: true,
                items: ['-', {
                    iconCls: 'x-fa fa-users  green-color',
                    tooltip: '修改用户角色信息',
                    isDisabled: function (grid, rowIndex, colIndex, item, record) {
                        return record.get('reserved') || currentUser.userid == record.get('id')
                    },
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        if (!record) {
                            toast({
                                msg: '请选中一条要删除的记录'
                            })
                        } else {
                            var view = Ext.create('luter.view.sys.user.SetRole')
                            view.loadView({
                                user: record.get('id'),
                                username: record.get('realname') + '-' + record.get('username')
                            });
                            var id = record.get('id');
                            loadFormDataFromDb(view, 'sys/user/view?id=' + id);

                        }
                    }
                }, '-', {
                    iconCls: baseConfig.appicon.key,
                    tooltip: '重置用户的密码',
                    isDisabled: function (grid, rowIndex, colIndex, item, record) {
                        return record.get('reserved')
                    },

                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        if (!record) {
                            toast({
                                msg: '请选中记录'
                            })
                        } else {
                            var id = record.get('id');
                            var username = record.get('username');
                            var view = Ext.create('luter.view.sys.user.ResetUserPass');
                            view.loadView({
                                id: id,
                                username: username
                            })
                            view.show()
                        }
                    }
                }, '-', {
                    iconCls: baseConfig.appicon.ban,
                    tooltip: '启用/禁用账户',
                    isDisabled: function (grid, rowIndex, colIndex, item, record) {
                        return record.get('reserved')
                        // return record.get('reserved') || currentUser.userid == record.get('id')
                    },

                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        if (!record) {
                            toast({
                                msg: '请选中记录'
                            })
                        } else {
                            var locked = record.get('locked');
                            var id = record.get('id');
                            showConfirmMesg({
                                message: locked ? '解锁' : '锁定' + '当前用户，确定吗？',
                                fn: function (btn) {
                                    if (btn === 'yes') {
                                        Ext.Ajax.request({
                                            url: 'sys/user/lock',
                                            method: 'POST',
                                            params: {
                                                id: id
                                            },
                                            success: function (response, options) {
                                                DealAjaxResponse(response);
                                                Ext.getStore('UserStore').load();
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
            },


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
            // layout:'column',
            dock: 'top',
            items: [{
                text: '添加',
                iconCls: baseConfig.appicon.add,
                tooltip: '添加新用户',
                width: 80,
                handler: function () {
                    var win = Ext.create('luter.view.sys.user.UserAdd', {animateTarget: this, shadow: false});
                    win.loadView();
                    win.setTitle('添加新用户')
                    win.show();

                }
            }, {
                xtype: 'textfield',
                flex: 1,
                emptyText: '输入用户名的部分全部、拼音或者首字母,回车开始搜索',
                // minLength:2,
                // minLengthText: '请输入{0}个字以内',
                itemId: 'usersearchname',
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            var queryEl = getCmpByItemId('usersearchname');
                            var value = queryEl.getValue()
                            if (value && value.length > 1) {
                                Ext.getStore('UserStore').getProxy().setExtraParam('query', value);
                                Ext.getStore('UserStore').load();
                            } else {
                                toast('请输入至少两位搜索关键词')
                            }
                        }
                    }
                }
            }, '->', {
                text: '',
                width: 50,
                iconCls: baseConfig.appicon.search,
                tooltip: '搜索',
                handler: function () {
                    var queryEl = getCmpByItemId('usersearchname');
                    var value = queryEl.getValue()
                    if (value && value.length > 1) {
                        Ext.getStore('UserStore').getProxy().setExtraParam('query', value);
                        Ext.getStore('UserStore').load();
                    } else {
                        toast('请输入至少两位搜索关键词')
                    }

                }
            }, {
                text: '',
                width: 50,
                iconCls: baseConfig.appicon.reset,
                tooltip: '清除搜索条件',
                handler: function () {
                    var queryEl = getCmpByItemId('usersearchname');
                    queryEl.setValue('');
                    Ext.getStore('UserStore').getProxy().setExtraParams({});
                    Ext.getStore('UserStore').load();

                }
            }]
        }]
        me.listeners = {
            'itemdblclick': function (table, record, html, row, event, opt) {
                if (record) {
                    var id = record.get('id');
                    var reserved = record.get('reserved');
                    if (reserved) {
                        toast('系统用户不允许修改')
                        return false;
                    }
                    var view = Ext.create('luter.view.sys.user.UserEdit', {
                        title: '编辑数据',
                        animateTarget: this,
                        shadow: false
                    });
                    view.loadView({
                        userid: id
                    });
                    // loadFormDataFromDb(view, 'sys/user/view?id=' + id);
                    Ext.Ajax.request({
                        url: 'sys/user/view',
                        method: 'POST',
                        params: {
                            id: id
                        },
                        success: function (response, options) {
                            var form = view.down('form');
                            var result = Ext.JSON.decode(response.responseText);
                            var formActive = form && !form.destroying && !form.destroyed;
                            if (result.success && formActive) {
                                view.show();
                                form.getForm().clearInvalid();
                                var therecord = result.data;
                                if (therecord.gender) {
                                    therecord.gender = therecord.gender.id;
                                }
                                if (therecord.department) {
                                    therecord.department = therecord.department.id;
                                }
                                form.getForm().setValues(therecord);
                            } else {
                                toast('加载数据失败，请稍后再试')

                            }

                        },
                        failure: function (response, options) {
                            DealAjaxResponse(response);
                        }
                    });
                } else {
                    showFailMesg({
                        msg: '加载信息失败，请确认。'
                    })
                }

            }

            // , itemmouseenter: function (view, record, item) {
            //     Ext.fly(item).set({
            //         'data-qtip': '' + record.get('remarks')
            //     });
            // }
        }
        me.plugins = []
        me.callParent(arguments);
    }
});
