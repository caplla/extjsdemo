Ext.define('luter.view.${modulename}.${cnamexx}.${cnamedx}', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.${cnamexx}view',
    layout: 'fit',
    requires: ['luter.combo.YesNo','luter.view.${modulename}.${cnamexx}.${cnamedx}List'],
    border: false,
    title:'模块标题',
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: '${cnamexx}listview',
            layout: 'fit'

        }]
        //store
        Ext.create('luter.store.${cnamedx}Store', {
            storeId: '${cnamedx}Store'
        })
        me.callParent(arguments);
    }
});
