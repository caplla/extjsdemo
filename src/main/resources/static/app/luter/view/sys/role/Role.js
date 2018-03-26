Ext.define('luter.view.sys.role.Role', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.roleview',
    layout: 'fit',
    requires: ['luter.view.sys.role.RoleAuthView'],
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            border: false,
            items: [{
                iconCls: baseConfig.appicon.role,
                xtype: "roleauthview"
            }]
        });
        me.callParent();
    }
});
