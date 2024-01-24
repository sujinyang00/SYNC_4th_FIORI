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

        return Controller.extend("exam.exprogram17.controller.Main", {
            onInit: function () {
                var oData = {
                    Products: [{ 
                        CategoryID: '', 
                        ProductName: '', 
                        UnitsInStock: '', 
                        UnitsOnOrder: '', 
                        OrderAble: '' 
                    }],
                    Sales_by_Categories: [{
                        ProductName: '',
                        ProductSales: ''
                    }]
                };
                this.getView().setModel(new JSONModel(oData), 'products');

                //Router 객체 생성
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RouteMain").attachPatternMatched(this._onPatternMatched, this);

            },
            _onPatternMatched: function() {                
                this.byId("idCategoryID").setValue();
                this.byId("idCategoryName").setValue();
    
                //table 선택값도 clear
                this.byId("idCategoriesTable").removeSelections();
                this.byId("idVizFrame").vizSelection([], { clearSelection: true });
                

                //table, vizFrame 클리어
                var oTable = this.byId("idTable");
                oTable.getModel("products").setData({});
                
                var oVizFrame = this.byId("idVizFrame");
                oVizFrame.getModel("products").setData({});
                oVizFrame.getDataset().getBinding("data").refresh();
                

                this.getView().getModel("products").refresh(true);
                this.getView().getModel().refresh(true);

                // console.log("products model 비우고 난 후 : ", this.getView().getModel("products").getData());
            },



            onSearch: function() { //필터 검색
                var sCateID = this.byId("idCategoryID").getValue();
                var sCateName = this.byId("idCategoryName").getValue();

                var aFilter = []; 

                if(sCateID) {
                    aFilter.push(new Filter('CategoryID', FilterOperator.GE, sCateID));
                }
                if(sCateName) {
                    aFilter.push(new Filter('CategoryName', FilterOperator.Contains, sCateName));
                }

                if(aFilter) {
                    this.byId("idCategoriesTable").getBinding("items").filter(aFilter);
                } else {
                    this.byId("idCategoriesTable").getBinding("items").filter();
                }
            },

            onSelectionChange: function(oEvent) { //카테고리 셀을 클릭했을 때 상품 정보 조회
                var sPath = oEvent.getParameters().listItem.getBindingContextPath(); //상대 경로로 지정되어 있는 DataSet에서 사용자가 선택한 Row의 모델 경로 얻음
                var oSelectData = this.getView().getModel().getProperty(sPath); //한 건의 model data - 모델경로로 해당 경로의 전체 데이터 얻음

                console.log('CategoryID: ', oSelectData.CategoryID);
                
                var oFilter = new Filter("CategoryID", FilterOperator.EQ, oSelectData.CategoryID); //path, operator, value1, value2
                console.log('Category Filter', oFilter);
                
                
                var oDataModel = this.getView().getModel();
                oDataModel.read("/Products", {
                    filters: [oFilter],
                    success: function(oReturn) { 
                        console.log('Products 전체조회 : ', oReturn);
                        
                        
                        if(oFilter) {
                            this.byId("idTable").getBinding("rows").filter(oFilter); //table에 바인딩
                            
                            var oTable = this.byId("idTable");

                            this.result = oReturn.results;
                            oTable.setModel(new JSONModel({ 
                                Products: oReturn.results
                            }), "products");
                        } else {
                            this.byId("idTable").getBinding("rows").filter();
                        }

                    }.bind(this),
                    error: function(oError) {
                        console.log("Products 전체조회 중 오류 발생: ", oError);
                    }
                });

                oDataModel.read("/Sales_by_Categories", {
                    filters: [oFilter],
                    success: function(oReturn) { 
                        console.log('Sales_by_Categories 전체조회 : ', oReturn);

                        if(oFilter) {
                            this.byId("idVizFrame").getDataset().getBinding("data").filter(oFilter); //pie chart에 바인딩                         
                                                    
                            var oTable = this.byId("idVizFrame");
                            oTable.setModel(new JSONModel({ 
                                Sales_by_Categories: oReturn.results
                            }), "products");                                                
                        } else {
                            this.byId("idVizFrame").getDataset().getBinding("data").filter();
                        }

                    }.bind(this),
                    error: function(oError) {
                        console.log("Sales_by_Categories 전체조회 중 오류 발생: ", oError);
                    }
                });

            },
            onRowSelectionChange: function(oEvent) {

                var sIdx = oEvent.getParameters().rowIndex;
                
                if (this.result && this.result[sIdx] && this.result[sIdx].ProductName) {
                    var sProductName = this.result[sIdx].ProductName;
            
                    this.oRouter.navTo('RouteDetail', {
                        pName: sProductName
                    }, true);
                }
            },

            // 추가기능 - 왼쪽 표에서 상품 선택 시 해당 상품의 Detail 페이지로 이동 
            onDatasetSelected: function(oEvent) {
                var sProductName = oEvent.getParameters().data[0].data.ProductName

                console.log('Product Name : ',sProductName);


                this.oRouter.navTo('RouteDetail', {
                    pName: sProductName
                }, true);
            }



        });
    });
