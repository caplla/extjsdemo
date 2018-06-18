Ext.define('luter.store.UserStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'luter.model.UserModel',
    pageSize: 15,
    remoteSort: true,
    sortOnLoad: true,
    proxy: {
        type: 'ajax',
        actionMethods: {
            create: 'POST',
            read: 'POST',
            update: 'POST',
            destroy: 'POST'
        },
        api: {
            read: 'sys/user/list'
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
