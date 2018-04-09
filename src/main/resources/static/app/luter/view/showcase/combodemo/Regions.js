Ext.define('luter.view.showcase.combodemo.Regions', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    referenceHolder: true,
    layout: 'hbox',
    viewModel: {
        formulas: {
            getCity: {//城市绑定
                bind: {
                    pid: '{province.value}'
                },
                get: function (data) {
                    return Ext.create('Ext.data.Store', {
                        data: getChild(data.pid),
                        autoLoad: false
                    })
                }
            },
            getCounty: {//区县绑定
                bind: {
                    pid: '{city.value}'
                },
                get: function (data) {
                    return Ext.create('Ext.data.Store', {
                        data: getChild(data.pid),
                        autoLoad: false
                    })
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        var provinceStore = Ext.create('Ext.data.Store', {
            data: getChild(1),
            autoLoad: true
        });
        me.items = [{
            xtype: 'combo',
            fieldLabel: '省(直辖市)',
            displayField: 'text',
            reference: 'province',
            valueField: 'id',
            publishes: 'value',
            store: provinceStore
        }, {
            xtype: 'combo',
            fieldLabel: '城市',
            displayField: 'text',
            reference: 'city',
            valueField: 'id',
            publishes: 'value',
            forceSelection: true,
            bind: {
                visible: '{province.value}',
                store: "{getCity}"
            }
        }, {
            xtype: 'combo',
            fieldLabel: '区县',
            displayField: 'text',
            reference: 'county',
            valueField: 'id',
            forceSelection: true,
            bind: {
                visible: '{city.value}',
                store: "{getCounty}"

            }
        }]
        me.callParent(arguments);
    }
})

function getChild(pid) {
    var data = new Array();
    Ext.each(regions, function (item) {
        if (item.pid == pid) {
            data.push(item)
        }
    });
    return data;
}