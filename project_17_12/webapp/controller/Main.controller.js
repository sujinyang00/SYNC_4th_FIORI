sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("project1712.controller.Main", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter(); // 한 단계 위에 있는 컴포넌트에 접근해서 라우터 가져옴
                this.oRouter.getRoute('RouteMain').attachPatternMatched(this._onPatternMatched, this); //url이 패턴에 일치하면 _onPatternMatched 호출 (this에는 라우터 객체??)
            },
            
            onGoDetail: function() {
                //parameter 여러 개면 /?tab=okok&test=10 &붙여서 나옴
                this.oRouter.navTo('RouteDetail', {
                    key1: 'hello',
                    key2: 123
                }, true);
                // .navTo('라우트 객체이름', {파라미터 정보}, 라우터히스토리초기화)
            },
            onGoNotFound: function() {
                this.oRouter.getTargets().display("NotFound", {
                    fromTarget : 'TargetMain'
                }); //targets 속성을 다 가져와서 NotFound인거
            },
            onGoEmployee: function() {
                this.oRouter.navTo('RouteEmp', {}, true);
            },
            _onPatternMatched: function(oEvent) {
                //var oArgu = oEvent.getParameter('arguments');
                var oArgu = oEvent.getParameters().arguments;
                oArgu["?query"].test
                
                console.log('Main arguments: ', oArgu);
                console.log('Main: ', oArgu["?query"].test);                    
            }

        });
    });
