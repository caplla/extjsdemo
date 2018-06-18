Ext.define('luter.view.sys.user.UserProfile', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.userprofileview',
    layout: 'column',
    requires: ['luter.combo.YesNo'],
    border: false,
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'panel',
            columnWidth: .5,
            height: 200,
            cls: 'panel-body',
            items: [
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    padding: '20 0 0 0 ',
                    items: [
                        {
                            xtype: 'component',
                            flex: 1,
                        },
                        {
                            xtype: 'image',
                            cls: 'circle-image',
                            src: 'static/luter/resource/images/avatar.jpg',
                            flex: 3,
                            listeners: {
                                el: {
                                    click: function () {
                                        toast('click event capture on image')
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'tbtext',
                            flex: 5,
                            padding: '0 0 0 20',
                            text: '<br><b>账号</b>:' + currentUser.username +
                            '<br><br><b>姓名</b>:' + currentUser.realname +
                            '<br><br><b>所在部门:</b>' + currentUser.departmentName +
                            '<br><br><b>最后一次登录:</b>' + currentUser.last_login_time
                        },
                        {
                            xtype: 'button',
                            tooltip: '修改个人信息',
                            flex: 3,
                            cls: 'green-btn',
                            text:'修改信息',
                            iconCls: baseConfig.appicon.update,
                            handler: function () {
                                var view = Ext.create('luter.view.sys.user.EditMyInfo');
                                view.loadView();
                                Ext.Ajax.request({
                                    url: 'sys/user/current',
                                    method: 'POST',
                                    success: function (response, options) {
                                        var form = view.down('form');
                                        var result = Ext.JSON.decode(response.responseText);
                                        var formActive = form && !form.destroying && !form.destroyed;
                                        if (result.success && formActive) {
                                            view.show();
                                            form.getForm().clearInvalid();
                                            var therecord = result.data;
                                            therecord.gender = therecord.gender.id;
                                            form.getForm().setValues(therecord);
                                        } else {
                                            toast('加载数据失败，请稍后再试')

                                        }

                                    },
                                    failure: function (response, options) {
                                        DealAjaxResponse(response);
                                    }
                                });
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '修改密码',
                            text:'修改密码',
                            flex: 3,
                            iconCls: baseConfig.appicon.key,
                            cls: 'red-btn',
                            handler: function () {
                                var view = Ext.create('luter.view.sys.user.ResetMyPass');
                                view.show()
                            }
                        }
                    ]
                }]

        }, {
            xtype: 'panel',
            columnWidth: .5,
            height: 200,
            cls: 'panel-body',
        }]
        me.callParent(arguments);
    }
});
