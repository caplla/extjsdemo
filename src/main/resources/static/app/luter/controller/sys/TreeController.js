Ext.define('luter.controller.sys.TreeController', {
    extend: 'Ext.app.Controller',
    stores: ['MyTreeStore','SyncTreeStore'],
    views: ['sys.mytree.AllTree'],
    init: function () {

    }
});
