Ext.define('luter.ux.TrayClock', {
    extend: 'Ext.toolbar.TextItem',

    alias: 'widget.trayclock',

    cls: 'ux-desktop-trayclock',

    html: '&#160;',

    //timeFormat: 'Y-m-d G:i:s A',
    timeFormat: 'Y年m月d日 G点i分s秒',

    //com.luter.gencode.tpl: '{time}-{week}',
    tpl: '{time}<span style="color:black;">{week}</span>',

    initComponent: function () {
        var me = this;

        me.callParent();

        if (typeof (me.tpl) == 'string') {
            me.tpl = new Ext.XTemplate(me.tpl);
        }
    },

    afterRender: function () {
        var me = this;
        Ext.Function.defer(me.updateTime, 100, me);
        me.callParent();
    },

    onDestroy: function () {
        var me = this;

        if (me.timer) {
            window.clearTimeout(me.timer);
            me.timer = null;
        }

        me.callParent();
    },

    updateTime: function () {
        var aWeek = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        var weeka = aWeek[new Date().getDay()];
        var me = this,
            time = Ext.Date.format(new Date(), me.timeFormat),
            text = me.tpl.apply({
                time: time,
                week: weeka
            });

        if (me.lastText != text) {
            me.setText(text);
            me.lastText = text;
        }

        me.timer = Ext.Function.defer(me.updateTime, 1000, me);
    }
});
