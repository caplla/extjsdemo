/**
 * 采用extjs6的list tree组件构建一个导航菜单
 */
Ext.define('luter.view.main.Navlist', {
    extend: 'Ext.list.Tree',
    alias: 'widget.navlist',
    width: 240,
    minWidth: 120,
    frame: true,
    border: true,
    split: false,
    expanderFirst: false,
    expanderOnly: false,
    highlightPath: true,
    itemId: 'navigationTreeList',
    ui: 'navigation',
    store: 'NavTreeStore',
    initComponent: function () {
        this.callParent(arguments);
    }
});
