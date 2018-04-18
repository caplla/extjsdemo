Ext.define('luter.combo.CatGenderCombo', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.catgendercombo',
    xtype: 'catgendercombo',
    displayField: 'text',
    valueField: 'value',
    labelAlign: 'right',
    emptyText: '请选择',
    queryMode: 'local',
    store: Ext.create('Ext.data.Store', {
        fields: ['text', 'value'],
        data: [{
            "text": "公的",
            "value": 1
        }, {
            "text": "母的",
            "value": 2
        }, {
            "text": "看不清",
            "value": 3
        }]
    }),
    triggerAction: 'all',
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

    }
})
;
