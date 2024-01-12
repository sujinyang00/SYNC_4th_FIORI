sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, JSONModel, Fragment) {
        "use strict";

        return Controller.extend("odata.project1709.controller.Main", {
            onInit: function () {
                var oData = {
                    OrderID: '',
                    CustomerID: '',
                    OrderDate_start: null,
                    OrderDate_end: null
                };
                this.getView().setModel(new JSONModel(oData), 'search'); //search모델 생성


                //Router
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteMain").attachPatternMatched(this._onPatternMatched, this);

                
            },
            _onPatternMatched: function(oEvent) {
                var oArgu = oEvent.getParameters().arguments;

                // console.log(oArgu);
            },

            onSearch: function() {
                var aFilter = []; //사용자가 고른 filter를 담을 배열
                
                //*** 1️⃣id 값으로 가져오기 ***/
                // var sOrderId = this.byId("idOrderID").getValue();
                // var sCustomerId = this.byId("idCustomerID").getValue();
                // var oStartDate = this.byId("idOrderDate").getDateValue();
                // var oEndDate = this.byId("idOrderDate").getSecondDateValue();
                

                //*** 2️⃣model객체 값으로 가져오기 ***/
                var oSearch = this.getView().getModel("search").getData();
                var sOrderId = oSearch.OrderID;
                var sCustomerId = oSearch.CustomerID;
                var oStartDate = oSearch.OrderDate_start;
                var oEndDate = oSearch.OrderDate_end;

                // debugger;

                        
                //**************** 1️⃣ 필터 하나씩 추가 ************************/
                //방법1️⃣
                // if(sOrderId) {
                //     var oFilter = new Filter({
                //         path: 'OrderID', //필터 적용할 대상 필드명
                //         operator: FilterOperator.EQ, //연산자 "EQ" 라도 해도 됨 
                //         value1: sOrderId, //BT 의 경우 From
                //         value2: '' //BT의 경우 To
                //     });
                //     aFilter.push(oFilter);                    
                // }
                // //방법2️⃣
                // if(sOrderId){
                //     aFilter.push(new Filter('OrderID', 'EQ', sOrderId));
                // }

                //방법1️⃣
                // if(sCustomerId) {
                //     var oFilter = new Filter({
                //         path: 'CustomerID',
                //         operator: FilterOperator.Contains,
                //         value1: sCustomerId,
                //         value2: ''
                //     });
                //     aFilter.push(oFilter);
                // }
                // //방법2️⃣
                // if(sCustomerId) {
                //     aFilter.push(new Filter('CustomerID', 'Contains', sCustomerId)); 
                // }

                // //방법1️⃣
                // if(oStartDate && oEndDate) {
                //     var oFilter = new Filter({
                //         path: 'OrderDate',
                //         operator: FilterOperator.BT,
                //         value1: oStartDate,
                //         value2: oEndDate
                //     });
                //     aFilter.push(oFilter);
                // }                
                
                // //방법2️⃣
                // if(oStartDate && oEndDate) {
                //     aFilter.push(new Filter('OrderDate', 'BT', oStartDate, oEndDate));
                // }
            
                // this.byId("idTable").getBinding("items").filter(aFilter); //table에 binding된 정보의 items에 필터추가





                /***************** 2️⃣ filters 사용******************/            
                if(sOrderId) aFilter.push(new Filter('OrderID', 'EQ', sOrderId));
                if(sCustomerId) aFilter.push(new Filter('CustomerID','Contains', sCustomerId));
                if(oStartDate && oEndDate) aFilter.push(new Filter('OrderDate', 'BT', oStartDate, oEndDate));




                if(aFilter){
                    this.byId("idTable").getBinding("items").filter(new Filter({
                        filters: aFilter,
                        and: true
                    }));
                } else {
                    this.byId("idTable").getBinding("items").filter();
                }


                

            },

            onSelectionChange: function(oEvent) {
                
                var sPath = oEvent.getParameters().listItem.getBindingContextPath(); //상대 경로로 지정되어 있는 DataSet에서 사용자가 선택한 Row의 모델 경로 얻음
                var oSelectData = this.getView().getModel().getProperty(sPath); //한 건의 model data - 모델경로로 해당 경로의 전체 데이터 얻음

                //alert(oSelectData.OrderID);

                var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern: 'yyyy-MM-dd'
                });        

                var oData = {
                    Orders: [{
                        OrderID: oSelectData.OrderID,
                        CustomerID: oSelectData.CustomerID,
                        EmployeeID: oSelectData.EmployeeID,
                        OrderDate: oFormat.format(oSelectData.OrderDate), //데이터 포멧
                        RequiredDate: oFormat.format(oSelectData.RequiredDate),
                        ShippedDate: oFormat.format(oSelectData.ShippedDate),
                        ShipVia: oSelectData.ShipVia,
                        Freight: oSelectData.Freight,
                        ShipName: oSelectData.ShipName,
                        ShipAddress: oSelectData.ShipAddress,
                        ShipCity: oSelectData.ShipCity,
                        ShipRegion: oSelectData.ShipRegion,
                        ShipPostalCode: oSelectData.ShipPostalCode,
                        ShipCountry: oSelectData.ShipCountry
                    }]
                };

                //local 모델 가져와
                var oLocalModel = this.getView().getModel("local");
                
                //local 모델에 set
                oLocalModel.setData(oData);
                
                this.getView().setModel(oLocalModel, "local");

                console.log('local 모델의 data');
                console.log(oLocalModel.getData());

                this.byId("idOrdersTable").bindElement({
                        path: '/Orders',
                        model: 'local'
                });
            

                //Dialog 호출
                //this.byId("idOrdersDialog").open();

                //Detail page 이동 
                this.oRouter.navTo('RouteDetail',{
                    oid: oSelectData.OrderID
                }, true);


            },
            onClose: function(oEvent) {
                oEvent.getSource().getParent().close();
            },


            fnDateToString: function(sValue) {
                if(sValue) {
                    var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: 'yyyy-MM-dd' // 'yyyy/mm/dd' 이렇게도 할 수 있음
                    }); //Date 관련 포맷 객체 생성

                    return oFormat.format(sValue); //2024-01-09 이런식으로
                }
            },
            onValueHelpRequest: function() {
                this.byId("idCustomerDialog").open();

                //sap.m.MessageToast.show('팝업 오픈');
            }
        });
    });
