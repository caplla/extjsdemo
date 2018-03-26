Ext.define('luter.view.combodemo.ComboDemo', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.combodemoview',
    width: 300,
    initComponent: function () {
        var me = this;
        var treeStore = Ext.create('Ext.data.TreeStore', {
            root: {
                id: 1,
                expanded: true,
                valueField: "你爹",
                children: [{
                    id: 11,
                    valueField: "你妹",
                    leaf: true,

                }, {
                    id: 1111,
                    valueField: "驴",
                    leaf: true,

                }, {
                    id: 12,
                    valueField: "你哥",
                    expanded: true,
                    children: [{
                        id: 121,
                        valueField: "你侄子",
                        leaf: true
                    }, {
                        id: 122,
                        valueField: "你侄女",
                        leaf: true
                    }]
                }, {
                    id: 13,
                    valueField: "猪",
                    leaf: true
                }]
            }
        });
        var xialashu = Ext.create('Ext.form.Panel', {
            title: "下拉里面一棵树",
            items: [
                Ext.create('luter.ux.TreePicker', {
                    store: treeStore,
                    fieldLabel: "对象",
                    valueField: 'id',
                    displayField: 'valueField',
                    selectChildren: true,
                    canSelectFolders: false,
                    name: 'object'
                })
            ],
            buttons: [{
                text: "找对象",
                handler: function (btn) {
                    var form = btn.up('panel').getForm(),
                        treePicker = btn.up('panel').down('treepicker');
                    console.log(treePicker.getValue())
                    Ext.toast('找到的对象是:' + treePicker.getRawValue());
                }
            }]
        });
        me.items = [{
            title: '全国省市三级',
            baseCls: 'home-body',
            closeable: false,
            layout: 'fit',
            items: [
                Ext.create('luter.view.combodemo.Regions')
            ]
        }, {
            title: '下拉选择树',
            baseCls: 'home-body',
            closeable: false,
            layout: 'fit',
            items: [
                xialashu
            ]
        }]
        me.callParent(arguments);
    }
});
