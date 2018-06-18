#请把这段内容拷贝到config.js里面model位置
/**
* 字段定义说明：
*/
$cname:{
#set($size = $b.size())
#foreach($elem in $b)
    #if($velocityCount != $size)
        $elem.COLUMN_NAME :'$elem.REMARKS',
    #else
        $elem.COLUMN_NAME :'$elem.REMARKS'
    #end
#end
}

#请把这段内容拷贝到config.js里面model位置
