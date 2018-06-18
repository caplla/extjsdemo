Ext.define('luter.view.sys.user.UserAdd', {
    extend: 'Ext.window.Window',
    alias: 'widget.useraddview',
    requires: [],
    constrain: true,
    modal: true,
    maximizable: true,
    iconCls: baseConfig.appicon.add,
    layout: "fit",
    width: 700,
    height: 500,
    minWidth: 550,
    minHeight: 400,
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'form',
            width: 650,
            height: 450,
            minWidth: 500,
            minHeight: 350,
            layout: 'column',

            fieldDefaults: {
                labelAlign: 'right',
                labelStyle: 'font-weight:bold;'
            },
            border: false
        }]
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
                        success: function (form, action) {
                            me.close();
                            DealAjaxResponse(action.response);
                            Ext.getStore('UserStore').load();
                        },
                        failure: function (form, action) {
                            DealAjaxResponse(action.response);
                        }
                    });
                } else {
                    toast('信息填写不完整，请完善信息后提交')
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
    loadView: function (config) {

        var formCmp = this.getComponent(0);
        formCmp.add([{
            columnWidth: 1,
            layout: "form",
            items: [{
                xtype: "textfield",
                fieldLabel: baseConfig.model.user.username,
                name: 'username',
                vtype: 'lowerChar',
                minLength: 4,
                minLengthText: '请输入{0}个字以内',
                maxLength: 20,
                maxLengthText: '请输入{0}个字以内',
                emptyText: '系统账号名称',
                allowBlank: false,
                labelAttrTpl: 'data-qtip="全系统唯一，一旦建立无法删除"',
                flex: 1,
                validator: function () {
                    return this.validFlag;
                }, listeners: {
                    'change': function (textfield, newValue, oldValue) {
                        var me = this;
                        Ext.Ajax.request({
                            url: 'sys/user/exist',
                            method: 'POST',
                            params: {
                                param_name: 'username',
                                param_value: newValue
                            },
                            success: function (response) {
                                me.validFlag = Ext.decode(response.responseText) ? true : '用户名:' + newValue + '已经被占用，请重新输入';
                                me.validate();
                            }
                        });
                    }
                }
            }, {
                xtype: "textfield",
                fieldLabel: baseConfig.model.user.password,
                name: 'password',
                minLength: 5,
                minLengthText: '请输入{0}个字以内',
                maxLength: 30,
                maxLengthText: '请输入{0}个字以内',
                emptyText: '请输入用户初始密码',
                labelAttrTpl: 'data-qtip="用户初始密码"',
                allowBlank: false,
                value: '888888',
                flex: 1
            },
                {
                    xtype: 'fieldcontainer',
                    fieldLabel: baseConfig.model.user.reserved,
                    defaultType: 'radiofield',
                    defaults: {
                        flex: 1
                    },
                    layout: 'hbox',
                    items: [
                        {
                            boxLabel: '系统用户',
                            name: 'reserved',
                            checked: false,
                            boxLabelAttrTpl: 'data-qtip="系统保留用户"',
                            inputValue: true,
                        }, {
                            boxLabel: '普通用户',
                            name: 'reserved',
                            checked: true,
                            boxLabelAttrTpl: 'data-qtip="普通用户"',
                            inputValue: false,
                        }
                    ]
                },

                {
                    xtype: 'fieldcontainer',
                    fieldLabel: baseConfig.model.user.locked,
                    defaultType: 'radiofield',
                    defaults: {
                        flex: 1
                    },
                    layout: 'hbox',
                    items: [
                        {
                            boxLabel: '锁定用户',
                            name: 'locked',
                            checked: false,
                            tooltip: '',
                            inputValue: true,
                            boxLabelAttrTpl: 'data-qtip="锁定的用户，无法登录本系统"',
                        }, {
                            boxLabel: '不锁定',
                            name: 'locked',
                            checked: true,
                            inputValue: false,
                            boxLabelAttrTpl: 'data-qtip="没锁定的用户，可以登录本系统"',
                        }
                    ]
                },

                {
                    xtype: "textfield",
                    fieldLabel: baseConfig.model.user.realname,
                    name: 'realname',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    labelAttrTpl: 'data-qtip="用户的真实姓名"',
                    allowBlank: false,
                    flex: 1
                }, {
                    xtype: "textarea",
                    fieldLabel: baseConfig.model.user.remarks,
                    name: 'remarks',
                    maxLength: 250,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '',
                    labelAttrTpl: 'data-qtip="账号全系统唯一，一旦建立无法删除"',
                    allowBlank: true,
                }]
        }]);

    }
});
