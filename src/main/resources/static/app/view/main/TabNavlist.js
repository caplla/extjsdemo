/**
 * 采用extjs6的list tree组件构建一个导航菜单
 */
Ext.define('luter.view.main.TabNavlist', {
    extend: 'Ext.list.Tree',
    alias: 'widget.tabnavlist',
    width: 240,
    minWidth: 180,
    frame: true,
    border: true,
    split: false,
    expanderFirst: false,
    expanderOnly: false,
    highlightPath: true,
    itemId: 'navigationTreeList',
    ui: 'navigation',
    store: Ext.create("luter.store.NavTreeStore", {
        storeId: 'NavTreeStore'
    }),
    listeners: {
        painted: function (treelistEl) {
            var treelist = treelistEl.component;
            //第一个选中
            treelist.setSelection(treelist.getStore().getRoot().firstChild);
            //根据ID选中
            // treelist.setSelection(treelist.getStore().getRoot().findChild('id', 0, true));
        },
        itemclick: throttle(function (el, record, opt) {
            var nodeData = record.node.data;
            var ContentPanel = Ext.getCmp('SysContentPanel');
            if (nodeData.leaf) {
                addTab(nodeData);
            } else {
                console.log('tree node expand')
            }
        }, 100)
    },
    initComponent: function () {
        this.callParent(arguments);
    }
});

/**
 * 防止不停点击造成的频繁加载
 * @param fn 要执行的函数
 * @param delay 延迟多久生效
 * @returns {Function}
 */
function throttle(fn, delay) {
    var timer = null;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
};
