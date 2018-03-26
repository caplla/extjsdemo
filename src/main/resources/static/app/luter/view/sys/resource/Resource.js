Ext.define('luter.view.sys.resource.Resource', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.resourceview',
    layout: 'border',
    requires: ['luter.view.sys.resource.ResourceList'],
    initComponent: function () {
        var me = this;
        this.items = [{
            region: 'north',
            xtype: "panel",
            layout: 'fit',
            html: ''
        }, {
            region: 'center',
            xtype: "resourcetreeview",
            layout: 'fit'
        }]
        me.callParent();
    }
})
