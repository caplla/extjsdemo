/**
 * Created by clt on 15/12/16.
 */
Ext.define('luter.store.SyncTreeStore', {
    extend: 'Ext.data.TreeStore',
    fields: ['id', 'text', 'leaf', 'iconCls', 'tips', 'href'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/tree/sync',
        reader: {
            type: 'json',
            root: 'children',
            successProperty: 'success'
        },

        actionMethods: {
            read: 'GET'
        }
    }, root: {
        text: '同步树他爹',
        id: '0',
        leaf: false,
        expanded: true
    },

    listeners: {
        nodeappend: function (me, node, index, eOpts) {
            //加载之前改变图标颜色
            if (!node.isRoot()) {
                node.set('iconCls', node.get('iconCls') + '  black-color');
            }

        }
    }
});
