sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1712.controller.Detail", {
            onInit: function () {                
                this.oRouter = this.getOwnerComponent().getRouter();

                //attachPatternMatched : url이 일치할 때마다 _onPatternMatched 실행시킴
                this.oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);
            },
            onNavBack: function() {
                this.oRouter.navTo('RouteMain',{
                    'query': {
                        tab: 'okok',
                        test: '10'
                    }
                });

            }, 
            _onPatternMatched: function(oEvent) { 
                //RouteDetail 라우트 객체의 Pattern이 일치할 때 마다 해당 이벤트 실행됨
                var oArgu = oEvent.getParameters().arguments;

                console.log('Detail : ', oArgu);
            }

        });
    });
