Ext.define('luter.combo.ResType', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.restypeCombo',
    xtype: 'restypeCombo',
    displayField: 'name',
    valueField: 'value',
    fieldLabel: '资源类型',
    labelAlign: 'right',
    emptyText: '请选择',
    queryMode: 'local',
    store: Ext.create('Ext.data.Store', {
        fields: ['name', 'value', 'tip'],
        data: [{
            "name": "系统菜单",
            "value": 'menu',
            "tip": '系统左侧导航菜单，可以展开，有下级'
        }, {
            "name": "功能模块",
            "value": 'module',
            "tip": '系统左侧功能导航菜单，点击后可以跳转到对应功能模块'
        }, {
            "name": "操作权限",
            "value": 'perm',
            "tip": '代表操作权限，对应后台一个URI,一般是按钮操作或者获取列表数据操作'
        }]
    }),
    triggerAction: 'all',
    editable: false,
    listConfig: {
        emptyText: '<span style="color:red">没有找到匹配数据</span>',
        getInnerTpl: function () {
            return '<b>{name}</b><br><font size=\"1\" color=\"blue\">{tip}</font>';
        }
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

    }
});
