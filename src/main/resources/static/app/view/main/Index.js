Ext.define('luter.view.main.Index', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.indexview',
    margin: '10 0 0 0',
    layout: {
        type: 'vbox',
        align: 'stretch' //拉伸使其充满整个父容器
    },
    requires: [],
    border: false,
    autoScroll: true,
    initComponent: function () {
        var me = this;
        var option = {
            title: {
                text: '未来一周气温变化',
                subtext: '纯属虚构'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['最高气温', '最低气温']
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} °C'
                    }
                }
            ],
            series: [
                {
                    name: '最高气温',
                    type: 'line',
                    data: [11, 11, 15, 13, 12, 13, 10],
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name: '最低气温',
                    type: 'line',
                    data: [1, -2, 2, 5, 3, 2, 0],
                    markPoint: {
                        data: [
                            {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        };
        var baroption = {
            title: {
                text: '某站点用户访问来源',
                subtext: '纯属虚构',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'left',
                                max: 1548
                            }
                        }
                    },
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 335, name: '直接访问'},
                        {value: 310, name: '邮件营销'},
                        {value: 234, name: '联盟广告'},
                        {value: 135, name: '视频广告'},
                        {value: 1548, name: '搜索引擎'}
                    ]
                }
            ]
        };
        me.items = [{
            xtype: 'panel',
            layout: 'column',
            margin: '10 10 10 10',
            items: [Ext.create('luter.ux.WidgetCard', {
                count: 123123,
                columnWidth: .25,
                height: 100,
                icon: 'fa fa-gear',
                style: 'border-top: orange 3px solid;',
                text: '杀掉'
            }),
                Ext.create('luter.ux.WidgetCard', {
                    count: 123123,
                    columnWidth: .25,
                    height: 100,
                    icon: 'fa fa-paw',
                    style: 'border-top: green 3px solid;',
                    text: '活埋'
                }),
                Ext.create('luter.ux.WidgetCard', {
                    count: 3232,
                    columnWidth: .25,
                    height: 100,
                    style: 'border-top: red 3px solid;',
                    icon: 'fa fa-eye',
                    text: '吓死'
                }),


                Ext.create('luter.ux.WidgetCard', {
                    count: 2323,
                    columnWidth: .25,
                    height: 100,
                    icon: 'fa fa-bars',
                    style: 'border-top: blue 3px solid;',
                    text: '憋死'
                })
            ]
        }, {
            layout: 'column',
            margin: '10 0 0 0 ',
            items: [Ext.create('luter.ux.EchartsPanel', {
                height: 300,
                option: option,
                paddingLeft: 10,
                columnWidth: .5,
                // theme:'dark',
            }), Ext.create('luter.ux.EchartsPanel', {
                height: 300,
                option: option,
                paddingLeft: 10,
                // theme:'dark',
                columnWidth: .5,
            })]
        }, {
            layout: 'column',
            margin: '10 0 0 0 ',
            items: [Ext.create('luter.ux.EchartsPanel', {
                height: 300,
                option: baroption,
                paddingLeft: 10,
                columnWidth: 1,
                // theme:'dark',
            })]
        }]
        me.callParent(arguments);
    }
});
