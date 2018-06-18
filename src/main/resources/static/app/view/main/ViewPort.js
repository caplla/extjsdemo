/**
 * 主视图占满全屏是个viewport
 */
Ext.define('luter.view.main.ViewPort', {
    extend: 'Ext.Viewport',
    alias: 'widget.viewport', //别名，与xtype对应
    layout: 'border', //东南西北中布局，边界嘛
    stores: [],
    requires: ['luter.view.main.Header', 'luter.view.main.Footer', 'luter.view.main.Navlist'],
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
                items: [{
                    xtype: 'panel',
                    flex: 1,
                    height: 52,
                    bodyStyle: {
                        'backgroundColor': '#495060'
                    },
                    cls: 'bordered'
                }, {
                    flex: 18,
                    // cls: 'wave',//波浪样式
                    xtype: 'navlist'
                }]

            }, {
                region: 'center',
                layout: 'border',
                items: [{
                    region: 'north',
                    xtype: 'appheader',
                },

                    {
                        region: 'center',
                        id: 'SysContentPanel',
                        layout: 'fit',
                        autoScroll: true,//自动产生滚动条
                        padding: '3 0 1 0',
                        // cls: 'home-body',//通过css设置
                        style: {
                            backgroundColor: 'black'
                        },
                        xtype: 'panel',
                        items: [Ext.create('luter.view.main.Index')]

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
