Ext.define('luter.view.main.Footer', {
    extend: 'Ext.toolbar.Toolbar',//继承自工具栏
    region: 'south',
    xtype: 'sysfooter',
    style: {//背景色黑色
        background: '#000'
    },
    frame: false,
    border: false,
    height: 30,
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [{
                xtype: 'tbtext',
                style: {
                    color: '#FFF',
                    fontSize: '14px',
                    textAlign: 'right',
                    fontWeight: 'bold'
                },
                flex: 3,
                id: 'southText',
                text:  Ext.Date.format(new Date(), 'Y') +' © ' +"luter 版权所有"+'<small>:'+"v1.0"+'</small>'
            }, '->', Ext.create('luter.ux.TrayClock', {
                flex: 1,
                style: {
                    color: '#FFF',
                    padding: '0px 0px 0px  0px',
                    fontWeight: 'bold',
                    textAlign: 'right',
                    fontSize: '12px'
                }
            })]
        });
        me.callParent(arguments);
    }
});
