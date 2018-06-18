Ext.define('luter.view.main.Footer', {
    extend: 'Ext.toolbar.Toolbar',//继承自工具栏
    region: 'south',
    xtype: 'sysfooter',
    frame: false,
    border: false,
    height: 30,
    cls: 'footer',
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {
            items: [{
                xtype: 'tbtext',
                cls: 'footer-copyright',
                flex: 2,
                id: 'southText',
                text: sysconfig.year  + sysconfig.copyright + '<small>,version:' +sysconfig.vesion + '</small>'
            }, '->', Ext.create('luter.ux.TrayClock', {
                flex: 1,
                cls: 'footer-time',
                style: {
                    color: '#000',
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
