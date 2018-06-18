Ext.define('luter.view.sys.role.RoleEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.roleeditview',
    requires: [],
    constrain: true,
    modal: true,
    maximizable: true,
    iconCls: baseConfig.appicon.update,
    layout: "fit",
    width: 700,
    height: 500,
    minWidth: 500,
    minHeight: 400,
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'form',
            width: 700,
            height: 500,
            minWidth: 500,
            minHeight: 400,
            layout: 'form',

            fieldDefaults: {
                labelAlign: 'right',
                labelStyle: 'font-weight:bold;'
            },
            border: false
        }]
        me.buttons = ['->', {
            text: '修改',
            cls: 'green-btn',
            iconCls: baseConfig.appicon.add,
            handler: function () {
                var form = this.down('form');
                if (form.isValid()) {
                    form.submit({
                        url: 'sys/role/update',
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
                    xtype: "hidden",
                    fieldLabel: baseConfig.model.role.id,
                    name: 'id',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    allowBlank: false,
                    flex: 1
                },


                {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.role.name,
                    name: 'name',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    allowBlank: false,
                    flex: 1
                }, {
                    xtype: "textarea",
                    fieldLabel: baseConfig.model.role.remarks,
                    name: 'remarks',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    allowBlank: false,
                    flex: 1
                },
            ]

        }]);

    }
});
