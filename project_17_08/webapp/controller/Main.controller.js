sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1708.controller.Main", {
            onInit: function () {
                var oData = {
                    list: [
                        
                    ]
                };
                var oModel = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(oModel); //기본모델로 이름없이 세팅
            },
            onAdd: function() {
                var oModel = this.getView().getModel();
                //var aList = oModel.getData().list;
                var aList = oModel.getProperty("/list");

                aList.push({
                    name: 'hihi',
                    age: 20
                });
                //oModel.setData({list: aList}, true);
                oModel.setProperty("/list", aList);
                

            },
            onDelete: function(oEvent) {
                var oTable = this.byId("idTable");
                var oModel = this.getView().getModel();
                var aList = oModel.getProperty("/list");
                var oIndexList = oTable.getSelectedIndices();
                var len = oIndexList.length; //list = [1,3,5]

                for (var i=len-1; i>=0; i--){
                    aList.splice(oIndexList[i], 1);
                }
                oModel.setProperty("/list", aList);
            },

            onRowDelete: function(oEvent) {
                //debugger;

                var oModel = this.getView().getModel();
                var aList = oModel.getProperty("/list");
                var delIndex = oEvent.getParameters().row.getIndex();
                console.log('del index: '+delIndex);

                //해당 인덱스의 모델 데이터 삭제                
                aList.splice(delIndex, 1);
                oModel.setProperty("/list", aList);

            }
        });
    });
