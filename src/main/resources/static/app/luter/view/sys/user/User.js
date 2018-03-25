Ext.define('luter.view.sys.user.User', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.userview',
    layout: 'fit',
    requires: ['luter.view.sys.user.UserList'],
    border: false,
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'userlistview',
            layout: 'fit'

        }]
        me.callParent(arguments);
    }
});
