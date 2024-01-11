sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, FlattenedDataset, FeedItem) {
        "use strict";

        return Controller.extend("project1710.controller.Main", {
            onInit: function () {
                var oData = {
                    list: [
                        { name: 'aaa', rate: '35', cost: '10' },
                        { name: 'bbb', rate: '15', cost: '12' },
                        { name: 'ccc', rate: '10', cost: '11' },
                        { name: 'ddd', rate: '15', cost: '15' },
                        { name: 'eee', rate: '20', cost: '10' },
                        { name: 'fff', rate: '55', cost: '16' }
                    ]
                };

                this.getView().setModel(new JSONModel(oData), "view");

                this._setChartInContoller();

            },

            _setChartInContoller: function() {
                var oData = {
                    sales: [
                        { product : 'Jacket', amount: "65" },
                        { product : 'Shirts', amount: "70" },
                        { product : 'Pants', amount: "83" },
                        { product : 'Coats', amount: "92" },
                        { product : 'Purse ', amount: "77" }
                    ]
                };

                this.getView().setModel(new JSONModel(oData), 'cont');

                //chart
                var oColFrame = this.byId("idColChart");

                //dataset 구성
                var oColDataset = new FlattenedDataset({
                    dimensions: [
                        { 
                            name: 'Product', //카테고리명
                            value: '{cont>product}' //dataset 데이터 정보
                        }
                    ],
                    measures: [
                        {
                            name: 'Amount', //
                            value: '{cont>amount}'
                        }
                    ],
                    data: { //기준 경로 세팅
                        path: 'cont>/sales',                        
                    }
                });
                oColFrame.setDataset(oColDataset);                                
                                
                //feed 구성
                var feedColValueAxis = new FeedItem({
                    uid: 'valueAxis',
                    type: 'Measure',
                    values: ['Amount']
                });
                var feedColCategoryAxis = new FeedItem({
                    uid: 'categoryAxis',
                    type: 'Dimension',
                    values: ['Product']
                });
                oColFrame.addFeed(feedColValueAxis);
                oColFrame.addFeed(feedColCategoryAxis);
                
                //chart의 속성을 controller에서 세팅하는 방법
                oColFrame.setVizProperties({
                    title: { text: '두번째 차트' }
                });


            }



        });
    });
