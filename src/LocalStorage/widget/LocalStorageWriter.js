define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",


], function(declare, _WidgetBase, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent) {
    "use strict";

    return declare("LocalStorage.widget.LocalStorageWriter", [_WidgetBase], {

        keyName: null,
        onnullMF: null,
        overwrite: null,
        attribute: null,
        reWriteOnChange: null,
        // Internal variables.
        _handles: null,
        _contextObj: null,

        constructor: function() {
            this._handles = [];
        },

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
        },

        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            // var self = this;

            // 3. if not, call onnullMF and..
            // 4. set the value of the item to the result
            // 5. call the continueMF

            if (!window.localStorage) {
                console.log('This browser does not support localstorage');
                return;
            } else if (this.overwrite == false && localStorage.getItem(this.keyName) && localStorage.getItem(this.keyName) != "") {
                console.log('The LocalStorage item already exists and we are not overwriting.')
                return;
            }
            if (this.reWriteOnChange === true) {
                // add handler
                var _attrHandler = this.subscribe({
                    guid: obj.getGuid(),
                    attr: this.attribute,
                    callback: lang.hitch(this, function(guid, attr, attrValue) {
                        this._executeMicroflowWriteLS(this.onnullMF, obj.getGuid(), this.keyName);
                    })
                })
                this._handles.push(_attrHandler);
            }
            this._executeMicroflowWriteLS(this.onnullMF, obj.getGuid(), this.keyName);



            this._contextObj = obj;
            this._updateRendering(callback);
        },

        resize: function(box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function() {
            logger.debug(this.id + ".uninitialize");
        },

        _executeMicroflowWriteLS: function(mfName, guid, keyName) {
            // return new Promise(function(resolve, reject) {
            mx.data.action({
                params: {
                    actionname: mfName,
                    applyto: "selection",
                    guids: [guid]
                },
                callback: lang.hitch(this, function(res) {
                    localStorage.setItem(keyName, res);
                    // resolve(res)
                }),
                error: function(err) {
                    console.log(err);
                    // reject(err)
                }
            });
            // });

        },

        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback);
        },

        _executeCallback: function(cb) {
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["LocalStorage/widget/LocalStorageWriter"]);