/**
 * Created by clt on 15/12/18.
 */
Ext.define('luter.view.sys.role.RoleAuthView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.roleauthview',
    layout: 'border',
    iconCls: baseConfig.appicon.role,
    requires: ['luter.model.UserModel'],
    title: '用户角色与授权',
    initComponent: function () {
        var me = this;
        /**
         * *遍历子节点
         */
        var checkedC = function (node, checked) {
            node.eachChild(function (child) {
                child.set('checked', checked);
                child.fireEvent('checkchange', child, checked);
                if (node.childNodes.length > 0) {
                    checkedC(child, checked);
                }
            });
        };

        /*
         * 递归实现找到所有父亲节点,并改为选中状态
         */
        var allParent = function (node, flag) {
            // 设置 点击的节点为选中状态
            node.set('checked', flag);
            // 本级节点的根节点不为空，且不是tree的rootNode的情况下
            if (node.parentNode != null && (node.parentNode.data.id != '1' || node.parentNode.data.id != '1000')) {
                if (!node.data.checked) {// 如果此节点是未选中状态，则点击是选中操作
                    var i = 0;
                    // 本级所有节点的选中数量
                    node.parentNode.eachChild(function (child) {
                        // 循环判断本级下属所有节点是否有选中的
                        if (child.data.checked) {
                            i = i + 1;
                        }

                    });
                    if (i <= 0) {// 如果本级节点下属已经没有选中的，则更新其父节点为未选中。
                        allParent(node.parentNode, flag);
                    }
                } else {// 如果是选中状态，则点击是取消选中操作
                    allParent(node.parentNode, flag);
                }

            }
        };
        var roleUserStore = Ext.create('Ext.data.Store', {
            storeId: 'roleUserStore',
            autoLoad: false,
            model: 'luter.model.UserModel',
            pageSize: 15,
            remoteSort: true,
            sortOnLoad: true,
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'GET',
                    update: 'POST',
                    destroy: 'POST'
                },
                api: {
                    read: '/user/list'
                },
                reader: {
                    type: 'json',
                    root: 'root',
                    successProperty: 'success',
                    totalProperty: 'total'
                },
                listeners: {
                    exception: function (proxy, response, operation, eOpts) {
                        DealAjaxResponse(response);
                    }
                }
            },
            sortOnLoad: true,
            sorters: {
                property: 'id',
                direction: 'DESC'
            }
        });
        var rolegrid = Ext.create('Ext.grid.Panel', {
            store: Ext.data.StoreManager.lookup('roleStore'),
            itemId: 'roleGrid',
            flex: 1,
            listeners: {
                'itemdblclick': function (table, record, html, row, event, opt) {
                    if (record) {
                        if (!record.get('is_reserved')) {
                            //克隆一个记录，用作form load的属性匹配和修改
                            var therecord = record.clone();
                            ////把object转换成id
                            //if (therecord && record.get('department')) {
                            //    therecord.set('department', record.get('department').id);
                            //}
                            //if (therecord && record.get('gender')) {
                            //    therecord.set('gender', record.get('gender').id);
                            //}
                            var view = Ext.create('luter.view.sys.role.RoleEdit');
                            view.show();
                            //延迟500毫秒，load数据到form
                            var d = new Ext.util.DelayedTask(function () {
                                view.down('form').loadRecord(therecord);
                            });
                            d.delay(500);
                        } else {
                            return false;
                            //showFailMesg({
                            //    msg: '系统角色不允许修改。'
                            //})
                        }

                    } else {
                        showFailMesg({
                            msg: '加载信息失败，请确认。'
                        })
                    }

                }
            },
            selModel: Ext.create('Ext.selection.RowModel', {
                listeners: {
                    select: function (el, record, index, eOpts) {
                        roleuserGrid.setTitle('<i class="fa fa-lg fa-user"></i> --[<font color=red> ' + record.get("role_name") + ' </font>]的用户：');
                        Ext.data.StoreManager.lookup('roleUserStore').getProxy().setExtraParam('role', record.get("id"));
                        //Ext.data.StoreManager.lookup('roleUserStore').load({url: 'role/listRoleUsers'});
                        Ext.data.StoreManager.lookup('roleUserStore').load();
                    }
                }
            }),
            columns: [{
                header: baseConfig.model.role.id,
                dataIndex: 'id',
                hidden: false,
                flex: 1
            }, {
                header: baseConfig.model.role.role_name,
                dataIndex: 'role_name',
                flex: 1
            }, {
                header: baseConfig.model.role.is_reserved,
                dataIndex: 'is_reserved',
                xtype: 'booleancolumn',
                trueText: '是的',
                falseText: '不是',
                flex: 1
            }, {
                header: "操作",
                xtype: "actioncolumn",
                width: 50,
                sortable: false,
                items: [{
                    text: "系统操作权限分配",
                    iconCls: 'icon-update',
                    tooltip: "设置该角色可以操作的系统功能",
                    handler: function (grid, rindex, cindex) {
                        var record = grid.getStore().getAt(rindex);
                        treeB.setTitle('<i class="fa fa-lg fa-users"></i> [<font color=red> ' + record.get("role_name") + ' </font>]的系统操作权限：');
                        Ext.getStore('storeB').getProxy().setExtraParam('role_id', record.get("id"));
                        Ext.getStore('storeB').load({
                            callback: function () {
                                treeB.expandAll();
                            }
                        });

                        rolegrid.selModel.doSelect(rolegrid.store.data.items[rindex]);

                    },
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        return record.get('is_reserved');
                    }
                }]
            }],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: Ext.getStore('roleStore'),
                displayInfo: true,
                displayMsg: '当前数据 {0} - {1} 总数： {2}',
                emptyMsg: "没数据显示"
            }),
            tbar: [{
                text: '添加角色',
                id: 'addRoleButton',
                iconCls: baseConfig.appicon.add,
                tooltip: '新增一个角色',
                handler: function () {
                    var win = Ext.create('luter.view.sys.role.RoleAdd');
                    win.show();
                }
            }], plugins: [{
                ptype: 'rowexpander',
                rowBodyTpl: ['<p>{role_desc}</p>']
            }]
        });
        var roleuserGrid = Ext.create('Ext.grid.Panel', {
            store: Ext.getStore('roleUserStore'),
            flex: 1,
            itemId: 'roleUserGrid',
            selModel: Ext.create('Ext.selection.RowModel', {
                listeners: {
                    selectionchange: function (sm, selections) {

                    }
                }
            }),
            columns: [{
                header: 'id',
                dataIndex: baseConfig.model.user.id,
                hidden: true,

                flex: 1
            }, {
                header: baseConfig.model.user.username,
                dataIndex: 'username',

                flex: 1
            }, {
                header: baseConfig.model.user.gender,
                dataIndex: 'gender',
                flex: 1
            }],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: Ext.getStore('roleUserStore'),
                displayInfo: true,
                displayMsg: '当前数据 {0} - {1} 总数： {2}',
                emptyMsg: "没数据显示",
                plugins: [Ext.create('luter.ux.grid.PagingToolbarResizer')]
            })
        });

        var storeB = Ext.create('Ext.data.TreeStore', {
            fields: ['id', 'text', 'leaf', 'tips', 'href', 'checked'],
            autoLoad: false,
            storeId: 'storeB',
            proxy: {
                type: 'ajax',
                url: 'resource/getAuthTreeData',
                reader: {
                    type: 'json',
                    root: 'children',
                    successProperty: 'success'
                },
                actionMethods: {
                    read: 'POST'
                }

            }, root: {
                text: '系统资源权限树',
                id: '0',
                leaf: false,
                expanded: false
            },
            listeners: {
                exception: function (proxy, response, operation, eOpts) {
                    DealAjaxResponse(response);
                }
            }
        });


        var treeB = Ext.create('Ext.tree.Panel', {
            title: '权限',
            itemId: 'ReourcesRoleTreeGrid',
            frame: true,
            region: 'center',
            flex: 1,
            stripeRows: true,
            rootVisible: true,
            tools: [{
                type: 'expand',
                tooltip: '展开',
                handler: function () {
                    treeB.expandAll();

                }
            }, {
                type: 'collapse',
                tooltip: '收起',
                handler: function () {
                    treeB.collapseAll();

                }
            }],
            listeners: {
                checkchange: function (node, checked, eOpts) {
                    node.expand();
                    node.checked = checked;
                    if (node.childNodes.length > 0) {
                        checkedC(node, checked);
                    }
                    allParent(node, checked);

                }
            },
            store: storeB,
            hideHeaders: true,
            columns: [
                //    {
                //    flex: 1,
                //    dataIndex: 'checked',
                //    xtype: 'booleancolumn',
                //    trueText: apprender.trueText,
                //    falseText: apprender.falseText
                //},

                {
                    text: '',
                    flex: 1,
                    dataIndex: 'iconCls',
                    renderer: function (v, meta, record, rowIndex) {
                        if (record.raw) {
                            var check = record.raw.checked;
                            if (check) {
                                return '<i style="color:green" class="' + v + '"></i>';
                            } else {
                                return '<i style="color:red" class="' + v + '"></i>';
                            }
                        }
                        return '<i class="' + v + '"></i>';
                    }
                }, {
                    xtype: 'treecolumn',
                    flex: 13,
                    sortable: true,
                    dataIndex: 'text'
                }],
            multiSelect: false,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    text: '授权',
                    iconCls: 'icon-add',
                    tooltip: '选定权限后，点击此按钮，为当前选中的角色赋予选中的权限。',
                    handler: function () {
                        var checkednodes = treeB.getChecked();
                        if (checkednodes.length <= 0) {
                            showFailMesg({
                                msg: '您还没有为此角色选择系统权限，请选择后进行授权！'
                            });

                        } else {
                            var checkids = new Array();
                            for (var i = 0; i < checkednodes.length; i++) {
                                if (checkednodes[i].data.id == '0') {
                                    //没有根节点

                                } else {
                                    checkids.push(checkednodes[i].data.id);
                                    if (checkednodes[i].data.leaf) {
                                        //只有leaf节点
                                        //checkids.push(checkednodes[i].data.id);

                                    }

                                }

                            }
                            console.log(checkids.length);
                            if (1 == 1) {
                                var role_id = rolegrid.getSelectionModel().getSelection()[0].data.id;
                                if (role_id) {
                                    showConfirmMesg({
                                        msg: '为角色授权，确认?',
                                        fn: function (e) {
                                            if (e == 'yes') {
                                                Ext.Ajax.request({
                                                    url: 'resource/AuthRoleResource',
                                                    method: 'POST',
                                                    params: {
                                                        ids: Ext.encode(unique(checkids)),
                                                        role_id: role_id
                                                    },
                                                    success: function (response, options) {
                                                        DealAjaxResponse(response);

                                                    },
                                                    failure: function (response, options) {
                                                        DealAjaxResponse(response);

                                                    }
                                                });
                                            }

                                        }
                                    })

                                } else {
                                    showFailMesg({
                                        msg: '请在角色列表中选中需要授权的角色记录，然后进行操作。'
                                    })
                                }

                            }

                        }
                    }
                }]
            }]
        });
        var roleUserPanel = Ext.create('Ext.panel.Panel', {
            region: 'west',
            flex: 2,
            layout: {
                type: 'vbox',
                pack: 'middle',
                align: 'stretch'
            },
            items: [rolegrid, roleuserGrid]
        });
        Ext.applyIf(me, {
            items: [roleUserPanel, treeB]
        });
        me.callParent(arguments);
    }
});
