Ext.define('luter.view.main.Header', {
    extend: 'Ext.Container',//继承自容器类
    xtype: 'appheader',
    cls: 'app-header',//自定义样式，参见style.css
    height: 52,//高度
    layout: {//布局，水平box布局
        type: 'hbox',
        align: 'middle'
    },
    initComponent: function () {
        var me = this;
        me.items = [{//先放个LOGO
            xtype: 'image',
            cls: 'circle-pic',
            src: '/app/resource/images/logo.png'
        }, {//再显示个标题
            xtype: 'tbtext',
            flex: 4,
            style: {
                color: '#FFF',
                fontSize: '20px',
                padding: '0px 10px 0px  55px',
                fontWeight: 900
            },
            text: '这里是系统标题'
        },{
            xtype: 'image',
            cls: 'circle-pic',
            src: '/app/resource/images/avatar.jpg'
        }];
        me.callParent();
    }
});
