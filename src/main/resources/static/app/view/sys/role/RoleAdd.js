Ext.define('luter.view.sys.role.RoleAdd', {
    extend: 'Ext.window.Window',
    alias: 'widget.roleaddview',
    requires: [],
    constrain: true,
    modal: true,
    maximizable: true,
    iconCls: baseConfig.appicon.add,
    layout: "fit",
    width: 550,
    height: 350,
    minWidth: 550,
    minHeight: 250,
    title: '添加角色',
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'form',
            width: 500,
            height: 300,
            minWidth: 500,
            minHeight: 200,
            layout: 'form',
            fieldDefaults: {
                labelAlign: 'right',
                labelStyle: 'font-weight:bold;'
            },
            border: false
        }]
        me.buttons = ['->', {
            text: '新增',
            cls: 'green-btn',
            iconCls: baseConfig.appicon.add,
            handler: function () {
                var form = this.down('form');
                if (form.isValid()) {
                    form.submit({
                        url: 'sys/role/add',
                        method: 'POST',
                        waitTitle: "提示",
                        waitMsg: '正在提交数据，请稍后 ……',
                        success: function (form, action) {
                            me.close();
                            DealAjaxResponse(action.response);
                            Ext.getStore('RoleStore').load();
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
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.role.name,
                    name: 'name',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    allowBlank: false,
                    flex: 1
                },
                {
                    xtype: "textarea",
                    fieldLabel: baseConfig.model.role.remarks,
                    name: 'remarks',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    allowBlank: false,
                    flex: 1
                },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: baseConfig.model.role.reserved,
                    defaultType: 'radiofield',
                    defaults: {
                        flex: 1
                    },
                    layout: 'hbox',
                    items: [
                        {
                            boxLabel: '是的[系统保留角色一旦添加后不可以删除]',
                            name: 'reserved',
                            checked: false,
                            tooltip: '系统保留角色一旦添加后不可以删除',
                            inputValue: true,
                        }, {
                            boxLabel: '不是[添加后可删除]',
                            name: 'reserved',
                            checked: true,
                            inputValue: false,
                        }
                    ]
                }
            ]

        }]);

    }
});
