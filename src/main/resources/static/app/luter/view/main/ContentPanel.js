/*
 *系统主页面TabPanel面板
 */
Ext.define('luter.view.main.ContentPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.syscontentpanel',
    border: false,
    requires: ['luter.view.main.Index'],
    // plugins: [Ext.create('luter.ux.TabCloseMenu', {//用到了一个tab右键关闭插件
    //     closeTabText: '关闭当前页',
    //     closeOthersTabsText: '关闭其他页',
    //     closeAllTabsText: '关闭所有页',
    //     closeIcon: +' fa fa-remove red-color',
    //     closeOtherIcon: ' fa fa-remove red-color',
    //     closeAllIcon: 'fa fa-remove red-color',
    // })],
    items: [{
        id: 'dashboardpanel',
        title: 'DASHBOARD',
        baseCls: 'home-body',
        closeable: false,
        layout: 'fit',
        glyph: 42, items: [
            {
                xtype: 'indexview',
            }
        ]
    }]

});
