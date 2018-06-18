Ext.define('luter.combo.Role', {
    extend: 'Ext.form.field.Tag',
    alias: 'widget.roleCombo',
    displayField: 'name',
    valueField: 'id',
    queryMode: 'remote',
    forceSelection: true,
    filterPickList: true,
    editable: false,
    triggerAction: 'all',
    emptyText:'请选择角色',
    listConfig: {
        // emptyText: '<span style="color:red">没有找到匹配数据</span>',
        getInnerTpl: function () {
            return '<b>{name}</b><small style="font-size: 8px;color: darkblue">{remarks}</small>';

        }
    },
    initComponent: function () {
        var me = this;
        Ext.applyIf(me, {});
        this.store = Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'remarks'],
            proxy: {
                type: 'ajax',
                async: false,
                api: {
                    read: 'sys/role/list/all'
                },
                extraParams: {},
                actionMethods: {
                    read: 'POST'
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    successProperty: 'success',
                    totalProperty: 'count'
                },
                successProperty: 'success',
                listeners: {
                    exception: function (proxy, response, operation, eOpts) {
                        DealAjaxResponse(response);
                    }
                }

            },
            autoLoad: true,
            sorters: {
                property: 'id',
                direction: 'DESC'
            },

            listeners: {
                'load': function (store, records, successful, operation) {
                    //if (successful) {
                    //    var ins_rec = {
                    //        id: 'pleaseselect',
                    //        item_code: null,
                    //        item_text: '请选择',
                    //        memo: '请选择....'
                    //    }
                    //    store.insert(0, ins_rec);
                    //}
                }
            }
        })

        me.callParent(arguments);

    }
});
