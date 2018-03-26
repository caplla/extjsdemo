/**
 * Created by clt on 15/12/7.
 */
Ext.define('luter.view.sys.role.RoleEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.roleeditview',
    requires: [],
    constrain: true,
    modal: true,
    layout: "fit",
    iconCls: appicon.update,

    viewModel: {
        data: {
            title: ''
        }
    },
    bind: {
        title: '修改角色:' + '{title}'
    },
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            layout: 'fit',
            width: 700,
            autoHeight: true,
            items: [{
                xtype: 'form',
                width: 700,
                autoHeight: true,
                fieldDefaults: {
                    labelAlign: 'right',
                    labelStyle: 'font-weight:bold;'
                },
                border: false,
                items: [{
                    xtype: 'fieldset',
                    collapsible: false,
                    title: '基本信息',
                    layout: "column",
                    items: [{
                        columnWidth: 1,
                        layout: "form",
                        items: [
                            {
                                xtype: 'hidden',
                                fieldLabel: appmodel.role.id,
                                name: 'id',
                                allowBlank: true,
                                flex: 1
                            },
                            {
                                xtype: "textfield",
                                fieldLabel: appmodel.role.role_name,
                                name: 'role_name',
                                vtype: 'charAndCh',
                                maxLength: 30,
                                maxLengthText: '请输入{0}个字以内',
                                allowBlank: false,
                                bind: '{title}',
                                flex: 1
                            }, {
                                xtype: 'textarea',
                                fieldLabel: appmodel.role.role_desc,
                                name: 'role_desc',
                                allowBlank: true,
                                flex: 1
                            }]

                    }]
                }]
            }],

        });
        this.buttons = [{
            text: '更新',
            iconCls: appicon.update,
            tooltip: '更新',
            handler: function () {
                var form = this.down('form');
                var win = this;
                if (form.isValid()) {
                    form.submit({
                        url: 'role/update',
                        method: 'POST',
                        waitTitle: "提示",
                        waitMsg: '正在提交数据，请稍后 ……',
                        success: function (form, action) {
                            win.close();
                            DealAjaxResponse(action.response);
                            refreshGridList('roleGrid');
                        },
                        failure: function (form, action) {
                            DealAjaxResponse(action.response);
                        }
                    });
                }

            },
            scope: this
        }, '-', {
            text: '放弃',
            iconCls: appicon.undo,
            tooltip: '放弃',
            handler: function () {
                this.close();
            },
            scope: this
        }]
        me.callParent(arguments);
    }
});
