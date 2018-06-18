Ext.define('luter.store.${cnamedx}Store', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'luter.model.${cnamedx}Model',
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
            read: '${modulename}/${cnamexx}/list'
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
    sorters: {
        property: 'id',
        direction: 'DESC'
    }

});
