Ext.define('luter.model.LogModel', {
extend : 'Ext.data.Model',
fields : [
         {name:'id'},
             {name:'create_at'},
             {name:'remarks'},
             {name:'update_at'},
             {name:'version'},
             {name:'browser_type'},
             {name:'client_ip'},
             {name:'content'},
             {name:'log_class'},
             {name:'request_method'},
             {name:'request_params'},
             {name:'request_time'},
             {name:'request_url'},
             {name:'user_agent'},
             {name:'userid'},
            {name:'username'}
    ]});
