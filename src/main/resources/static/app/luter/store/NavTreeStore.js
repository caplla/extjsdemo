Ext.define('luter.store.NavTreeStore', {
    extend: 'Ext.data.TreeStore',
    fields: ['id', 'text', 'leaf', 'module', 'tips', 'icon'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: '/resource/getSysUserTreeData',
        reader: {
            type: 'json',
            root: 'children',
            successProperty: 'success'
        },

        actionMethods: {
            read: 'GET'
        },
        listeners: {
            exception: function (proxy, response, operation, eOpts) {
                DealAjaxResponse(response);
            }
        }
    },
    root: {
        text: '功能菜单',
        id: 0,
        leaf: false,
        expanded: false
    },

    listeners: {
        beforeload: function (store, operation, eOpts) {
            if (store.isLoading()) return false;
        },

        nodeappend: function (me, node, index, eOpts) {
            //展开节点。
            if (!node.isRoot() && !node.get('leaf')) {
                node.set('expanded', true);
            }

        }
    }
});
/**
 * 解决问题：主要是因为RootTreeItem引起
 * ext-all.js?v=20000000:22 Uncaught TypeError: b.getFloated is not a function
 */

Ext.define('Overrides.list.RootTreeItem', {
    override: 'Ext.list.RootTreeItem',
    config: {
        floated: null
    },
    setFloated: function (floated) {
        var me = this,
            el = me.element,
            placeholder = me.placeholder,
            node, wasExpanded;
        if (me.treeItemFloated !== floated) {
            if (floated) {
                placeholder = el.clone(false, true);
                placeholder.id += '-placeholder';
                me.placeholder = Ext.get(placeholder);
                me.wasExpanded = me.getExpanded();
                me.setExpanded(true);
                el.addCls(me.floatedCls);
                el.dom.parentNode.insertBefore(placeholder, el.dom);
                me.floater = me.createFloater();
            }
            else if (placeholder) {
                wasExpanded = me.wasExpanded;
                node = me.getNode();
                me.setExpanded(wasExpanded);
                if (!wasExpanded && node.isExpanded()) {
                    me.preventAnimation = true;
                    node.collapse();
                    me.preventAnimation = false;
                }
                me.floater.remove(me, false);
                el.removeCls(me.floatedCls);
                placeholder.dom.parentNode.insertBefore(el.dom, placeholder.dom);
                placeholder.destroy();
                me.floater.destroy();
                me.placeholder = me.floater = null;
            }
            me.treeItemFloated = floated;
        }
    },
    getFloated: function () {
        return this.treeItemFloated;
    },
    runAnimation: function (animation) {
        return this.itemContainer.addAnimation(animation);
    },
    stopAnimation: function (animation) {
        animation.jumpToEnd();
    },
    privates: {
        createFloater: function () {
            var me = this,
                owner = me.getOwner(),
                ownerTree = me.up('treelist'),
                floater,
                toolElement = me.getToolElement();
            me.floater = floater = new Ext.container.Container({
                cls: ownerTree.self.prototype.element.cls + ' ' + ownerTree.uiPrefix + ownerTree.getUi() + ' ' + Ext.baseCSSPrefix + 'treelist-floater',
                floating: true,
                width: Ext.isIE8 ? 200 : (ownerTree.expandedWidth - toolElement.getWidth()),
                shadow: false,
                renderTo: Ext.getBody(),
                listeners: {
                    element: 'el',
                    click: function (e) {
                        return owner.onClick(e);
                    }
                }
            });
            floater.add(me);
            floater.show();
            floater.el.alignTo(toolElement, 'tr?');
            return floater;
        }
    }
});