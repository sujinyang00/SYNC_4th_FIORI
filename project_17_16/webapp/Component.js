/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */
//변수 선언
var _rootPath = jQuery.sap.getModulePath("project1716").split('/~')[0];
// debugger;

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "project1716/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("project1716.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);