/**
 * icon_prefix font字体前缀定义
 * baseConfig 全局配置
 */
var icon_prefix = " x-fa  ", baseConfig = {
    /**
     * 全局常量定义
     */
    cons: {
        noimage: 'app/resource/images/noimage.jpg',
        static_server: '',
        name: sysconfig.name || 'Luter Admin Panel',
        version: sysconfig.version || '20180001',
        copyright: sysconfig.copyright || '©Luter.inc All Rights Reserved ™',
    },
    unit: {
        "required": '<span style="color:red;font-weight:bold" data-qtip="必填">*</span>',
        "mi": '<span style="color:blue;font-weight:bold" data-qtip="单位:米">[米]</span>',
        "pingfangmi": '<span style="color:blue;font-weight:bold" data-qtip="单位:平方米">[㎡]</span>',
        "DateFormatLong": 'Y-m-d H:i:s',
        "DateFormatShort": 'Y-m-d',
    },
    dictcode: {
        gender: 100
    },
    /**
     * 渲染器
     */
    renders: {
        trueText: '<i data-qtip="是"  class=" fa fa-lg fa-check green-color"></i>',
        falseText: '<i  data-qtip="否"  class=" fa fa-lg fa-close red-color"></i>',
        cancel: '<i class=" fa fa-lg fa-undo"></i>'
    },
    /**
     * 图标定义
     */
    appicon: {
        home: icon_prefix + 'fa-home',
        add: icon_prefix + "fa-plus",
        update: icon_prefix + "fa-edit",
        trash: icon_prefix + "fa-trash",
        delete: icon_prefix + "fa-remove red-color",
        set_wallpaper: icon_prefix + "fa-image",
        setting: icon_prefix + "fa-gears",
        desktop: icon_prefix + "fa-desktop",
        pailie: icon_prefix + "fa-cubes",
        logout: icon_prefix + "fa-power-off",
        avatar: icon_prefix + "fa-photo",
        key: icon_prefix + "fa-key",
        user: icon_prefix + "fa-user",
        refresh: icon_prefix + "fa-refresh blue-color",
        close: icon_prefix + "fa-close",
        male: icon_prefix + 'fa-male',
        female: icon_prefix + 'fa-female',
        role: icon_prefix + 'fa-users',
        user_add: icon_prefix + "fa-user-plus",
        undo: icon_prefix + 'fa-undo',
        search: icon_prefix + 'fa-search',
        reset: icon_prefix + 'fa-retweet',
        yes: icon_prefix + 'fa-check green-color',
        no: icon_prefix + 'fa-close red-color',
        list_ol: icon_prefix + ' fa-list-ol',
        list_alt: icon_prefix + ' fa-list-alt',
        ban: icon_prefix + "fa-ban",
        log: icon_prefix + "fa-tty",
        printer: icon_prefix + "fa-print",
        fax: icon_prefix + "fa-fax",
        download: icon_prefix + "fa-cloud-download",
        upload: icon_prefix + "fa-cloud-upload",
        comment: icon_prefix + " fa-commenting-o",
        credit: icon_prefix + "fa fa-gift"
    },
    /**
     * 模型定义
     */
    model: {
        /**
         * 系统用户
         */
        user: {
            id: 'ID',
            create_at: '创建于',
            remarks: '备注',
            update_at: '最后更新于',
            version: '版本',
            last_login_client: '最近登录客户端',
            last_login_ip: '最近登录IP',
            last_login_time: '最近登录时间',
            locked: '锁定',
            password: '密码',
            realname: '姓名',
            realname_py: '姓名拼音',
            realname_pyhd: '姓名拼音首字母',
            reserved: '系统用户',
            salt: '盐',
            username: '账号',
        },
        /**
         * 系统资源
         */
        resource: {
            id: 'ID',
            create_at: '创建于',
            remarks: '备注',
            update_at: '最近更新于',
            version: '版本',
            icon: '图标',
            module: '模块ID',
            name: '名称',
            perm: '权限标识',
            pid: '上级',
            res_type: '资源类型',
            reversed: '是否保留',
            tip: '提示说明',
            uri: '资源路径URI',
            ishref: '是否外链',
            href: '外链地址'
        }, /**
         * 系统角色
         */
        role: {
            id: 'ID',
            create_at: '创建于',
            remarks: '备注',
            update_at: '最后更新',
            version: '版本',
            name: '角色名称',
            reserved: '系统保留'
        }, /**
         * 系统日志
         */
        log: {
            id: 'ID',
            create_at: '创建于',
            remarks: '备注',
            update_at: '最后更新',
            version: '版本',
            browser_type: '浏览器类型',
            client_ip: '客户端IP',
            content: '日志内容',
            log_class: '日志分类',
            request_method: '请求方法',
            request_params: '请求参数',
            request_time: '请求时间',
            request_url: '请求地址',
            user_agent: 'User-Agent',
            userid: '用户ID',
            username: '账号'
        }, /**
         * 宠物-猫
         */
        cat: {
            id: 'ID',
            created_at: '创建于',
            remarks: '备注',
            update_at: '最近更新',
            version: '版本',
            age: '年龄',
            name: '名字'
        }

    }
};
