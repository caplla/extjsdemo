Ext.define('luter.store.UserStore', {
    extend: 'Ext.data.Store',
    autoLoad: true,//默认自动加载数据
    model: 'luter.model.UserModel',
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
            read: '/app/testdata/users.json'
        },
        reader: {
            type: 'json',
            root: 'root',
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
