Ext.define('luter.view.pet.cat.CatEdit', {
    extend: 'Ext.window.Window',
    alias: 'widget.cateditview',
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
    title: '修改',
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
                        url: 'pet/cat/update',
                        method: 'POST',
                        waitTitle: "提示",
                        waitMsg: '正在提交数据，请稍后 ……',
                        success: function (form, action) {
                            me.close();
                            DealAjaxResponse(action.response);
                            Ext.getStore('CatStore').load();
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
                    fieldLabel: baseConfig.model.cat.id,
                    name: 'id',
                    allowBlank: false,
                    flex: 1
                },
                {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.cat.remarks,
                    name: 'remarks',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    minLength: 2,
                    minLengthText: '请输入{0}个字以内',
                    afterLabelTextTpl: '',
                    labelAttrTpl: 'data-qtip="悬停提示信息"',
                    allowBlank: false,
                    flex: 1
                },
                {
                    xtype: "numberfield",
                    fieldLabel: baseConfig.model.cat.age,
                    name: 'age',
                    allowDecimals: false,
                    decimalPrecision: 0,
                    emptyText: '',
                    minValue:0,
                    minText:'不能小于{0}',
                    maxValue : 50,
                    maxText:'不能大于{0}',
                    labelAttrTpl: 'data-qtip="悬停提示信息"',
                    afterLabelTextTpl: '',
                    allowBlank: false,
                    flex: 1
                },
                {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.cat.name,
                    name: 'name',
                    maxLength: 250,
                    emptyText: '',
                    afterLabelTextTpl: '',
                    minLength: 2,
                    minLengthText: '请输入{0}个字以内',
                    labelAttrTpl: 'data-qtip="悬停提示信息"',
                    maxLengthText: '请输入{0}个字以内',
                    allowBlank: false,
                    flex: 1
                }
            ]

        }]);

    }
});
