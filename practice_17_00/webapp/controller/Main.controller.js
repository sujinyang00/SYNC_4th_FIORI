sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("practice1700.controller.Main", {
            onInit: function () {
                
            },

            onOpenNameDialog: function() {
                this.byId("idNameDialog").open();
            },
            onCloseNameDialog: function(oEvent) {
                oEvent.getSource().getParent().close();
            }





        });
    });
