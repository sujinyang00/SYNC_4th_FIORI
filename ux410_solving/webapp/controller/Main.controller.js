sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel) {
        "use strict";

        return Controller.extend("sap.btp.ux410solving.controller.Main", {
            onInit: function () {
                var oData = {
                    OrderID: ''
                };
                var oType = {                    
                    type: [
                        {typeName: 'bar'},
                        {typeName: 'column'},
                        {typeName: 'line'},
                        {typeName: 'donut'}
                    ]
                };
                this.getView().setModel(new JSONModel(oData), 'search');
                this.getView().setModel(new JSONModel(oType), 'typeList');


                //Router
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteMain").attachPatternMatched(this._onPatternMatched, this);
            },
            _onPatternMatched: function(oEvent) {
                var oArgu = oEvent.getParameters().arguments;

                // console.log(oArgu);
            },
            onSearch: function() {
                var aFilter = [];
                    
                var sOrderId = '';
                if (sOrderId) sOrderId = this.byId("idCombo1").getSelectedItem().getText();
                // console.log(sOrderId);

                var oModel = this.getView().getModel("search");
                var oData = {
                    OrderID: sOrderId
                };
                
                oModel.setData(oData);

                var sType = 'bar';
                if(sType) sType = this.byId("idCombo2").getSelectedItem().getText();
                // console.log(oTypeList.typeName);
                this.byId("idBarChart").setVizType(sType);
                
                
                if(sOrderId) {
                    aFilter.push(new Filter('OrderID', FilterOperator.EQ, sOrderId));                    
                    this.byId("idBarChart").getDataset().getBinding("data").filter(new Filter(aFilter));
                }

            },
            onDatasetSelected: function(oEvent) {  
               
                var sOrderId = oEvent.getParameters().data[0].data.OrderID;
                var sProductId = oEvent.getParameters().data[0].data.ProductID;
                
        
                //Router -Detail로 이동
                this.oRouter.navTo('RouteDetail',{
                    oid: sOrderId,
                    pid: sProductId
                }, true);
                
            }
        });
    });
