Ext.define('luter.combo.GenderCombo', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.gendercombo',
    xtype: 'gendercombo',
    displayField: 'text',
    valueField: 'value',
    labelAlign: 'right',
    emptyText: '请选择',
    queryMode: 'local',
    store: Ext.create('Ext.data.Store', {
        fields: ['text', 'value'],
        data: [{
            "text": "男人",
            "value": 1
        }, {
            "text": "女人",
            "value": 2
        }, {
            "text": "人妖",
            "value": 3
        }, {
            "text": "不是人",
            "value": 4
        }]
    }),
    triggerAction: 'all',
    // tpl: Ext.create('Ext.XTemplate',
    //     '<tpl for=".">',
    //     '<div class="x-boundlist-item">',
    //     '<tpl if="value==true">',
    //     '<i class=" fa fa-lg fa-check"></i>{text}',
    //     '<tpl elseif="value==false">',
    //     '<i class=" fa fa-lg fa-close"></i>{text}',
    //     '<tpl else>',
    //     '<i class=" fa fa-lg fa-question"></i>{text}',
    //     '</tpl>',
    //     '</div>',
    //     '</tpl>'
    // ),
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

    }
})
;
