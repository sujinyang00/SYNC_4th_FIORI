sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("practice1700.controller.Filtering", {
            onInit: function () {
                var oData = {
                    OrderID: '',
                    CustomerID: '',
                    OrderDate_start: null,
                    OrderDate_end: null
                };
                this.getView().setModel(new JSONModel(oData), 'search'); //search모델 생성

                //Router 객체 생성
                this.oRouter = this.getOwnerComponent().getRouter();
            },

            fnDateToString: function(sValue) {
                if(sValue) {
                    var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: 'yyyy년 MM월 dd일'
                    });

                    return oFormat.format(sValue);
                }
            },

            onSearch: function() {                
                //*** 2️⃣model객체 값으로 가져오기 ***/
                var oSearch = this.getView().getModel("search").getData();
                var sOrderId = oSearch.OrderID;
                var sCustomerId = oSearch.CustomerID;
                var oStartDate = oSearch.OrderDate_start;
                var oEndDate = oSearch.OrderDate_end;

                var aFilter = []; //필터

                //console.log('OrderId: ', sOrderId, "CustomerId: ",sCustomerId, 'StartDate: ',sStartDate, "EndDate: ", sEndDate);

                if (sOrderId) {
                    aFilter.push(new Filter('OrderID', FilterOperator.EQ, sOrderId));
                }
                if (sCustomerId){
                    aFilter.push(new Filter('CustomerID', FilterOperator.Contains, sCustomerId));
                }
                if(oStartDate && oEndDate) {
                    aFilter.push(new Filter('OrderDate', FilterOperator.BT, oStartDate, oEndDate));
                }
                
                
                if(aFilter){
                    this.byId("idOrdersTable").getBinding("items").filter(aFilter); //table에 바인딩된 정보의 items에 필터적용                    
                } else {
                    this.byId("idOrdersTable").getBinding("items").filter(); //table에 바인딩된 정보의 items에 필터적용                                        
                }

            },
            
            onSelectionChange: function(oEvent) {

                var sPath = oEvent.getParameters().listItem.getBindingContextPath(); //상대 경로로 지정되어 있는 DataSet에서 사용자가 선택한 Row의 모델 경로 얻음
                console.log('sPath: ', sPath);
                var oSelectData = this.getView().getModel().getProperty(sPath); //한 건의 model data - 모델경로로 해당 경로의 전체 데이터 얻음


                //console.log('OrderID: ', oSelectData.OrderID);

                this.oRouter.navTo('RouteOrderDetail', {
                    oid: oSelectData.OrderID
                }, true);
            }





        });
    });
