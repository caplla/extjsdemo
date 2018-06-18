Ext.define('luter.store.ResourceStore', {
    extend: 'Ext.data.TreeStore',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'sys/resource/tree/sync',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        },
        actionMethods: {
            read: 'POST'
        },
        listeners: {
            exception: function (proxy, response, operation, eOpts) {
                DealAjaxResponse(response);
            }
        }
    },
    root: {
        name: '后台系统菜单和资源',
        id: '0',
        expanded: true,
        tip: '功能菜单根节点'
    },
    listeners: {
        beforeload: function (store, operation, eOpts) {
            if (store.isLoading()) return false;
        },
        nodeappend: function (me, node, index, eOpts) {
            if (!node.isRoot()) {
                // node.set('iconCls', node.get('icon'));
                node.set('qtip', node.get('remarks'));
                node.set('leaf', node.get('res_type') == 2);
            }

        }
    }

});
