sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sap.btp.ux410solving.controller.Detail", {
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

                //debugger;

                var oArgu = oEvent.getParameters().arguments;
                console.log('OrderID : ', oArgu.oid); //OrderID값이 넘어옴
                console.log('ProductID : ', oArgu.pid); 

                
                this.byId("orderId").setText(oArgu.oid); 
                this.byId("obTitle").setObjectTitle(`OrderID : ${oArgu.oid}`);

                //Form에 바인딩
                this.byId("idSimpleForm").bindElement(`/Order_Details(OrderID=${oArgu.oid},ProductID=${oArgu.pid})`);


            }

        });
    });
