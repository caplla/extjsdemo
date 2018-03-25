Ext.define('luter.controller.sys.UserController', {
    extend: 'Ext.app.Controller',
    stores: ['UserStore'], //用户store
    views: ['sys.user.User'], //视图定义，默认会加载第一个视图作为主视图
    init: function () {
        this.control({
            'userlistview': {
                'beforerender': function (view) {
                    console.log("beforerender   list......   ");
                },
                'afterrender': function (view) {
                    console.log("afterrender   list......   ");
                    // this.getUserStoreStore().load();//如果UserStore里没设置autoLoad: true,就可以在这里加载用户数据
                }
            }
        });

    }
});
