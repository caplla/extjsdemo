Ext.define('luter.store.CatStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,//默认自动加载数据
    model: 'luter.model.CatModel',
    pageSize: 15,
    remoteSort: true,
    sortOnLoad: true,
    proxy: {
        type: 'ajax',
        batchActions: true,//默认批量
        // paramsAsJson: true,
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'POST',
            destroy: 'POST'
        },
        api: {
            read: '/showcase/cat/list',
            create: '/showcase/cat/add/batch',//store.sync()会调用这个
            update: '/showcase/cat/update',
            destroy: '/showcase/cat/delete'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty: 'total'
        },
        writer: {
            allowSingle: false,
            writeAllFields: true,
            type: 'json'
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
