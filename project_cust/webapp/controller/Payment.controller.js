sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox, Filter, FilterOperator, Sorter) {
        "use strict";
        var aFilter = [];

        return Controller.extend("projectcust.controller.Payment", {
            onInit: function () {
                
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RoutePayment").attachPatternMatched(this._onPatternMatched, this);
                
                var oPaymentModel = this.getOwnerComponent().getModel();
                this.getView().setModel(oPaymentModel, "payment");
                
                
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
                this.getOwnerComponent().getRouter().navTo('RouteMain', {});
            },

            _onPatternMatched: function(oEvent) {
                var oArgu = oEvent.getParameters().arguments;                      

                if(oArgu.custCode) {
                    aFilter.push(new Filter("Custcode", FilterOperator.EQ, oArgu.custCode));
                    console.log('aFilter1 : ',aFilter);
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
                            total += parseInt(item.Matprice, 10);                                            
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
                    var intValue = parseInt(parseFloat(sValue) * 100);
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
    
            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                            this.handleNavBackToList();

                            //판매오더 발생
                            //P R5 R7 나눠서 create 
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
            }

            
	});
});
