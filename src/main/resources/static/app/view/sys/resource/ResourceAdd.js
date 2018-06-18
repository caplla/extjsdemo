Ext.define('luter.view.sys.resource.ResourceAdd', {
    extend: 'Ext.window.Window',
    alias: 'widget.resourceaddview',
    requires: [],
    constrain: true,
    modal: true,
    maximizable: true,
    iconCls: baseConfig.appicon.add,
    layout: "fit",
    width: 700,
    height: 500,
    minWidth: 550,
    minHeight: 400,
    title: '添加数据',
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'form',
            width: 650,
            height: 450,
            minWidth: 500,
            minHeight: 350,
            layout: 'form',
            fieldDefaults: {
                labelAlign: 'right',
                labelStyle: 'font-weight:bold;'
            },
            border: false,
            referenceHolder: true,
            viewModel: true,
        }]
        me.buttons = ['->', {
            text: '新增',
            cls: 'green-btn',
            iconCls: baseConfig.appicon.add,
            handler: function () {
                var form = this.down('form');
                if (form.isValid()) {
                    form.submit({
                        url: 'sys/resource/add',
                        method: 'POST',
                        waitTitle: "提示",
                        waitMsg: '正在提交数据，请稍后 ……',
                        success: function (form, action) {
                            me.close();
                            DealAjaxResponse(action.response);
                            Ext.getStore('ResourceStore').load();
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
            items: [{
                xtype: 'hidden',
                name: 'pid',
                value: config.pid
            }, {
                xtype: "displayfield",
                fieldLabel: baseConfig.model.resource.pid,
                value: config.pname,
                allowBlank: false,
                flex: 1
            }, {
                xtype: "restypeCombo",
                fieldLabel: baseConfig.model.resource.res_type,
                name: 'res_type',
                publishes: 'value',
                value: config.res_type,
                reference: 'res_type',
                allowBlank: false,
                flex: 1
            }, {
                xtype: "yesnoCombo",
                fieldLabel: baseConfig.model.resource.ishref,
                name: 'ishref',
                publishes: 'value',
                reference: 'ishref',
                bind: {
                    visible: '{res_type.value=="module"}',
                    allowBlank: '{res_type.value=="module"}',
                    value: '{res_type.value!="perm"}'
                },
                setAllowBlank: function (value) {
                    this.allowBlank = !value
                },
                flex: 1
            },
                {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.href,
                    name: 'href',
                    maxLength: 250,
                    bind: {
                        visible: '{res_type.value=="module"&&ishref.value==true}',
                        allowBlank: '{res_type.value=="module"&&ishref.value==true}'
                    },
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    setAllowBlank: function (value) {
                        this.allowBlank = !value
                    },
                    flex: 1
                }, {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.name,
                    name: 'name',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    allowBlank: false,
                    flex: 1
                },
                {
                    xtype: "hidden",
                    fieldLabel: baseConfig.model.resource.reversed,
                    name: 'reversed',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    value: 1,
                    allowBlank: false,
                    flex: 1
                },
                {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.tip,
                    name: 'tip',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    allowBlank: false,
                    flex: 1
                },
                {
                    xtype: "iconCombo",
                    fieldLabel: baseConfig.model.resource.icon,
                    name: 'icon',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    allowBlank: false,
                    flex: 1
                }, {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.uri,
                    name: 'uri',
                    maxLength: 250,
                    bind: {
                        visible: '{res_type.value=="perm"}',
                        allowBlank: '{res_type.value=="perm"}'
                    },
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    setAllowBlank: function (value) {
                        this.allowBlank = !value
                    },
                    flex: 1
                },

                {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.module,
                    name: 'module',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    bind: {
                        visible: '{res_type.value=="module"&&ishref.value==false}',
                        allowBlank: '{res_type.value=="module"&&ishref.value==false}'
                    },
                    setAllowBlank: function (value) {
                        this.allowBlank = !value
                    },
                    flex: 1
                },

                {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.resource.perm,
                    name: 'perm',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    bind: {
                        visible: '{res_type.value=="perm"}',
                        allowBlank: '{res_type.value=="perm"}'
                    },
                    setAllowBlank: function (value) {
                        this.allowBlank = !value
                    },
                    flex: 1
                }


            ]

        }]);

    }
});
