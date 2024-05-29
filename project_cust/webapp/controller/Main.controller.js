sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/m/library",
    "../model/formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Device, JSONModel, Filter, FilterOperator, library, formatter, MessageToast, MessageBox) {
        "use strict";

        var sCustcode = 'CUST000006';
        var aFilter = [];
        aFilter.push(new Filter("Custcode", FilterOperator.EQ, sCustcode));

        return Controller.extend("projectcust.controller.Main", {
            _iCarouselTimeout: 0, // a pointer to the current timeout
            _iCarouselLoopTime: 8000, // loop to next picture after 8 seconds

            formatter: formatter,
            
            onInit: function () {                        

                var oProductsModel = this.getOwnerComponent().getModel(),
                    iPagesCount = 1;
                this.getView().setModel(oProductsModel, "products");

                
                
                
                if (Device.system.desktop) {
                    iPagesCount = 2;    //한 페이지에 보이는 상품수
                } else if (Device.system.tablet) {
                    iPagesCount = 2;
                }
                

                //setting 
                var oSettingsModel = new JSONModel({ pagesCount: iPagesCount });
                //oProductsModel.setSizeLimit(10);
                this.getView().setModel(oSettingsModel, "settings");        

                                         
                var oDataModel = this.getOwnerComponent().getModel();
                oDataModel.read("/ProductListEntitySet", {
                    success: function(oReturn) { 
                        console.log('Products 전체조회 : ', oReturn);
                        var matcodes = [];
                        var fMatcodes = []; // F를 포함한 Matcode를 저장할 배열
                        var mMatcodes = []; // M을 포함한 Matcode를 저장할 배열
                        var cMatcodes = [];
                        var results = oReturn.results; // Assuming 'results' is the array containing your data
                        results.forEach(function(item) {
                            matcodes.push(item.Matcode);
                            if (item.Matcode.includes('F')) {
                                fMatcodes.push(item.Matcode);
                            }
                            if (item.Matcode.includes('M')) {
                                mMatcodes.push(item.Matcode);
                            }
                            if (item.Matcode.includes('C')) {
                                cMatcodes.push(item.Matcode);
                            }                            
                        });
                        
                        // 결과 출력
                        console.log("전체 Matcode 속성:", matcodes);
                        console.log("F를 포함한 Matcode 속성:", fMatcodes);
                        console.log("M을 포함한 Matcode 속성:", mMatcodes);
                        console.log("M을 포함한 Matcode 속성:", cMatcodes);
                        
                        // F 또는 M을 포함한 Matcode가 있는 경우 bedImg 설정
                        // if (fMatcodes.length > 0) {
                        //     oViewModel.setProperty("/bedImg", 'projectcust/img/F_Img.png');
                        // } else if (mMatcodes.length > 0) {
                        //     oViewModel.setProperty("/bedImg", 'projectcust/img/M_Img.png');
                        // } else if (cMatcodes.length > 0) {
                        //     oViewModel.setProperty("/bedImg", 'projectcust/img/M_Img.png');
                        // }
                        }.bind(this),
                        error: function(oError) {
                            console.log("Products 전체조회 중 오류 발생: ", oError);
                        }
                });
                    
                this.byId("idImage").setSrc(_rootPath+"/image/001.png");
                this.byId("idImage2").setSrc(_rootPath+"/image/002.png");
                this.byId("idImage3").setSrc(_rootPath+"/image/003.png");
                    
                //Router 객체 생성
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteMain").attachPatternMatched(this._onPatternMatched, this);                                    
                          
                
                
                
                var oDataModel2 = this.getOwnerComponent().getModel();
                oDataModel2.read("/CartEntitySet", {
                    filters: aFilter,
                    success: function(oReturn) { 
                        console.log('aFilter는 : ',aFilter);
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

            _onPatternMatched: function(oEvent) {
                var oArgu = oEvent.getParameters().arguments;                      

                if(oArgu.custCode) {
                    aFilter.push(new Filter("Custcode", FilterOperator.EQ, oArgu.custCode));
                    console.log(aFilter); 
                }   
            },

            setImageUrl: function(sValue) {
                return `${_rootPath}/image/${sValue}.png`;
            },

            onSelectProduct: function(oEvent) {
                // 클릭한 ImageContent의 바인딩 컨텍스트를 가져옵니다.
                var oBindingContext = oEvent.getSource().getBindingContext("products");

                // 바인딩 컨텍스트를 통해 Matcode를 가져옵니다.
                var sMatcode = oBindingContext.getProperty("Matcode");
                                
                //Detail로 라우팅
                if (sMatcode != null) {
                    this.oRouter.navTo('RouteProduct', {
                        mCode: oBindingContext.getProperty("Matcode")
                    }, true);

                    console.log('>>>',oBindingContext.getProperty("Matcode"));
                }                
            },
            

            onNumberOfPages: function (oEvent) {
                const oCarouselCustomLayout = this.byId("carouselSample").getCustomLayout(),
                    sVisiblePageCount = oEvent.getParameter("value");
    
                    oCarouselCustomLayout.setVisiblePagesCount(Number(sVisiblePageCount));
            },
    
            OnScrollModeChange: function(oEvent) {
                const CarouselScrollMode = library.CarouselScrollMode,
                    bViewMode = oEvent.getParameter("state"),
                    sScrollMode = bViewMode ?  CarouselScrollMode.VisiblePages : CarouselScrollMode.SinglePage;

                this.byId("carouselSample").getCustomLayout()?.setScrollMode(sScrollMode);
            },   


            onAddToCart: function(oEvent) {
                sap.m.MessageToast.show("✅ 상품 상세페이지에서 구매 타입을 선택해주세요. ");

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
            
            onProceedButtonPress: function(oEvent) {
                var msg = '상품 구매하기';
                // sap.m.MessageToast.show(msg);
                
                this.oRouter.navTo('RoutePayment', {
                    custCode: sCustcode
                }, true);

            },

            //장바구니 삭제 
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
                var sIndex = aPathParts[aPathParts.length - 1]; 
                // console.log(sIndex); //삭제할 행 정보 담김

                var custcodeMatch = sIndex.match(/Custcode='([^']+)'/);
                var matcodeMatch = sIndex.match(/Matcode='([^']+)'/);

                var sCustcode = custcodeMatch ? custcodeMatch[1] : null;
                var sMatcode = matcodeMatch ? matcodeMatch[1] : null;


                this.onDelete(sMatcode, sCustcode);    //DB에서 삭제
                            
            },


            
        });
    });
