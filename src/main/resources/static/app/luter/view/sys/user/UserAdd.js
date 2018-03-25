Ext.define('luter.view.sys.user.UserAdd', {
    extend: 'Ext.window.Window',//扩展window组件
    alias: 'widget.useraddview',
    requires: [],
    constrain: true,//约束窗体弹出，别出浏览器可视范围
    modal: true,//模态
    maximizable: true,//可以最大化
    iconCls: baseConfig.appicon.add,//图标
    layout: "fit",//自适应布局
    width: 700,
    autoHeight: true,//自适应高度
    viewModel: {
        data: {
            title: ''
        }
    },
    bind: {
        title: '新增用户:  ' + '{title}'//绑定这个空间的title属性上
    },
    initComponent: function () {
        var me = this;
        //加入一个表单，表单内元素通过loadView方法添加
        me.items = [{
            xtype: 'form',
            width: 700,
            autoHeight: true,
            fieldDefaults: {
                labelAlign: 'right',
                labelStyle: 'font-weight:bold;'
            },
            border: false
        }]
        //操作按钮直接加载window上
        me.buttons = ['->', {
            text: '新增',
            cls: 'green-btn',
            iconCls: baseConfig.appicon.add,
            handler: function () {
                var form = this.down('form');
                if (form.isValid()) {
                    form.submit({
                        url: 'sys/user/add',
                        method: 'POST',
                        waitTitle: "提示",
                        waitMsg: '正在提交数据，请稍后 ……',
                        success: function (form, action) {//添加成功后提示消息，并且刷新用户列表数据
                            me.close();
                            DealAjaxResponse(action.response);
                            Ext.data.StoreManager.lookup('UserStore').load();
                        },
                        failure: function (form, action) {
                            DealAjaxResponse(action.response);
                        }
                    });
                } else {
                    toast({
                        msg: '表单填写错误，请确认'
                    })
                }
            },
            scope: this
        }, '-', {
            text: '放弃',
            cls: 'red-btn',
            iconCls: baseConfig.appicon.undo,
            handler: function () {
                me.close();
            },
            scope: this
        }]
        me.callParent(arguments);
    },
    //form表单的渲染在这里完成，目的是可以通过创建操作传入参数
    loadView: function (config) {
        var formCmp = this.getComponent(0);
        formCmp.add([{
            columnWidth: 1,
            layout: "form",
            items: [{
                xtype: "textfield",
                fieldLabel: baseConfig.model.user.username,
                name: 'username',
                maxLength: 250,
                maxLengthText: '请输入{0}个字以内',
                emptyText: '登录用的用户名',
                bind: '{title}',//mvvm数据绑定，输入的时候同步就显示在win的title上了
                allowBlank: false,
                flex: 1
            },
                {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.user.real_name,
                    name: 'real_name',
                    maxLength: 10,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '真实姓名',
                    allowBlank: false,
                    flex: 1
                }

            ]

        }]);

    }
});