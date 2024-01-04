sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1706.controller.Main", {
            onInit: function () {

            },

            HelloButtonPress: function() {
                
                sap.m.MessageToast.show("Hellooooo")
            },
            onOpenDialog: function() {
                this.byId("idDialog").open();
            },        
            onClose: function() {
                this.byId("idDialog").close();
            }
        });
    });
