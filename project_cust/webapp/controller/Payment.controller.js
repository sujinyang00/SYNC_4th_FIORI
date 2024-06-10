sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/odata/v2/ODataModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, Filter, FilterOperator, Sorter, ODataModel) {
        "use strict";
        var aFilter = [];
        var sLeasePrc = '';  

        return Controller.extend("projectcust.controller.Payment", {
            onInit: function () {
                
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RoutePayment").attachPatternMatched(this._onPatternMatched, this);
                
                var oPaymentModel = this.getOwnerComponent().getModel();
                this.getView().setModel(oPaymentModel, "payment");
                
                
                var oProductsModel = this.getOwnerComponent().getModel();
                this.getView().setModel(oProductsModel, "products");
                
                
                ////여기부터 sap ui5
                this._wizard = this.byId("ShoppingCartWizard");
                this._oNavContainer = this.byId("navContainer");
                this._oDynamicPage = this.getPage();
                
                this.model = new JSONModel();
                this.model.attachRequestCompleted(null, function () {
                    this.model.getData().CartEntitySet.splice(5, this.model.getData().CartEntitySet.length);
                    this.model.setProperty("/selectedPayment", "Credit Card");
                    this.model.setProperty("/selectedDeliveryMethod", "Standard");
                    this.model.setProperty("/differentDeliveryAddress", false);
                    this.model.setProperty("/CashOnDelivery", {});
                    this.model.setProperty("/BillingAddress", {});
                    this.model.setProperty("/CreditCard", {});
                    this.calcTotal();
                    this.model.updateBindings();
                }.bind(this));
                
                // this.model.loadData(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
                this.getView().setModel(this.model);
                

            },            

            onNavBack: function() {
                this.getOwnerComponent().getRouter().navTo('RouteMain', {
                    custCode : this.sCustcode
                }, true);
            },

            _onPatternMatched: function(oEvent) {
                var oArgu = oEvent.getParameters().arguments;                      

                if(oArgu.custCode) {
                    aFilter.push(new Filter("Custcode", FilterOperator.EQ, oArgu.custCode));
                    console.log('aFilter1 : ',aFilter);
                    this.sCustcode = oEvent.getParameter("arguments").custCode;
                }   
                                
                this.byId("idProductList").getBinding("items").filter(aFilter);
                this.byId("idProductFinList").getBinding("items").filter(aFilter);
                this.calcTotal(); //총 금액 계산

                
            },

            

            setImageUrl: function(sValue) {
                return `${_rootPath}/image/${sValue}.png`;
            },

            getPage: function () {
                return this.byId("dynamicPage");
            },

            calcTotal: function () {
                console.log('aFilter : ', aFilter);

                var oDataModel = this.getOwnerComponent().getModel();
                oDataModel.read("/CartEntitySet", {
                    filters: aFilter,
                    success: function(oReturn) { 
                        console.log('Cart 전체조회 : ', oReturn);
                        
                        var total = 0;
                        var results = oReturn.results; 
                        results.forEach(function(item) {                            
                            total += parseInt(item.Saprice, 10);                                            
                        });

                        // 결과 출력
                        var formattedTotprice = this.setPrice(total);
                        console.log("총 금액 :", formattedTotprice);
                        this.byId("ProductsTotalPrice").setNumber(formattedTotprice);
                        this.byId("ProductsTotalPrice2").setNumber(formattedTotprice);

                    }.bind(this),
                    error: function(oError) {
                        console.log("Cart 전체조회 중 오류 발생: ", oError);
                        this.byId("ProductsTotalPrice").setNumber(0);
                        this.byId("ProductsTotalPrice2").setNumber(0);
                    }
                });
                
            },

            setPrice: function(sValue) {
                // sValue가 존재하고 유효한 숫자인지 확인
                if (sValue && !isNaN(sValue)) {
                    // 숫자로 변환 후 정수로 변환하여 소숫점 이하를 제거하고 100을 곱합니다.
                    var intValue = parseInt(parseFloat(sValue));
                    // KRW를 적용하고 3자리마다 쉼표를 추가하여 반환합니다.
                    return intValue.toLocaleString('en');// + " KRW";
                } else {
                    return sValue; // sValue가 유효하지 않으면 그대로 반환합니다.
                }
            },




            onDelete: function(sMatcode, sCustcode) {
                var oDataModel = this.getView().getModel("payment");

                var sPath = oDataModel.createKey("/CartEntitySet", {
                    Matcode: sMatcode,
                    Custcode: sCustcode
                });

                oDataModel.remove(sPath, {
                    success: function(oReturn) {
                        MessageBox.success("✅ 데이터 삭제 완료 ");
                        console.log('Cart 단건 삭제 : ',oReturn);
                        location.reload();
                    },
                    error: function(oError) {
                        MessageBox.error("⚠️ 데이터 삭제 실패 ");
                        console.log('Cart 삭제 중 오류 발생 : ',oError);

                    }
                })
            },

            
            handleDelete: function (oEvent) {
                var listItem = oEvent.getParameter("listItem");
                var oContext = listItem.getBindingContext("payment");
                var sPath = oContext.getPath();
                
                // sPath는 삭제할 항목의 모델 경로입니다. 예를 들어, "/CartEntitySet/0"
                var aPathParts = sPath.split("/");
                var sIndex = aPathParts[aPathParts.length - 1];  // 예를 들어, "0"을 얻습니다.
                // console.log(sIndex); //삭제할 행 정보 담김

                var custcodeMatch = sIndex.match(/Custcode='([^']+)'/);
                var matcodeMatch = sIndex.match(/Matcode='([^']+)'/);

                var sCustcode = custcodeMatch ? custcodeMatch[1] : null;
                var sMatcode = matcodeMatch ? matcodeMatch[1] : null;


                this.onDelete(sMatcode, sCustcode);    //DB에서 삭제
                               

            },

            
    
            goToPaymentStep: function () {
                var selectedKey = this.model.getProperty("/selectedPayment");
    
                switch (selectedKey) {
                    case "Bank Transfer":
                        this.byId("PaymentTypeStep").setNextStep(this.getView().byId("BankAccountStep"));
                        break;
                    case "Cash on Delivery":
                        this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CashOnDeliveryStep"));
                        break;
                    case "Credit Card":
                    default:
                        this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CreditCardStep"));
                        break;
                }
            },
    
            setPaymentMethod: function () {
                this.setDiscardableProperty({
                    message: "결제방식을 바꾸시겠습니까? 지금까지 입력한 결제방식에 대한 정보가 사라집니다.",
                    discardStep: this.byId("PaymentTypeStep"),
                    modelPath: "/selectedPayment",
                    historyPath: "prevPaymentSelect"
                });
            },
    
            setDifferentDeliveryAddress: function () {
                this.setDiscardableProperty({
                    message: "배송 주소를 변경하시겠습니까? 지금까지 입력한 배송정보가 사라집니다. ",
                    discardStep: this.byId("BillingStep"),
                    modelPath: "/differentDeliveryAddress",
                    historyPath: "prevDiffDeliverySelect"
                });
            },
    
            setDiscardableProperty: function (params) {
                if (this._wizard.getProgressStep() !== params.discardStep) {
                    MessageBox.warning(params.message, {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.YES) {
                                this._wizard.discardProgress(params.discardStep);
                                history[params.historyPath] = this.model.getProperty(params.modelPath);
                            } else {
                                this.model.setProperty(params.modelPath, history[params.historyPath]);
                            }
                        }.bind(this)
                    });
                } else {
                    history[params.historyPath] = this.model.getProperty(params.modelPath);
                }
            },
    
            billingAddressComplete: function () {
                if (this.model.getProperty("/differentDeliveryAddress")) {
                    this.byId("BillingStep").setNextStep(this.getView().byId("DeliveryAddressStep"));
                } else {
                    this.byId("BillingStep").setNextStep(this.getView().byId("DeliveryTypeStep"));
                }
            },
    
            handleWizardCancel: function () {
                this._handleMessageBoxOpen("구매를 취소하시겠습니까?", "warning");
            },
    
            handleWizardSubmit: function () {
                this._handleMessageBoxOpen("구매를 진행하시겠습니까?", "confirm");
            },
    
            backToWizardContent: function () {
                this._oNavContainer.backToPage(this._oDynamicPage.getId());
            },
    
            checkCreditCardStep: function () {
                var cardName = this.model.getProperty("/Name") || "";
                if (cardName.length < 3) {
                    this._wizard.invalidateStep(this.byId("CreditCardStep"));
                } else {
                    this._wizard.validateStep(this.byId("CreditCardStep"));
                }
            },
    
            checkCashOnDeliveryStep: function () {
                var firstName = this.model.getProperty("/FirstName") || "";
                if (firstName.length < 3) {
                    this._wizard.invalidateStep(this.byId("CashOnDeliveryStep"));
                } else {
                    this._wizard.validateStep(this.byId("CashOnDeliveryStep"));
                }
            },
    
            checkBillingStep: function () {
                var address = this.model.getProperty("/Address") || "";
                var city = this.model.getProperty("/City") || "";
                var zipCode = this.model.getProperty("/ZipCode") || "";
                var country = this.model.getProperty("/Country") || "";
    
                if (address.length < 3 || city.length < 3 || zipCode.length < 3 || country.length < 3) {
                    this._wizard.invalidateStep(this.byId("BillingStep"));
                } else {
                    this._wizard.validateStep(this.byId("BillingStep"));
                }
            },
    
            completedHandler: function () {
                this._oNavContainer.to(this.byId("wizardBranchingReviewPage"));
            },

        

            // 판매오더 생성
            createSAO: function() {                 
                
                var oDataModel = this.getOwnerComponent().getModel();
                var today2 = new Date().toISOString().split('.')[0];  // "2024-06-03T00:00:00" format
        
                // var sData = {
                //     Saocode : "SAO240610097", 
                //     Custcode : "CUST000001",
                //     Sordertype : "1",
                //     Orddate : today2,  //오늘
                //     Okstate : "2",
                //     Ordstate : "P",
                //     Shipflag : false,
                //     Agcode : "HB000",
                //     Crdat : today2 //오늘
                // };
                // console.log('sData : ', sData);

                // oDataModel.create("/SaoEntitySet", sData, {
                //     method: "POST",
                //     success: function(data) {
                //         sap.m.MessageToast.show("판매오더가 성공적으로 만들어졌습니다.");                        
                //     }.bind(this),
                //     error: function(oError) {
                //         console.log('판매오더 생성 중 오류 발생 : ',oError);
                //     }
                // });

                var numericPart = '';
                var numericPart2 = '';
                var numericPart3 = '';
                var maxSaocode = "SAO240611000";
                var maxRentcode = "REN240611000";
                var maxCarecode = "CAR240611000";
                var newSaocode = '';
                var newRentcode = '';
                var newCarecode = '';

                var sSaocode = '';
                var sRentcode = '';
                var sCarecode = '';

                var newSaoUnit = [];
                var newProUnit = [];
                var newRentUnit = [];
                var newCareUnit = [];

                oDataModel.read("/SaoEntitySet", {     
                    // filters: aFilter,               
                    success: function(oReturn) { 
                        console.log('이전 판매오더 조회 : ', oReturn);
                        
                        oReturn.results.forEach(function (item) {
                            if (item.Saocode > maxSaocode) {
                                maxSaocode = item.Saocode;
                            }
                        });

                        // 숫자 부분 추출 후 1 증가
                        numericPart = parseInt(maxSaocode.replace("SAO", ""), 10) + 1;
                        // newSaocode = "SAO" + String(numericPart).padStart(8, '0');
                        newSaocode = "SAO" + String(numericPart);
                        sSaocode = newSaocode;
                        console.log('새로 생성할 판매오더코드 : ', sSaocode);     

                    }.bind(this),
                    error: function(oError) {
                        console.log("기존 판매오더 조회 중 오류 발생: ", oError);
                    }
                });

                oDataModel.read("/SaoRentEntitySet", {     
                    // filters: aFilter,               
                    success: function(oReturn) { 
                        console.log('기존 렌탈조회 : ', oReturn);
                        
                        oReturn.results.forEach(function (item) {
                            if (item.Rentcode > maxRentcode) { 
                                maxRentcode = item.Rentcode;
                            }
                        });

                        // 숫자 부분 추출 후 1 증가
                        numericPart2 = parseInt(maxRentcode.replace("REN", ""), 10) + 1;
                        // newRentcode = "REN" + String(numericPart2).padStart(8, '0');
                        newRentcode = "REN" + String(numericPart2);
                        sRentcode = newRentcode;
                        console.log('새로 생성할 렌탈코드 : ', sRentcode);     

                    }.bind(this),
                    error: function(oError) {
                        console.log("렌탈조회 중 오류 발생: ", oError);
                    }
                });


                oDataModel.read("/SaoCareEntitySet", {     
                    // filters: aFilter,               
                    success: function(oReturn) { 
                        console.log('기존 케어조회 : ', oReturn);
                        
                        oReturn.results.forEach(function (item) {
                            if (item.Capcode > maxCarecode) { 
                                maxCarecode = item.Capcode;
                            }
                        });

                        // 숫자 부분 추출 후 1 증가
                        numericPart3 = parseInt(maxCarecode.replace("CAR", ""), 10) + 1;
                        // newCarecode = "CAR" + String(numericPart3).padStart(8, '0');
                        newCarecode = "CAR" + String(numericPart3);
                        sCarecode = newCarecode;
                        console.log('새로 생성할 케어코드 : ', sCarecode);     

                    }.bind(this),
                    error: function(oError) {
                        console.log("케어조회 중 오류 발생: ", oError);
                    }
                });

                



                oDataModel.read("/CartEntitySet", {
                    filters: aFilter,
                    success: function(oReturn) { 
                        console.log('Cart 전체조회2 : ', oReturn);
                        
                        var results = oReturn.results;

                        results.forEach(function(item) {
                            //이 반복문 돌때마다 saocode 증가해야됨                                    
                            var today = new Date().toISOString().split('.')[0];  // "2024-06-03T00:00:00" format

                            // newSaocode = "SAO" + String(numericPart).padStart(8, '0');
                            newSaocode = "SAO" + String(numericPart);
                            sSaocode = newSaocode;

                            // newRentcode = "REN" + String(numericPart2).padStart(8, '0');
                            newRentcode = "REN" + String(numericPart2);
                            sRentcode = newRentcode;
                            
                            // newCarecode = "CAR" + String(numericPart3).padStart(8, '0');
                            newCarecode = "CAR" + String(numericPart3);
                            sCarecode = newCarecode;

                            var sData = {
                                Saocode : sSaocode, 
                                Custcode : item.Custcode,
                                Sordertype : "1",
                                Orddate : today,  //오늘
                                Okstate : "2",
                                Ordstate : item.Ordstate,
                                Shipflag : false,
                                Agcode : "HB000",
                                Crdat : today //오늘
                            }; 
        
                            // console.log('판매오더 생성 : ', sData);
                            newSaoUnit.push(sData);
                                            
                            // oDataModel.create("/SaoEntitySet", sData, {
                            //     method: "POST",
                            //     success: function(data) {
                            //         MessageToast.show("판매오더가 성공적으로 만들어졌습니다.");

                            //     }.bind(this),
                            //     error: function(oError) {
                            //         console.log('판매오더 생성 중 오류 발생 : ',oError);
                            //     }
                            // });                            

                            switch(item.Ordstate) {
                                case "P":
                                    // createPur(item, sSaocode);    //즉시구매 데이터 생성
                                    var pData = {
                                        Saocode : sSaocode,
                                        Matcode : item.Matcode,
                                        Quant : item.Quant,
                                        Unit : "EA",
                                        Saprice : item.Saprice,
                                        Currkey : "KRW",
                                        Crdat : today //오늘
                                    }
                                    // console.log('즉구 판매오더 생성 : ', pData);
                                    newProUnit.push(pData);
                
                                    // oDataModel.create("/PurchaseEntitySet", pData, {    
                                    //     method: "POST",
                                    //     success: function(data) {
                                    //         sap.m.MessageToast.show("즉구 판매오더가 성공적으로 만들어졌습니다.");   

                                    //     }.bind(this),
                                    //     error: function(oError) {
                                    //         console.log('즉구오더 생성 중 오류 발생 : ',oError);

                                    //     }
                                    // });                                    
                                    break;
                                case "R5":
                                    // createRent(item, sSaocode);   //렌탈 데이터 생성
                                    var sRentPrd = '';
                                    var sLeasePrc = '';
                                    switch (item.Ordstate) {
                                        case "R5":
                                            sRentPrd = '1';                            
                                            break;
                                        case "R7":
                                            sRentPrd = '2';
                                            break;
                                    } 

                                    switch(item.Matcode) {
                                        case "FINM01":
                                            sLeasePrc = "13500.00";
                                        case "FINM02":
                                            sLeasePrc = "15500.00";
                                        case "FINM03":
                                            sLeasePrc = "17500.00";
                                        case "FINM04":
                                            sLeasePrc = "20500.00";
                                        case "FINS01":
                                            sLeasePrc = "15000.00";
                                        case "FINS02":
                                            sLeasePrc = "17000.00";
                                        case "FINS03":
                                            sLeasePrc = "19000.00";
                                        case "FINS04":
                                            sLeasePrc = "22000.00";
                                    }

                                    
                                    var rData = {
                                        Rentcode : sRentcode,   
                                        Custcode : item.Custcode,
                                        Saocode : sSaocode,
                                        Matcode : item.Matcode,
                                        Matname : item.Matname,
                                        Mattype : "F",
                                        Quant : item.Quant,
                                        Unit : "EA",
                                        Rentstate : "1",
                                        Mbill : item.Saprice,
                                        Leaseprice : sLeasePrc,   
                                        Currkey : "KRW",
                                        Rentperiod : sRentPrd,
                                        Crdat : today
                                    }
                                    // console.log('렌탈5 판매오더 생성 : ', rData);
                                    newRentUnit.push(rData);
                                    
                                    // oDataModel.create("/RentEntitySet", rData, {
                                    //     method: "POST",
                                    //     success: function(data) {
                                    //         sap.m.MessageToast.show("렌탈 판매오더가 성공적으로 만들어졌습니다.");   

                                    //     }.bind(this),
                                    //     error: function(oError) {
                                    //         console.log('렌탈오더 생성 중 오류 발생 : ',oError);

                                    //     }
                                    // });
                                    break;
                                case "R7":
                                    // createRent(item, sSaocode);   //렌탈 데이터 생성
                                    var sRentPrd = '';
                                    var sLeasePrc = '';
                                    switch (item.Ordstate) {
                                        case "R5":
                                            sRentPrd = '1';                            
                                            break;
                                        case "R7":
                                            sRentPrd = '2';
                                            break;
                                    } 

                                    switch(item.Matcode) {
                                        case "FINM01":
                                            sLeasePrc = "13500.00";
                                        case "FINM02":
                                            sLeasePrc = "15500.00";
                                        case "FINM03":
                                            sLeasePrc = "17500.00";
                                        case "FINM04":
                                            sLeasePrc = "20500.00";
                                        case "FINS01":
                                            sLeasePrc = "15000.00";
                                        case "FINS02":
                                            sLeasePrc = "17000.00";
                                        case "FINS03":
                                            sLeasePrc = "19000.00";
                                        case "FINS04":
                                            sLeasePrc = "22000.00";
                                    }

                                    
                                    var rData = {
                                        Rentcode : sRentcode,   
                                        Custcode : item.Custcode,
                                        Saocode : sSaocode,
                                        Matcode : item.Matcode,
                                        Matname : item.Matname,
                                        Mattype : "F",
                                        Quant : item.Quant,
                                        Unit : "EA",
                                        Rentstate : "1",
                                        Mbill : item.Saprice,
                                        Leaseprice : sLeasePrc,   
                                        Currkey : "KRW",
                                        Rentperiod : sRentPrd,
                                        Crdat : today
                                    }
                                    // console.log('렌탈7 판매오더 생성 : ', rData);
                                    newRentUnit.push(rData);

                                    // oDataModel.create("/RentEntitySet", rData, {
                                    //     method: "POST",
                                    //     success: function(data) {
                                    //         sap.m.MessageToast.show("렌탈 판매오더가 성공적으로 만들어졌습니다.");   

                                    //     }.bind(this),
                                    //     error: function(oError) {
                                    //         console.log('렌탈오더 생성 중 오류 발생 : ',oError);

                                    //     }
                                    // });
                                    break;
                                case "C":
                                    // createCare(item, sSaocode);   //케어 데이터 생성
                                    console.log('케어 판매오더 생성');
                                    var cData = {
                                        Capcode : "CAR240603002",   //
                                        Saocode : sSaocode,
                                        Custcode : item.Custcode,
                                        Matcode : item.Matcode,
                                        Matname : item.Matname,
                                        Capdate : "2024-06-06T00:00:00",
                                        Caprice : item.Saprice,
                                        Currkey : "KRW",
                                        Crdat : today
                                    }
                                    // console.log('케어 판매오더 생성 : ', cData);
                                    newCareUnit.push(cData);
                                    
                                    // oDataModel.create("/CareEntitySet", cData, {
                                    //     method: "POST",
                                    //     success: function(data) {
                                    //         sap.m.MessageToast.show("케어 판매오더가 성공적으로 만들어졌습니다.");   

                                    //     },
                                    //     error: function(oError) {
                                    //         console.log('케어오더 생성 중 오류 발생 : ',oError);

                                    //     }
                                    // });
                                    break;
                            }

                            numericPart += 1;
                            numericPart2 += 1;
                            numericPart3 += 1;
                        });

                        

                       

                        if (newSaoUnit.length != 0) {
                            console.log('SaoEntitySet : ', newSaoUnit);  
                            //판매오더, 즉구, 렌탈, 케어 각각 create
                            newSaoUnit.forEach(function(item) {
                                // console.log('item : ', item);
                                oDataModel.setUseBatch(false);
                                oDataModel.create("/SaoEntitySet", item, {
                                    method: "POST",
                                    success: function(data) {
                                        sap.m.MessageToast.show("판매오더가 성공적으로 만들어졌습니다.");
                                    },
                                    error: function(oError) {
                                        console.log('판매오더 생성 중 오류 발생 : ', oError);
                                    }
                                });
                            });                      
                        }

                        if (newProUnit.length != 0) {
                            console.log('PurchaseEntitySet : ', newProUnit);
                            oDataModel.setUseBatch(false);
                            newProUnit.forEach(function(item) {
                                oDataModel.create("/PurchaseEntitySet", item, {
                                    method: "POST",
                                    success: function(data) {
                                        sap.m.MessageToast.show("즉시구매오더가 성공적으로 만들어졌습니다.");
                                    },
                                    error: function(oError) {
                                        console.log('즉구 생성 중 오류 발생 : ', oError);
                                    }
                                });
                            });
                        }
                        if (newRentUnit.length != 0) {
                            console.log('RentEntitySet : ', newRentUnit);
                            oDataModel.setUseBatch(false);
                            newRentUnit.forEach(function(item) {
                                oDataModel.create("/RentEntitySet", item, {
                                    method: "POST",
                                    success: function(data) {
                                        sap.m.MessageToast.show("렌탈오더가 성공적으로 만들어졌습니다.");
                                    },
                                    error: function(oError) {
                                        console.log('렌탈 생성 중 오류 발생 : ', oError);
                                    }
                                });
                            });
                        }
                        if(newCareUnit.length != 0){
                            console.log('CareEntitySet : ', newCareUnit);
                            oDataModel.setUseBatch(false);
                            newCareUnit.forEach(function(item) {
                                oDataModel.create("/CareEntitySet", item, {
                                    method: "POST",
                                    success: function(data) {
                                        sap.m.MessageToast.show("케어오더가 성공적으로 만들어졌습니다.");
                                    },
                                    error: function(oError) {
                                        console.log('케어 생성 중 오류 발생 : ', oError);
                                    }
                                });
                            });
                        }

                        


                    }.bind(this),
                    error: function(oError) {
                        console.log("Cart 전체조회2 중 오류 발생: ", oError);
                    }
                });




                

            },

    
            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                            this.handleNavBackToList();
                                                    
                            this.createSAO();    //판매오더 생성
                            console.log('custcode : ', this.sCustcode);

                            if (this.oRouter) {
                                // this.oRouter.navTo('RouteMain', {}, true);
                                this.oRouter.navTo('RouteMain', {
                                    custCode: this.sCustcode
                                }, true);
                            } else {
                                console.error("oRouter가 초기화되지 않았습니다.");
                            }                         
                            
                        }
                    }.bind(this)
                });
            },
    
            handleNavBackToList: function () {
                this._navBackToStep(this.byId("ContentsStep"));
            },
    
            handleNavBackToPaymentType: function () {
                this._navBackToStep(this.byId("PaymentTypeStep"));
            },
    
            handleNavBackToCreditCard: function () {
                this._navBackToStep(this.byId("CreditCardStep"));
            },
    
            handleNavBackToCashOnDelivery: function () {
                this._navBackToStep(this.byId("CashOnDeliveryStep"));
            },
    
            handleNavBackToBillingAddress: function () {
                this._navBackToStep(this.byId("BillingStep"));
            },
    
            handleNavBackToDeliveryType: function () {
                this._navBackToStep(this.byId("DeliveryTypeStep"));
            },
    
            _navBackToStep: function (step) {
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(step);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);
    
                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this._oNavContainer.to(this._oDynamicPage);
            },

            

            
	});
});
