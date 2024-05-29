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

        return Controller.extend("projectcust.controller.Product", {
            onInit: function () {

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteProduct").attachPatternMatched(this._onPatternMatched, this);
                
                var oProductsModel = this.getOwnerComponent().getModel();
                this.getView().setModel(oProductsModel,"products");
            },

            onNavBack: function() {
                this.getOwnerComponent().getRouter().navTo('RouteMain', {});
            },

            _onPatternMatched: function(oEvent) {
                var oArgu = oEvent.getParameters().arguments;                         
                
                
                //Table에 바인딩
                var aFilter = [];
                
                if(oArgu.mCode) {
                    aFilter.push(new Filter("Matcode", FilterOperator.EQ, oArgu.mCode));
                    console.log(aFilter);
                }
                this.byId("idProductsTable").getBinding("items").filter(aFilter);

                //상품명 가져오기 
                var oTable = this.byId("idProductsTable");
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilter);

                // Wait for the data to be available
                oBinding.attachEventOnce("dataReceived", function() {
                    var aItems = oTable.getItems();
                    if (aItems.length > 0) {
                        var oContext = aItems[0].getBindingContext("products");
                        var sMatname = oContext.getProperty("Matname");
                        this.byId("page").setTitle(sMatname + '의 상품상세');

                        //자재명
                        this.byId("HeaderMatName").setTitle(sMatname);
                        //판매가
                        var sMatprice = oContext.getProperty("Matprice");
                        this.byId("HeaderMatprice").setText(sMatprice * 100);
                        this.byId("HeaderMatName").setNumber(sMatprice * 100);
                        //월 렌탈료 5,7년
                        var sMb1 = oContext.getProperty("Mb1");
                        this.byId("HeaderMb1").setText(sMb1);
                        var sMb2 = oContext.getProperty("Mb2");
                        this.byId("HeaderMb2").setText(sMb2);
                        //이미지를 위한 Matcode
                        var sMatcode = oContext.getProperty("Matcode");
                    
                        // 이미지 설정
                        var sImageUrl = this.setImageUrl(sMatcode);
                        this.byId("idProductImage").setSrc(sImageUrl);
                        
                    } else {
                        this.byId("page").setTitle('상품의 주문 조회');
                    }
                }.bind(this));                

            },
            
            setImageUrl: function(sValue) {
                return `${_rootPath}/image/${sValue}.png`;
            },

            handleSelectionChange: function(oEvent) {
                var oSelectedItem = oEvent.getParameter("item");
                var sKey = oSelectedItem.getKey();
                
                // 각 버튼에 대한 콘솔 출력
                if (sKey === "Purchase") {
                    console.log("즉시구매 버튼 클릭됨");
                } else if (sKey === "Rent5") {
                    console.log("5년 렌탈 버튼 클릭됨");
                } else if (sKey === "Rent7") {
                    console.log("7년 렌탈 버튼 클릭됨");
                }
               
            },





        });
    });
