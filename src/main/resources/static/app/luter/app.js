/**
 * 设置Extjs的动态加载路径
 */
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext': '/app/vendor/extjs/6.2.0',
        'Ext.ux': '/app/vendor/extjs/6.2.0/ux'
    }
});
/**
 * 是否开启url缓存，就是xxx.com?_dc=123123123123类似这种
 */
Ext.Ajax.disableCaching = false;
/**
 * 初始化工具提示
 */
Ext.QuickTips.init();
var luterapp;//定义一个全局app对象，便于后续使用
Ext.application({
    name: 'luter',//这个应用叫啥，其实就是目录名字
    /**
     * 你把这个应用放哪个目录下了,控制器啊store啊view啥的，在哪里?
     * 以后定义一个叫Ext.define('luter.model.Car',{})的时候，其实就是指向了js文件:app/luter/model/Car.js
     * requiere就会动态 ajax load这个js下来
     */
    appFolder: '/app/luter',
    init: function () {//先初始化
        console.log('init')
    }, launch: function () {//发射！
        console.log('launch')
        luterapp = this;
        this.loadModule({
            moduleId: 'MainController'
        });
        var module = this.getController('MainController');//加载这个控制器
        var viewName = module.views[0];//获取到这个控制器里的第一个view名字
        var view = module.getView(viewName);//获取到这个view,本质上就是加载js文件
        view.create();//创建这个view
    },
    /**
     * 动态加载控制器
     * @param config
     * @returns {boolean}
     */
    loadModule: function (config) {
        if (!Ext.ClassManager.isCreated(config.moduleId)) {
            console.log('controller:' + config.moduleId + "  is not load ,now load in.....");
            try {
                var module = luterapp.getController(config.moduleId);
            } catch (error) {
                showFailMesg({
                    message: ':<> O!   No:load module fail,the module object is null.' +
                    '<br> maybe :the module is Not available now.' +
                    '</br>Error: ' + error
                });
                return false;
            } finally {

            }

        }

    },
    addTab: function (config) {
        var tabpanel = Ext.getCmp('systabpanel');
        var tabcount = tabpanel.items.getCount();
        var maxTabCount = 5;
        if (tabcount && tabcount > maxTabCount) {
            showFailMesg({
                title: '为了更好的使用，最多允许打开5个页面',
                message: '您打开的页面过多，请关掉一些!'
            });
            return false;
        }
        var notab = tabpanel.getComponent(config.id);
        if (!notab && null == notab) {//不存在新建
            //不管是啥，都放到一个panel里面。
            notab = tabpanel.add(Ext.create('Ext.panel.Panel', {
                tooltip: config.text + ':' + config.qtip,
                id: config.id, // tab的唯一id
                title: config.text, // tab的标题
                layout: 'fit', // 填充布局,它不会让load进来的东西改变大小
                border: false, // 无边框
                closable: true, // 有关闭选项卡按钮
                iconCls: config.iconCls,
                listeners: {
                    // 侦听tab页被激活里触发的动作
                    scope: this,
                    destroy: function () {
                        console.log("tab :" + config.id + ",has been destroyed")
                    }
                },
                items: config.items
            }));
            //新建之后focus
            tabpanel.setActiveTab(notab);
        }
        else {//存在设置focus
            tabpanel.setActiveTab(notab);
        }
    }
});

