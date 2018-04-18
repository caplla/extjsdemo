Ext.define('luter.view.showcase.cat.CatList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.showcaseCatListView',
    requires: [],
    store: 'CatStore',
    itemId: 'showcaseCatGrid',
    columnLines: true,
    viewConfig: {
        emptyText: '<b>暂无数据</b>',
        autoFill: true,
        getRowClass: function (record, rowIndex, rowParams, store) {
            // return record.get('locked') ? 'no' : '';

        }
    },
    selModel: 'cellmodel',

    initComponent: function () {
        var catgenderCombo = Ext.create('luter.combo.CatGenderCombo');
        var me = this;
        var rowEditor = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1,//1是点一下就编辑，2就是点2下
            listeners: {
                edit: function (editor, e) {

                }
            }
        });
        me.plugins = [rowEditor];
        me.columns = [{
            xtype: 'rownumberer',
            text: '序号',
            width: 60
        }, {
            header: "操作",
            xtype: "actioncolumn",
            width: 60,
            sortable: false,
            items: [{
                text: "删除",
                iconCls: 'icon-delete',
                tooltip: "删除这条记录",
                handler: function (grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    if (!record) {
                        toast({
                            msg: '请选中一条要删除的记录'
                        })
                    } else {
                        showConfirmMesg({
                            message: '确定删除这条记录?',
                            fn: function (btn) {
                                if (btn === 'yes') {
                                    Ext.Ajax.request({
                                        url: '/showcase/cat/delete',
                                        method: 'POST',
                                        params: {
                                            id: record.get('id')
                                        },
                                        success: function (response, options) {
                                            DealAjaxResponse(response);
                                            Ext.data.StoreManager.lookup('CatStore').load();
                                        },
                                        failure: function (response, options) {
                                            DealAjaxResponse(response);
                                        }
                                    });
                                } else {
                                    Ext.toast({
                                        title: '看...',
                                        width: 200,
                                        html: '不删了.....'
                                    });
                                    return false;
                                }
                            }

                        })

                    }

                }
            }]
        }, {
            header: baseConfig.model.cat.id,
            dataIndex: 'id',
            hidden: true,
            flex: 1
        }, {
            header: baseConfig.model.cat.name,
            dataIndex: 'name',
            editor: {
                completeOnEnter: true,//回车就完事
                field: {
                    xtype: 'textfield',
                    maxLength: 100,
                    maxLengthText: '请输入{0}个字以内',
                    emptyText: '叫啥',
                    allowBlank: false,
                    listeners: {
                        change: function (field, e) {
                            //这里可以随时提交
                        }
                    }
                }
            },
            flex: 1
        }, {
            header: baseConfig.model.cat.gender,
            dataIndex: 'gender',
            renderer: Ext.util.Format.comboRenderer(catgenderCombo),
            editor: {
                completeOnEnter: true,//回车就完事
                field: {
                    xtype: 'catgendercombo',
                    emptyText: '公的母的?',
                    allowBlank: false
                }
            },
            flex: 1
        }, {
            header: baseConfig.model.cat.age,
            dataIndex: 'age',
            // editor: {
            //     completeOnEnter: true,//回车就完事
            //     field: {
            //         xtype: 'numberfield',
            //         minValue: 1,
            //         maxValue: 50,
            //         allowBlank: false
            //     }
            // },
            getEditor: function (record) {//这种方式可以动态加编辑
                if (1 == 1) {
                    return Ext.create('Ext.grid.CellEditor', {
                        field: {
                            xtype: 'numberfield',
                            minValue: 1,
                            maxValue: 50,
                            allowBlank: false
                        }
                    })
                } else return false;
            },
            flex: 1
        }]

        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            displayInfo: true,
            displayMsg: '当前数据 {0} - {1} 总数： {2}',
            emptyMsg: "没数据显示",
            plugins: [new Ext.create('luter.ux.grid.PagingToolbarResizer', {
                options: [5, 10, 15, 20, 25, 50, 100]
            })]
        })
        me.dockedItems = [{
            xtype: 'toolbar',
            items: [{
                text: 'add Row',
                iconCls: baseConfig.appicon.add,
                tooltip: ' 加一行',
                handler: function () {
                    me.getStore().insert(0, Ext.create('luter.model.CatModel'));
                    rowEditor.startEdit(0, 0);

                }
            }, {
                text: '添加Window',
                iconCls: baseConfig.appicon.add,
                tooltip: '添加',
                handler: function () {
                    var win = Ext.create('luter.view.showcase.cat.CatAdd', {
                        animateTarget: this//以这个按钮为锚点动画打开win
                    });
                    win.loadView();//给form加入元素
                    win.show();//显示这个窗体

                }
            }, {
                text: 'getModifiedRecords',
                iconCls: baseConfig.appicon.add,
                tooltip: 'getModifiedRecords',
                handler: function () {
                    var data = me.getStore().getModifiedRecords();
                    if (data && data.length > 0) {
                        Ext.each(data || [], function (item) {
                            console.log(item);
                            if (item.phantom === true && item.isValid()) {
                                //这些是新增的
                                console.log("这是新增:"+item.id)
                            }
                            if (item.dirty === true && item.phantom !== true && item.isValid()) {
                                //这些是修改的
                                console.log("这是修改:"+item.id)
                            }
                        }, this);
                    } else {

                    }
                }
            }, {
                text: 'Sync提交',
                iconCls: baseConfig.appicon.add,
                tooltip: 'Sync提交',
                handler: function () {
                    me.getStore().sync({
                        scope: this,
                        success: function (a, b, c) {
                            Ext.Msg.alert("成功", "保存成功");
                        },
                        failure: function (a, b, c) {
                            Ext.Msg.alert("失败", "保存失败");
                        }
                    });
                }
            }, {
                text: '另一个保存',
                handler: function () {
                    for (var i = 0; i < me.store.data.items.length; i++) {
                        var record = me.store.data.items [i];
                        if (record.dirty) {
                            //这些是有变动的
                        }
                    }
                }
            }]
        }]
        me.callParent(arguments);
    }
})
;
