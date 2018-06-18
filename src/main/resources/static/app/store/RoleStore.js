Ext.define('luter.store.RoleStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'luter.model.RoleModel',
    pageSize: 15,
    remoteSort: true,
    sortOnLoad: true,
    storeId:'RoleStore',
    proxy: {
        type: 'ajax',
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        api: {
            read: 'sys/role/list'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty: 'count'
        },
        listeners: {
            exception: function (proxy, response, operation, eOpts) {
                DealAjaxResponse(response);
            }
        }
    },
    sortOnLoad: true,
    sorters: {
        property: 'id',
        direction: 'DESC'
    }

});
