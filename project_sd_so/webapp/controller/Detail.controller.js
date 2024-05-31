sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, Sorter) {
        "use strict";

        return Controller.extend("exam.exprogram17.controller.Detail", {
            onInit: function () {

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);
            },

            onNavBack: function() {
                this.getOwnerComponent().getRouter().navTo('RouteMain', {});
            },

            _onPatternMatched: function(oEvent) {
                var oArgu = oEvent.getParameters().arguments;
                this.byId("page").setTitle(oArgu.pName+' 상품의 주문 조회');


                //Table에 바인딩
                var aFilter = [];

                if(oArgu.pName) {
                    aFilter.push(new Filter("ProductName", FilterOperator.EQ, oArgu.pName));
                    console.log(aFilter);
                }
                this.byId("idProductsTable").getBinding("items").filter(aFilter);
                


            }





        });
    });
