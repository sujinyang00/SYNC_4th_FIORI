sap.ui.define([
    "sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/m/library",
    "../model/formatter",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Device, JSONModel, Filter, library, formatter, MessageToast) {
        "use strict";

        return Controller.extend("projectcust.controller.Main", {
            _iCarouselTimeout: 0, // a pointer to the current timeout
            _iCarouselLoopTime: 8000, // loop to next picture after 8 seconds

            formatter: formatter,
            
            onInit: function () {
                var oProductsModel = this.getOwnerComponent().getModel(),
                    iPagesCount = 1;
                this.getView().setModel(oProductsModel, "products");
                
                if (Device.system.desktop) {
                    iPagesCount = 3;
                } else if (Device.system.tablet) {
                    iPagesCount = 2;
                }
                

                //setting 
                var oSettingsModel = new JSONModel({ pagesCount: iPagesCount });
                //oProductsModel.setSizeLimit(10);
                this.getView().setModel(oSettingsModel, "settings");                                

                //view 
                var oViewModel = new JSONModel({
                    PictureUrl: 'projectcust/img/M_Img.png',
                });
                this.getView().setModel(oViewModel, "view");

                                         
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
                
            },





            onSelectProduct: function(oEvent) {
                // 클릭한 이미지 컨텐츠의 부모 컨테이너(여기서는 HBox)를 가져옵니다.
                var oHBox = oEvent.getSource().getParent();

                // HBox의 바인딩된 데이터 모델(products)을 가져옵니다.
                var oModel = oHBox.getModel("products");

                // HBox의 바인딩된 데이터 경로를 사용하여 matcode를 가져옵니다.
                var sMatcode = oModel.getProperty("Matcode");

                // 가져온 matcode를 출력합니다.
                console.log("Clicked Matcode: ", sMatcode);
                
                // console.log(">> sIdx : ", oEvent.getParameters());
                var sIdx = oEvent.getParameters().rowIndex;

                
                if (this.result && this.result[sIdx] && this.result[sIdx].Matcode) {
                    var sMatCode = this.result[sIdx].Matcode;
            
                    this.oRouter.navTo('RouteDetail', {
                        mCode: sMatCode
                    }, true);
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


            
    
            



        });
    });
