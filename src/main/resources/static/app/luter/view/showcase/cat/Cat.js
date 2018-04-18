Ext.define('luter.view.showcase.cat.Cat', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.showcaseCatView',
    layout: 'fit',
    requires: ['luter.view.showcase.cat.CatList'],
    border: false,
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'showcaseCatListView',
            layout: 'fit'

        }]
        me.callParent(arguments);
    }
});
