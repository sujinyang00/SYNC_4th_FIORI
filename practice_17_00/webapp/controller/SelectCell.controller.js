sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("practice1700.controller.SelectCell", {
            onInit: function () {
                var oData = {
                    list: [
                        { num1: 1, description: '설명' }
                    ]                    
                }
                this.getView().setModel(new JSONModel(oData));
            },

            onAdd: function() {
                var oModel = this.getView().getModel();
                var aList = oModel.getProperty("/list");

                aList.push({ num1: 123, description: '설명자리'});
                oModel.setProperty("/list", aList);
            },
            onDelete: function() {
                var oInxList = this.byId("idSelectTable").getSelectedIndices();
                var oModel = this.getView().getModel();
                var aList = oModel.getProperty("/list");
                var len = oInxList.length;

                for(var i=len-1; i>=0; i--){
                    aList.splice(oInxList[i],1);
                }
                oModel.setProperty("/list", aList);

            },
            onRowDelete: function(oEvent) {
                var delIdx = oEvent.getParameters().row.getIndex(); // idx추출
                var oModel = this.getView().getModel();
                var aList = oModel.getProperty("/list");

                aList.splice(delIdx, 1);
                oModel.setProperty("/list", aList);
            }
            



        });
    });
