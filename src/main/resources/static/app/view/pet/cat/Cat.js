Ext.define('luter.view.pet.cat.Cat', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.catview',
    layout: 'fit',
    requires: ['luter.combo.YesNo','luter.view.pet.cat.CatList'],
    border: false,
    title:'模块标题',
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'catlistview',
            layout: 'fit'

        }]
        //store
        Ext.create('luter.store.CatStore', {
            storeId: 'CatStore'
        })
        me.callParent(arguments);
    }
});
