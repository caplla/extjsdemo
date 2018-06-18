/**
 * 主视图占满全屏是个viewport
 */
Ext.define('luter.view.main.TabViewPort', {
    extend: 'Ext.Viewport',
    alias: 'widget.tabviewport', //别名，与xtype对应
    layout: 'border', //东南西北中布局，边界嘛
    stores: [],
    requires: ['luter.view.main.TabHeader', 'luter.view.main.Footer', 'luter.view.main.TabNavlist'],
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: [{
                region: 'west',
                id: 'WestPanel',
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretchmax'
                },
                listeners: {
                    collapse: function () {
                        Ext.getCmp('menuToggleButton').setHtml('<i onclick="toggleWestPanel(this)" style="font-size: 20px;margin-left: 10px;color: #000" class="fa fa-arrow-right"></i>')
                    },
                    expand: function () {
                        Ext.getCmp('menuToggleButton').setHtml('<i onclick="toggleWestPanel(this)" style="font-size: 20px;margin-left: 10px;color: #000" class="fa fa-arrow-left"></i>')
                    }
                },
                items: [

                    {
                        xtype: 'panel',
                        flex: 1,
                        height: 52,
                        bodyStyle: {
                            'backgroundColor': '#495060'
                        },
                        cls: 'bordered'
                    },


                    {
                        flex: 18,
                        // cls: 'wave',
                        xtype: 'tabnavlist'
                    }]

            }, {
                region: 'center',
                layout: 'border',
                items: [{
                    region: 'north',
                    xtype: 'apptabheader',
                }, {
                    region: 'center',
                    id: 'SysContentPanel',
                    layout: 'fit',
                    autoScroll: true,//自动产生滚动条
                    // padding: '3 0 1 0',
                    // cls: 'home-body',//通过css设置
                    style: {
                        backgroundColor: 'black'
                    },
                    xtype: 'tabpanel',
                    plugins: [Ext.create('luter.ux.TabCloseMenu', {//用到了一个tab右键关闭插件
                        closeTabText: '关闭当前页',
                        closeOthersTabsText: '关闭其他页',
                        closeAllTabsText: '关闭所有页',
                        closeIcon: ' fa fa-remove red-color',
                        closeOtherIcon: ' fa fa-remove red-color',
                        closeAllIcon: 'fa fa-remove red-color',
                    })],
                    items: [{
                        title: '首页',
                        closeable: false,
                        id: 'tab-main.Index',
                        layout: 'fit',
                        glyph: 42,
                        items: [
                            Ext.create('luter.view.main.Index')
                        ]
                    }],
                    listeners: {
                        beforeremove: function (panel, item, eOpts) {
                            console.log('will   remove  the tab :' + item.id)
                        },

                    }

                },


                    {
                        region: 'south',
                        xtype: 'sysfooter'
                    }]

            }]
        });
        me.callParent(arguments);
    }
});

/**
 * 往中间tabpanel加入tab
 * @param
 *
 * {
                                    "id": 5,
                                    "text": "个人中心",
                                    "ishref": false,
                                    "href": null,
                                    "leaf": true,
                                    "iconCls": " x-fa fa-chain-broken",
                                    "qtip": "个人中心",
                                    "module": "sys.user.UserProfile",
                                    "pid": 1,
                                    "expanded": true,
                                }

 *
 *
 * @returns {boolean}
 */
function addTab(config) {
    var ContentPanel = Ext.getCmp('SysContentPanel');
    var tabcount = ContentPanel.items.getCount();
    var maxTabCount = 10;
    var moduleID = config.module; //找到控制器ID,定义在tree的数据里modole_id
    var isUrl = config.ishref;
    var view = null;
    if (isUrl || isUrl == true) {
        view = Ext.create('luter.ux.IFrame', {
            scroll: 'yes',
            src: config.href
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
        var tabid = 'tab-' + moduleID;
        console.log('add tab:' + tabid + ' to tabpanel.....')
        var notab = ContentPanel.getComponent(tabid);
        if (!notab && null == notab) {
            //新建之前判断一下打开了多少
            if (tabcount && tabcount > maxTabCount) {
                showFailMesg({
                    title: '您打开的页面过多',
                    msg: '为了更好的使用体验，同时允许打开5个tab页面，您打开的页面过多，请关掉一些!'
                });
                return false;
            }
            notab = ContentPanel.add(Ext.create('Ext.panel.Panel', {
                tooltip: config.text + ':' + config.qtip,
                id: tabid, // tab的唯一id
                title: config.text, // tab的标题
                layout: 'fit', // 填充布局,它不会让load进来的东西改变大小
                border: false, // 无边框
                autoScroll: true,
                closable: true, // 有关闭选项卡按钮
                iconCls: config.iconCls,
                listeners: {
                    // 侦听tab页被激活里触发的动作
                    scope: this,
                    destroy: function () {
                        console.log("tab :" + tabid + ",has been destroyed")
                    }
                },
                items: [view]
            }));
            //新建之后focus
            ContentPanel.setActiveTab(notab);
        }
        else {//存在设置focus
            ContentPanel.setActiveTab(notab);
        }
    } else {
        showFailMesg({
            msg: '加载模块视图失败，模块ID:' + moduleID
        });
        return false;
    }
}