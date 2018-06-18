Ext.define('luter.view.sys.role.RoleUserList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.roleuserlistview',
    requires: [],
    store: 'RoleUserStore',
    itemId: 'roleUserGrid',
    columnLines: true,
    rowLines: true,
    viewConfig: {
        emptyText: '<b>暂无数据</b>'
    },
    initComponent: function () {
        var me = this;
        me.columns = [{
            header: "操作",
            xtype: "actioncolumn",
            width: 60,
            sortable: false,
            items: [{
                iconCls: 'x-fa fa-close  red-color',
                tooltip: '从这个角色下删除此用户，此用户将不拥有这个角色的权限',
                isDisabled: function (grid, rowIndex, colIndex, item, record) {
                    return record.get('reserved')
                },
                handler: function (grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    if (!record) {
                        toast({
                            msg: '请选中一条记录'
                        })
                    } else {
                        var roleP = Ext.getCmp('roleGrid');
                        var selectedRecord = roleP.getSelectionModel().getSelection()[0];
                        if (selectedRecord.id <= 0) {
                            showFailMesg({
                                msg: '请在角色列表选中一个角色'
                            })
                            return;
                        }
                        showConfirmMesg({
                            message: '确定吗?',
                            fn: function (btn) {
                                if (btn === 'yes') {
                                    Ext.Ajax.request({
                                        url: 'sys/role/del/user',
                                        method: 'POST',
                                        params: {
                                            userid: record.get('id'),
                                            roleid: selectedRecord.id
                                        },
                                        success: function (response, options) {
                                            DealAjaxResponse(response);
                                            Ext.getStore('RoleUserStore').load();
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
            text: baseConfig.model.user.id,
            dataIndex: 'id',
            hidden: true,
            flex: 1
        },
            {
                text: baseConfig.model.user.username,
                dataIndex: 'username',
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
                renderer: Ext.util.Format.comboRenderer(yesNoCombo),
                flex: 1
            }

        ]

        me.callParent(arguments);
    },
    setRole: function (me, role) {
        me.roleid = role;
    }
});
