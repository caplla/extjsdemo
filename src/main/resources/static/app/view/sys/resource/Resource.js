Ext.define('luter.view.sys.resource.Resource', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.resourceview',
    layout: 'fit',
    requires: ['luter.combo.YesNo', 'luter.view.sys.resource.ResourceList'],
    border: false,
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'resourcelistview',
            layout: 'fit'

        }]
        //store
        Ext.create('luter.store.ResourceStore', {
            storeId: 'ResourceStore'
        })
        me.callParent(arguments);
    }
});
