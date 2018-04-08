Ext.define('luter.view.showcase.mytree.AllTree', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.treelisttab',
    width: 300,
    initComponent: function () {
        var me = this;
        me.items = [{
            title: '点哪个节点，就展开哪个节点，这叫:异步加载树',
            baseCls: 'home-body',
            closeable: false,
            layout: 'fit',
            items: [
                Ext.create('luter.view.showcase.mytree.MyTree')
            ]
        }, {
            title: '页面加载的时候一次性把一整个树的数据全加载了叫:同步加载树',
            baseCls: 'home-body',
            closeable: false,
            layout: 'fit',
            items: [
                Ext.create('luter.view.showcase.mytree.SyncTree')
            ]
        }]
        me.callParent(arguments);
    }
});
