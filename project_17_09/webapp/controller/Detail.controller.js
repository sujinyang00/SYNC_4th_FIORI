sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("odata.project1709.controller.Detail", {
            onInit: function () {                
                this.oRouter = this.getOwnerComponent().getRouter();

                //attachPatternMatched : url이 일치할 때마다 _onPatternMatched 실행시킴
                this.oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);
            },
            onNavBack: function() {
                this.oRouter.navTo("RouteMain",{});

            }, 
            _onPatternMatched: function(oEvent) { 
                //RouteDetail 라우트 객체의 Pattern이 일치할 때 마다 해당 이벤트 실행됨
                var oArgu = oEvent.getParameters().arguments;
                //console.log('OrderID : ', oArgu);
                //console.log('OrderID : ', oArgu.oid); //OrderID값이 넘어옴

                //this.byId("orderId").setText(oArgu.oid); 


                //Form에 바인딩
                // "/EntitySetName(key='1',key='2')"
                // "/EntitySetName('1')"
                this.byId("idForm").bindElement(`/Orders(${oArgu.oid})`);
                

            },
            fnDateFormatter: function(sValue) {
                if(sValue){
                    var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: 'yyyy년 MM월 dd일'
                    });
                    return oFormat.format(sValue);
                }
            }

        });
    });
