/**
 * Created by clt on 15/12/13.
 */
Ext.define('luter.view.sys.resource.ResourceList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.resourcetreeview',
    layout: 'fit',
    require: [],
    initComponent: function () {
        var me = this;
        var combo = Ext.create('luter.combo.ResTypeCombo');
        var ResourceTree = Ext.create('Ext.tree.Panel', {
            itemId: 'resourceTreeGrid',
            stripeRows: true,
            rootVisible: true,
            tools: [{
                type: 'refresh',
                tooltip: '刷新资源数列表',
                handler: function () {
                    ResourceTree.getStore().load();
                }
            }, {
                type: 'collapse',
                tooltip: '收起',
                handler: function () {
                    ResourceTree.collapseAll();
                }
            }],
            listeners: {},
            store: 'ResourceStore',
            multiSelect: false,
            columns: [{
                header: "操作",
                xtype: "actioncolumn",
                width: 100,
                sortable: false,
                items: [{
                    text: "新增下级",
                    iconCls: 'icon-add',
                    tooltip: "在此节点增加下级",
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        var config = {};
                        config.parent_id = record.get('id');
                        config.pname = record.get('text');
                        config.ptype = record.get('resource_type') === 'module' ? 'perm' : '';
                        config.readO = record.get('resource_type') === 'module' ? true : false;
                        var view = Ext.create('luter.view.sys.resource.ResourceAdd');
                        view.loadView(config);
                        view.show();
                    },
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        return record.get('type') === 'perm';
                    }
                }, '-', {
                    text: "修改",
                    iconCls: 'icon-update',
                    tooltip: "修改资源信息",
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.getStore().getAt(rowIndex);
                        var view = Ext.widget('resourceeditview');
                        view.loadView();
                        view.show();
                        var d = new Ext.util.DelayedTask(function () {
                            view.down('form').loadRecord(record);
                        });
                        d.delay(500);

                    },
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        return record.get('is_dev');
                    }
                }]
            }, {
                xtype: 'treecolumn',
                text: baseConfig.model.resource.text,
                flex: 3,
                sortable: true,
                dataIndex: 'text',
                renderer: function (value, metaData, list, rowIndex, colIndex, store, view) {
                    var count = list.childNodes.length;
                    if (count > 0) {
                        return value + ' (' + count + ')';
                    } else {
                        return value + '(0)';
                    }

                }
            }, {
                header: baseConfig.model.resource.id,
                dataIndex: 'id',
                hidden: true,
                flex: 1
            },
                {
                    header: baseConfig.model.resource.module_id,
                    dataIndex: 'module_id',
                    flex: 2
                },
                {
                    header: baseConfig.model.resource.resource_type,
                    dataIndex: 'resource_type',
                    flex: 1
                },
                {
                    header: baseConfig.model.resource.href,
                    dataIndex: 'href',
                    flex: 1
                },
                {
                    header: baseConfig.model.resource.iconCls,
                    dataIndex: 'iconCls',
                    renderer: function (value) {
                        return '<i class=" fa  ' + value + '"></i>'
                    },
                    flex: 1
                },
                {
                    header: baseConfig.model.resource.pid,
                    dataIndex: 'pid',
                    hidden: true,
                    flex: 1
                },
                {
                    header: baseConfig.model.resource.qtip,
                    dataIndex: 'qtip',
                    hidden: true,
                    flex: 1
                }
            ]
        });
        Ext.applyIf(me, {
            items: [ResourceTree]
        });
        me.callParent(arguments);
    }

})
