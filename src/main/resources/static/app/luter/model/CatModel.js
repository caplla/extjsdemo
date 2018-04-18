Ext.define('luter.model.CatModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'gender', type: 'string'},
        {name: 'age', type: 'int'}
    ]
});
