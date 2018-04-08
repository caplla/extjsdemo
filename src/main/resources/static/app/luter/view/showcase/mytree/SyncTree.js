Ext.define('luter.view.showcase.mytree.SyncTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.synctreelistview',
    width: 300,
    store: 'SyncTreeStore',
    rootVisible: true,
    lines: false,
    useArrows: true,
    collapseFirst: false,
    minWidth: 200,
    frame: true,
    bufferedRenderer: true,
    initComponent: function () {
        var me = this;
        me.columns = [{
            xtype: 'treecolumn',
            flex: 1,
            sortable: false,
            dataIndex: 'text'

        }]
        Ext.apply(this, {
            tools: [{
                type: 'expand',
                tooltip: '展开',
                handler: function () {
                    me.expandAll();
                }
            }, {
                type: 'collapse',
                tooltip: '收起',
                handler: function () {
                    me.collapseAll();
                }
            }]
        })
        me.callParent(arguments);
    }
});
