/**
 * 操作成功提示
 */
function showSucMesg(config) {
    Ext.Msg.show({
        title: '成功',
        msg: config.msg || '',
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
        msg: config.msg || '',
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
            showFailMesg({
                msg: '请求出现错误:<br/>错误代码:' + response.status + ',' +
                '<br/>错误内容：' + response.statusText + '<br/>' +
                '这表示您要访问的内容出现错误或者暂时无法提供服务，请联系您的系统管理员！' +
                '<br/>Request URL:' + response.request.options.url + '<br>Response: ' + response.responseText
            });
        } else {
            try {
                var result = Ext.JSON.decode(response.responseText);
                if (result.success) {
                    if (result.total == 0 || result.total == 'undefined') {
                        Ext.msgs.msg('提示：', '暂无记录！');
                    }
                    showSucMesg(result);
                } else {
                    if (result.code == 0) {
                        showFailMesg(result);
                        window.location = "login";
                    } else {
                        showFailMesg(result);
                    }

                }
            } catch (error) {
                console.log(error);
                showFailMesg({
                    msg: ':<> O!Sorry :Try to decode response message to json faild.' +
                    '<br> This  means that the server reject you request.' +
                    '<br> Please contact your administrator for help.' +
                    '</br><span class="red-color">Error: ' + error + '</span>'
                });
                return false;
            } finally {

            }


        }
    }
    else {
        showFailMesg({
            msg: '发生错误'
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
    //Ext.Msg.show({
    //    title: constant.title||'提示',
    //    msg: constant.msg || '',
    //    buttons: Ext.Msg.OK,
    //    icon: Ext.MessageBox.INFO,
    //    fn: constant.fn || ''
    //});
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
        width:200,
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
            msg: 'view 参数或者url参数不能为空，请确认'
        });
        return false;
    }
    form.getForm().load({
        url: url,
        success: function () {
            view.show();
        },
        failure: function (obj, action) {
            if (action && action.result) {
                action.result.msg = action.result.msg + "<br>uri :" + action.url;
                showFailMesg(action.result);
                return false;
            }
            showFailMesg({
                msg: '返回信息为空，获取失败，请检查服务器是否正确返回了对应记录<br>url:' + url
            })
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
    //                 msg: '获取数据失败，请检查服务器是否正确返回了对应记录。url:'+url
    //             })
    //         }
    //     });
    // });
    // d.delay(500);
}