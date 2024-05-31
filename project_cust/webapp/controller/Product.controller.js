sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/library",
    "sap/ui/model/Sorter",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Device, JSONModel, Filter, FilterOperator, library,Sorter, MessageToast, MessageBox) {
        "use strict";
        var sCustcode = '';
        var aFilter2 = [];        

        return Controller.extend("projectcust.controller.Product", {
            onInit: function () {

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteProduct").attachPatternMatched(this._onPatternMatched, this);
                
                var oProductsModel = this.getOwnerComponent().getModel();
                this.getView().setModel(oProductsModel,"products");

                //장바구니
                var oDataModel2 = this.getOwnerComponent().getModel();
                oDataModel2.read("/CartEntitySet", {
                    filters: aFilter2,
                    success: function(oReturn) { 
                        console.log('Cart 전체조회 : ', oReturn.results);
                        
                        // this.getView().setModel(oDataModel2,"payment");

                        // 'payment' 모델에 필터된 데이터를 설정
                        var paymentModel = new sap.ui.model.json.JSONModel();
                        paymentModel.setData({ CartEntitySet: oReturn.results });
                        this.getView().setModel(paymentModel, "payment");
                        
                        // 바인딩 업데이트
                        this.getView().byId("idProductList").getBinding("items").refresh();
                    
                    
                    }.bind(this),
                    error: function(oError) {
                        console.log("Cart 전체조회 중 오류 발생: ", oError);
                    }
                });

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
                        // 판매가
                        var sMatprice = oContext.getProperty("Matprice");
                        var formattedMatprice = this.setPrice(sMatprice);
                        this.byId("HeaderMatprice").setText(formattedMatprice);
                        this.byId("HeaderMatName").setNumber(formattedMatprice);
                        
                        // 월 렌탈료 5, 7년
                        var sMb1 = oContext.getProperty("Mb1");
                        var formattedMb1 = this.setPrice2(sMb1);
                        this.byId("HeaderMb1").setText(formattedMb1);
                        
                        var sMb2 = oContext.getProperty("Mb2");
                        var formattedMb2 = this.setPrice2(sMb2);
                        this.byId("HeaderMb2").setText(formattedMb2);
                        //이미지를 위한 Matcode
                        var sMatcode = oContext.getProperty("Matcode");
                    
                        // 이미지 설정
                        var sImageUrl = this.setImageUrl(sMatcode);
                        this.byId("idProductImage").setSrc(sImageUrl);
                        
                    } else {
                        this.byId("page").setTitle('상품의 주문 조회');
                    }
                }.bind(this));                

                
                //장바구니
                if(oArgu.custCode) {
                    sCustcode = oArgu.custCode;
                }
                aFilter2.push(new Filter("Custcode", FilterOperator.EQ, sCustcode));
                console.log(aFilter);
                
                var oDataModel2 = this.getOwnerComponent().getModel();
                oDataModel2.read("/CartEntitySet", {
                    filters: aFilter2,
                    success: function(oReturn) { 
                        console.log('aFilter는 : ',aFilter);
                        console.log('Cart 전체조회 : ', oReturn.results);                    

                        // 'payment' 모델에 필터된 데이터를 설정
                        var paymentModel = new sap.ui.model.json.JSONModel();
                        paymentModel.setData({ CartEntitySet: oReturn.results });
                        this.getView().setModel(paymentModel, "payment");
                        
                        // 바인딩 업데이트
                        this.getView().byId("idProductList").getBinding("items").refresh();
                    
                    
                    }.bind(this),
                    error: function(oError) {
                        console.log("Cart 전체조회 중 오류 발생: ", oError);
                    }
                });


            },

            onProceedButtonPress: function(oEvent) {
                var msg = '상품 구매하기';
                // sap.m.MessageToast.show(msg);
                
                this.oRouter.navTo('RoutePayment', {
                    custCode: sCustcode
                }, true);

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

            onToggleCart: function(oEvent){                
                //장바구니 view 컨트롤
                var oCartView = this.byId("cartView");

                if(oCartView.getSize() === "0px") {
                    oCartView.setSize("300px");                    
                } else {
                    oCartView.setSize("0px");                    
                };
            },


            setPrice: function(sValue) {
                // sValue가 존재하고 유효한 숫자인지 확인
                if (sValue && !isNaN(sValue)) {
                    // 숫자로 변환 후 정수로 변환하여 소숫점 이하를 제거하고 100을 곱합니다.
                    var intValue = parseInt(parseFloat(sValue) * 100);
                    // KRW를 적용하고 3자리마다 쉼표를 추가하여 반환합니다.
                    return intValue.toLocaleString('en') + " KRW";
                } else {
                    return sValue; // sValue가 유효하지 않으면 그대로 반환합니다.
                }
            },

            setPrice2: function(sValue) {
                // sValue가 존재하고 유효한 숫자인지 확인
                if (sValue && !isNaN(sValue)) {
                    // 숫자로 변환 후 정수로 변환하여 소숫점 이하를 제거
                    var intValue = parseInt(parseFloat(sValue));
                    // KRW를 적용하고 3자리마다 쉼표를 추가하여 반환합니다.
                    return intValue.toLocaleString('en') + " KRW";
                } else {
                    return sValue; // sValue가 유효하지 않으면 그대로 반환합니다.
                }
            },



        });
    });
