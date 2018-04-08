/**
 * 操作成功提示
 */
function showSucMesg(config) {
    Ext.Msg.show({
        title: '成功',
        msg: config.message || '',
        width: 400,
        buttons: Ext.Msg.OK,
        icon: Ext.MessageBox.INFO,
        fn: config.fn || ''
    });
}

/**
 * 操作失败提示
 */
function showFailMesg(config) {
    Ext.Msg.show({
        title: config.title || '失败',
        msg: config.message || '',
        width: 450,
        buttons: Ext.Msg.OK,
        icon: Ext.MessageBox.ERROR,
        fn: config.fn || ''
    });
}

/**
 * 统一处理ajax的返回异常并进行提示
 * @param response
 * @returns {boolean}
 * @constructor
 */
function DealAjaxResponse(response) {
    if (response) {
        if (response.status > '399' || response.status == 0) {
            // showFailMesg({
            //     message: '请求出现错误:<br/>错误代码:' + response.status + ',' +
            //     '<br/>错误内容：' + response.statusText + '<br/>' +
            //     '这表示您要访问的内容出现错误或者暂时无法提供服务，请联系您的系统管理员！' +
            //     '<br/>Request URL:' + response.request.options.url + '<br>Response: ' + response.responseText
            // });
            showFailMesg(Ext.JSON.decode(response.responseText))
        } else {
            var result = Ext.JSON.decode(response.responseText);
            if (result.success) {
                if (result.total == 0 || result.total == 'undefined') {

                }
                showSucMesg(result);
            } else {
                showFailMesg(result);
            }
        }
    }
    else {
        showFailMesg({
            message: '发生错误'
        });
    }

};

/**
 * 显示提示确认对话框
 * @param config
 * {
 * title:
 * message:
 * fn:function(){
 * }
 * }
 */
function showConfirmMesg(config) {
    Ext.MessageBox.buttonText.yes = '<i   class=" fa fa-th fa-check">是</i>';
    Ext.MessageBox.buttonText.no = '<i   class=" fa fa-th fa-close">否</i>';
    Ext.MessageBox.buttonText.cancel = '<i class=" fa fa-lg fa-undo">取消</i>';
    Ext.Msg.show({
        title: config.title || '确认吗?',
        message: config.message + '<br>点击"是"确认。点击"否"退出操作' || '',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: config.fn || ''
    });
}

var showToastMessage = function (message, alignTo) {
    Ext.toast({
        cls: 'toast-window',
        header: false,
        width: 200,
        html: '<div class="toast">' + message + '</div>',
        animate: true,
        slideInAnimation: 'ease',
        slideInDuration: 300,
        slideOutDuration: 200,
        autoCloseDelay: 1500,
        align: alignTo ? alignTo : 't'
    });
}

/**
 * 远程从后台加载form表单的数据
 * @param view 窗口视图，这个窗口下直接包含form
 * @param url  远程获取数据的url,只能返回单条数据
 */
function loadFormDataFromDb(view, url) {
    var form = view.down('form');
    if (!view || !form || !url) {
        showFailMesg({
            message: 'view 参数或者url参数不能为空，请确认'
        });
        return false;
    }
    form.getForm().load({
        url: url,
        method: 'GET',
        success: function () {
            view.show();
        },
        failure: function (obj, action) {
            if (action && action.result) {
                action.result.message = action.result.message + "<br>uri :" + action.url;
                showFailMesg(action.result);
                return false;
            }
            console.log(obj, action)
            var result = Ext.JSON.decode(action.response.responseText);
            showFailMesg(result)
        }
    });
    return true;
    //可以延迟加载，等待UI渲染完成
    // var d = new Ext.util.DelayedTask(function () {
    //     form.getForm().load({
    //         url: url,
    //         failure: function (me, response) {
    //
    //             showFailMesg({
    //                 message: '获取数据失败，请检查服务器是否正确返回了对应记录。url:'+url
    //             })
    //         }
    //     });
    // });
    // d.delay(500);
}

/**
 * 刷新grid list数据源 gridItemId
 *
 * @param {Object}
 *            gridItemId
 */
function refreshGridList(gridItemId) {
    console.log(gridItemId);
    if ('undefined' != typeof (gridItemId)) {
        var grid = Ext.ComponentQuery.query('#' + gridItemId)[0];
        if (grid) {
            var store = grid.getStore();
            if (store) {
                store.load();
            }
        }

    }
}

/**
 *
 *去除array中的重复项
 *
 */
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; ( elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

/**
 * vtype定义
 */
Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);
        if (!date) {
            return;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        return true;
    },
    daterangeText: '开始日期必须小于结束日期', // 验证显示文字
    ip: function (v) {
        return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(v);
    },
    ipText: '不是合法有效的IP地址格式，正确格式:xxx.xxx.xxx.xxx',
    ipMask: /[\d\.]/i,
    mobileAndPhone: function (v) {
        var isPhone = /^0(\d{2}|\d{3})\-(\d{6}|\d{7}|\d{8})$/;
        var isMob = /^(13[0-9]{9})|(17[0-9]{9})|(18[0-9]{9})|(15[89][0-9]{8})$/;
        return isMob.test(v) || isPhone.test(v);
    },
    mobileAndPhoneText: '匹配格式： 11位手机号码 和区号-电话号码(6-8位)如：13332221111、0331-12345678',

    password: function (val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },
    passwordText: '两次输入的密码必须一致！',

    cellPhone: function (v) {
        var isMob = /^(13[0-9]{9})|(17[0-9]{9})|(18[0-9]{9})|(15[89][0-9]{8})$/;
        return isMob.test(v);
    },
    cellPhoneText: '手机号码不正确，请确认！',

    phone: function (v) {
        var isPhone = /^0(\d{2}|\d{3})\-(\d{6}|\d{7}|\d{8})$/;

        return isPhone.test(v);
    },
    phoneText: '电话号码格式不正确，请确认！',
    zipCode: function (v) {
        var iszipCode = /^[1-9][0-9]{5}$/;
        return iszipCode.test(v);
    },
    zipCodeText: '邮编必须是六位数字，开头不能为0，如：110011',
    charAndCh: function (v) {
        var istheone = /^[a-z|A-Z\u4E00-\u9FA5]+$/;
        return istheone.test(v);
    },
    charAndChText: '只能输入字母或者中文',
    lowerChar: function (v) {
        return /^[a-z]+$/.test(v);
    },
    lowerCharText: '只能输入小写字母',
    upperChar: function (v) {
        return /^[A-Z]+$/.test(v);
    },
    upperCharText: '只能输入大写字母',
    anyChar: function (v) {
        return /^[A-Za-z]+$/.test(v);
    },
    anyCharText: '只能输入大小写字母',
    url: function (v) {
        return /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/.test(v);
    },
    urlText: 'URL格式不正确'
});