Ext.define('luter.view.${modulename}.${cnamexx}.${cnamedx}List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.${cnamexx}listview',
    requires: [],
    store: '${cnamedx}Store',
    itemId: '${cname}Grid',
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
                    isDisabled:function(grid, rowIndex, colIndex,item,record){
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
                                            url: '${modulename}/${cnamexx}/delete',
                                            method: 'POST',
                                            params: {
                                                id: record.get('id')
                                            },
                                            success: function (response, options) {
                                                DealAjaxResponse(response);
                                                Ext.getStore('${cnamedx}Store').load();
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


    #set($size = $b.size())
    #foreach($elem in $b)
    #if($velocityCount != $size)
        {
            text : baseConfig.model.${cname}.$elem.COLUMN_NAME,
            dataIndex :'$elem.COLUMN_NAME',
            flex : 1
        },
    #else
        {
            text : baseConfig.model.${cname}.$elem.COLUMN_NAME,
            dataIndex :'$elem.COLUMN_NAME',
            flex : 1
        }
    #end
    #end



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
                    var win = Ext.create('luter.view.${modulename}.${cnamexx}.${cnamedx}Add', {animateTarget: this, shadow: false});
                    win.loadView();
                    win.show();

                }
            }]
        }]
        me.listeners = {
            'itemdblclick': function (table, record, html, row, event, opt) {
                if (record) {
                    var id = record.get('id');
                    var view = Ext.create('luter.view.${modulename}.${cnamexx}.${cnamedx}Edit', {
                        title: '编辑数据',
                        animateTarget: this,
                        shadow: false
                    });
                    view.loadView();
                    loadFormDataFromDb(view, '${modulename}/${cnamexx}/view?id=' + id);
                } else {
                    showFailMesg({
                        msg: '加载信息失败，请确认。'
                    })
                }

            } ,itemmouseenter: function (view, record, item) {
                Ext.fly(item).set({
                    'data-qtip': '' + record.get('remarks')
                });
            }
        }
        me.plugins = []
        me.callParent(arguments);
    }
});
