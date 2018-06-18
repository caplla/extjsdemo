/**
 * Created by luter on 15/12/21.
 */
Ext.define('luter.ux.grid.PagingToolbarResizer', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.pagingtoolbarresizer',

    /**
     * @cfg {Ext.data.Store} options
     * The {@link Ext.data.Store} combobox should use as its data source (required).
     * You can also use an array of integers.
     * Defaults to [5, 10, 15, 20, 25, 30, 50, 75, 100, 200, 300, 500, 1000]
     */
    options: [5, 10, 15, 20, 25, 30, 50, 75, 100, 200, 300, 500, 1000],

    /**
     * @cfg {String} mode Acceptable values are:
     *
     *
     'remote' : Default
     *
     Automatically loads the {@link #store} the first time the trigger
     * is clicked. If you do not want the store to be automatically loaded the first time the trigger is
     * clicked, set to 'local' and manually load the store.  To force a requery of the store
     * every time the trigger is clicked see {@link #lastQuery}.
     *
     'local' :
     *
     ComboBox loads local data
     *
     *
     */
    mode: 'remote',

    /**
     * @cfg {String} displayText
     * The message to display before the combobox (defaults to 'Records per Page')
     */
    displayText: '每页',

    constructor: function (config) {

        Ext.apply(this, config);

        this.callParent(arguments);
    },

    init: function (pagingToolbar) {

        var comboStore = this.options;
        var ptStore = pagingToolbar.store;
        var combo = Ext.create('Ext.form.field.ComboBox', {
            typeAhead: false,
            triggerAction: 'all',
            forceSelection: true,
            lazyRender: true,
            editable: false,
            mode: this.mode,
            value: ptStore.pageSize,
            width: 100,
            store: comboStore,
            listeners: {
                select: function (combo, value, i) {
                    ptStore.pageSize = value.data.field1;
                    ptStore.loadPage(1);
                }
            }
        });

        var index = pagingToolbar.items.indexOf(pagingToolbar.items.map['refresh']);
        pagingToolbar.insert(++index, this.displayText);
        pagingToolbar.insert(++index, combo);
        pagingToolbar.insert(++index, '条');

        //destroy combobox before destroying the paging toolbar
        pagingToolbar.on({
            beforedestroy: function () {
                combo.destroy();
            }
        });

    }
});
