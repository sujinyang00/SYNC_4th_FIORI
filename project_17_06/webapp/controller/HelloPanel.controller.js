sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.Fragment} Fragment
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1706.controller.HelloPanel", {
            onInit: function () {

            },

            onShowHello: function () {
                var oInput = this.byId("input1").getValue();
                sap.m.MessageToast.show(oInput);

            }


        });
    });
