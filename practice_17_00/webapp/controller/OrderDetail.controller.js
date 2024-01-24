sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("practice1700.controller.OrderDetail", {
            onInit: function () {

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteOrderDetail").attachPatternMatched(this._onPatternMatched, this);
            },

            onNavBack: function() {
                this.getOwnerComponent().getRouter().navTo('RouteMain', {});
            },

            _onPatternMatched: function(oEvent) {
                var oArgu = oEvent.getParameters().arguments;
                //this.byId("idOrderID_Detail").setText(oArgu.oid);


                //Form에 바인딩
                // "/EntitySetName(key='1',key='2')"
                // "/EntitySetName('1')"
                this.byId("idForm").bindElement(`/Orders(${oArgu.oid})`);
                
            }





        });
    });
