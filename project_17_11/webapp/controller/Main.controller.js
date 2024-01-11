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

        return Controller.extend("project1711.controller.Main", {
            onInit: function () {
                //❓문제 ) 연도별 합계를 한 눈에 확인하는 막대차트 구현 -View에서
                var oData = {
                    chartDataset: [
                        { year: '2020', priceSum: '1000' },
                        { year: '2021', priceSum: '2000' },
                        { year: '2022', priceSum: '1200' },
                        { year: '2023', priceSum: '2500' }
                    ]
                };

                this.getView().setModel(new JSONModel(oData), 'chart');
            
                var oModel = this.getView().getModel();
                this.getView().setModel(oModel);


                //this._setChartInController();
            },

            _setChartInController: function() {
                var oModel = this.getView().getModel();
                this.getView().setModel(oModel);

                //chart
                var oColFrame = this.byId("idChartContainer");

                //dataset
                var oColDataset = new FlattenedDataset({
                    dimension: [
                        { name: 'Products', value: '{/ProductName}' }
                    ],
                    measures: [
                        { name: 'Stock', value: '{/UnitsInStock}' },
                        { name: 'Order', value: '{/UnitsOnOrder}' }

                    ],
                    data: { //기준 경로 세팅
                        path: '/Products'
                    }
                });
                oColDataset.setDataset(oColDataset);

                //feed구성
                var feedColValueAxis = new FeedItem({
                    uid: 'valueAxis',
                    type: 'Measure',
                    values: ['Products']
                });
                var feedColCategoryAxis = new FeedItem({
                    uid: 'categoryAxis',
                    type: 'Dimension',
                    values: ['Stock', 'Order']
                });
                oColFrame.addFeed(feedColValueAxis);
                oColFrame.addFeed(feedColCategoryAxis);

                //chart의 속성을 controller에서 세팅
                oColFrame.setVizProperties({
                    title: {text: 'controller로 구성한 Viz차트'}
                });

            }

        });
    });
