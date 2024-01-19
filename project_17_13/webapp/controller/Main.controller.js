sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, ODataModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("opdata.project1713.controller.Main", {
            onInit: function () {
                this.oData = {
                    Productno: "17",
                    Productname: "상품명",
                    Fname: "Yang",
                    Lname: "Sujin",
                    Memo: "메모",
                }

                this.getView().setModel(new JSONModel(this.oData), 'data');
            },
            onCloseDialog: function(oEvent) {
                oEvent.getSource().getParent().close();
            },
            
            onRowSelectionChange: function(oEvent) {  
                // ⭐ Row 선택해제 되었을 때도 '선택' 된 것이기 때문에 이벤트 발생
                // ⭐ 따라서 rowContext가 없을 땐 함수 종료하도록 함
                if (!oEvent.getParameter('rowContext')) return;
                  
                var sPath = oEvent.getParameter('rowContext').getPath(); //Product('1000')                                
                var oSelectData = this.getView().getModel().getProperty(sPath); //한 건의 model data - 모델경로로 해당 경로의 전체 데이터 얻음

                var oData = {
                    Productno: oSelectData.Productno,
                    Productname: oSelectData.Productname,
                    Fname: oSelectData.Fname,
                    Lname: oSelectData.Lname,
                    Memo: oSelectData.Memo,
                };

                this.getView().getModel("data").setData(oData);
            },

            onClickReset: function() {            
                this.getView().getModel("data").setData({
                    Productno: "",
                    Productname: "",
                    Fname: "",
                    Lname: "",
                    Memo: "",
                });

                //table 선택값도 clear
                this.byId("idTable").clearSelection();
                this.getView().getModel().refresh(true);
            },

            onEntity: function() { 
                // 데이터 한 건 조회
                // GET 요청 : "/Products(ProductNo='1')"
                var oJSONData = this.getView().getModel('data').getData();
                var oDataModel = this.getView().getModel();
                var sPath = oDataModel.createKey("/Products", {
                    // Productno: '1117'
                    Productno: oJSONData.Productno
                }); //sPath값 => "/Products('1000')"
                oDataModel.read(sPath, {
                    success: function(oReturn) {
                        sap.m.MessageToast.show("✅ 데이터 한건조회 완료");
                        console.log('Products 데이터 한 건 조회 : ',oReturn);
                    },
                    error: function(oError){
                        MessageBox.success("⚠️ 데이터 한 건 조회 실패");
                    }
                });

            },
            onEntitySet: function() {
                // 전체조회 구현 
                // Get 요청 : "/Products"
                var oDataModel = this.getView().getModel();
                
                // 🪄 Filter 구현 -Productname에 안녕이 포함된 값 조회
                var oFilter = new Filter("Productname", FilterOperator.EQ, "안녕"); //path, operator, value1, value2
                
                var oDialog = this.byId("idDialog");
                
                oDataModel.read("/Products", {
                    filters: [oFilter],
                    success: function(oReturn) {
                        console.log("Products 전체조회 : ", oReturn);
                        
                        oDialog.setModel(new JSONModel(oReturn), 'popup');
                        oDialog.open();
                    },
                    error: function(oError) {
                        console.log("Products 전체조회 중 오류 발생: ", oError);
                    }
                });


            },
            onCreate: function() {
                var oDataModel = this.getView().getModel();  
                var oJSONData = this.getView().getModel('data').getData();

                var oBody = {
                    Productno: oJSONData.Productno,
                    Productname: oJSONData.Productname || '',
                    Fname: oJSONData.Fname || '',
                    Lname: oJSONData.Lname || '',
                    Memo: oJSONData.Memo || '',
                };

                oDataModel.create("/Products", oBody, {
                    success: function() {
                        sap.m.MessageToast.show("✅ 데이터 생성 완료");
                    },
                    error: function() {
                        sap.m.MessageToast.show("⚠️ 데이터 생성 실패");
                    }
                });
            },

            onUpdate: function() {
                // 데이터 변경 요청
                // PUT 요청 : "/Products('1000')" + Body
                var oBody = this.getView().getModel('data').getData();
                var oDataModel = this.getView().getModel();  

                var sPath = oDataModel.createKey("/Products", {
                    Productno: oBody.Productno
                });

                oDataModel.update(sPath, oBody, {
                    success: function() {
                        sap.m.MessageToast.show("✅ 데이터 수정 완료");
                    },
                    error: function() {
                        sap.m.MessageToast.show("⚠️ 데이터 수정 실패");
                    }
                });
            },

            onDelete: function() {
                // 데이터 삭제 요청
                // DELETE 요청 : "/Products('1000')"
                var oBody = this.getView().getModel('data').getData();
                var oDataModel = this.getView().getModel();

                var sPath = oDataModel.createKey("/Products", {
                    Productno: oBody.Productno
                }); // => /Products('키값')과 동일 

                oDataModel.remove(sPath, {
                    success: function(oReturn) {
                        sap.m.MessageToast.show("✅ 데이터 삭제 완료");
                        console.log('Products 삭제 : ',oReturn);
                    },
                    error: function(oError) {
                        sap.m.MessageToast.show("⚠️ 데이터 삭제 실패");
                        console.log("Products 삭제 중 오류 발생: ", oError);
                    }
                })
            }
        });
    });
