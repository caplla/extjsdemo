/**
 * 采用extjs6的list tree组件构建一个导航菜单
 */
Ext.define('luter.view.main.Navlist', {
    extend: 'Ext.list.Tree',
    alias: 'widget.navlist',
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
                var moduleID = nodeData.module; //找到控制器ID,定义在tree的数据里modole_id
                var isUrl = nodeData.ishref;
                var view = null;
                if (isUrl || isUrl == true) {
                    view = Ext.create('luter.ux.IFrame', {
                        scroll: 'yes',
                        src: nodeData.href
                    });
                } else {
                    if (!moduleID || moduleID == '') {
                        showFailMesg({
                            title: '创建模块失败.',
                            msg: '模块加载错误，模块id为空，创建模块失败'
                        });
                        return false;
                    }
                    view = Ext.create("luter.view." + moduleID);
                }
                if (view) {
                    ContentPanel.removeAll(true, true);
                    ContentPanel.add(view);
                } else {
                    showFailMesg({
                        msg: '加载模块视图失败，模块ID:' + moduleID
                    });
                    return false;
                }

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
