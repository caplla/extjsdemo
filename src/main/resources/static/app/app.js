/**
 * 设置Extjs的动态加载路径
 */
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext': 'webjars/extjs/6.2.0/classic/',
        'Ext.ux': 'webjars/extjs/6.2.0/ux'
    }
});
/**
 * 是否开启url缓存，就是xxx.com?_dc=123123123123类似这种
 */
Ext.Ajax.disableCaching = false;
/**
 * 初始化工具提示
 */
Ext.tip.QuickTipManager.init();
var luterapp;//定义一个全局app对象，便于后续使用
Ext.application({
    name: 'luter',//这个应用叫啥，其实就是目录名字
    /**
     * 你把这个应用放哪个目录下了,控制器啊store啊view啥的，在哪里?
     * 以后定义一个叫Ext.define('luter.model.Car',{})的时候，其实就是指向了js文件:app/luter/model/Car.js
     * requiere就会动态 ajax load这个js下来
     */
    appFolder: '/app',
    init: function () {//先初始化

    },
    launch: function () {
        checkBroswerVersion();
        luterapp = this;
        sysconfig.tabmodel ? Ext.create("luter.view.main.TabViewPort") : Ext.create("luter.view.main.ViewPort")
    }

});

var yesNoCombo = Ext.create('luter.combo.YesNo')
/**
 * 给中间加内容
 * @param viewname
 */
function addCenterContent(view) {
    if (view) {
        var ContentPanel = Ext.getCmp('SysContentPanel');
        ContentPanel.removeAll(true, true);
        ContentPanel.add(view);
    } else {
        Ext.toast("创建模块失败")
    }
}
