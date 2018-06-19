Ext.define('luter.view.main.Header', {
    extend: 'Ext.Container',//继承自容器类
    xtype: 'appheader',
    cls: 'app-header',
    height: 52,//高度
    layout: {//布局，水平box布局
        type: 'hbox',
        align: 'middle'
    },
    initComponent: function () {
        var me = this;
        //全屏状态
        var fullscreen = false;
        me.items = [{
            flex: 1,
            id: 'menuToggleButton',
            html: '<i onclick="toggleWestPanel(this)" style="font-size: 20px;margin-left: 10px;color: #000" class="fa fa-arrow-left"></i>'
        }, {
            xtype: 'image',
            cls: 'circle-pic',
            src: '/images/logo.png'
        }, {
            xtype: 'tbtext',
            flex: 5,
            cls: 'title-text',
            text: '' + baseConfig.cons.name,
            listeners: {
                'dblclick': {
                    element: 'el', //fullscreee by click the header bar
                    fn: function () {
                        if (fullscreen == false) {
                            requestFullScreen();
                            fullscreen = true;
                        } else {
                            exitFullscreen();
                            fullscreen = false;
                        }

                    }
                },
                afterrender: function (c) {
                    Ext.create('Ext.tip.ToolTip', {
                        target: c.getEl(),
                        html: '双击全屏...'
                    });
                }
            }
        },

            {
                xtype: 'image',
                cls: 'circle-pic',
                src: '/images/avatar.jpg'
            },
            {
                xtype: 'splitbutton',
                text: '<span style="font-size: 16px">' + currentUser.username +
                '</span><br><span style="font-size: 8px">' + currentUser.realname + '</span>',
                // iconCls: 'avatar_btn',
                iconAlign: 'bottom',
                scale: 'large',
                flex: 1,
                menu: new Ext.menu.Menu({
                    items: [
                        {
                            text: '个人信息',
                            iconCls: 'fa fa-user',
                            handler: function () {
                                var view = Ext.create('luter.view.sys.user.UserProfile');
                                addTab({
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
                                });
                            }
                        }, {
                            text: '退出登录',
                            iconCls: 'fa fa-arrow-left',
                            handler: function () {
                                showConfirmMesg({
                                    message: '确认注销并退出系统？',
                                    fn: function (btn) {
                                        if (btn === 'yes') {
                                            Ext.Ajax.request({
                                                url: 'logout',
                                                method: 'POST',
                                                success: function (response, options) {
                                                    window.location.href = "/login";
                                                },
                                                failure: function (response, options) {
                                                    DealAjaxResponse(response);
                                                }
                                            });
                                            window.location.href = "/login"

                                        } else {
                                            return false;
                                        }
                                    }
                                })

                            }
                        },

                    ]
                })
            }];

        me.callParent();
    },
    toggleWestPanel: function () {

    }
});

function toggleWestPanel(me) {
    var panel = Ext.getCmp('WestPanel');
    panel.toggleCollapse();
    if (panel.getCollapsed()) {
        me.setAttribute('class', 'fa fa-arrow-right')
    } else {
        me.setAttribute('class', 'fa fa-arrow-left')
    }
}

//进入全屏
function requestFullScreen() {
    var de = document.documentElement;
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    }
}

//退出全屏
function exitFullscreen() {
    var de = document;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}
