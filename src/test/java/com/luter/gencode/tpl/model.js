Ext.define('luter.model.${cnamedx}Model', {
extend : 'Ext.data.Model',
fields : [
#set($size = $b.size())
#foreach($elem in $b)
    #if($velocityCount != $size)
     {name:'$elem.COLUMN_NAME'},
    #else
    {name:'$elem.COLUMN_NAME'}
    #end
#end
]});
