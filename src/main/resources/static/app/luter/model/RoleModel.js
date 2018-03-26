Ext.define('luter.model.RoleModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'is_reserved', type: 'int'}
    ]
});
