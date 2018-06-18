Ext.define('luter.store.CatStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'luter.model.CatModel',
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
            read: 'pet/cat/list'
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
