Ext.define('luter.ux.WidgetCard', {
    extend: 'Ext.Component',
    alias: 'widget.wcard',
    cls: ['luter_widget'],
    initComponent: function () {
        var me = this;
        var numberid = Ext.id();
        me.html = '<div style="height: 100px;width: 100%;padding: 0;top: 0;margin: 0; -webkit-box-shadow: #ddd 0px 0px 10px;\n' +
            '    -moz-box-shadow: #ddd 0px 0px 10px;\n' +
            '    box-shadow: #ddd 0px 0px 10px;">' +
            '<div style=" height: inherit;width: 30%;padding: 0;-webkit-box-align: center;align-items: center;-webkit-box-pack: center;justify-content: center;float: left;background-color: rgb(45, 140, 240);">' +
            '<i class="' + me.icon + '" style="display: inline-block;speak: none;font-style: normal;font-weight: 400;color: white;' +
            'font-size: 32px;padding-left: 35%;font-variant: normal;text-transform: none;text-rendering: auto;line-height: 1;margin-top: 40%;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;"></i>' +
            '</div>' +
            '<div style="height: 100px;min-height:60px;width: 70%;background: #ffffff;-webkit-box-align: center;align-items: center;-webkit-box-pack: center;justify-content: center;padding: 0;float: right;">' +
            '<p id="' + numberid + '" style="text-align: center;color: rgb(45, 140, 240);font-size: 32px;font-weight: 700;">' + me.count + '</p>' +
            '<p style=" font-size: 16px;font-weight: 600;text-align: center;color: #C8C8C8;">' + me.text + '</p></div>' +
            '</div>';
        me.callParent();
//         target = 目标元素的 ID；
// startVal = 开始值；
// endVal = 结束值；
// decimals = 小数位数，默认值是0；
// duration = 动画延迟秒数，默认值是2；

        me.on("boxready", function () {
            var countup = new CountUp(numberid, 0, me.count, 0, 2.5, {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
            });
            if (!countup.error) {
                countup.start();
            } else {
                console.error(countup.error);
            }
        });
    }
});


// Ext.define('luter.ux.WidgetCard', {
//     extend: 'Ext.Component',
//     alias: 'widget.wcard',
//     cls: 'luter_widget',
//     initComponent: function () {
//         var me = this;
//         me.html = '<div class="infor-card">' +
//             '<div class="infor-card-left">' +
//             '<i class="' + me.icon + '   widget-icon"></i>' +
//             '</div>' +
//             '<div class="infor-card-right">' +
//             '<p class="widget-number">' + me.count + '</p>' +
//             '<p class="widget-intro-text">' + me.text + '</p></div>' +
//             '</div>';
//         me.callParent();
//     }
// });
