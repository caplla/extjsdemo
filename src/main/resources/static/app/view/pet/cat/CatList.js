Ext.define('luter.view.pet.cat.CatList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.catlistview',
    requires: [],
    store: 'CatStore',
    itemId: 'catGrid',
    columnLines: true,
    rowLines: true,
    viewConfig: {
        emptyText: '<b>暂无数据</b>'
    },
    initComponent: function () {
        var me = this;
        me.columns =
            [
                {
                    xtype: 'rownumberer',
                    text: '序号',
                    width: 60
                },
                {
                    header: "操作",
                    xtype: "actioncolumn",
                    width: 100,
                    sortable: false,
                    menuDisabled: true,
                    items: [{
                        iconCls: 'x-fa fa-close  red-color',
                        tooltip: '删除这条记录',
                        isDisabled: function (grid, rowIndex, colIndex, item, record) {
                            // return record.get('reserved')
                            return false;
                        },
                        handler: function (grid, rowIndex, colIndex) {
                            var record = grid.getStore().getAt(rowIndex);
                            if (!record) {
                                toast({
                                    msg: '请选中一条记录'
                                })
                            } else {
                                showConfirmMesg({
                                    message: '确定删除这条记录?',
                                    fn: function (btn) {
                                        if (btn === 'yes') {
                                            Ext.Ajax.request({
                                                url: 'pet/cat/delete',
                                                method: 'POST',
                                                params: {
                                                    id: record.get('id')
                                                },
                                                success: function (response, options) {
                                                    DealAjaxResponse(response);
                                                    Ext.getStore('CatStore').load();
                                                },
                                                failure: function (response, options) {
                                                    DealAjaxResponse(response);
                                                }
                                            });
                                        } else {
                                            return false;
                                        }
                                    }

                                })

                            }
                        }
                    }]
                },


                {
                    text: baseConfig.model.cat.id,
                    dataIndex: 'id', hidden: true,
                    flex: 1
                },
                {
                    text: baseConfig.model.cat.created_at,
                    dataIndex: 'created_at', hidden: true,
                    flex: 1
                },
                {
                    text: baseConfig.model.cat.remarks,
                    dataIndex: 'remarks',
                    flex: 1
                },
                {
                    text: baseConfig.model.cat.update_at,
                    dataIndex: 'update_at', hidden: true,
                    flex: 1
                },
                {
                    text: baseConfig.model.cat.version,
                    dataIndex: 'version', hidden: true,
                    flex: 1
                },
                {
                    text: baseConfig.model.cat.age,
                    dataIndex: 'age',
                    flex: 1
                },
                {
                    text: baseConfig.model.cat.name,
                    dataIndex: 'name',
                    flex: 1
                }


            ]

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
                text: '添加',
                iconCls: baseConfig.appicon.add,
                tooltip: '添加',
                handler: function () {
                    var win = Ext.create('luter.view.pet.cat.CatAdd', {animateTarget: this, shadow: false});
                    win.loadView();
                    win.show();

                }
            }, {
                text: '看视频',
                iconCls: baseConfig.appicon.image,
                tooltip: '看视频',
                handler: function () {
                    Ext.create('Ext.window.Window', {
                        title: '看片',
                        width: 500,
                        autoHeight: true,
                        minHeight: 200,
                        constrain: true,
                        modal: true,
                        maximizable: true,
                        layout: "fit",
                        items: Ext.create('luter.ux.Video', {
                            autoplay: true,
                            controls: [],
                            poster: '',
                            start: 0,
                            loopstart: true,
                            loopend: false,
                            src: 'http://graduate.cqnu.edu.cn/creategroup/UploadFiles_5832/f0168ku0mr4.p703.1.mp4'
                        })
                    }).show();

                }
            }]
        }]
        me.listeners = {
            'itemdblclick': function (table, record, html, row, event, opt) {
                if (record) {
                    var id = record.get('id');
                    var view = Ext.create('luter.view.pet.cat.CatEdit', {
                        title: '编辑数据',
                        animateTarget: this,
                        shadow: false
                    });
                    view.loadView();
                    loadFormDataFromDb(view, 'pet/cat/view?id=' + id);
                } else {
                    showFailMesg({
                        msg: '加载信息失败，请确认。'
                    })
                }

            }, itemmouseenter: function (view, record, item) {
                Ext.fly(item).set({
                    'data-qtip': '' + record.get('remarks')
                });
            }
        }
        me.plugins = []
        me.callParent(arguments);
    }
});
