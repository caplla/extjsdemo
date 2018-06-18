Ext.define('luter.view.sys.role.Role', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.roleview',
    layout: 'border',
    requires: ['luter.model.UserModel','luter.view.sys.role.RoleList', 'luter.view.sys.role.RoleUserList'],
    border: false,
    initComponent: function () {
        var me = this;
        //store
        Ext.create('luter.store.RoleStore', {
            storeId: 'RoleStore'
        })
        Ext.create('Ext.data.Store', {
            storeId: 'RoleUserStore',
            autoLoad: false,
            pageSize: 15,
            remoteSort: true,
            sortOnLoad: true,
            model: 'luter.model.UserModel',
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'POST',
                    update: 'POST',
                    destroy: 'POST'
                },
                api: {
                    read: 'sys/role/users'
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    successProperty: 'success',
                    totalProperty: 'count'
                }
            },
            sortOnLoad: true,
            sorters: {
                property: 'id',
                direction: 'DESC'
            }
        })

        me.items = [{
            xtype: 'rolelistview',
            layout: 'fit',
            region: 'center',
            id:'roleGrid',
            title: '角色列表',
            flex: 5

        }, {
            xtype: 'roleuserlistview',
            title: '角色用户',
            region: 'east',
            id: 'roleUserGrid',
            width: 300,
            minWidth: 200,
            collapsed: true,
            collapseMode: 'mini',
            collapsible: true,
            split: true,
            flex: 3
        }]

        me.callParent(arguments);
    }
});
