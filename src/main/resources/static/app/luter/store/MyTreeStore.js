Ext.define('luter.store.MyTreeStore', {
    extend: 'Ext.data.TreeStore',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/showcase/tree/async',
        reader: {
            type: 'json',
            root: 'children',
            successProperty: 'success'
        },
        actionMethods: {
            read: 'GET'
        },
        root:'0',
        listeners: {
            exception: function (proxy, response, operation, eOpts) {
                DealAjaxResponse(response);
            }
        }
    },
    root: {
        title:'异步树他爹',
        id: '0',
        expanded: true
    }

});
