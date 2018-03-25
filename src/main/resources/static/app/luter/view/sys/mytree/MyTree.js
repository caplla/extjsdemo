Ext.define('luter.view.sys.mytree.MyTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treelistview',
    width: 300,
    store: 'MyTreeStore',
    initComponent: function () {
        var me = this;
        me.tools = [{
            type: 'refresh',
            tooltip: '刷新资源数列表',
            handler: function () {
                me.getStore().load();
            }
        }, {
            type: 'collapse',
            tooltip: '收起',
            handler: function () {
                me.collapseAll();
            }
        },{
            type: 'expand',
            tooltip: '全部展开',
            handler: function () {
                me.expandAll();
            }
        }]
        me.columns = [{
            xtype: 'treecolumn',
            text: '节点的名字',
            dataIndex: 'title',
            width: 350,
            sortable: true
        }, {
            text: '节点的图标',
            dataIndex: 'iconcls',
            flex: 1,
            renderer: function (v) {
                return '<i class="fa ' + v + '"></i>';
            },
            sortable: true
        }]
        me.callParent(arguments);
    }
});
