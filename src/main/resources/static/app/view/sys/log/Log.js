Ext.define('luter.view.sys.log.Log', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.logview',
    layout: 'fit',
    requires: ['luter.combo.YesNo','luter.view.sys.log.LogList'],
    border: false,
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'loglistview',
            layout: 'fit'

        }]
        //store
        Ext.create('luter.store.LogStore', {
            storeId: 'LogStore'
        })
        me.callParent(arguments);
    }
});
