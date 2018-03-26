Ext.define('luter.controller.MainController', {
    extend: 'Ext.app.Controller',
    views: ['main.ViewPort'],
    stores: ['NavTreeStore'],
    init: function (application) {
        var me = this;
        this.control({
            'viewport': {//监听viewport的初始化事件，可以做点其他事情在这里，如有必要，记得viewport定义里的alias么？
                'beforerender': function () {
                    console.log('viewport begin render at:' + new Date());
                },
                'afterrender': function () {
                    console.log('viewport  render finished at:' + new Date());
                },
            },
            'syscontentpanel': {
                'afterrender': function (view) {
                    console.log('syscontentpanel rendered at:' + new Date());
                }
            },
            'navlist': {
                'itemclick': function (el, record, opt) {
                    var nodeData = record.node.data;

                    var tabpanel = Ext.getCmp('systabpanel');
                    var tabcount = tabpanel.items.getCount();
                    var maxTabCount = 5;
                    if (tabcount && tabcount > 5) {
                        showFailMesg({
                            title: '为了更好的使用，最多允许打开5个页面',
                            message: '您打开的页面过多，请关掉一些!'
                        });
                        return false;
                    }
                    if (nodeData.leaf) {//是打开新模块，否则是展开树节点
                        var moduleID = nodeData.module_id;//找到控制器ID,定义在tree的数据里modole_id
                        if (!moduleID || moduleID == '') {
                            showFailMesg({
                                title: '创建模块失败.',
                                message: '模块加载错误，模块module_id为空，创建模块失败'
                            });
                            return false;
                        }
                        console.log('to add module with id:' + moduleID);
                        //开始加载控制器
                        try {
                            var module = luterapp.getController(moduleID);
                        } catch (error) {
                            showFailMesg({
                                message: '根据模块ID:' + moduleID + '创建模块失败。' +
                                '<br> 可能的原因 :<br>1、该模块当前没有实现.' +
                                '<br> 2、模块文件名称与模块名称不一致，请检查' +
                                '</br><span style="color: red">Error: ' + error + '</span>'
                            });
                            return false;
                        } finally {

                        }
                        //判断模块是否加载下来，因为是ajax加载，所以还是判断一下比较好
                        if (!module) {
                            showFailMesg({
                                message: 'B:load module fail,the module object is null.' +
                                '<br> maybe :the module is Not available now.'
                            });
                            return false;

                        }
                        //加载到之后，默认去获取控制器里views:[]数组里的第一个作为主视图
                        var viewName = module.views[0];
                        console.log('will create a tab with view ,id:' + viewName);
                        var view = module.getView(viewName);
                        console.log('get the view el:' + view);
                        if (!view) {
                            showFailMesg({
                                message: 'Sorry ,to get the module view fail...'
                            });
                            return false;
                        }

                        //判断一下这个视图是不是已经加载到tabpanel里去了
                        var tabid = me.getTabId(moduleID);
                        console.log('will create a tab with id:' + tabid);
                        var notab = tabpanel.getComponent(tabid);
                        var viewEL = view.create();
                        if (!viewEL) {
                            showFailMesg({
                                message: 'Sorry ,to get the module viewEL fail...'
                            });
                            return false;
                        }

                        if (!notab && null == notab) {//不存在新建
                            //不管是啥，都放到一个panel里面。
                            notab = tabpanel.add(Ext.create('Ext.panel.Panel', {
                                tooltip: nodeData.text + ':' + nodeData.qtip,
                                id: tabid, // tab的唯一id
                                title: nodeData.text, // tab的标题
                                layout: 'fit', // 填充布局,它不会让load进来的东西改变大小
                                border: false, // 无边框
                                closable: true, // 有关闭选项卡按钮
                                iconCls: nodeData.iconCls,
                                listeners: {
                                    // 侦听tab页被激活里触发的动作
                                    scope: this,
                                    destroy: function () {
                                        console.log("tab :" + tabid + ",has been destroyed")
                                    }
                                },
                                items: [view.create()]
                            }));
                            //新建之后focus
                            tabpanel.setActiveTab(notab);
                        }
                        else {//存在设置focus
                            tabpanel.setActiveTab(notab);
                        }
                    } else {
                        console.log('tree node expand')
                    }
                }
            }
        });
    },
    getTabId: function (mid) {
        var winid = mid;
        var c = winid.split('.');
        winid = c.pop();
        return winid + '-tab';
    }

});
