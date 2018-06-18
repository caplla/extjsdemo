Ext.define('luter.view.sys.role.RoleAuth', {
    extend: 'Ext.window.Window',
    alias: 'widget.roleauthview',
    requires: [],
    constrain: true,
    modal: true,
    maximizable: true,
    iconCls: baseConfig.appicon.update,
    layout: "fit",
    width: 400,
    height: 600,
    minWidth: 600,
    minHeight: 600,
    roleid: null,
    rolename: '',
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
        me.setTitle('授权角色:' + me.rolename)
        var treeStore = Ext.create('Ext.data.TreeStore', {
            fields: ['id', 'text', 'leaf', 'tips', 'href', 'checked'],
            autoLoad: false,
            storeId: 'storeB',
            root: {
                text: '系统资源权限树',
                id: '0',
                leaf: false,
                expanded: true,
                checked: false
            },
            proxy: {
                type: 'ajax',
                // url: 'static/luter/testdata/auth.json'
                url: 'sys/role/auth/tree?roleid=' + me.roleid,
                actionMethods: {
                    read: 'POST'
                },
            },
            listeners: {
                exception: function (proxy, response, operation, eOpts) {
                    DealAjaxResponse(response);
                }
            }
        });
        var tree = Ext.create('Ext.tree.Panel', {
            itemId: 'ReourcesRoleTreeGrid',
            frame: true,
            region: 'center',
            flex: 1,
            stripeRows: true,
            rootVisible: false,
            // bufferedRenderer: false,
            // checkPropagation: 'up',//up,down
            animate: true,
            store: treeStore,
            rootVisible: true,
            listeners: {
                checkchange: function (node, checked, eOpts) {
                    node.expand();
                    node.checked = checked;
                    if (node.childNodes.length > 0) {
                        checkedC(node, checked);
                    }
                    allParent(node, checked);

                }
            }

        })
        me.items = [tree]
        me.buttons = ['->', {
            text: '提交授权',
            cls: 'green-btn',
            iconCls: baseConfig.appicon.add,
            handler: function () {
                var checkednodes = tree.getChecked();
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
                        var role_id = me.roleid;
                        if (role_id) {
                            showConfirmMesg({
                                msg: '为角色授权，确认?',
                                fn: function (e) {
                                    if (e == 'yes') {
                                        Ext.Ajax.request({
                                            url: 'sys/role/auth/save',
                                            method: 'POST',
                                            params: {
                                                ids: checkids.join(','),
                                                roleid: role_id
                                            },
                                            success: function (response, options) {
                                                me.close();
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
                // if (me && me.roleid > 0) {
                //     var records = tree.getView().getChecked(),
                //         ids = [];
                //     Ext.Array.each(records, function (rec) {
                //         if (rec.get('id') > 0) {
                //             ids.push(rec.get('id'));
                //         }
                //
                //     });
                //     Ext.MessageBox.show({
                //         title: 'Selected Nodes' + me.roleid,
                //         msg: ids.join(','),
                //         icon: Ext.MessageBox.INFO
                //     });
                //     showConfirmMesg({
                //         msg: '修改角色权限，此角色下的所有账户的权限将全部修改，确认修改吗?',
                //         fn: function (e) {
                //             if (e == 'yes') {
                //                 Ext.Ajax.request({
                //                     url: 'sys/role/auth/save/',
                //                     method: 'POST',
                //                     params: {
                //                         ids: ids.join(','),
                //                         roleid: me.roleid
                //                     },
                //                     success: function (response, options) {
                //                         me.close();
                //                         DealAjaxResponse(response);
                //
                //                     },
                //                     failure: function (response, options) {
                //                         DealAjaxResponse(response);
                //
                //                     }
                //                 });
                //             }
                //
                //         }
                //     })
                // }
                // else {
                //     showFailMesg({
                //         msg: '请选择角色'
                //     })
                // }

            },
            scope: this
        }, '-', {
            text: '放弃',
            cls: 'red-btn',
            iconCls: baseConfig.appicon.undo,
            handler: function () {
                me.close();
            },
            scope: this
        }]
        me.callParent(arguments);
    },
    loadView: function (config) {
    }
});
