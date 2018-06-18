/**
 *Extjs公共函数
 */

/*
 * 浏览器版本检测
 */
function checkBroswerVersion() {
    if (Ext.isMac) {
        console.log('client OS is MAC');
    } else if (Ext.isWindows) {
        console.log('client OS is Windows');
    }
    else if (Ext.isLinux) {
        console.log('client OS is Linux');
    }

    if (Ext.isSafari) {
        console.log('you are using Safari browser with version :' + Ext.safariVersion);
    }
    if (Ext.isChrome) {
        console.log('you are using Chrome browser with version :' + Ext.chromeVersion);
    }
    if (Ext.ieVersion != 0 && Ext.ieVersion < 11) {
        Ext.Msg.show({
            title: '您的浏览器不符合使用要求',
            msg: '您的IE浏览器版本低于11，某些功能将无法正常使用.<br>为了保证您正常使用本系他功能，请使用IE浏览器11或者更高版本，<br>推荐使用:Google Chrome浏览器   ',
            width: 400,
            closable: false,
            buttons: [],
            icon: Ext.MessageBox.ERROR
        });
        return false;
    } else if (Ext.safariVersion < 8 && Ext.safariVersion != 0) {
        Ext.Msg.show({
            title: '您的浏览器不符合使用要求',
            msg: '您的IE浏览器版本低于11，某些功能将无法正常使用.<br>为了保证您正常使用本系他功能，请使用IE浏览器11或者更高版本，<br>推荐使用:Google Chrome浏览器   ',
            width: 400,
            buttons: [],
            closable: false,
            icon: Ext.MessageBox.ERROR
        });
        return false;
    } else {
        return true;
    }
}

/**
 *全局Ajax请求异常发生
 */
Ext.Ajax.on('requestexception', function (conn, response, options, e) {
    var statusCode = response.status, msg = '';
    var message = Ext.decode(response.responseText, true);
    if (message) {
        msg = message.message
    }
    if (statusCode == 0) {
        showFailMesg({
            msg: '[requestexception]=请求出现错误:服务器访问异常,请联系您的系统管理员！'
        });
        return;
    }
    showFailMesg({
        title: '发生错误:' + statusCode,
        msg: '[requestexception]=请求出现错误，<br/>错误代码:<span style="color: red;font-weight: 600">' + statusCode +
        '</span><br/>错误内容：<span style="color: red;font-weight: 600">' +
        msg + '</span><br/>资源名称:' + response.request.options.url
    })
});
/**
 *全局Ajax请求前
 */
Ext.Ajax.on('beforerequest', function (conn, response, options, e) {
    //Ext.getBody().mask('正在处理，请稍后......');
});
/**
 *全局Ajax请求完成后
 */
Ext.Ajax.on('requestcomplete', function (conn, response, options, e) {
    //Ext.getBody().unmask();
});

/**
 * 操作成功提示
 */
function showSucMesg(config) {
    Ext.Msg.show({
        title: '成功',
        msg: config.msg || config.message || '',
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
        msg: config.msg || config.message || '',
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
function DealAjaxResponse(response, alert) {
    if (response.status == 0) {
        showFailMesg({
            msg: '与服务器连接断开，后台服务无法访问。' +
            '<br> 请联系系统管理员获得帮助.'
        });
        return false;
    }
    if (response) {
        try {
            var result = Ext.JSON.decode(response.responseText);
            if (result.success) {
                if (result.total == 0 || result.total == 'undefined') {
                    Ext.msgs.msg('提示：', '暂无记录！');
                }
                alert ? showSucMesg(result) : toast(result.message);

            } else {
                if (result.code == 0) {
                    showFailMesg(result);
                    window.location = "login";
                } else {
                    showFailMesg({
                        msg: '<br>错误:' + result.message + '<br>error:' + result.error
                    });
                }

            }
        } catch (error) {
            showFailMesg({
                msg: '加载失败.' +
                '<br> 请联系系统管理员获得帮助.' +
                '</br><span class="red-color">错误: ' + error + '</span>'
            });
            return false;
        } finally {

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
    Ext.MessageBox.buttonText.yes = '<i   class=" fa fa-th  fa-check">是</i>';
    Ext.MessageBox.buttonText.no = '<i   class=" fa fa-th fa-close">否</i>';
    Ext.MessageBox.buttonText.cancel = '<i class=" fa fa-lg fa-undo">取消</i>';
    Ext.Msg.show({
        title: config.title || '确认吗?',
        message: config.msg || config.message + '<br>点击"是"确认。点击"否"退出操作' || '',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: config.fn || ''
    });
}

/**
 * 显示系统提示信息{
 * message或者msg:'提示信息'，
 *from:从哪个位置弹出来
 * timeout:显示多久,默认2秒
 *
 * }
 * @param config
 */
var toast = function (config) {
    if ((typeof config == 'string') && config.constructor == String) {
        Ext.toast({
            title: '提示',
            width: 300,
            html: '<div style="font-size: 14px;font-weight: 600;color: black">' + config + '</div>',
            animate: true,
            slideInAnimation: 'ease',
            slideInDuration: 300,
            slideOutDuration: 200,
            autoCloseDelay: 3000,
            align: 't'
        });
    }
    else if (typeof config == 'object' && config.constructor == Object) {
        Ext.toast({
            title: config.title || '注意:',
            width: config.width || 300,
            html: '<div style="font-size: 14px;font-weight: 600;color: black">' + config.msg || config.message + '</div>',
            animate: true,
            slideInAnimation: 'ease',
            slideInDuration: 300,
            slideOutDuration: 200,
            autoCloseDelay: config.timeout || 3000,
            align: config.from ? config.from : 't'
        });
    }
    else {

    }

}

/**
 *通过itemId获取组件
 */
function getCmpByItemId(itemid) {
    var me = Ext.ComponentQuery.query('#' + itemid)[0];
    if (me)
        return me;
    else
        return null;
};

/**
 * 远程从后台加载form表单的数据
 * @param view 窗口视图Ext.create创建后的，这个窗口下直接包含form
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

/**
 * setStype 方法覆盖，判断dom是否存在
 */
Ext.define('Overrides.dom.Element', {
    override: 'Ext.dom.Element',
    setStyle: function (prop, val) {
        return this.dom ? this.callParent([prop, val]) : this;
    }
});
/**
 * 给treelist 加tooltip
 */
Ext.define('Overrides.list.TreeItem', {
    override: 'Ext.list.TreeItem',
    updateNode: function (node) {
        var qtip = node && node.get('qtip');

        this.callParent(arguments);
        qtip && this.element.dom.setAttribute('data-qtip', qtip);
    }
});

/**
 * 语言覆盖
 */
Ext.define("Ext.locale.zh_CN.Window", {
    override: "Ext.window.Window",
    closeToolText: '关闭窗口'
});
Ext.define("Ext.locale.zh_CN.Panel", {
    override: "Ext.panel.Panel",
    collapseToolText: '收起',
    expandToolText: '展开'
});
/**
 * loader动态加载JS的时候出的错误捕获
 */
Ext.define("overrides.Loader", {
    override: "Ext.Loader",
    onLoadFailure: function (e) {
        showFailMesg({
            title: '无法访问服务器资源',
            msg: '页面加载失败!<br>页面名称:' + e._classNames[0] +
            '<br>请确保如下路径的文件可访问:<br>' + e.entries[0].key
        });
    }
    // ,onLoadSuccess:function () {//加载成功的
    //
    // }
});
/**
 * combo列渲染
 * @param combo
 * @returns {function(*=): *}
 */
Ext.util.Format.comboRenderer = function (combo) {
    return function (value) {
        var record = combo.findRecord(combo.valueField, value);
        return record
            ? record.get(combo.displayField)
            : combo.valueNotFoundText;
    };
};
/**
 *为form增加方法setReadOnlyForAll 全部field的readonly开关
 */
Ext.override(Ext.form.Panel, {
    setReadOnlyForAll: function (bReadOnly) {
        this.getForm().getFields().each(function (field) {
            field.setReadOnly(bReadOnly);
        });
    }
});
/**
 * vtype定义
 */
Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);
        console.log('日期范围...')
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
        var isMob = /^1[345678]\d{9}$/;
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
        var isMob = /^1[345678]\d{9}$/;
        return isMob.test(v);
    },
    cellPhoneText: '手机号码格式不正确！目前支持大陆手机号码格式，11位数字，13开头。',

    phone: function (v) {
        var isPhone = /^0(\d{2}|\d{3})\-(\d{6}|\d{7}|\d{8})$/;
        return isPhone.test(v);
    },
    phoneText: '电话号码格式不正确.比如：0351-123123123，格式:区号-号码',
    zipCode: function (v) {
        var iszipCode = /^[1-9][0-9]{5}$/;
        return iszipCode.test(v);
    },
    zipCodeText: '中国邮编必须是六位数字，开头不能为0，如：110011',
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

/**
 * 给必填选项加上红星
 */
Ext.define('luter.form.field.Base', {
    override: 'Ext.form.field.Base',
    initComponent: function () {
        var me = this;
        this.afterLabelTextTpl = new Ext.XTemplate(
            '<tpl if="this.allowBlank()">',
            '<span style = "color:red;">(*)</span>',
            '</tpl>',
            {
                disableFormats: true,
                allowBlank: function () {
                    return me.allowBlank === false;
                }
            }
        );
        this.callParent(arguments);
    }
});


/**
 * 数字倒数渐变
 * @param target
 * @param startVal
 * @param endVal
 * @param decimals
 * @param duration
 * @param options
 * @constructor
 */
var CountUp = function (target, startVal, endVal, decimals, duration, options) {
    var self = this;
    self.version = function () {
        return '1.9.3';
    };
    // default options
    self.options = {
        useEasing: true, // toggle easing
        useGrouping: true, // 1,000,000 vs 1000000
        separator: ',', // character to use as a separator
        decimal: '.', // character to use as a decimal
        easingFn: easeOutExpo, // optional custom easing function, default is Robert Penner's easeOutExpo
        formattingFn: formatNumber, // optional custom formatting function, default is formatNumber above
        prefix: '', // optional text before the result
        suffix: '', // optional text after the result
        numerals: [] // optionally pass an array of custom numerals for 0-9
    };

    // extend default options with passed options object
    if (options && typeof options === 'object') {
        for (var key in self.options) {
            if (options.hasOwnProperty(key) && options[key] !== null) {
                self.options[key] = options[key];
            }
        }
    }

    if (self.options.separator === '') {
        self.options.useGrouping = false;
    }
    else {
        // ensure the separator is a string (formatNumber assumes this)
        self.options.separator = '' + self.options.separator;
    }

    // make sure requestAnimationFrame and cancelAnimationFrame are defined
    // polyfill for browsers without native support
    // by Opera engineer Erik Möller
    var lastTime = 0;
    var vendors = ['webkit', 'moz', 'ms', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }

    function formatNumber(num) {
        var neg = (num < 0),
            x, x1, x2, x3, i, len;
        num = Math.abs(num).toFixed(self.decimals);
        num += '';
        x = num.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? self.options.decimal + x[1] : '';
        if (self.options.useGrouping) {
            x3 = '';
            for (i = 0, len = x1.length; i < len; ++i) {
                if (i !== 0 && ((i % 3) === 0)) {
                    x3 = self.options.separator + x3;
                }
                x3 = x1[len - i - 1] + x3;
            }
            x1 = x3;
        }
        // optional numeral substitution
        if (self.options.numerals.length) {
            x1 = x1.replace(/[0-9]/g, function (w) {
                return self.options.numerals[+w];
            })
            x2 = x2.replace(/[0-9]/g, function (w) {
                return self.options.numerals[+w];
            })
        }
        return (neg ? '-' : '') + self.options.prefix + x1 + x2 + self.options.suffix;
    }

    // Robert Penner's easeOutExpo
    function easeOutExpo(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
    }

    function ensureNumber(n) {
        return (typeof n === 'number' && !isNaN(n));
    }

    self.initialize = function () {
        if (self.initialized) return true;

        self.error = '';
        self.d = (typeof target === 'string') ? document.getElementById(target) : target;
        if (!self.d) {
            self.error = '[CountUp] target is null or undefined'
            return false;
        }
        self.startVal = Number(startVal);
        self.endVal = Number(endVal);
        // error checks
        if (ensureNumber(self.startVal) && ensureNumber(self.endVal)) {
            self.decimals = Math.max(0, decimals || 0);
            self.dec = Math.pow(10, self.decimals);
            self.duration = Number(duration) * 1000 || 2000;
            self.countDown = (self.startVal > self.endVal);
            self.frameVal = self.startVal;
            self.initialized = true;
            return true;
        }
        else {
            self.error = '[CountUp] startVal (' + startVal + ') or endVal (' + endVal + ') is not a number';
            return false;
        }
    };

    // Print value to target
    self.printValue = function (value) {
        var result = self.options.formattingFn(value);

        if (self.d.tagName === 'INPUT') {
            this.d.value = result;
        }
        else if (self.d.tagName === 'text' || self.d.tagName === 'tspan') {
            this.d.textContent = result;
        }
        else {
            this.d.innerHTML = result;
        }
    };

    self.count = function (timestamp) {

        if (!self.startTime) {
            self.startTime = timestamp;
        }

        self.timestamp = timestamp;
        var progress = timestamp - self.startTime;
        self.remaining = self.duration - progress;

        // to ease or not to ease
        if (self.options.useEasing) {
            if (self.countDown) {
                self.frameVal = self.startVal - self.options.easingFn(progress, 0, self.startVal - self.endVal, self.duration);
            } else {
                self.frameVal = self.options.easingFn(progress, self.startVal, self.endVal - self.startVal, self.duration);
            }
        } else {
            if (self.countDown) {
                self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration));
            } else {
                self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
            }
        }

        // don't go past endVal since progress can exceed duration in the last frame
        if (self.countDown) {
            self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
        } else {
            self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
        }

        // decimal
        self.frameVal = Math.round(self.frameVal * self.dec) / self.dec;

        // format and print value
        self.printValue(self.frameVal);

        // whether to continue
        if (progress < self.duration) {
            self.rAF = requestAnimationFrame(self.count);
        } else {
            if (self.callback) self.callback();
        }
    };
    // start your animation
    self.start = function (callback) {
        if (!self.initialize()) return;
        self.callback = callback;
        self.rAF = requestAnimationFrame(self.count);
    };
    // toggles pause/resume animation
    self.pauseResume = function () {
        if (!self.paused) {
            self.paused = true;
            cancelAnimationFrame(self.rAF);
        } else {
            self.paused = false;
            delete self.startTime;
            self.duration = self.remaining;
            self.startVal = self.frameVal;
            requestAnimationFrame(self.count);
        }
    };
    // reset to startVal so animation can be run again
    self.reset = function () {
        self.paused = false;
        delete self.startTime;
        self.initialized = false;
        if (self.initialize()) {
            cancelAnimationFrame(self.rAF);
            self.printValue(self.startVal);
        }
    };
    // pass a new endVal and start animation
    self.update = function (newEndVal) {
        if (!self.initialize()) return;
        newEndVal = Number(newEndVal);
        if (!ensureNumber(newEndVal)) {
            self.error = '[CountUp] update() - new endVal is not a number: ' + newEndVal;
            return;
        }
        self.error = '';
        if (newEndVal === self.frameVal) return;
        cancelAnimationFrame(self.rAF);
        self.paused = false;
        delete self.startTime;
        self.startVal = self.frameVal;
        self.endVal = newEndVal;
        self.countDown = (self.startVal > self.endVal);
        self.rAF = requestAnimationFrame(self.count);
    };

    // format startVal on initialization
    if (self.initialize()) self.printValue(self.startVal);
};
