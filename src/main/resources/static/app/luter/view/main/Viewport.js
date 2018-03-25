/**
 * 主视图占满全屏是个viewport
 */
Ext.define('luter.view.main.ViewPort', {
    extend: 'Ext.Viewport',
    alias: 'widget.viewport',//别名，与xtype对应
    layout: 'border',//东南西北中布局，边界嘛
    stores: [],
    requires: ['luter.view.main.Header', 'luter.view.main.Footer', 'luter.view.main.Navlist', 'luter.view.main.ContentPanel'],
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: [{
                region: 'north',
                xtype: 'appheader'
            }, {
                region: 'west',
                xtype: 'navlist'
            }, {
                region: 'center',
                id:'systabpanel',
                xtype: 'syscontentpanel'

            }, {
                region: 'south',
                xtype: 'sysfooter'
            }]
        });
        me.callParent(arguments);
    }
});