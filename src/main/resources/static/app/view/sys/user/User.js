Ext.define('luter.view.sys.user.User', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.userview',
    layout: 'fit',
    requires: ['luter.combo.YesNo', 'luter.view.sys.user.UserList'],
    border: false,
    title:'系统用户管理',
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'userlistview'
        } ]
        //store
        Ext.create('luter.store.UserStore', {
            storeId: 'UserStore'
        })
        me.callParent(arguments);
    }
});
