Ext.define('luter.ux.Video', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.lutervideo',
    layout: 'fit',
    autoplay: false,
    controls: true,
    bodyStyle: 'background-color:#000;color:#fff',
    html: 'luter',
    tpl: [
        '<video id="{id}-video" autoPlay="{autoplay}" controls="{controls}" poster="{poster}" start="{start}"' +
        ' loopstart="{loopstart}" loopend="{loopend}" autobuffer="{autobuffer}" loop="{loop}" ' +
        ' style="width:100%;height:100%;object-fit:fill">',
        '<tpl for="src">',
        '<source src="{src}" type="{type}"/>',
        '</tpl>',
        '{html}',
        '</video>'
    ],

    initComponent: function () {

        var me = this,
            fallback,
            size,
            cfg,
            el;

        if (me.fallbackHTML) {
            fallback = me.fallbackHTML;
        } else {
            fallback = "你这浏览器不支持Html5的视频播放功能，你应该装个好一点的浏览器. ";

            if (Ext.isChrome) {
                fallback += '升级Chrome.';
            } else if (Ext.isGecko) {
                fallback += ' 升级到 Firefox 3.5 或者更新.';
            } else {
                var chrome = '<a href="http://www.google.com/chrome">Chrome</a>';
                fallback += 'Please try <a href="http://www.mozilla.com">Firefox</a>';

                if (Ext.isIE) {
                    fallback += ', ' + chrome +
                        ' or <a href="http://www.apple.com/safari/">Safari</a>.';
                } else {
                    fallback += ' or ' + chrome + '.';
                }
            }
        }
        me.fallbackHTML = fallback;

        cfg = me.data = Ext.copyTo({
                tag: 'video',
                html: fallback
            },
            me, 'id,poster,start,loopstart,loopend,playcount,autobuffer,loop');

        // just having the params exist enables them
        if (me.autoplay) {
            cfg.autoplay = 1;
        }
        if (me.controls) {
            cfg.controls = 1;
        }

        // handle multiple sources
        if (Ext.isArray(me.src)) {
            cfg.src = me.src;
        } else {
            cfg.src = [{src: me.src}];
        }
        me.callParent();
    },

    afterRender: function () {
        var me = this;
        me.callParent();
        me.video = me.body.getById(me.id + '-video');
        el = me.video.dom;
        me.supported = (el && el.tagName.toLowerCase() == 'video');
        if (me.supported) {
            me.video.on('error', me.onVideoError, me);
        }
    },

    getFallback: function () {
        return '<h1 style="background-color:#ff4f4f;padding: 10px;">' + this.fallbackHTML + '</h1>';
    },

    onVideoError: function () {
        var me = this;

        me.video.remove();
        me.supported = false;
        me.body.createChild(me.getFallback());
    },

    onDestroy: function () {
        var me = this;

        var video = me.video;
        if (me.supported && video) {
            var videoDom = video.dom;
            if (videoDom && videoDom.pause) {
                videoDom.pause();
            }
            video.remove();
            me.video = null;
        }

        me.callParent();
    }
});