Ext.define('luter.store.RoleStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'luter.model.RoleModel',
    pageSize: 15,
    remoteSort: true,
    sortOnLoad: true,
    proxy: {
        type: 'ajax',
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'POST',
            destroy: 'POST'
        },
        api: {
            read: '/role/list'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty: 'total'
        },
        listeners: {
            exception: function (proxy, response, operation, eOpts) {
                DealAjaxResponse(response);
            }
        }
    },
    sorters: {
        property: 'id',
        direction: 'DESC'
    }

});
