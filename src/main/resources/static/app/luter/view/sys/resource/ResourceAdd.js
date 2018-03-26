/**
 * Created by clt on 15/12/13.
 */
Ext.define('luter.view.sys.resource.ResourceAdd', {
    extend: 'Ext.window.Window',
    alias: 'widget.resourceaddview',
    requires: ['luter.combo.ResTypeCombo'],
    constrain: true,
    modal: true,
    iconCls: baseConfig.appicon.add,

    layout: "fit",
    viewModel: {
        data: {
            title: ''
        }
    },
    bind: {
        title: '新增系统资源:  ' + '{title}'
    },
    initComponent: function () {
        var me = this;
        this.items = [{
            xtype: 'form',
            width: 700,
            fieldDefaults: {
                labelAlign: 'right',
                labelStyle: 'font-weight:bold;'
            },
            autoHeight: true,
            border: false
        }]
        this.buttons = ['->', {
            text: '新增',
            iconCls: baseConfig.appicon.add,
            tooltip: '保存',
            handler: function () {
                var form = this.down('form');
                var win = this;
                if (form.isValid()) {
                    form.submit({
                        url: '/resource/create',
                        method: 'POST',
                        waitTitle: "提示",
                        waitMsg: '正在提交数据，请稍后 ……',
                        success: function (form, action) {
                            win.close();
                            DealAjaxResponse(action.response);
                            Ext.StoreManager.lookup('Resource').reload();
                        },
                        failure: function (form, action) {
                            DealAjaxResponse(action.response);

                        }
                    });
                } else {
                    showFailMesg({
                        msg: '请检查输入是否完整和正确！'
                    });
                }
            },
            scope: this
        }, '-', {
            text: '放弃',
            iconCls: baseConfig.appicon.undo,
            tooltip: '放弃',
            handler: function () {

                this.close();
            },
            scope: this
        }];

        me.callParent(arguments);
    },
    loadView: function (config) {
        var formCmp = this.getComponent(0);
        formCmp.add([{
            xtype: 'fieldset',
            collapsible: false,
            title: '资源信息',
            layout: "column",
            items: [{
                columnWidth: 1,
                layout: "form",
                border: false,
                items: [{
                    xtype: "displayfield",
                    fieldLabel: '上级名称',
                    value: config.pname,
                    allowBlank: false,
                    flex: 1
                }, {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.pid,
                    name: 'pid',
                    readOnly: true,
                    value: config.parent_id,
                    allowBlank: false,
                    flex: 1
                }, {
                    xtype: "restypecombo",
                    fieldLabel: baseConfig.model.resource.resource_type,
                    name: 'resource_type',
                    value: config.ptype,

                    allowBlank: false,
                    readOnly: config.readO || false,
                    flex: 1
                }, {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.text,
                    name: 'text',
                    bind: '{title}',
                    allowBlank: false,
                    flex: 1
                }, {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.module_id,
                    name: 'module_id',
                    allowBlank: true,
                    flex: 1
                }, {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.href,
                    name: 'href',
                    allowBlank: true,
                    flex: 1
                }, {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.qtip,
                    name: 'perm',
                    allowBlank: true,
                    flex: 1
                }, {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.iconCls,
                    name: 'iconCls',
                    allowBlank: true,
                    flex: 1
                }]
            }]
        }]);
    }

})
