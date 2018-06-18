Ext.define('luter.view.test.Test', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.testview',
    layout: 'form',
    requires: [],
    border: false,
    title: '测试',
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: "textfield",
            fieldLabel: '合同编号',
            name: 'aaa',
            plugins: [Ext.create('luter.ux.InputTextMask', {
                mask: '(999)999-9999',
                clearWhenInvalid: true
            })],
            itemId: 'test1',
            allowBlank: true,
            flex: 1
        }, {
            xtype: "textfield",
            fieldLabel: '固定电话',
            name: 'aaa',
            plugins: [Ext.create('luter.ux.InputTextMask', {
                mask: 'AA-AAAA',
                clearWhenInvalid: true
            })],
            itemId: 'test2',
            allowBlank: true,
            flex: 1
        },   {
            xtype: 'button',
            text: '取值',
            handler: function () {
                toast(getCmpByItemId('test1').getRawValue())

            }
        }]
        me.callParent(arguments);
    }
});
