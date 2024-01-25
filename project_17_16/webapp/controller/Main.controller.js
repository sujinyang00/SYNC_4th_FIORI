sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, ODataModel, MessageBox, Fragment, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("project1716.controller.Main", {
            onInit: function () {
                this.byId("idImage").setSrc(_rootPath+"/image/mudo2.png");


                var oDataModel = this.getOwnerComponent().getModel();
                oDataModel.read("/Member", {
                    success: function(oReturn) {
                        MessageBox.success("✅ 데이터 전체조회 완료");
                        console.log('Member 전체조회 : ', oReturn);
                         

                    }, 
                    error: function(oError) {
                        MessageBox.success("⚠️ 데이터 전체조회 실패");
                        console.log("Member 전체조회 중 오류 발생: ", oError);
                    }
                });

            },

            setImageUrl: function(sValue) {
                return `${_rootPath}/image/${sValue}.png`;
            }

        });
    });
