Ext.define('luter.controller.showcase.TreeController', {
    extend: 'Ext.app.Controller',
    stores: ['MyTreeStore','SyncTreeStore'],
    views: ['showcase.mytree.AllTree'],
    init: function () {

    }
});
