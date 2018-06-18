Ext.define('luter.view.sys.user.SetRole', {
    extend: 'Ext.window.Window',
    alias: 'widget.setroleview',
    requires: ['luter.combo.Role'],
    constrain: true,
    modal: true,
    maximizable: true,
    iconCls: baseConfig.appicon.add,
    layout: "fit",
    width: 700,
    height: 300,
    minWidth: 550,
    minHeight: 200,
    title: '分配角色',
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'form',
            width: 650,
            height: 350,
            minWidth: 500,
            minHeight: 250,
            layout: 'column',
            fieldDefaults: {
                labelAlign: 'right',
                labelStyle: 'font-weight:bold;'
            },
            border: false
        }]
        me.buttons = ['->', {
            text: '分配',
            cls: 'green-btn',
            iconCls: baseConfig.appicon.add,
            handler: function () {
                var form = this.down('form');
                if (form.isValid()) {
                    form.submit({
                        url: 'sys/user/set/role',
                        method: 'POST',
                        waitTitle: "提示",
                        waitMsg: '正在提交数据，请稍后 ……',
                        success: function (form, action) {
                            me.close();
                            DealAjaxResponse(action.response);
                            Ext.getStore('UserStore').load();
                        },
                        failure: function (form, action) {
                            DealAjaxResponse(action.response);
                        }
                    });
                } else {
                    toast('信息填写不完整，请完善信息后提交')
                }
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
        var formCmp = this.getComponent(0);
        formCmp.add([{
                columnWidth: 1,
                layout: "form",
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel:'要授权的用户',
                        value: config.username
                    },
                    {
                        xtype: 'hidden',
                        name: 'user',
                        value: config.user
                    },
                    {
                        xtype: "roleCombo",
                        fieldLabel: '设置角色',
                        name: 'roles',
                        labelAttrTpl: 'data-qtip="用户属于角色，则具有此角色的所有操作权限"',
                        allowBlank: false,
                        flex: 1
                    }
                ]
            }]
        );

    }
});
