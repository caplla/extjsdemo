/**
 * Created by clt on 15/12/6.
 */
Ext.define('luter.store.ResourceStore', {
    extend: 'Ext.data.TreeStore',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/resource/tree/async',
        reader: {
            type: 'json',
            root: 'children',
            successProperty: 'success'
        },
        root: '0',
        actionMethods: {
            read: 'GET'
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
        expanded: true
    },
    listeners: {
        beforeload: function (store, operation, eOpts) {
            if (store.isLoading()) return false;
        },
        nodeappend: function (me, node, index, eOpts) {
            //加载之前
            if (!node.isRoot()) {
                node.set('iconCls', node.get('iconCls') + '  red-color');
                node.set('qtip', node.get('remarks'));
                node.set('leaf', node.get('type') == 'perm');
            }

        }
    }

});
