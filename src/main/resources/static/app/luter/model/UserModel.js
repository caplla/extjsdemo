Ext.define('luter.model.UserModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'string'},
        {name: 'username', type: 'string'},
        {name: 'gender', type: 'string'},
        {name: 'real_name', type: 'string'}
    ]
});
