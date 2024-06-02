sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, MessageToast) {
        "use strict";

        return Controller.extend("projectcust.controller.Login", {
            onInit: function () {
            // OData 모델을 여기서 설정합니다. manifest에 설정되어 있지 않은 경우
                var oModel = this.getOwnerComponent().getModel();

                this.oRouter = this.getOwnerComponent().getRouter();

                // this.byId("idImage").setSrc(_rootPath + "/image/003.png");

            },
    
            onLogin: function () {
                var oDataModel = this.getOwnerComponent().getModel();
                var oView = this.getView();
                var sEmail = oView.byId("email").getValue();
                var sPassword = oView.byId("password").getValue();
            
                var aFilter = [];
            
                if (sEmail) {
                    aFilter.push(new Filter("Email", FilterOperator.EQ, sEmail));
                }
                if (sPassword) {
                    aFilter.push(new Filter("Custpw", FilterOperator.EQ, sPassword));
                }
            
                if (sEmail && sPassword) {
                    oDataModel.read("/CustomEntitySet", {
                        filters: aFilter,
                        success: function (oData) {
                            console.log('>> oData.results : ', oData.results[0].Custcode);
                            if (oData.results && oData.results.length > 0) {
                                // 이메일과 비밀번호가 일치하는 경우
                                console.log('custcode : ', oData.results[0].Custcode);
                                if (this.oRouter) {
                                    // this.oRouter.navTo('RouteMain', {}, true);
                                    this.oRouter.navTo('RouteMain', {
                                        custCode: oData.results[0].Custcode
                                    }, true);
                                } else {
                                    console.error("oRouter가 초기화되지 않았습니다.");
                                }
                            } else {
                                // 이메일과 비밀번호가 일치하지 않는 경우
                                MessageToast.show("이메일 또는 비밀번호가 잘못되었습니다.");
                            }
                        }.bind(this),
                        error: function (oError) {
                            console.error("Error fetching customer data:", oError);
                        }
                    });
                } else {
                    // 유효하지 않은 입력 처리
                    MessageToast.show("email 또는 Password가 없습니다!");
                }
            },


        });
    });