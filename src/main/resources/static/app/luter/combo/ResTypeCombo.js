Ext.define('luter.combo.ResTypeCombo', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.restypecombo',
    xtype: 'restypecombo',
    displayField: 'text',
    valueField: 'value',
    labelAlign: 'right',
    emptyText: '请选择',
    queryMode: 'local',
    store: Ext.create('Ext.data.Store', {
        fields: ['text', 'value'],
        data: [{
            "text": "菜单",
            "value": 'menu'
        }, {
            "text": "模块",
            "value": 'module'
        }, {
            "text": "权限",
            "value": 'perm'
        }]
    }),
    triggerAction: 'all',
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

    }
})
;
